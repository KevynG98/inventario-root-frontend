// Context.js
import React, { createContext, useState } from 'react';
import { postData, putData } from '../../../../apiService';


export const AppContext = createContext();

export const ContextProvider = ({ children }) => {
  const [showModalProveedor, setShowModalProveedor] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [requisicionSeleccionada, setRequisicionSeleccionada] = useState(null);

  const toggleModalProveedor = () => {
    setShowModalProveedor(!showModalProveedor);
  };

  const abrirModal = (requisicion) => {
    setRequisicionSeleccionada(requisicion);
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setRequisicionSeleccionada(null);
  };

  const crearRequisicion = async (formulario, productos = [], servicios = []) => {
    // Remover 'id' temporal de frontend antes de enviar
    const cleanProductos = productos.map(({ id, ...rest }) => rest);
    const cleanServicios = servicios.map(({ id, ...rest }) => rest);

    const payload = {
      ...formulario,
      productos: cleanProductos,
      servicios: cleanServicios,
    };

    try {
      const response = await postData('/requisisiones/guardar/', payload);
      console.log('Requisición guardada:', response.data);
      alert('✅ Requisición guardada correctamente');
    } catch (error) {
      console.error('❌ Error al guardar requisición:', error.response?.data || error);
      alert('Error al guardar la requisición');
    }
  };

  const values = {
    showModalProveedor,
    setShowModalProveedor,
    toggleModalProveedor,
    showModal,
    abrirModal,
    cerrarModal,
    requisicionSeleccionada,
    crearRequisicion, // ✅ exportado al context
  };

  return (
    <AppContext.Provider value={values}>
      {children}
    </AppContext.Provider>
  );
};
