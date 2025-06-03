import React, { createContext, useContext, useState, useEffect } from 'react';
import { getData, postData, putData, deleteData } from '../../../apiService';

const PreciosContext = createContext();

export const PreciosProvider = ({ children }) => {
  const [skus, setSkus] = useState([]);
  const [seguros, setSeguros] = useState([]);
  const [precios, setPrecios] = useState([]);
  const [showModalPrecios, setShowModalPrecios] = useState(false);
  const [skuActivo, setSkuActivo] = useState(null);

  const cargarSkus = async () => {
    try {
      const res = await getData('inventario/skus/?page_size=1000');
      setSkus(res.data.results || []);
    } catch (error) {
      console.error('Error al cargar SKUs:', error);
    }
  };

  const cargarSeguros = async () => {
    try {
      const res = await getData('inventario/seguros/?page_size=100');
      setSeguros(res.data.results || []);
    } catch (error) {
      console.error('Error al cargar seguros:', error);
    }
  };

  const cargarPrecios = async () => {
    try {
      const res = await getData('inventario/precios/?page_size=10000');
      const preciosTransformados = res.data.map(p => ({
        ...p,
        seguro_id: seguros.find(s => s.nombre === p.seguro_nombre)?.id || null,
        precio: parseFloat(p.precio), // Asegurar que sea número
      }));
      setPrecios(preciosTransformados || []);
    } catch (error) {
      console.error('Error al cargar precios:', error);
    }
  };

  const abrirModalEditarPrecios = (sku) => {
    const preciosSKU = precios.filter((p) => p.sku === sku.id);
    setSkuActivo({ ...sku, precios: preciosSKU });
    setShowModalPrecios(true);
  };

  const actualizarPrecio = async (data) => {
    try {
      await putData(`inventario/precios-actualizar/${data.id}/`, data);
      await cargarPrecios();
    } catch (error) {
      console.error('Error al actualizar precio:', error);
    }
  };

  const crearPrecio = async (data) => {
    try {
      await postData('inventario/precios-crear/', data);
      await cargarPrecios();
    } catch (error) {
      console.error('Error al crear precio:', error);
    }
  };

  const eliminarPrecio = async (id) => {
    try {
      await deleteData(`inventario/precios/${id}/`);
      await cargarPrecios();
    } catch (error) {
      console.error('Error al eliminar precio:', error);
    }
  };

  useEffect(() => {
    cargarSkus();
    cargarSeguros();
  }, []);
  
  useEffect(() => {
    if (seguros.length > 0) {
      cargarPrecios();
    }
  }, [seguros]);
  

  return (
    <PreciosContext.Provider
      value={{
        skus,
        seguros,
        precios,
        skuActivo,
        showModalPrecios,
        setShowModalPrecios,
        abrirModalEditarPrecios,
        actualizarPrecio,
        crearPrecio,
        eliminarPrecio,
        cargarSeguros,
      }}
    >
      {children}
    </PreciosContext.Provider>
  );
};

export const usePreciosContext = () => useContext(PreciosContext);
