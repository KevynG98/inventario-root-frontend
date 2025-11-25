import React, { createContext, useContext, useState, useEffect } from 'react';
import { getData, postData, putData, deleteData } from '../../../apiService';
import Swal from 'sweetalert2';

const PreciosContext = createContext();

export const PreciosProvider = ({ children }) => {
  const [cotizaciones, setCotizaciones] = useState([]);
  const [seguros, setSeguros] = useState([]);
  const [precios, setPrecios] = useState([]);
  const [showModalPrecios, setShowModalPrecios] = useState(false);
  const [inventarioActivo, setInventarioActivo] = useState(null);
  const [codigoInventarioActivo, setCodigoInventarioActivo] = useState('');
  const [descripcionInventario, setDescripcionInventario] = useState('');
  const [cotizacionSeleccionada, setCotizacionSeleccionada] = useState(null);

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

  const abrirModalEditarPrecios = (cotizacion) => {
    console.log('Abriendo modal para cotización:', cotizacion);
    setCotizacionSeleccionada(cotizacion);
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
  const cargarCotizaciones = async () => {
    Swal.fire({
      title: 'Cargando productos...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  
    try {
      const res = await getData('proyecto/cotizaciones/?page=1&page_size=50');
      const resultados = res.data || [];

      console.log('Cotizaciones cargadas:', resultados);
      
  
      setCotizaciones(resultados);
  
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

  const rechazarCotizacion = async (id) => {
    Swal.fire({
      title: '¿Estás seguro de rechazar esta cotización?',
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, rechazar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteData(`proyecto/cotizaciones/${id}/rechazar/`);
          
          Swal.fire(
            'Rechazada',
            'La cotización ha sido rechazada.',
            'success'
          );

          await cargarCotizaciones();
        } catch (error) {
          console.error('Error al rechazar cotización:', error);
          Swal.fire(
            'Error',
            'Hubo un problema al rechazar la cotización.',
            'error'
          );
        }
      }
    });
  }

  const aprovarCotizacion = async (id) => {
  }

  useEffect(() => {
    cargarCotizaciones();
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
        rechazarCotizacion,
        aprovarCotizacion,
        cotizaciones,
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
        cotizacionSeleccionada,
      }}
    >
      {children}
    </PreciosContext.Provider>
  );
};

export const usePreciosContext = () => useContext(PreciosContext);
