import React from 'react';
import { PreciosProvider } from './Context';
import ListadoCotizaciones from './ListadoCotizaciones';
import ModalCotizaciones from './ModalCotizaciones';

const Index = () => (
  <PreciosProvider>
    <ListadoCotizaciones />
    <ModalCotizaciones />
  </PreciosProvider>
);

export default Index;
