import React from 'react';
import { Container } from 'react-bootstrap';

import Aux from '../../hoc/_Aux';
import welcomeImage from '../../assets/images/hospistal/hospital_narnajo.png'; // Asegurate que la ruta sea correcta

const Dashboard = () => {
  return (
    <Aux>
      <Container className="d-flex flex-column justify-content-center align-items-center text-center vh-100 bg-light">
        {/* Animación y estilos embebidos */}
        <style>
          {`
            .fade-in {
              opacity: 0;
              transform: translateY(10px);
              animation: fadeInUp 1s ease forwards;
            }

            @keyframes fadeInUp {
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}
        </style>
        <h2 className="text-primary fw-bold fade-in">Bienvenido al sistema del Hospital Naranjo</h2>
        <img
          src={welcomeImage}
          alt="Bienvenida Hospital"
          className="fade-in"
          style={{
            marginBottom: '30px',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
          }}
        />
      </Container>
    </Aux>
  );
};

export default Dashboard;
