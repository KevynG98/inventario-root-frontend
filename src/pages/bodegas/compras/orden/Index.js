import React from 'react';
import { ContextProvider } from './Context';
import FormularioOrdenCompra from './Form';

const Index = () => {
  return (
    <ContextProvider>
      <FormularioOrdenCompra />
    </ContextProvider>
  );
};

export default Index;
