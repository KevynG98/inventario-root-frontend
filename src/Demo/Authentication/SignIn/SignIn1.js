import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import '../../../assets/scss/style.scss';
import { useForm } from 'react-hook-form';
import { useComponentContext } from './context';
import logo from '../../../assets/images/inventario/inventario2.jpg';
import logoInventario from '../../../assets/images/inventario/logo-inventario.png';
import Swal from 'sweetalert2';

const SignUp1 = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { isLoading, error, sendData, modalAction } = useComponentContext();

  useEffect(() => {
    if (isLoading) {
      Swal.fire({
        title: 'Cargando...',
        text: 'Espere mientras se cargan los datos',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
    } else {
      Swal.close();

      if (error) {
        let mensaje = 'Ha ocurrido un error inesperado.';
        if (error.includes("User not found")) {
          mensaje = 'El usuario ingresado no existe.';
        } else if (error.includes("Incorrect password")) {
          mensaje = 'La contraseña ingresada es incorrecta.';
        }

        Swal.fire({
          icon: 'error',
          title: 'No se pudo iniciar sesión',
          text: mensaje
        });
      }
    }
  }, [isLoading, error]);

  const onSubmit = (data) => {
    sendData(data);
    modalAction();
  };

  return (
    <>
      <div className="d-flex flex-column flex-md-row vh-100">
        {/* Columna izquierda */}
        <div
          className="d-flex flex-column justify-content-center align-items-center w-100 w-md-50 p-4 p-md-5"
          style={{
            background: 'linear-gradient(135deg, #eef3f8 0%, #dbe4ed 100%)'
          }}
        >
          <img
            src={logoInventario}
            alt="Inventario"
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              marginBottom: '1.5rem',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }}
          />

          <h2 className="fw-bold text-dark text-center mb-2">Bienvenido al Inventario</h2>
          <p className="text-muted text-center mb-4" style={{ maxWidth: '300px' }}>
            Gestiona, organiza y controla tus productos fácilmente.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{
              width: '100%',
              maxWidth: '400px',
              backgroundColor: '#fff',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.05)'
            }}
          >
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
              <NavLink to="/caja" className="text-primary small">
                Inicia Sesión en el Sistema como <b>cajero</b>
              </NavLink>
            </div>

            <button type="submit" className="btn btn-primary w-100">Continue</button>
          </form>
        </div>

        {/* Columna derecha */}
        <div
          className="d-none d-md-flex w-100"
          style={{
            backgroundImage: `url(${logo})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        ></div>
      </div>
    </>
  );
};

export default SignUp1;
