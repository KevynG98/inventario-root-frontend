import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../../assets/scss/style.scss';
import Breadcrumb from '../../../App/layout/AdminLayout/Breadcrumb';
import { useForm } from 'react-hook-form';
import { useComponentContext } from './context';
import ModalCarga from './Modal';

const SignUp1 = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { data1, isLoading, error, sendData, modalAction, show } = useComponentContext();

    const onSubmit = (data) => {
        console.log('Formulario enviado', data);
        sendData(data);
        modalAction();  // Aquí cambia el estado 'show' en el contexto
        console.log("Response: ", data1);
    };
    

    return (
        <>
            <Breadcrumb />
            <div className="auth-wrapper">
                <div className="auth-content">
                    <div className="auth-bg">
                        <span className="r" />
                        <span className="r s" />
                        <span className="r s" />
                        <span className="r" />
                    </div>
                    <div className="card">
                        <div className="card-body text-center">
                            <div className="mb-4">
                                <i className="feather icon-unlock auth-icon" />
                            </div>
                            <h3 className="mb-4">Login</h3>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="input-group mb-3">
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Email"
                                        {...register('email', { required: 'Email is required' })}
                                    />
                                    {errors.email && <div className="error">{errors.email.message}</div>}
                                </div>
                                <div className="input-group mb-4">
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Password"
                                        {...register('password', { required: 'Password is required' })}
                                    />
                                    {errors.password && <div className="error">{errors.password.message}</div>}
                                </div>
                                <div className="form-group text-left">
                                    {/* <div className="checkbox checkbox-fill d-inline">
                                        <input type="checkbox" id="checkbox-fill-a1" />
                                        <label htmlFor="checkbox-fill-a1" className="cr"> Save credentials</label>
                                    </div> */}
                                </div>
                                <button type="submit" className="btn btn-primary shadow-2 mb-4">Login</button>
                            </form>
                            <p className="mb-2 text-muted">Forgot password? <NavLink to="/auth/reset-password-1">Reset</NavLink></p>
                            {/* <p className="mb-0 text-muted">Don’t have an account? <NavLink to="/auth/signup-1">Signup</NavLink></p> */}
                        </div>
                    </div>
                </div>
            </div>
            {show && <ModalCarga />}
        </>
    );
};

export default SignUp1;