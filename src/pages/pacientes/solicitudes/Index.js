import React from 'react';
import { SolicitudesProvider } from './Context';
import List from './List';

const Solicitudes = () => (
  <SolicitudesProvider>
    <List />
  </SolicitudesProvider>
);

export default Solicitudes;