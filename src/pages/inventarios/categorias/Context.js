import React, { createContext, useState, useContext, useEffect } from 'react';
import { getData, postData, putData, deleteData } from '../../../apiService';
import { NotificationManager } from "react-notifications";
import Swal from 'sweetalert2';

const MyContext = createContext();

export const ContextProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [modoFormulario, setModoFormulario] = useState('crear'); // 'crear', 'editar' o 'ver'
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);
  const [subcategorias, setSubcategorias] = useState([]); // 👈 NUEVO

  // paginación
  const [page, setPage] = useState(1);
  const [nullNextPage, setNullNextPage] = useState(null)
  const [nullPrevPage, setPrevNextPage] = useState(null)

  const nextPage = () => {
    setPage(prev => prev + 1);
  };

  const prevPage = () => {
    setPage(prev => prev - 1);
  };

  const cargarDatos = async () => {
    Swal.fire({
      title: 'Cargando...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const response = await getData(`inventario/categorias/?page=${page}`);
      const resultados = response.data.results;

      setData(resultados);
      setNullNextPage(response.data.next);
      setPrevNextPage(response.data.previous);

      Swal.close();

      if (resultados.length === 0) {
        Swal.fire({
          icon: 'info',
          title: 'Sin resultados',
          text: 'No se encontraron datos para los filtros aplicados.',
        });
      }
    } catch (error) {
      Swal.close();

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al cargar categorías',
      });

      console.error('Error al cargar categorías:', error);
    }
  };

  const enviarDatos = async (data) => {
    const { subcategorias: subcats, ...categoriaData } = data;
    try {
      const response = await postData("inventario/categorias-crear/", categoriaData);
      if (response?.status === 201 && response.data) {
        NotificationManager.success("Categoría creada", "Éxito", 3000);

        const categoriaId = response.data.id;

        // Crear subcategorías si hay
        if (subcats && subcats.length > 0) {
          for (const nombre of subcats) {
            await postData("inventario/subcategorias-crear/", {
              nombre,
              categoria: categoriaId,
              is_active: true,
            });
          }
        }

        setSubcategorias([]);
        showModal();
      } else {
        NotificationManager.error("Algo salió mal", "Error", 5000);
      }
    } catch (err) {
      console.error('Error al crear categoría:', err);
      NotificationManager.error("Error al crear categoría", "Error", 5000);
    }

    cargarDatos();
  };

  const actualizarProveedor = async (datos) => {
    try {
      const response = await putData(`inventario/categorias-actualizar/${datos.id}/`, datos);

      if (response.status === 200 || response.status === 204) {
        NotificationManager.success("Categoría actualizada", "Éxito", 3000);
        cargarDatos();
        setShow(false);
      } else {
        console.warn("Algo salió mal al actualizar:", response);
      }
    } catch (error) {
      console.error("Error al actualizar categoría:", error);
    }
  };

  const eliminarProveedor = async (id) => {
    const confirmed = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará permanentemente la categoría.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (confirmed.isConfirmed) {
      try {
        const response = await deleteData(`inventario/categorias-eliminar/${id}/`);
        NotificationManager.success("Categoría eliminada", "Éxito", 3000);
        cargarDatos();
      } catch (error) {
        console.error('Error al eliminar categoría:', error);
        NotificationManager.error("Hubo un error al eliminar", "Error", 3000);
      }
    }
  };

  const showModal = () => setShow(!show);

  const abrirModalCrear = () => {
    setProveedorSeleccionado(null);
    setModoFormulario('crear');
    setSubcategorias(['']); // 👈 inicia con una subcategoría vacía
    showModal();
  };

  const abrirModalEditar = async (proveedor) => {
    setProveedorSeleccionado(proveedor);
    setModoFormulario('editar');

    try {
      const response = await getData(`inventario/categorias/subcategorias/${proveedor.id}/`);
      const nombres = response.data.map(sub => sub.nombre);
      setSubcategorias(nombres);
    } catch (error) {
      console.error('Error al obtener subcategorías:', error);
      setSubcategorias([]);
    }

    showModal();
  };

  const abrirModalVer = async (proveedor) => {
    setProveedorSeleccionado(proveedor);
    setModoFormulario('ver');

    try {
      const response = await getData(`inventario/categorias/subcategorias/${proveedor.id}`);
      const nombres = response.data.map(sub => sub.nombre);
      setSubcategorias(nombres);
    } catch (error) {
      console.error('Error al obtener subcategorías:', error);
      setSubcategorias([]);
    }

    showModal();
  };

  useEffect(() => {
    cargarDatos();
  }, [page]);

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
    proveedorSeleccionado,
    setProveedorSeleccionado,
    abrirModalEditar,
    abrirModalCrear,
    abrirModalVer,
    actualizarProveedor,
    eliminarProveedor,
    subcategorias, // 👈 exportado
    setSubcategorias // 👈 exportado
  };

  return <MyContext.Provider value={values}>{children}</MyContext.Provider>;
};

export const useMyContext = () => useContext(MyContext);
