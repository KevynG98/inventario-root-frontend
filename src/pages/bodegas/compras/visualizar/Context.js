// Context.js
import React, { createContext, useState } from 'react';

export const AppContext = createContext();

const datosIniciales = [
  { id: 1, proveedor: 'Proveedor A', fecha: '2025-07-14', estado: 'Nueva' },
  { id: 2, proveedor: 'Proveedor B', fecha: '2025-07-13', estado: 'Revisión' },
];

export const ContextProvider = ({ children }) => {
  const [requisiciones, setRequisiciones] = useState(datosIniciales);
  const [requisicionSeleccionada, setRequisicionSeleccionada] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const abrirModal = (requisicion) => {
    setRequisicionSeleccionada(requisicion);
    setShowModal(true);
  };

  const cerrarModal = () => {
    setRequisicionSeleccionada(null);
    setShowModal(false);
  };

  const actualizarEstado = (id, nuevoEstado) => {
    setRequisiciones(prev =>
      prev.map(r => r.id === id ? { ...r, estado: nuevoEstado } : r)
    );
  };

  return (
    <AppContext.Provider value={{
      showModal,
      abrirModal,
      cerrarModal,
      requisicionSeleccionada,
      requisiciones,
      actualizarEstado
    }}>
      {children}
    </AppContext.Provider>
  );
};
