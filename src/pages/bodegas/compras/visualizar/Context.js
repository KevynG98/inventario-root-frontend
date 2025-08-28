// Context.js
import React, { createContext, useState, useEffect } from 'react';
import { getData, patchData, putData } from '../../../../apiService';

export const AppContext = createContext();

export const ContextProvider = ({ children }) => {
  const [requisiciones, setRequisiciones] = useState([]);
  const [requisicionSeleccionada, setRequisicionSeleccionada] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [bodegas, setBodegas] = useState([]);
  const [skus, setSkus] = useState([]);

  const cargarCatalogos = async () => {
    try {
      const [resBodegas, resSkus] = await Promise.all([
        getData('inventario/bodegas/?page_size=200'),
        getData('inventario/skus/?page_size=200'),
      ]);
      setBodegas(resBodegas?.data?.results ?? resBodegas?.data ?? []);
      setSkus(resSkus?.data?.results ?? resSkus?.data ?? []);
    } catch (e) {
      console.error('❌ Error cargando catálogos:', e.response?.data || e.message);
    }
  };

  const cargarRequisiciones = async () => {
    try {
      const data = await getData('requisisiones/?excluir=aprobada');
      console.log('🧪 Respuesta original del backend:', data);

      if (!Array.isArray(data.data)) {
        console.error('❌ La respuesta no es un arreglo:', data);
        return;
      }

      const bodegasMap = new Map((bodegas || []).map((b) => [String(b.id), b.nombre]));
      const mapeadas = data.data.map((r) => {
        const bodegaRaw = r.bodega ?? '';
        const bodegaNombre = bodegasMap.get(String(bodegaRaw)) || bodegaRaw;
        return {
          ...r,
          bodega_nombre: bodegaNombre,
          usuario: r.usuario || r.creado_por || '',
          fecha: r.created_at ? new Date(r.created_at).toISOString().split('T')[0] : '',
        };
      });

      console.log('📦 Requisiciones cargadas:', mapeadas);
      setRequisiciones(mapeadas);
    } catch (error) {
      console.error('❌ Error cargando requisiciones:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    cargarCatalogos().then(() => cargarRequisiciones());
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

  const actualizarRequisicion = async (id, payload) => {
    try {
      const res = await putData(`requisisiones/actualizar/${id}/`, payload);
      if (res.status >= 200 && res.status < 300) {
        await cargarRequisiciones();
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Error actualizando requisición:', error.response?.data || error.message);
      return false;
    }
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
        actualizarRequisicion,
        bodegas,
        skus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
