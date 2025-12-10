import React, { createContext, useState, useContext, useEffect } from 'react';
import { getData, postData, postFormData, putData, deleteData } from '../../../apiService';
import { NotificationManager } from "react-notifications";
import Swal from 'sweetalert2';

const MyContext = createContext();

export const ContextProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [modoFormulario, setModoFormulario] = useState('crear'); // 'crear', 'editar' o 'ver'
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);
  const [role, setRole] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  // búsqueda global
  const [skusFiltrados, setSkusFiltrados] = useState(null);
  const [buscando, setBuscando] = useState(false);
  const [termBusqueda, setTermBusqueda] = useState('');
  const [searchPage, setSearchPage] = useState(1);
  const [searchNext, setSearchNext] = useState(null);
  const [searchPrev, setSearchPrev] = useState(null);
  const [importando, setImportando] = useState(false);
  const [showImport, setShowImport] = useState(false);

  // paginación
  const [page, setPage] = useState(1);
  const [nullNextPage, setNullNextPage] = useState(null);
  const [nullPrevPage, setPrevNextPage] = useState(null);

  const nextPage = () => setPage(prev => prev + 1);
  const prevPage = () => setPage(prev => prev - 1);

  const cargarDatos = async () => {
    Swal.fire({
      title: 'Cargando...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    try {
      const response = await getData(`inventario/productos/?page=${page}&page_size=50`);
      const resultados = response.data.results;

      setData(resultados);
      setNullNextPage(response.data.next);
      setPrevNextPage(response.data.previous);
      setSkusFiltrados(null); // reset filtro al cambiar de página
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
      Swal.fire({ icon: 'error', title: 'Error', text: 'Error al cargar admisiones' });
      console.error('Error al cargar admisiones:', error);
    }
  };

  const buscarSkusGlobal = async (termino, pageArg = 1) => {
    const q = (termino || '').trim();
    if (!q) {
      setSkusFiltrados(null);
      setTermBusqueda('');
      setSearchPage(1);
      setSearchNext(null);
      setSearchPrev(null);
      return;
    }
    setBuscando(true);
    try {
      const params = new URLSearchParams({ page_size: '50' });
      params.set('page', String(pageArg || 1));
      // Usar búsqueda OR del backend con ?q= para nombre/código/barcode
      params.set('q', q);
      const res = await getData(`inventario/productos/buscar/?${params.toString()}`);
      const resultados = Array.isArray(res.data) ? res.data : (res.data.results || []);
      setSkusFiltrados(resultados);
      setTermBusqueda(q);
      setSearchPage(pageArg || 1);
      setSearchNext(res.data?.next ?? null);
      setSearchPrev(res.data?.previous ?? null);
      if (resultados.length === 0) {
        Swal.fire({ icon: 'info', title: 'Sin resultados', text: 'No se encontraron productos que coincidan.' });
      }
    } catch (error) {
      console.error('Error al buscar productos:', error);
      Swal.fire({ icon: 'error', title: 'Error en la búsqueda', text: 'Ocurrió un problema al consultar el backend.' });
    } finally {
      setBuscando(false);
    }
  };

  const limpiarFiltroSkus = () => setSkusFiltrados(null);

  const buscarSkusNextPage = async () => {
    if (!termBusqueda || !searchNext) return;
    await buscarSkusGlobal(termBusqueda, searchPage + 1);
  };

  const buscarSkusPrevPage = async () => {
    if (!termBusqueda || !searchPrev) return;
    await buscarSkusGlobal(termBusqueda, Math.max(1, searchPage - 1));
  };

  const cargarCategorias = async () => {
    try {
      const response = await getData(`inventario/categorias/?page_size=100`);
      setCategorias(response.data.results);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  const cargarMarcas = async () => {
    try {
      const response = await getData(`inventario/marcas/?page_size=100`);
      setMarcas(response.data.results);
    } catch (error) {
      console.error('Error al cargar marcas:', error);
    }
  };

  const normalizarPayload = (raw) => {
    const payload = { ...raw };
    delete payload.clasificacion_producto;
    delete payload.iva;
    payload.estado = payload.estado || 'alta';
    payload.categoria = payload.categoria || '';
    payload.marca = payload.marca || '';
    payload.nombre = payload.nombre || '';
    payload.codigo_inventario = payload.codigo_inventario || '';
    payload.principio_activo = payload.principio_activo || 'N/A';
    payload.unidad_compra = payload.unidad_compra || 'Unidad';
    payload.unidad_despacho = payload.unidad_despacho || 'Unidad';
    payload.unidades_por_paquete = parseInt(payload.unidades_por_paquete || 1, 10);
    payload.precio_compre = parseFloat(payload.precio_compre ?? 0) || 0;
    payload.precio_stock = parseFloat(payload.precio_stock ?? 0) || 0;
    payload.barcode = payload.barcode || '';
    payload.subcategoria = payload.subcategoria || '';
    payload.proveedor = payload.proveedor || '';
    payload.is_active = payload.is_active ?? true;
    return payload;
  };

  const enviarDatos = async (data) => {
    try {
      const response = await postData("inventario/productos-crear/", normalizarPayload(data));
      if (response?.status === 201 && response.data) {
        NotificationManager.success("Producto creado", "Éxito", 3000);
        showModal();
      } else {
        NotificationManager.error("Algo salió mal", "Error", 5000);
      }
    } catch (err) {
      const detail = err.response?.data;
      if (detail?.codigo_inventario?.[0]) {
        NotificationManager.error(`Código duplicado: ${detail.codigo_inventario[0]}`, "Error", 5000);
      } else {
        NotificationManager.error("Error desconocido al crear", "Error", 5000);
      }
      console.error('Error al crear usuario:', detail || err);
    }
    cargarDatos();
  };

  const actualizarProveedor = async (datos) => {
    try {
      const response = await putData(`inventario/productos-actualizar/${datos.id}/`, normalizarPayload(datos));
      if (response.status === 200 || response.status === 204) {
        NotificationManager.success("Producto editado con éxito", "Éxito", 3000);
        cargarDatos();
        setShow(false);
      } else {
        console.warn("Algo salió mal al actualizar:", response);
      }
    } catch (error) {
      console.error("Error al actualizar proveedor:", error);
    }
  };

  const eliminarProveedor = async (id) => {
    const confirmed = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará permanentemente el producto.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (confirmed.isConfirmed) {
      try {
        await deleteData(`inventario/productos-eliminar/${id}/`);
        NotificationManager.success("Producto eliminado con éxito", "Éxito", 3000);
        cargarDatos && cargarDatos();
      } catch (error) {
        console.error('Error al eliminar proveedor:', error);
        NotificationManager.error("Hubo un error al eliminar", "Error", 3000);
      }
    }
  };

  const showModal = () => setShow(!show);

  const abrirModalCrear = () => {
    setProveedorSeleccionado(null);
    setModoFormulario('crear');
    showModal();
  };

  const abrirModalEditar = (proveedor) => {
    setProveedorSeleccionado(proveedor);
    setModoFormulario('editar');
    showModal();
  };

  const abrirModalVer = (proveedor) => {
    setProveedorSeleccionado(proveedor);
    setModoFormulario('ver');
    showModal();
  };

  const abrirModalImport = () => setShowImport(true);
  const cerrarModalImport = () => setShowImport(false);

  useEffect(() => {
    cargarDatos();
    cargarCategorias();
    cargarMarcas();
    const getRole = () => {
      const u = JSON.parse(localStorage.getItem("user") || "null");
      const r = u?.roles?.[0];
      return typeof r === "string" ? r : r?.id || null;
    };
    setRole(getRole());
  }, [page]);

  const cargarProductosMasivo = async (file) => {
    if (!file) {
      NotificationManager.warning("Selecciona un archivo Excel para cargar.", "Aviso", 4000);
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    setImportando(true);
    try {
      const res = await postFormData('inventario/productos-carga-masiva/', formData, { timeout: 180000 });
      const resumen = res.data?.resumen || 'Carga completada';
      NotificationManager.success(resumen, "Éxito", 5000);
      await cargarDatos();
    } catch (error) {
      const detail = error.response?.data;
      const mensaje = detail?.error || 'No se pudo completar la carga masiva.';
      NotificationManager.error(mensaje, "Error", 6000);
      console.error('Error en carga masiva:', detail || error);
    } finally {
      setImportando(false);
    }
  };

  const values = {
    data,
    show,
    showModal,
    nullNextPage,
    nullPrevPage,
    nextPage,
    prevPage,
    skusFiltrados,
    buscando,
    buscarSkusGlobal,
    limpiarFiltroSkus,
    termBusqueda,
    searchPage,
    searchNext,
    searchPrev,
    buscarSkusNextPage,
    buscarSkusPrevPage,
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
    categorias,
    marcas,
    role,
    importando,
    cargarProductosMasivo,
    showImport,
    abrirModalImport,
    cerrarModalImport,
  };

  return <MyContext.Provider value={values}>{children}</MyContext.Provider>;
};

export const useMyContext = () => useContext(MyContext);
