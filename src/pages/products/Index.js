import React from 'react'
import { ContextProvider } from './Context';  // Asegúrate de importar el proveedor
import { Products } from './Products';
import ModalCreate from './ModalCreate';
import ModalRol from './ModarRol';

const Index = () => {
  return (
    <ContextProvider>
      <Products />
      <ModalCreate />
      <ModalRol />
    </ContextProvider>
  )
}

export default Index