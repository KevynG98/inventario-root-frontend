import React, { createContext, useState, useEffect } from 'react';
import { getData } from '../../apiService';

// Creamos el contexto
export const CajeroContext = createContext();

// Proveedor del contexto
export const CajeroProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [productos, setProductos] = useState([]);

  const bodegaActual = new URLSearchParams(window.location.search).get('bodega') || 'Principal';

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await getData('inventario/skus-con-bodegas/?page_size=1000');
        const all = res.data.results || [];
        const filtrados = all.filter(sku =>
          sku.bodegas?.some(b => b.nombre_bodega?.toLowerCase() === bodegaActual.toLowerCase())
        );
        setProductos(filtrados);
      } catch (err) {
        console.error('Error al cargar productos:', err);
      }
    };

    fetchProductos();
  }, [bodegaActual]);

  // Agregar producto
  const addItem = (item) => {
    setItems([...items, item]);
  };

  // Limpiar productos
  const clearItems = () => {
    setItems([]);
  };

  return (
    <CajeroContext.Provider value={{ items, productos, addItem, clearItems }}>
      {children}
    </CajeroContext.Provider>
  );
};
