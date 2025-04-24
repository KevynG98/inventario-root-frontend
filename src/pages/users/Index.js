import React from 'react'
import { ContextProvider } from './Context';  // Asegúrate de importar el proveedor
import { Users } from './Users';
import ModalUserForm from './ModalUserForm';

const Index = () => {
  return (
    <ContextProvider>
      <Users />
      <ModalUserForm />
    </ContextProvider>
  )
}

export default Index