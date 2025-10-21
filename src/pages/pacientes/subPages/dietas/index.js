import React from 'react';
import { DietasProvider } from './Context';
import DietasForm from './Form';
import DietasList from './List';

const Dietas = ({ value }) => (
  <DietasProvider value={value}>
    <DietasForm />
    <DietasList />
  </DietasProvider>
);

export default Dietas;
