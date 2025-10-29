import React from 'react';
import { SolicitudMedicamentosProvider } from './Context';
import SolicitudMedicamentosList from './List';
import SolicitudMedicamentosForm from './Form';

const SolicitudMedicamentos = ({ value }) => (
  <SolicitudMedicamentosProvider value={value}>
    <div className="d-flex flex-column gap-4">
      <SolicitudMedicamentosList />
      <SolicitudMedicamentosForm />
    </div>
  </SolicitudMedicamentosProvider>
);

export default SolicitudMedicamentos;
