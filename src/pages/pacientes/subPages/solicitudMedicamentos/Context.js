import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { NotificationManager } from 'react-notifications';
import { getData } from '../../../../apiService';

const SolicitudMedicamentosContext = createContext(null);

const initialFormState = {
  id: null,
  bodega_origen: '',
  bodega_destino: '',
  comentarios: ''
};

const initialItemDraft = {
  sku: '',
  categoria: '',
  subcategoria: '',
  cantidad: 1
};

export const useSolicitudMedicamentosContext = () =>
  useContext(SolicitudMedicamentosContext);

const formatSolicitud = (solicitud) => ({
  ...solicitud,
  fecha_envio: solicitud?.fecha_envio ? new Date(solicitud.fecha_envio) : null,
  fecha_recibido: solicitud?.fecha_recibido
    ? new Date(solicitud.fecha_recibido)
    : null,
  fecha_cargado_ec: solicitud?.fecha_cargado_ec
    ? new Date(solicitud.fecha_cargado_ec)
    : null
});

const dedupe = (items = [], key = 'nombre') => {
  const map = new Map();
  items.forEach((item) => {
    if (!item || !item[key]) {
      return;
    }
    map.set(item[key], item);
  });
  return Array.from(map.values());
};

const normalizeSkus = (skus) =>
  (Array.isArray(skus) ? skus : []).map((sku) => ({
    id: sku.id,
    codigo_sku: sku.codigo_sku,
    nombre: sku.nombre || sku.descripcion || '',
    categoria: sku.categoria || '',
    subcategoria: sku.subcategoria || '',
    descripcion: sku.descripcion || ''
  }));

const defaultRecepcionEstado = (selected) => {
  if (!selected) {
    return {};
  }
  const map = {};
  (selected.items || []).forEach((item) => {
    const cantidadBase =
      item.cantidad_enviada || item.cantidad_pedida || item.cantidad_recibida || 0;
    map[item.id] = {
      checked: item.recibido || false,
      cantidad: cantidadBase
    };
  });
  return map;
};

export const SolicitudMedicamentosProvider = ({ children, value }) => {
  const [mode, setMode] = useState('list');
  const [selected, setSelected] = useState(null);
  const [formState, setFormState] = useState(initialFormState);
  const [itemDraft, setItemDraft] = useState(initialItemDraft);
  const [itemsDraft, setItemsDraft] = useState([]);
  const [loadingAction, setLoadingAction] = useState(false);
  const [catalogs, setCatalogs] = useState({
    bodegas: [],
    categorias: [],
    subcategorias: [],
    skus: [],
    departamentos: [],
    usuarios: []
  });
  const [subcategoriasFiltradas, setSubcategoriasFiltradas] = useState([]);

  const solicitudes = useMemo(() => {
    const sourceItems = value?.items;
    const rawItems = Array.isArray(sourceItems)
      ? sourceItems
      : Array.isArray(sourceItems?.results)
      ? sourceItems.results
      : [];
    return rawItems.map(formatSolicitud);
  }, [value?.items, value?.items?.results]);

  const ordenesActivas = useMemo(() => {
    const sourceOrdenes = value?.ordenesActivas;
    if (Array.isArray(sourceOrdenes)) {
      return sourceOrdenes;
    }
    if (Array.isArray(sourceOrdenes?.results)) {
      return sourceOrdenes.results;
    }
    return [];
  }, [value?.ordenesActivas, value?.ordenesActivas?.results]);

  const loadCatalogs = useCallback(async () => {
    try {
      const [bodegasRes, categoriasRes, departamentosRes, usuariosRes] =
        await Promise.all([
          getData('inventario/bodegas/?page_size=200'),
          getData('inventario/categorias/?page_size=200'),
          getData('mantenimiento/departamentos/?page_size=200'),
          getData('user/filter-users/')
        ]);

      const bodegasList =
        bodegasRes?.data?.results ??
        bodegasRes?.data ??
        bodegasRes ??
        [];
      const categoriasList =
        categoriasRes?.data?.results ??
        categoriasRes?.data ??
        categoriasRes ??
        [];
      const departamentosList =
        departamentosRes?.data?.results ??
        departamentosRes?.data ??
        departamentosRes ??
        [];
      const usuariosList = Array.isArray(usuariosRes?.data)
        ? usuariosRes.data
        : usuariosRes?.data?.results ?? usuariosRes ?? [];

      setCatalogs((prev) => ({
        ...prev,
        bodegas: dedupe(bodegasList, 'nombre'),
        categorias: categoriasList,
        departamentos: departamentosList,
        usuarios: usuariosList
      }));
    } catch (error) {
      console.error('Error cargando catálogos de enfermería', error);
      NotificationManager.error(
        'No se pudieron cargar catálogos de inventario',
        'Error',
        4000
      );
    }
  }, []);

  const loadSkus = useCallback(async ({ categoriaNombre, subcategoriaNombre }) => {
    try {
      const params = new URLSearchParams({ page_size: '500' });
      if (categoriaNombre) {
        params.append('categoria', categoriaNombre);
      }
      if (subcategoriaNombre) {
        params.append('subcategoria', subcategoriaNombre);
      }
      const response = await getData(`inventario/skus/?${params.toString()}`);
      const list =
        response?.data?.results ??
        response?.data ??
        response ??
        [];
      setCatalogs((prev) => ({
        ...prev,
        skus: normalizeSkus(list)
      }));
    } catch (error) {
      console.error('Error cargando SKUs', error);
      NotificationManager.error(
        'No se pudieron cargar los SKUs disponibles',
        'Error',
        4000
      );
      setCatalogs((prev) => ({ ...prev, skus: [] }));
    }
  }, []);

  const loadSubcategorias = useCallback(async (categoriaId) => {
    if (!categoriaId) {
      setSubcategoriasFiltradas([]);
      return;
    }
    try {
      const response = await getData(
        `inventario/categorias/subcategorias/${categoriaId}/`
      );
      const list = Array.isArray(response?.data)
        ? response.data
        : response?.data?.results ?? [];
      setSubcategoriasFiltradas(list);
    } catch (error) {
      console.error('Error cargando subcategorías', error);
      setSubcategoriasFiltradas([]);
    }
  }, []);

  useEffect(() => {
    loadCatalogs();
  }, [loadCatalogs]);

  const resetDraft = useCallback(() => {
    setFormState(initialFormState);
    setItemDraft(initialItemDraft);
    setItemsDraft([]);
    setSelected(null);
  }, []);

  const openCreate = useCallback(() => {
    resetDraft();
    setMode('form');
  }, [resetDraft]);

  const openEdit = useCallback((solicitud) => {
    if (!solicitud) {
      return;
    }
    setSelected(solicitud);
    setFormState({
      id: solicitud.id,
      bodega_origen: solicitud.bodega_origen || '',
      bodega_destino: solicitud.bodega_destino || '',
      comentarios: solicitud.comentarios || ''
    });
    setItemsDraft(
      (solicitud.items || []).map((item) => ({
        id: item.id,
        sku: item.sku,
        descripcion: item.descripcion,
        cantidad: item.cantidad_pedida,
        categoria: item.categoria || '',
        subcategoria: item.subcategoria || '',
        comentario_enfermeria: item.comentario_enfermeria || ''
      }))
    );
    setMode('form');
  }, []);

  const openDetail = useCallback((solicitud) => {
    setSelected(solicitud || null);
    setMode('detail');
  }, []);

  const closeDetail = useCallback(() => {
    setSelected(null);
    setMode('list');
  }, []);

  const addItemDraft = useCallback(() => {
    const skuObj = (catalogs.skus || []).find(
      (sku) => sku.codigo_sku === itemDraft.sku
    );
    if (!skuObj) {
      NotificationManager.warning('Selecciona un SKU válido', 'Aviso', 3000);
      return;
    }
    const cantidad = parseInt(itemDraft.cantidad, 10);
    if (!Number.isFinite(cantidad) || cantidad <= 0) {
      NotificationManager.warning(
        'La cantidad debe ser mayor a cero',
        'Aviso',
        3000
      );
      return;
    }
    setItemsDraft((prev) => [
      ...prev,
      {
        id: null,
        sku: skuObj.codigo_sku,
        descripcion: skuObj.nombre,
        cantidad,
        categoria: skuObj.categoria,
        subcategoria: skuObj.subcategoria,
        comentario_enfermeria: ''
      }
    ]);
    setItemDraft(initialItemDraft);
  }, [catalogs.skus, itemDraft]);

  const removeDraftItem = useCallback((index) => {
    setItemsDraft((prev) => prev.filter((_, idx) => idx !== index));
  }, []);

  const updateDraftItem = useCallback((index, key, value) => {
    setItemsDraft((prev) =>
      prev.map((item, idx) =>
        idx === index
          ? {
              ...item,
              [key]: value
            }
          : item
      )
    );
  }, []);

  const mapItemsPayload = useCallback(
    () =>
      itemsDraft.map((item) => ({
        id: item.id,
        sku: item.sku,
        descripcion: item.descripcion,
        categoria: item.categoria,
        subcategoria: item.subcategoria,
        cantidad_pedida: item.cantidad,
        comentario_enfermeria: item.comentario_enfermeria
      })),
    [itemsDraft]
  );

  const saveSolicitud = useCallback(async () => {
    if (!formState.bodega_origen || !formState.bodega_destino) {
      NotificationManager.warning(
        'Selecciona bodegas de origen y destino',
        'Aviso',
        3000
      );
      return;
    }
    if (itemsDraft.length === 0) {
      NotificationManager.warning(
        'Agrega al menos un SKU a la solicitud',
        'Aviso',
        3000
      );
      return;
    }
    try {
      setLoadingAction(true);
      const payload = {
        bodega_origen: formState.bodega_origen,
        bodega_destino: formState.bodega_destino,
        comentarios: formState.comentarios,
        items: mapItemsPayload()
      };
      if (formState.id) {
        await value.update(formState.id, payload);
        NotificationManager.success('Solicitud actualizada', 'Éxito', 3000);
      } else {
        await value.create(payload);
        NotificationManager.success('Solicitud creada', 'Éxito', 3000);
      }
      await value.refresh?.();
      resetDraft();
      setMode('list');
    } catch (error) {
      const message =
        error?.response?.data?.error ||
        error?.response?.data ||
        'No se pudo guardar la solicitud';
      NotificationManager.error(
        typeof message === 'string' ? message : JSON.stringify(message),
        'Error',
        5000
      );
    } finally {
      setLoadingAction(false);
    }
  }, [
    formState.bodega_destino,
    formState.bodega_origen,
    formState.comentarios,
    formState.id,
    itemsDraft,
    mapItemsPayload,
    resetDraft,
    value
  ]);

  const enviarSolicitud = useCallback(
    async (solicitud) => {
      try {
        setLoadingAction(true);
        await value.enviar(solicitud.id);
        NotificationManager.success('Solicitud enviada', 'Éxito', 3000);
        await value.refresh?.();
      } catch (error) {
        const message =
          error?.response?.data?.error ||
          error?.response?.data ||
          'No se pudo enviar la solicitud';
        NotificationManager.error(
          typeof message === 'string' ? message : JSON.stringify(message),
          'Error',
          5000
        );
      } finally {
        setLoadingAction(false);
      }
    },
    [value]
  );

  const marcarPendienteRecibir = useCallback(
    async (solicitud) => {
      try {
        setLoadingAction(true);
        await value.marcarPendienteRecibir(solicitud.id);
        NotificationManager.success(
          'Solicitud actualizada a Pendiente de Recibir',
          'Éxito',
          3000
        );
        await value.refresh?.();
      } catch (error) {
        const message =
          error?.response?.data?.error ||
          error?.response?.data ||
          'No se pudo actualizar la solicitud';
        NotificationManager.error(
          typeof message === 'string' ? message : JSON.stringify(message),
          'Error',
          5000
        );
      } finally {
        setLoadingAction(false);
      }
    },
    [value]
  );

  const recibirSolicitud = useCallback(
    async (solicitud, itemsPayload) => {
      try {
        setLoadingAction(true);
        await value.recibir(solicitud.id, { items: itemsPayload });
        NotificationManager.success(
          'Solicitud recibida correctamente',
          'Éxito',
          3000
        );
        await value.refresh?.();
        setSelected(null);
        setMode('list');
      } catch (error) {
        const message =
          error?.response?.data?.error ||
          error?.response?.data ||
          'No se pudo marcar como recibida';
        NotificationManager.error(
          typeof message === 'string' ? message : JSON.stringify(message),
          'Error',
          5000
        );
      } finally {
        setLoadingAction(false);
      }
    },
    [value]
  );

  const cargarEstadoCuenta = useCallback(
    async (solicitud) => {
      try {
        setLoadingAction(true);
        await value.cargarEstadoCuenta(solicitud.id);
        NotificationManager.success(
          'Solicitud cargada al estado de cuenta',
          'Éxito',
          3000
        );
        await value.refresh?.();
        setSelected(null);
        setMode('list');
      } catch (error) {
        const message =
          error?.response?.data?.error ||
          error?.response?.data ||
          'No se pudo cargar al estado de cuenta';
        NotificationManager.error(
          typeof message === 'string' ? message : JSON.stringify(message),
          'Error',
          5000
        );
      } finally {
        setLoadingAction(false);
      }
    },
    [value]
  );

  const anularSolicitud = useCallback(
    async (solicitud, payload = {}) => {
      try {
        setLoadingAction(true);
        await value.anular(solicitud.id, payload);
        NotificationManager.success('Solicitud anulada', 'Éxito', 3000);
        await value.refresh?.();
        setSelected(null);
        setMode('list');
      } catch (error) {
        const message =
          error?.response?.data?.error ||
          error?.response?.data ||
          'No se pudo anular la solicitud';
        NotificationManager.error(
          typeof message === 'string' ? message : JSON.stringify(message),
          'Error',
          5000
        );
      } finally {
        setLoadingAction(false);
      }
    },
    [value]
  );

  const devolverItem = useCallback(
    async (solicitudId, itemId, payload) => {
      try {
        setLoadingAction(true);
        await value.devolverItem(solicitudId, itemId, payload);
        NotificationManager.success('Ítem enviado a devolución', 'Éxito', 3000);
        await value.refresh?.();
      } catch (error) {
        const message =
          error?.response?.data?.error ||
          error?.response?.data ||
          'No se pudo registrar la devolución';
        NotificationManager.error(
          typeof message === 'string' ? message : JSON.stringify(message),
          'Error',
          5000
        );
      } finally {
        setLoadingAction(false);
      }
    },
    [value]
  );

  const contextValue = useMemo(
    () => ({
      mode,
      setMode,
      solicitudes,
      ordenesActivas,
      selected,
      setSelected,
      formState,
      setFormState,
      itemDraft,
      setItemDraft,
      itemsDraft,
      setItemsDraft,
      catalogs,
      subcategoriasFiltradas,
      loadSubcategorias,
      loadSkus,
      addItemDraft,
      removeDraftItem,
      updateDraftItem,
      openCreate,
      openEdit,
      openDetail,
      closeDetail,
      resetDraft,
      saveSolicitud,
      enviarSolicitud,
      marcarPendienteRecibir,
      recibirSolicitud,
      cargarEstadoCuenta,
      anularSolicitud,
      devolverItem,
      loadingAction
    }),
    [
      mode,
      solicitudes,
      ordenesActivas,
      selected,
      formState,
      itemDraft,
      itemsDraft,
      catalogs,
      subcategoriasFiltradas,
      loadSubcategorias,
      loadSkus,
      addItemDraft,
      removeDraftItem,
      updateDraftItem,
      openCreate,
      openEdit,
      openDetail,
      closeDetail,
      resetDraft,
      saveSolicitud,
      enviarSolicitud,
      marcarPendienteRecibir,
      recibirSolicitud,
      cargarEstadoCuenta,
      anularSolicitud,
      devolverItem,
      loadingAction
    ]
  );

  return (
    <SolicitudMedicamentosContext.Provider value={contextValue}>
      {children}
    </SolicitudMedicamentosContext.Provider>
  );
};
