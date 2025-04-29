import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useMyContext } from './Context';
import ModalResetPassword from './ModalResetPassword';

const ModalUserForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const {
    show,
    showModal,
    sendData,
    assignRol,
    username,
    getRol,
    isCreatingUser,
    isViewingUser,
    data,
    formKey,
    openResetPasswordModal,
    updateUser
  } = useMyContext();

  const userData = username ? data.find((u) => u.username === username) : null;

  const [active, setActive] = useState(true);
  const [availableGroups, setAvailableGroups] = useState([]);
  const [assignedGroups, setAssignedGroups] = useState([]);
  const [showResetModal, setShowResetModal] = useState(false);

  // Cargar roles asignados y disponibles
  useEffect(() => {
    if (getRol.length > 0) {
      const allRoles = getRol.map(r => r.name);
      const assigned = userData?.roles?.map(r => r.name) || [];

      if (isCreatingUser) {
        setAvailableGroups(allRoles);
        setAssignedGroups([]);
      } else {
        setAssignedGroups(assigned);
        setAvailableGroups(allRoles.filter(role => !assigned.includes(role)));
      }
    }
  }, [getRol, userData, isCreatingUser]);

  // Cargar datos del usuario o limpiar
  useEffect(() => {
    if (isCreatingUser) {
      reset({ username: '', email: '', first_name: '', last_name: '' });
    } else if (userData) {
      reset({
        username: userData.username,
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
      });
    }
  }, [isCreatingUser, isViewingUser, userData, reset]);

  // Mover seleccionado a la derecha
  const handleAssign = () => {
    const selected = [...document.getElementById('groupLeft').selectedOptions].map(opt => opt.value);
    setAssignedGroups(prev => [...prev, ...selected]);
    setAvailableGroups(prev => prev.filter(g => !selected.includes(g)));
  };

  // Mover seleccionado a la izquierda
  const handleRemove = () => {
    const selected = [...document.getElementById('groupRight').selectedOptions].map(opt => opt.value);
    setAvailableGroups(prev => [...prev, ...selected]);
    setAssignedGroups(prev => prev.filter(g => !selected.includes(g)));
  };

  // Mover todos a la derecha
  const handleAssignAll = () => {
    setAssignedGroups(prev => [...prev, ...availableGroups]);
    setAvailableGroups([]);
  };

  // Mover todos a la izquierda
  const handleRemoveAll = () => {
    setAvailableGroups(prev => [...prev, ...assignedGroups]);
    setAssignedGroups([]);
  };

  // Enviar formulario
  const onSubmit = async (formData) => {
    formData.is_active = active;
    delete formData.active;

    try {
      if (isCreatingUser) {
        await sendData(formData);
      } else {
        formData.id = userData.id;
        await updateUser(formData);
      }

      // Asignar roles uno por uno
      for (const roleName of assignedGroups) {
        await assignRol({ username: formData.username, role: roleName });
      }

      reset();
      showModal();
    } catch (error) {
      console.error("Error en el formulario", error);
    }
  };

  return (
    <Modal show={show} onHide={showModal} size="lg" centered>
      <Modal.Body className="px-5 py-4">
        <h5 className="mb-4 fw-bold">
          {isCreatingUser ? 'Registrar nuevo usuario' : isViewingUser ? 'Detalles del usuario' : 'Editar usuario'}
        </h5>

        <form key={formKey} onSubmit={handleSubmit(onSubmit)}>
          {/* Username */}
          <div className="mb-3">
            <label className="fw-semibold">Usuario *</label>
            <input
              type="text"
              className="form-control"
              placeholder="Nombre de usuario"
              {...register("username", { required: "Campo obligatorio" })}
              disabled={!isCreatingUser}
            />
            {errors.username && <p className="text-danger">{errors.username.message}</p>}
          </div>

          {/* Nombre */}
          <div className="mb-3">
            <label className="fw-semibold">Nombre</label>
            <input
              type="text"
              className="form-control"
              {...register("first_name")}
            />
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="fw-semibold">E-mail</label>
            <div className="row">
              <div className="col-9">
                <input
                  type="email"
                  className="form-control"
                  {...register("email")}
                />
              </div>
              <div className="col-3 d-flex align-items-end">
                <button type="button" className="btn btn-danger w-100" disabled>
                  E-mail
                </button>
              </div>
            </div>
          </div>

          {/* Activo */}
          <div className="mb-3 d-flex align-items-center">
            <label className="fw-semibold mb-0">Activo</label>
            <div
              onClick={() => setActive(!active)}
              style={{
                marginLeft: '12px',
                width: '32px',
                height: '18px',
                backgroundColor: active ? '#0d6efd' : '#ccc',
                borderRadius: '20px',
                position: 'relative',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '2px',
                  left: active ? '16px' : '2px',
                  width: '14px',
                  height: '14px',
                  backgroundColor: '#fff',
                  borderRadius: '50%',
                  transition: 'left 0.2s'
                }}
              />
            </div>
          </div>

          {/* Grupos */}
          <div className="mb-3">
            <label className="fw-semibold">Grupos</label>
            <div className="d-flex gap-3">
              {/* Roles disponibles */}
              <select
                id="groupLeft"
                multiple
                className="form-control"
                size={6}
                onDoubleClick={handleAssign}
              >
                {availableGroups.length > 0 ? (
                  availableGroups.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))
                ) : (
                  <option disabled>No hay grupos</option>
                )}
              </select>

              {/* Botones de acción */}
              <div className="d-flex flex-column justify-content-center gap-2">
                <button type="button" onClick={handleAssign} className="btn btn-outline-secondary">&gt;</button>
                <button type="button" onClick={handleRemove} className="btn btn-outline-secondary">&lt;</button>
                <button type="button" onClick={handleAssignAll} className="btn btn-outline-secondary">&gt;&gt;</button>
                <button type="button" onClick={handleRemoveAll} className="btn btn-outline-secondary">&lt;&lt;</button>
              </div>

              {/* Roles asignados */}
              <select
                id="groupRight"
                multiple
                className="form-control"
                size={6}
                onDoubleClick={handleRemove}
              >
                {assignedGroups.length > 0 ? (
                  assignedGroups.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))
                ) : (
                  <option disabled>No hay asignados</option>
                )}
              </select>
            </div>
          </div>

          {/* Botones Finales */}
          <div className="d-flex justify-content-end gap-2">
            {isCreatingUser && (
              <button
                type="button"
                onClick={() => {
                  reset({ username: '', email: '', first_name: '', last_name: '' });
                  setAssignedGroups([]);
                  setAvailableGroups(getRol.map(r => r.name));
                  setActive(true);
                }}
                className="btn btn-secondary"
              >
                Nuevo
              </button>
            )}
            <button type="submit" className="btn btn-primary">
              {isCreatingUser ? 'Registrar' : 'Guardar'}
            </button>
            {!isCreatingUser && (
              <button type="button" className="btn btn-warning" onClick={openResetPasswordModal}>
                Restablecer contraseña
              </button>
            )}
          </div>
        </form>
      </Modal.Body>
      <ModalResetPassword show={showResetModal} onClose={() => setShowResetModal(false)} />
    </Modal>
  );
};

export default ModalUserForm;
