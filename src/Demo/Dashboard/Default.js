import React from 'react';
import { Container } from 'react-bootstrap';

import Aux from '../../hoc/_Aux';
import welcomeImage from '../../assets/images/inventario/inventario.jpg';

const Dashboard = () => {
  return (
    <Aux>
      <Container
        fluid
        className="vh-100 d-flex flex-column justify-content-center align-items-center text-center px-3"
        style={{
          background: 'linear-gradient(to bottom right, #f0f4f8, #dbe4ed)'
        }}
      >
        <h2 className="text-primary fw-bold fade-in mb-2">
          Bienvenido al sistema de inventarios
        </h2>

        <p className="text-muted fade-in mb-4" style={{ maxWidth: '500px' }}>
          Aquí podrás gestionar, visualizar y controlar todos los productos almacenados.
        </p>

        <img
          src={welcomeImage}
          alt="Sistema de Inventario"
          className="fade-in img-fluid"
          style={{
            maxHeight: '900px',
            width: '100%',
            maxWidth: '700px',
            marginBottom: '30px',
            borderRadius: '12px',
            boxShadow: '0 6px 24px rgba(0, 0, 0, 0.1)'
          }}
        />
      </Container>

    </Aux>
  );
};

export default Dashboard;