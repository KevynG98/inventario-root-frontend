import React from 'react';
import { ContextProvider } from './Context';
import Medidas from './List.js';
import ModalMedidas from './ModalMedidas.js';
import ModalCargaMasiva from './ModalCargaMasiva';

const Index = () => (
  <ContextProvider>
    <Medidas />
    <ModalMedidas />
    <ModalCargaMasiva />
  </ContextProvider>
);

export default Index;
