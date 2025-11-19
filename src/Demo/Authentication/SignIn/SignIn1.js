import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import '../../../assets/scss/style.scss';
import { useForm } from 'react-hook-form';
import { useComponentContext } from './context';
import logoImage from '../../../assets/images/hospistal/inventario_logo.png';
import Swal from 'sweetalert2';

const SignUp1 = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { isLoading, error, sendData } = useComponentContext();

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
  };

  return (
    <>
      <div
        className="d-flex flex-column flex-md-row vh-100"
        style={{
          background: 'radial-gradient(circle at 20% 20%, rgba(34, 211, 238, 0.06), transparent 28%), radial-gradient(circle at 80% 0%, rgba(124, 58, 237, 0.08), transparent 35%), linear-gradient(135deg, #0b1220 0%, #0f172a 45%, #0b3a4c 100%)',
          color: '#f8fafc'
        }}
      >
        {/* Columna izquierda */}
        <div className="d-flex flex-column justify-content-center align-items-center w-100 w-md-50 p-4 p-md-5">
          <img
            src={logoImage}
            alt="Inventario General logo"
            style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '20px', boxShadow: '0 10px 40px rgba(15, 23, 42, 0.35)' }}
            className="mb-4"
          />
          <h3 className="mb-2 fw-bold text-center" style={{ color: '#f9fafb' }}>
            Portal Inventario General
          </h3>
          <p className="text-center mb-4" style={{ color: '#cbd5f5' }}>
            Ingresa tus credenciales para continuar
          </p>
          <div className="d-inline-flex align-items-center px-3 py-2 rounded-pill mb-4" style={{ backgroundColor: 'rgba(125, 211, 252, 0.12)', border: '1px solid rgba(125, 211, 252, 0.3)', color: '#7dd3fc', letterSpacing: '0.08rem', fontSize: '0.75rem', textTransform: 'uppercase' }}>
            Ambiente DEV
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{ width: '100%', maxWidth: '380px', backgroundColor: 'rgba(12, 17, 32, 0.7)', borderRadius: '24px', padding: '32px', boxShadow: '0 20px 45px rgba(7, 11, 19, 0.45)', border: '1px solid rgba(148, 163, 184, 0.2)' }}
          >
            <div className="mb-3">
              <label className="form-label" style={{ color: '#e2e8f0' }}>Nombre de usuario</label>
              <input
                type="text"
                className="form-control shadow-sm"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', color: '#f9fafb', border: '1px solid rgba(148, 163, 184, 0.35)' }}
                placeholder="usuario"
                {...register('username', { required: 'El nombre de usuario es requerido' })}
              />
              {errors.username && <div className="text-warning mt-1">{errors.username.message}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label" style={{ color: '#e2e8f0' }}>Contraseña</label>
              <input
                type="password"
                className="form-control shadow-sm"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', color: '#f9fafb', border: '1px solid rgba(148, 163, 184, 0.35)' }}
                placeholder="password"
                {...register('password', { required: 'Contraseña requerida' })}
              />
              {errors.password && <div className="text-warning mt-1">{errors.password.message}</div>}
            </div>

            <div className="text-end mb-3">
              <NavLink to="/auth/signin-1" className="small" style={{ color: '#93c5fd' }}>
                Iniciar sesión
              </NavLink>
            </div>

            <button
              type="submit"
              className="btn w-100"
              style={{
                background: 'linear-gradient(135deg, #22d3ee, #6366f1, #7c3aed)',
                border: 'none',
                color: '#fff',
                padding: '12px',
                borderRadius: '12px',
                fontWeight: '600',
                letterSpacing: '0.04rem'
              }}
            >
              Entrar
            </button>
          </form>
        </div>

        {/* Columna derecha */}
        <div
          className="d-none d-md-flex flex-column justify-content-center align-items-center w-100"
          style={{
            background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.25) 0%, rgba(124, 58, 237, 0.4) 100%)',
            backdropFilter: 'blur(6px)',
            padding: '48px'
          }}
        >
          <img
            src={logoImage}
            alt="Inventario General"
            style={{
              width: '60%',
              maxWidth: '320px',
              borderRadius: '24px',
              boxShadow: '0 25px 55px rgba(15, 23, 42, 0.35)',
              backgroundColor: '#0f172a',
              padding: '24px'
            }}
          />
        </div>
      </div>
    </>
  );
};

export default SignUp1;
