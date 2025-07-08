import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const ContextProvider = ({ children }) => {
  const [message] = useState('¡Hola desde el contexto!');
  const [showModalProveedor, setShowModalProveedor] = useState(false);

  const toggleModalProveedor = () => {
    setShowModalProveedor(!showModalProveedor);
  };

  const values = {
    message,
    showModalProveedor, 
    setShowModalProveedor,
    toggleModalProveedor,
  }

  return (
    <AppContext.Provider value={values}>
      {children}
    </AppContext.Provider>
  );
};
