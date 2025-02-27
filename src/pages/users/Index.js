import React from 'react'
import { ContextProvider } from './Context';  // Asegúrate de importar el proveedor
import { Users } from './Users';
import ModalCreate from './ModalCreate';
import ModalRol from './ModarRol';

const Index = () => {
  return (
    <ContextProvider>
      <Users />
      <ModalCreate />
      <ModalRol/>
    </ContextProvider>
  )
}

export default Index