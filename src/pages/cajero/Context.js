import React, { createContext, useState } from 'react';

// Creamos el contexto
export const CajeroContext = createContext();

// Proveedor del contexto
export const CajeroProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  // Agregar producto
  const addItem = (item) => {
    setItems([...items, item]);
  };

  // Limpiar productos
  const clearItems = () => {
    setItems([]);
  };

  return (
    <CajeroContext.Provider value={{ items, addItem, clearItems }}>
      {children}
    </CajeroContext.Provider>
  );
};
