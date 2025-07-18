import React from 'react';
import { CajeroProvider } from './ContextCajeros';
import CajeroList from './ListCajeros';
import ModalCajero from './ModalCajero';

const IndexCajeros = () => (
  <CajeroProvider>
    <CajeroList />
    <ModalCajero />
  </CajeroProvider>
);

export default IndexCajeros;
