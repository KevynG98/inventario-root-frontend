import React, { createContext, useState, useEffect } from 'react';
import { getData } from '../../apiService';

// Creamos el contexto
export const CajeroContext = createContext();

// Proveedor del contexto
export const CajeroProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [productos, setProductos] = useState([]);
  const [bodegas, setBodegas] = useState([]);

  const initialBodega = new URLSearchParams(window.location.search).get('bodega') ||
    localStorage.getItem('bodegaPredeterminada') || '';
  const [bodegaActual, setBodegaActual] = useState(initialBodega);

  useEffect(() => {
    const fetchBodegas = async () => {
      try {
        const res = await getData('inventario/bodegas/?page_size=1000');
        const lista = res.data.results || [];
        setBodegas(lista);
        if (!initialBodega && lista.length > 0) {
          setBodegaActual(lista[0].nombre);
        }
      } catch (err) {
        console.error('Error al cargar bodegas:', err);
      }
    };
    fetchBodegas();
  }, []);

  useEffect(() => {
    if (!bodegaActual) {
      setProductos([]);
      return;
    }
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

  const changeBodega = (nombre, recordar) => {
    setBodegaActual(nombre);
    if (recordar) {
      localStorage.setItem('bodegaPredeterminada', nombre);
    }
  };

  // Agregar producto
  const addItem = (item) => {
    setItems([...items, item]);
  };

  // Limpiar productos
  const clearItems = () => {
    setItems([]);
  };

  return (
    <CajeroContext.Provider
      value={{
        items,
        productos,
        bodegas,
        bodegaActual,
        changeBodega,
        addItem,
        clearItems,
      }}
    >
      {children}
    </CajeroContext.Provider>
  );
};
