import React from 'react';
import { SeguimientoOrdenesProvider } from './Context';
import OrdenMedicaForm from './Form';
import SeguimientoOrdenesList from './List';

const SeguimientoOrdenesMedicas = ({ value }) => (
  <SeguimientoOrdenesProvider value={value}>
    <OrdenMedicaForm />
    <SeguimientoOrdenesList />
  </SeguimientoOrdenesProvider>
);

export default SeguimientoOrdenesMedicas;
