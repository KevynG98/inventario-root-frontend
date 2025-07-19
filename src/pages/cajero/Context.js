// Context.js
import React, { createContext, useState, useEffect } from 'react';
import { getData } from '../../apiService';

export const CajeroContext = createContext();

export const CajeroProvider = ({ children }) => {
  const [cajero, setCajero]   = useState(null);
  const [productos, setProductos] = useState([]);
  const [items, setItems]     = useState([]);

  /*………………………… autenticación …………………………*/
  const autenticarCajero = async (clave) => {
    try {
      const { data } = await getData(`inventario/cajeros/${clave}/`);
      sessionStorage.setItem('cajero', JSON.stringify(data));
      window.location.reload();                     // recarga para redibujar
    } catch {
      throw new Error('Clave inválida');
    }
  };

  /*………………………… cargar SKUs …………………………*/
  const cargarProductos = async (bodegaId) => {
    try {
      const { data } = await getData('inventario/skus-con-bodegas/?page_size=1000');
      const todos = data.results || [];

      // admite distintos nombres de campo
      const filtrados = todos.filter(sku =>
        sku.bodegas?.some(b =>
          b.id === bodegaId ||
          b.bodega_id === bodegaId ||
          b.id_bodega === bodegaId
        )
      );

      setProductos(filtrados.length ? filtrados : todos);  // fallback a todos
    } catch (err) {
      console.error('Error al cargar productos:', err);
    }
  };

  /*………………………… items vendidos …………………………*/
  const addItem    = (i) => setItems(prev => [...prev, i]);
  const clearItems = ()  => setItems([]);
  const cerrarSesion = () => {
    setCajero(null);
    sessionStorage.removeItem('cajero');
    setProductos([]);
    setItems([]);
    window.location.href = '/auth/signin-1';
  };

  /*………………………… init …………………………*/
  useEffect(() => {
    const cache = sessionStorage.getItem('cajero');
    if (cache) {
      const caj = JSON.parse(cache);
      setCajero(caj);
      cargarProductos(caj.bodega_id);
    }
  }, []);

  return (
    <CajeroContext.Provider value={{
      cajero, productos, items,
      autenticarCajero, addItem, clearItems, cerrarSesion
    }}>
      {children}
    </CajeroContext.Provider>
  );
};
