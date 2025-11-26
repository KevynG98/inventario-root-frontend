import React from 'react';
import { PreciosProvider } from './Context';
import ListadoRechazados from './ListadoRechazados';
import ModalRechazados from './ModalRechazados';

const Index = () => (
  <PreciosProvider>
    <ListadoRechazados />
    <ModalRechazados />
  </PreciosProvider>
);

export default Index;
