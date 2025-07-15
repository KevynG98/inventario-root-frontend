import React from 'react';
import { CajeroProvider } from './Context'; 
import CajeroForm from './Form'; 

const Index = () => {
  return (
    <CajeroProvider>
      <CajeroForm />
    </CajeroProvider>
  );
};

export default Index;
