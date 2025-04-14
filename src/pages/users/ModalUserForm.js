import React, { useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useMyContext } from './Context';

const ModalUserForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset
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
    formKey
  } = useMyContext();

  // Solo usar userData si hay username definido
  const userData = username ? data.find((u) => u.username === username) : null;

  // Reset del formulario según el modo
  useEffect(() => {
    if (isCreatingUser) {
      reset({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        password: ''
      });
    } else if (isViewingUser && userData) {
      reset({
        username: userData.username,
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name
      });
    } else if (!isCreatingUser && userData) {
      reset({
        username: userData.username
      });
    }
  }, [isCreatingUser, isViewingUser, username, userData, reset]);

  const onSubmit = async (formData) => {
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
    <Modal show={show} onHide={showModal} centered>
      <Modal.Body>
        <div className="px-3 py-2">
          <h4 className="mb-4 fw-bold">
            {isViewingUser
              ? 'Información del usuario'
              : isCreatingUser
              ? 'Registrar usuario'
              : 'Asignar rol'}
          </h4>
          <form key={formKey} onSubmit={handleSubmit(onSubmit)}>
            {/* Username */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Nombre de usuario</label>
              <input
                type="text"
                className="form-control py-2 px-3"
                placeholder="Username"
                disabled={isViewingUser || !isCreatingUser}
                {...register("username", { required: "Username is required" })}
              />
              {errors.username && <p className="text-danger">{errors.username.message}</p>}
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Correo electrónico</label>
              <input
                type="email"
                className="form-control py-2 px-3"
                placeholder="Email"
                readOnly={isViewingUser}
                {...register("email")}
              />
            </div>

            {/* First Name */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Nombre</label>
              <input
                type="text"
                className="form-control py-2 px-3"
                placeholder="First Name"
                readOnly={isViewingUser}
                {...register("first_name")}
              />
            </div>

            {/* Last Name */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Apellido</label>
              <input
                type="text"
                className="form-control py-2 px-3"
                placeholder="Last Name"
                readOnly={isViewingUser}
                {...register("last_name")}
              />
            </div>

            {/* Password */}
            {isCreatingUser && (
              <div className="mb-3">
                <label className="form-label fw-semibold">Contraseña</label>
                <input
                  type="password"
                  className="form-control py-2 px-3"
                  placeholder="Password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Password must be at least 6 characters" }
                  })}
                />
                {errors.password && <p className="text-danger">{errors.password.message}</p>}
              </div>
            )}

            {/* Rol */}
            {!isCreatingUser && !isViewingUser && (
              <div className="mb-3">
                <label className="form-label fw-semibold">Rol</label>
                <select
                  className="form-control py-2 px-3"
                  {...register("role", { required: "Role is required" })}
                >
                  <option value="">Selecciona un rol</option>
                  {getRol?.map((item) => (
                    <option key={item.name} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
                {errors.role && <p className="text-danger">{errors.role.message}</p>}
              </div>
            )}

            {/* Botón */}
            {!isViewingUser ? (
              <button type="submit" className="btn btn-primary w-100 py-2 rounded shadow">
                {isCreatingUser ? 'Registrar' : 'Asignar'}
              </button>
            ) : (
              <button type="button" className="btn btn-secondary w-100 py-2 rounded shadow" onClick={showModal}>
                Cerrar
              </button>
            )}
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalUserForm;
