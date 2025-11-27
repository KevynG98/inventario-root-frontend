import React, { createContext, useContext, useState, useEffect, use } from 'react';
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
  const [proyectos, setProyectos] = useState([]);
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState();



  const cargarProyectos = async () => {
      Swal.fire({
        title: 'Cargando proyectos...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
    
      try {
        const res = await getData('proyecto/?page=1&page_size=50');
        const resultados = res.data || [];
  
        console.log('Proyectos cargadas:', resultados);
        
    
        setProyectos(resultados);
    
        Swal.close();
    
        if (resultados.length === 0) {
          Swal.fire({
            icon: 'info',
            title: 'Sin resultados',
            text: 'No se encontraron proyectos.',
          });
        }
      } catch (error) {
        Swal.close();
    
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al cargar proyectos',
        });
    
      }
  };  




  const abrirModalEditarPrecios = (inventario) => {
    setProyectoSeleccionado(inventario);
    setShowModalPrecios(true);
  };

  useEffect(() => {
    cargarProyectos()
  }, []);
  
  useEffect(() => {
    
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
        codigoInventarioActivo,
        descripcionInventario,
        proyectos,
        proyectoSeleccionado
      }}
    >
      {children}
    </PreciosContext.Provider>
  );
};

export const usePreciosContext = () => useContext(PreciosContext);
