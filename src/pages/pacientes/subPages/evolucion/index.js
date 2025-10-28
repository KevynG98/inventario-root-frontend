import React from 'react';
import { EvolucionProvider } from './Context';
import EvolucionForm from './Form';
import EvolucionList from './List';

const Evolucion = ({ value }) => (
  <EvolucionProvider value={value}>
    <div className="d-flex flex-column gap-4">
      <EvolucionForm />
      <EvolucionList />
    </div>
  </EvolucionProvider>
);

export default Evolucion;
