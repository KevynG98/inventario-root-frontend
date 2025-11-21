import React, { createContext, useContext, useState, useEffect } from 'react';
import { getData, postData, putData, deleteData } from '../../../apiService';
import Swal from 'sweetalert2';

const PreciosContext = createContext();

export const PreciosProvider = ({ children }) => {
  const [inventarios, setInventarios] = useState([]);
  const [seguros, setSeguros] = useState([]);
  const [precios, setPrecios] = useState([]);
  const [showModalPrecios, setShowModalPrecios] = useState(false);
  const [inventarioActivo, setInventarioActivo] = useState(null);
  const [codigoInventarioActivo, setCodigoInventarioActivo] = useState('');
  const [descripcionInventario, setDescripcionInventario] = useState('');

  const cargarInventarios = async () => {
    Swal.fire({
      title: 'Cargando productos...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  
    try {
      const res = await getData('inventario/productos/?page_size=1000');
      const resultados = res.data.results || [];
  
      setInventarios(resultados);
  
      Swal.close();
  
      if (resultados.length === 0) {
        Swal.fire({
          icon: 'info',
          title: 'Sin resultados',
          text: 'No se encontraron productos.',
        });
      }
    } catch (error) {
      Swal.close();
  
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al cargar productos',
      });
  
      console.error('Error al cargar productos:', error);
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
        precio: parseFloat(p.precio),
      }));
      setPrecios(preciosTransformados || []);
    } catch (error) {
      console.error('Error al cargar precios:', error);
    }
  };

  const abrirModalEditarPrecios = (inventario) => {
    console.log('Abriendo modal para producto:', inventario);
    setCodigoInventarioActivo(inventario.codigo_inventario);
    setDescripcionInventario(inventario.descripcion_estado_cuenta);
    const preciosInventario = precios.filter((p) => p.inventario === inventario.id);
    setInventarioActivo({ ...inventario, precios: preciosInventario });
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
    cargarInventarios();
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
        inventarios,
        seguros,
        precios,
        inventarioActivo,
        showModalPrecios,
        setShowModalPrecios,
        abrirModalEditarPrecios,
        actualizarPrecio,
        crearPrecio,
        eliminarPrecio,
        cargarSeguros,
        codigoInventarioActivo,
        descripcionInventario,
      }}
    >
      {children}
    </PreciosContext.Provider>
  );
};

export const usePreciosContext = () => useContext(PreciosContext);
