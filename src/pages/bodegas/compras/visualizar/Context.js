import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const ContextProvider = ({ children }) => {
  const [message] = useState('¡Hola desde el contexto!');

  return (
    <AppContext.Provider value={{ message }}>
      {children}
    </AppContext.Provider>
  );
};
