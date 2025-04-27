import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../../assets/scss/style.scss';
import { useForm } from 'react-hook-form';
import { useComponentContext } from './context';
import ModalCarga from './Modal';
import logo from '../../../assets/images/hospistal/el-naranjo.png'; // Asegúrate de colocar la imagen ahí

const SignUp1 = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { data1, isLoading, error, sendData, modalAction, show } = useComponentContext();

  const onSubmit = (data) => {
    console.log('Formulario enviado', data);
    sendData(data);
    modalAction();
    console.log("Response: ", data1);
  };

  return (
    <>
      <div className="d-flex vh-100">
        {/* Columna izquierda: formulario */}
        <div className="d-flex flex-column justify-content-center align-items-center bg-light w-50 p-5">
          <h3 className="mb-4 fw-bold text-dark text-center">Inicio de Sesión al Sistema</h3>

          <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%', maxWidth: '400px' }}>
            <div className="mb-3">
              <label className="form-label">Nombre de usuario</label>
              <input
                type="text"
                className="form-control"
                placeholder="usuario"
                {...register('username', { required: 'El nombre de usuario es requerido' })}
              />
              {errors.username && <div className="text-danger">{errors.username.message}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                className="form-control"
                placeholder="password"
                {...register('password', { required: 'Contraseña requerida' })}
              />
              {errors.password && <div className="text-danger">{errors.password.message}</div>}
            </div>

            <div className="text-end mb-3">
              <NavLink to="/auth/reset-password-1" className="text-primary small">
                ¿Has olvidado tu contraseña?
              </NavLink>
            </div>

            <button type="submit" className="btn btn-primary w-100">Continue</button>
          </form>
        </div>

        {/* Columna derecha: imagen/logo */}
        <div
          className="d-none d-md-flex flex-column justify-content-center align-items-center w-50"
          style={{
            backgroundColor: '#007bff',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <img src={logo} alt="Logo EPEQ" style={{ maxWidth: '280px', width: '80%' }} />
        </div>
      </div>

      {show && <ModalCarga />}
    </>
  );
};

export default SignUp1;
