// Context.js
import React, { createContext, useEffect, useState } from 'react';
import { postData, putData, getData } from '../../../../apiService';


export const AppContext = createContext();

export const ContextProvider = ({ children }) => {
  const [showModalProveedor, setShowModalProveedor] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [requisicionSeleccionada, setRequisicionSeleccionada] = useState(null);
  const [bodegas, setBodegas] = useState([]);
  const [proveedores, setProveedores] = useState([]); // Lista de proveedores
  const [categorias, setCategorias] = useState([]); // Lista de categorias
  const [skus, setSkus] = useState([]); // Lista de SKUs

  const getBodegas = async () => {
    try {
      const response = await getData('/inventario/bodegas/');
      setBodegas(response.data.results);
    } catch (error) {
      console.error('Error al cargar bodegas:', error);
    }
  };

  const getProveedores = async () => {
    try {
      const response = await getData('/inventario/proveedores/');
      setProveedores(response.data.results);
    } catch (error) {
      console.error('Error al cargar proveedores:', error);
    }
  };

  const getCategorias = async () => {
    try {
      const response = await getData('/inventario/categorias/');
      setCategorias(response.data.results);
    } catch (error) {
      console.error('Error al cargar categorias:', error);
    }
  };

  const getSkus = async () => {
    try {
      const response = await getData('/inventario/skus/');
      setSkus(response.data.results);
    } catch (error) {
      console.error('Error al cargar SKUs:', error);
    }
  };

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

  useEffect(() => {
    getBodegas();
    getProveedores();
    getCategorias();
    getSkus();
  }, []);

  const values = {
    showModalProveedor,
    setShowModalProveedor,
    toggleModalProveedor,
    showModal,
    abrirModal,
    cerrarModal,
    requisicionSeleccionada,
    crearRequisicion, // ✅ exportado al context
    bodegas,
    proveedores,
    categorias,
    skus
  };

  return (
    <AppContext.Provider value={values}>
      {children}
    </AppContext.Provider>
  );
};
