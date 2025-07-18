import React, { createContext, useState, useContext, useEffect } from 'react';
import { getData, postData, putData, deleteData } from '../../../apiService';
import { NotificationManager } from "react-notifications";
import Swal from 'sweetalert2';

const CajeroContext = createContext();

export const CajeroProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [modoFormulario, setModoFormulario] = useState('crear');
  const [cajeroSeleccionado, setCajeroSeleccionado] = useState(null);
  const [page, setPage] = useState(1);
  const [nullNextPage, setNullNextPage] = useState(null);
  const [nullPrevPage, setPrevNextPage] = useState(null);

  const nextPage = () => setPage(prev => prev + 1);
  const prevPage = () => setPage(prev => prev - 1);

  const cargarDatos = async () => {
    Swal.fire({ title: 'Cargando...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    try {
      const response = await getData(`inventario/cajeros/?page=${page}`);
      const resultados = response.data.results;
      setData(resultados);
      setNullNextPage(response.data.next);
      setPrevNextPage(response.data.previous);
      Swal.close();

      if (resultados.length === 0) {
        Swal.fire({ icon: 'info', title: 'Sin resultados', text: 'No hay cajeros en esta página.' });
      }
    } catch (error) {
      Swal.close();
      Swal.fire({ icon: 'error', title: 'Error', text: 'Error al cargar cajeros' });
      console.error('Error al cargar cajeros:', error);
    }
  };

  const enviarDatos = async (data) => {
    try {
      const response = await postData("inventario/cajeros/crear/", data);
      if (response?.status === 201 && response.data) {
        NotificationManager.success("Cajero creado con éxito", "Éxito", 3000);
        showModal();
      } else {
        NotificationManager.error("Algo salió mal", "Error", 5000);
      }
    } catch (err) {
      console.error('Error al crear cajero:', err);
    }
    cargarDatos();
  };

  const actualizarCajero = async (datos) => {
    try {
      const response = await putData(`inventario/cajeros-actualizar/${datos.id}/`, datos);
      if (response.status === 200 || response.status === 204) {
        NotificationManager.success("Cajero actualizado", "Éxito", 3000);
        cargarDatos();
        setShow(false);
      }
    } catch (error) {
      console.error("Error al actualizar cajero:", error);
    }
  };

  const eliminarCajero = async (id) => {
    const confirmed = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esto eliminará al cajero.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (confirmed.isConfirmed) {
      try {
        await deleteData(`inventario/cajeros-eliminar/${id}/`);
        NotificationManager.success("Cajero eliminado", "Éxito", 3000);
        cargarDatos && cargarDatos();
      } catch (error) {
        console.error('Error al eliminar cajero:', error);
        NotificationManager.error("Error al eliminar", "Error", 3000);
      }
    }
  };

  const showModal = () => setShow(!show);

  const abrirModalCrear = () => {
    setCajeroSeleccionado(null);
    setModoFormulario('crear');
    showModal();
  };

  const abrirModalEditar = (cajero) => {
    setCajeroSeleccionado(cajero);
    setModoFormulario('editar');
    showModal();
  };

  const abrirModalVer = (cajero) => {
    setCajeroSeleccionado(cajero);
    setModoFormulario('ver');
    showModal();
  };

  useEffect(() => { cargarDatos(); }, [page]);

  const values = {
    data,
    show,
    showModal,
    nullNextPage,
    nullPrevPage,
    nextPage,
    prevPage,
    enviarDatos,
    modoFormulario,
    setModoFormulario,
    cajeroSeleccionado,
    setCajeroSeleccionado,
    abrirModalEditar,
    abrirModalCrear,
    abrirModalVer,
    actualizarCajero,
    eliminarCajero
  };

  return <CajeroContext.Provider value={values}>{children}</CajeroContext.Provider>;
};

export const useCajeroContext = () => useContext(CajeroContext);
