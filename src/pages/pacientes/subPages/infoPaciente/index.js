import React from 'react';
import { InfoPacienteProvider } from './Context';
import InfoPacienteList from './List';

const InfoPaciente = ({ value }) => (
  <InfoPacienteProvider value={value}>
    <InfoPacienteList />
  </InfoPacienteProvider>
);

export default InfoPaciente;
