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
    setValue
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
    openResetPasswordModal
  } = useMyContext();

  const userData = username ? data.find((u) => u.username === username) : null;

  const [active, setActive] = useState(true);
  const [availableGroups, setAvailableGroups] = useState([]);
  const [assignedGroups, setAssignedGroups] = useState([]);
  const [showResetModal, setShowResetModal] = useState(false);

  useEffect(() => {
    if (userData) {
      setAssignedGroups(userData.groups || []);
      setActive(userData.active ?? true);
    } else {
      setAssignedGroups([]);
      setActive(true);
    }

    if (getRol.length > 0) {
      const all = getRol.map(r => r.name);
      const assigned = userData?.groups || [];
      setAvailableGroups(all.filter(g => !assigned.includes(g)));
    }
  }, [userData, getRol]);

  useEffect(() => {
    if (isCreatingUser) {
      reset({ username: '', email: '', first_name: '', last_name: '', password: '' });
    } else if (userData) {
      reset({
        username: userData.username,
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name
      });
    }
  }, [isCreatingUser, isViewingUser, userData, reset]);

  const handleAssign = () => {
    const selected = [...document.getElementById('groupLeft').selectedOptions].map(opt => opt.value);
    setAssignedGroups(prev => [...prev, ...selected]);
    setAvailableGroups(prev => prev.filter(g => !selected.includes(g)));
  };

  const handleRemove = () => {
    const selected = [...document.getElementById('groupRight').selectedOptions].map(opt => opt.value);
    setAvailableGroups(prev => [...prev, ...selected]);
    setAssignedGroups(prev => prev.filter(g => !selected.includes(g)));
  };

  const onSubmit = async (formData) => {
    formData.groups = assignedGroups;
    formData.active = active;

    try {
      if (isViewingUser) {
        showModal();
        return;
      }
      if (isCreatingUser) {
        await sendData(formData);
      } else {
        await assignRol(formData);
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
                <button type="button" className="btn btn-danger w-100">
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
                marginLeft: '12px',         // <<< separación visual real
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
              <select id="groupLeft" multiple className="form-control" size={6}>
                {availableGroups.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
              <div className="d-flex flex-column justify-content-center gap-2">
                <button type="button" onClick={handleAssign} className="btn btn-outline-secondary">&gt;</button>
                <button type="button" onClick={handleRemove} className="btn btn-outline-secondary">&lt;</button>
              </div>
              <select id="groupRight" multiple className="form-control" size={6}>
                {assignedGroups.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Botones */}
          <div className="d-flex justify-content-end gap-2">
            {isCreatingUser && (
              <button
                type="button"
                onClick={() => {
                  reset({ username: '', email: '', first_name: '', last_name: '', password: '' });
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
