import React from 'react';
import { ContextProvider } from './Context';
import FormularioOrdenCompra from './Form';
import PreviewModal from './PreviewModal';

const Index = () => {
  return (
    <ContextProvider>
      <FormularioOrdenCompra />
      <PreviewModal />
    </ContextProvider>
  );
};

export default Index;
