// Context.js
import React, { createContext, useEffect, useState } from 'react';
import { getData } from '../../../../apiService'; 

export const AppContext = createContext();

export const ContextProvider = ({ children }) => {
  const [requisiciones, setRequisiciones] = useState([]);
  const [soloAprobadas, setSoloAprobadas] = useState([]);
  const [sinAprobadas, setSinAprobadas] = useState([]);

  const cargarRequisiciones = async () => {
    try {
      const todas = await getData('requisisiones/');
      const aprobadas = await getData('requisisiones/?estado=aprobada');
      const noAprobadas = await getData('requisisiones/?excluir=aprobada');

      setRequisiciones(todas.data || []);
      setSoloAprobadas(aprobadas.data || []);
      setSinAprobadas(noAprobadas.data || []);
    } catch (error) {
      console.error('❌ Error al cargar requisiciones:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    cargarRequisiciones();
  }, []);

  return (
    <AppContext.Provider
      value={{
        requisiciones,
        soloAprobadas,
        sinAprobadas,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
