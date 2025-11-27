import React from 'react';
import { PreciosProvider } from './Context';
import ListadoProyectos from './ListadoProyectos';
import ModalProyectos from './ModalProyectos';

const Index = () => (
  <PreciosProvider>
    <ListadoProyectos />
    <ModalProyectos />
  </PreciosProvider>
);

export default Index;
