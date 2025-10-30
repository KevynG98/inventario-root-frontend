import React from 'react';
import { OperacionesProvider, useOperacionesContext } from './Context';
import List from './List';
import Formulario from './Form';
import Detail from './Detail';

const Inner = () => {
  const { mode } = useOperacionesContext();
  if (mode === 'form') return <Formulario />;
  if (mode === 'detail') return <Detail />;
  return <List />;
};

const CalendarioOperaciones = () => (
  <OperacionesProvider>
    <Inner />
  </OperacionesProvider>
);

export default CalendarioOperaciones;