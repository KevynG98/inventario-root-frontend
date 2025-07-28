// Context.js
import React, { createContext, useState, useEffect } from 'react';
import { getData, patchData } from '../../../../apiService';

export const AppContext = createContext();

export const ContextProvider = ({ children }) => {
  const [requisiciones, setRequisiciones] = useState([]);
  const [requisicionSeleccionada, setRequisicionSeleccionada] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const cargarRequisiciones = async () => {
    try {
      const data = await getData('requisisiones/?excluir=aprobada');
      console.log('🧪 Respuesta original del backend:', data);

      if (!Array.isArray(data.data)) {
        console.error('❌ La respuesta no es un arreglo:', data);
        return;
      }

      const mapeadas = data.data.map((r) => ({
        ...r,
        proveedor: r.tipo_requisicion === 'bien'
          ? (r.productos[0]?.sku || 'Producto sin SKU')
          : (r.servicios[0]?.descripcion || 'Servicio sin nombre'),
        fecha: new Date(r.created_at).toISOString().split('T')[0],
      }));

      console.log('📦 Requisiciones cargadas:', mapeadas);
      setRequisiciones(mapeadas);
    } catch (error) {
      console.error('❌ Error cargando requisiciones:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    cargarRequisiciones();
  }, []);

  const abrirModal = (requisicion) => {
    setRequisicionSeleccionada(requisicion);
    setShowModal(true);
  };

  const cerrarModal = () => {
    setRequisicionSeleccionada(null);
    setShowModal(false);
  };

  const actualizarEstado = async (id, nuevoEstado) => {
    try {
      await patchData(`requisisiones/estado/${id}/`, { estado: nuevoEstado });

      setRequisiciones((prev) =>
        prev.map((r) => (r.id === id ? { ...r, estado: nuevoEstado } : r))
      );
    } catch (error) {
      console.error('❌ Error actualizando estado:', error.response?.data || error.message);
    }
    cargarRequisiciones();
  };

  return (
    <AppContext.Provider
      value={{
        showModal,
        abrirModal,
        cerrarModal,
        requisicionSeleccionada,
        requisiciones,
        actualizarEstado,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
