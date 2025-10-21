import React from 'react';
import { NotasEnfermeriaProvider } from './Context';
import NotasEnfermeriaForm from './Form';
import NotasEnfermeriaList from './List';

const NotasEnfermeria = ({ value }) => (
  <NotasEnfermeriaProvider value={value}>
    <NotasEnfermeriaForm />
    <NotasEnfermeriaList />
  </NotasEnfermeriaProvider>
);

export default NotasEnfermeria;
