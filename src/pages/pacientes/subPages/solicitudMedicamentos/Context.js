import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { getData } from '../../../../apiService';

const SolicitudContext = createContext(null);
export const useSolicitudContext = () => useContext(SolicitudContext);

const EMPTY_FORM = {
  id: null,
  estatus: 'PENDIENTE_ENVIAR',
  bodega_origen: '',
  bodega_destino: '',
  comentarios: '',
  items: []
};

const EMPTY_ITEM = {
  id: null,
  categoria: '',
  subcategoria: '',
  sku: '',
  descripcion: '',
  cantidad: 1
};

const asArray = (data) => {
  if (!data) {
    return [];
  }
  if (Array.isArray(data)) {
    return data;
  }
  if (Array.isArray(data.results)) {
    return data.results;
  }
  return [];
};

const normalizeBodega = (item) => ({
  id:
    item?.id ??
    item?.pk ??
    item?.codigo ??
    item?.nombre_bodega ??
    item?.nombre ??
    null,
  name:
    item?.nombre_bodega ||
    item?.nombre ||
    item?.descripcion ||
    item?.codigo ||
    ''
});

const normalizeCategoria = (item) => ({
  id: item?.id ?? item?.categoria_id ?? null,
  name: item?.nombre || item?.descripcion || item?.codigo || ''
});

const normalizeSubcategoria = (item, categoriaId) => ({
  id: item?.id ?? item?.subcategoria_id ?? null,
  name: item?.nombre || item?.descripcion || item?.codigo || '',
  categoriaId
});

const normalizeSku = (item) => ({
  id: item?.id ?? item?.sku_id ?? null,
  code: item?.codigo_sku || item?.codigo || '',
  name: item?.nombre || item?.descripcion || ''
});

const normalizeDepartamento = (item) => ({
  id: item?.id ?? item?.departamento_id ?? null,
  name: item?.nombre || item?.descripcion || ''
});

const normalizeUsuario = (item) => {
  const username =
    item?.username ||
    item?.usuario ||
    item?.correo ||
    item?.email ||
    item?.codigo ||
    '';

  const nameCandidates = [
    item?.nombre_completo,
    item?.nombreCompleto,
    item?.full_name,
    item?.fullName,
    [
      item?.primer_nombre,
      item?.segundo_nombre,
      item?.primer_apellido,
      item?.segundo_apellido
    ]
      .filter(Boolean)
      .join(' '),
    item?.nombre
  ];

  const fullName =
    nameCandidates.find(
      (candidate) => candidate && typeof candidate === 'string' && candidate.trim()
    ) || username;

  return {
    id: item?.id ?? username ?? fullName,
    username,
    fullName: fullName || username,
    label: fullName && username ? `${fullName} (${username})` : fullName || username
  };
};

const mapSolicitud = (raw) => {
  if (!raw) {
    return null;
  }

  const toDate = (value) => (value ? new Date(value) : null);

  const items = Array.isArray(raw.items)
    ? raw.items.map((item) => ({
        id: item.id ?? null,
        categoria: item.categoria ?? '',
        subcategoria: item.subcategoria ?? '',
        sku: item.sku ?? '',
        descripcion: item.descripcion ?? '',
        cantidad: item.cantidad_pedida ?? item.cantidad_enviada ?? item.cantidad_recibida ?? 0,
        cantidad_pedida: item.cantidad_pedida ?? 0,
        cantidad_enviada: item.cantidad_enviada ?? 0,
        cantidad_recibida: item.cantidad_recibida ?? 0,
        cantidad_devuelta: item.cantidad_devuelta ?? 0,
        recibido: Boolean(item.recibido),
        devuelto: Boolean(item.devuelto)
      }))
    : [];

  return {
    ...raw,
    items,
    fecha_creacion: toDate(raw.fecha_creacion),
    fecha_envio: toDate(raw.fecha_envio),
    fecha_recibido: toDate(raw.fecha_recibido),
    fecha_cargado_ec: toDate(raw.fecha_cargado_ec)
  };
};

export const SolicitudProvider = ({ children, value = {} }) => {
  const {
    items: remoteItems = [],
    loading = false,
    error = null,
    create,
    update,
    enviar,
    marcarPendienteRecibir,
    recibir,
    cargarEstadoCuenta,
    anular,
    devolverItem,
    refresh = () => {}
  } = value;

  const solicitudes = useMemo(
    () =>
      Array.isArray(remoteItems)
        ? remoteItems.map(mapSolicitud).filter(Boolean)
        : [],
    [remoteItems]
  );

  const [mode, setMode] = useState('list'); // list | form | detail
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [itemDraft, setItemDraft] = useState(EMPTY_ITEM);
  const [submitting, setSubmitting] = useState(false);

  const [catalogData, setCatalogData] = useState({
    bodegas: [],
    categorias: [],
    subcategorias: [],
    skus: [],
    departamentos: [],
    usuarios: []
  });
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [catalogError, setCatalogError] = useState(null);

  const [pendingAction, setPendingAction] = useState(null);

  const loadCatalogs = useCallback(async () => {
    setCatalogLoading(true);
    setCatalogError(null);
    try {
      const fetchAllPaginated = async (initialUrl) => {
        let collected = [];
        let nextUrl = initialUrl;
        while (nextUrl) {
          const res = await getData(nextUrl);
          const data = res?.data || {};
          collected = collected.concat(asArray(data));
          nextUrl = data.next || null;
        }
        return collected;
      };

      const [bodegasRes, categoriasRes, skusRes, departamentosRes] =
        await Promise.all([
          getData('inventario/bodegas/?page_size=200'),
          getData('inventario/categorias/?page_size=200'),
          getData('inventario/productos/?page_size=200'),
          getData('mantenimiento/departamentos/?page_size=200')
        ]);

      const usuariosRes = await fetchAllPaginated('user/filter-users/');

      const bodegas = asArray(bodegasRes.data).map(normalizeBodega);
      const categorias = asArray(categoriasRes.data).map(normalizeCategoria);
      const skus = asArray(skusRes.data).map(normalizeSku);
      const departamentos = asArray(departamentosRes.data).map(normalizeDepartamento);
      const usuarios = usuariosRes.map(normalizeUsuario);

      const subcategorias = [];
      for (const categoria of categorias) {
        if (!categoria?.id) {
          continue;
        }
        try {
          const subRes = await getData(
            `inventario/categorias/subcategorias/${categoria.id}/?page_size=200`
          );
          const list = asArray(subRes.data).map((item) =>
            normalizeSubcategoria(item, categoria.id)
          );
          subcategorias.push(...list);
        } catch (subError) {
          console.warn(
            'No se pudieron cargar las subcategorías para la categoría',
            categoria.id,
            subError
          );
        }
      }

      setCatalogData({
        bodegas,
        categorias,
        subcategorias,
        skus,
        departamentos,
        usuarios
      });
    } catch (err) {
      console.error('Error cargando catálogos para solicitudes de medicamentos', err);
      setCatalogError(
        'No se pudieron cargar los catálogos. Intenta nuevamente o contacta al administrador.'
      );
      setCatalogData({
        bodegas: [],
        categorias: [],
        subcategorias: [],
        skus: [],
        departamentos: [],
        usuarios: []
      });
    } finally {
      setCatalogLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCatalogs();
  }, [loadCatalogs]);

  useEffect(() => {
    if (!selected) {
      return;
    }
    const updated = solicitudes.find((item) => item.id === selected.id);
    if (updated && updated !== selected) {
      setSelected(updated);
    }
  }, [solicitudes, selected]);

  const resetDrafts = useCallback(() => {
    setForm(EMPTY_FORM);
    setItemDraft(EMPTY_ITEM);
  }, []);

  const openNew = useCallback(() => {
    resetDrafts();
    setSelected(null);
    setMode('form');
  }, [resetDrafts]);

  const openEdit = useCallback((solicitud) => {
    if (!solicitud) {
      return;
    }
    setForm({
      id: solicitud.id ?? null,
      estatus: solicitud.estatus ?? 'PENDIENTE_ENVIAR',
      bodega_origen: solicitud.bodega_origen ?? '',
      bodega_destino: solicitud.bodega_destino ?? '',
      comentarios: solicitud.comentarios ?? '',
      items: (solicitud.items || []).map((item) => ({
        ...item,
        cantidad: item.cantidad ?? item.cantidad_pedida ?? item.cantidad_enviada ?? 1
      }))
    });
    setItemDraft(EMPTY_ITEM);
    setMode('form');
  }, []);

  const openDetail = useCallback((solicitud) => {
    setSelected(solicitud ?? null);
    setMode('detail');
  }, []);

  const addItem = useCallback(() => {
    if (!itemDraft.sku) {
      window.alert('Selecciona o ingresa un SKU válido.');
      return;
    }
    if (!itemDraft.cantidad || Number(itemDraft.cantidad) <= 0) {
      window.alert('La cantidad debe ser mayor a cero.');
      return;
    }
    setForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          ...itemDraft,
          cantidad: Number(itemDraft.cantidad)
        }
      ]
    }));
    setItemDraft(EMPTY_ITEM);
  }, [itemDraft]);

  const removeItem = useCallback((index) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  }, []);

  const persistSolicitud = useCallback(async () => {
    if (!form.bodega_origen?.trim() || !form.bodega_destino?.trim()) {
      window.alert('Selecciona las bodegas de origen y destino.');
      return;
    }
    if (!form.items.length) {
      window.alert('Agrega al menos un SKU a la solicitud.');
      return;
    }

    const payload = {
      bodega_origen: form.bodega_origen,
      bodega_destino: form.bodega_destino,
      comentarios: form.comentarios,
      items: form.items.map((item) => ({
        id: item.id ?? undefined,
        categoria: item.categoria ?? '',
        subcategoria: item.subcategoria ?? '',
        sku: item.sku,
        descripcion: item.descripcion ?? '',
        cantidad_pedida: Number(item.cantidad ?? 0)
      }))
    };

    setSubmitting(true);
    try {
      if (form.id) {
        await update?.(form.id, payload);
      } else {
        await create?.(payload);
      }
      await refresh();
      setMode('list');
      resetDrafts();
    } finally {
      setSubmitting(false);
    }
  }, [form, create, update, refresh, resetDrafts]);

  const setStatus = useCallback(
    async (id, status) => {
      if (!id || !status) {
        return;
      }
      try {
        switch (status) {
          case 'ENVIADA':
            await enviar?.(id);
            break;
          case 'PENDIENTE_RECIBIR':
            await marcarPendienteRecibir?.(id);
            break;
          case 'CARGADA_EC':
            await cargarEstadoCuenta?.(id);
            break;
          default:
            return;
        }
        await refresh();
      } catch (err) {
        console.error('No se pudo actualizar el estado de la solicitud', err);
        const message =
          err?.response?.data?.error ||
          err?.response?.data?.detail ||
          err?.message ||
          'No se pudo actualizar el estado. Revisa los datos e inténtalo nuevamente.';
        window.alert(
          typeof message === 'string' ? message : 'No se pudo actualizar el estado.'
        );
      }
    },
    [enviar, marcarPendienteRecibir, cargarEstadoCuenta, refresh]
  );

  const closeActionModal = useCallback(() => {
    setPendingAction(null);
  }, []);

  const openReceiveModal = useCallback((solicitud) => {
    if (!solicitud || !Array.isArray(solicitud.items)) {
      window.alert('No hay información de ítems para recibir.');
      return;
    }
    const items = solicitud.items
      .filter((item) => item.id)
      .map((item) => {
        const defaultQty =
          item.cantidad_recibida ||
          item.cantidad_enviada ||
          item.cantidad_pedida ||
          item.cantidad ||
          0;
        return {
          id: item.id,
          sku: item.sku,
          descripcion: item.descripcion,
          cantidad_enviada: item.cantidad_enviada || item.cantidad_pedida || 0,
          cantidad_recibida: defaultQty,
          recibido: item.recibido !== false
        };
      });

    if (!items.length) {
      window.alert('No hay ítems disponibles para marcar como recibidos.');
      return;
    }

    setPendingAction({
      type: 'receive',
      solicitudId: solicitud.id,
      solicitud,
      items
    });
  }, []);

  const openAnularModal = useCallback((solicitud) => {
    if (!solicitud) {
      return;
    }
    if (solicitud.estatus === 'CARGADA_EC') {
      window.alert('No es posible anular una solicitud ya cargada al estado de cuenta.');
      return;
    }
    setPendingAction({
      type: 'anular',
      solicitudId: solicitud.id,
      solicitud
    });
  }, []);

  const openDevolverModal = useCallback((solicitud, item) => {
    if (!solicitud || !item) {
      return;
    }
    if (!item.id) {
      window.alert('No se puede devolver un ítem sin identificador.');
      return;
    }
    const recibido = item.cantidad_recibida || item.cantidad_enviada || item.cantidad || 0;
    const devuelto = item.cantidad_devuelta || 0;
    const restante = Math.max(0, recibido - devuelto);
    if (restante <= 0) {
      window.alert('No hay unidades disponibles para devolver.');
      return;
    }

    setPendingAction({
      type: 'devolver',
      solicitudId: solicitud.id,
      solicitud,
      item: {
        id: item.id,
        sku: item.sku,
        descripcion: item.descripcion,
        restante,
        devuelto,
        recibido
      }
    });
  }, []);

  const confirmReceive = useCallback(
    async (itemsPayload) => {
      if (!pendingAction || pendingAction.type !== 'receive') {
        return;
      }
      try {
        await recibir?.(pendingAction.solicitudId, {
          items: itemsPayload.map((item) => ({
            id: item.id,
            cantidad_recibida: Number(item.cantidad_recibida ?? 0),
            recibido: item.recibido !== false
          }))
        });
        await refresh();
        setPendingAction(null);
      } catch (err) {
        throw err;
      }
    },
    [pendingAction, recibir, refresh]
  );

  const confirmAnular = useCallback(
    async (payload) => {
      if (!pendingAction || pendingAction.type !== 'anular') {
        return;
      }
      try {
        await anular?.(pendingAction.solicitudId, payload);
        await refresh();
        setPendingAction(null);
      } catch (err) {
        throw err;
      }
    },
    [pendingAction, anular, refresh]
  );

  const confirmDevolver = useCallback(
    async (payload) => {
      if (!pendingAction || pendingAction.type !== 'devolver') {
        return;
      }
      try {
        await devolverItem?.(
          pendingAction.solicitudId,
          pendingAction.item.id,
          payload
        );
        await refresh();
        setPendingAction(null);
      } catch (err) {
        throw err;
      }
    },
    [pendingAction, devolverItem, refresh]
  );

  const catalogs = useMemo(() => {
    const bodegas = catalogData.bodegas
      .map((item) => item.name)
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));

    const normalizeText = (value) =>
      typeof value === 'string' ? value.trim().toLowerCase() : '';

    const categorias = catalogData.categorias
      .map((item) => item.name)
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));

    const selectedCategoria = catalogData.categorias.find((cat) => {
      if (!cat?.name || !itemDraft?.categoria) {
        return false;
      }
      return normalizeText(cat.name) === normalizeText(itemDraft.categoria);
    });
    const subcategoriasSource = selectedCategoria
      ? catalogData.subcategorias.filter(
          (sub) => sub.categoriaId === selectedCategoria.id
        )
      : [];

    const subcategorias = subcategoriasSource
      .map((item) => item.name)
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));

    const skus = catalogData.skus.map((item) => ({
      code: item.code,
      label: item.code && item.name ? `${item.code} — ${item.name}` : item.code || item.name,
      name: item.name
    }));

    const departamentos = catalogData.departamentos
      .map((item) => item.name)
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));

    return {
      bodegas,
      categorias,
      subcategorias,
      skus,
      departamentos,
      usuarios: catalogData.usuarios
    };
  }, [catalogData, itemDraft.categoria]);

  const valueMemo = useMemo(
    () => ({
      mode,
      setMode,
      loading,
      submitting,
      catalogLoading,
      catalogError,
      catalogs,
      solicitudes,
      openNew,
      openEdit,
      openDetail,
      selected,
      setSelected,
      form,
      setForm,
      item: itemDraft,
      setItem: setItemDraft,
      addItem,
      removeItem,
      saveSolicitud: persistSolicitud,
      setStatus,
      pendingAction,
      closeActionModal,
      openReceiveModal,
      openAnularModal,
      openDevolverModal,
      confirmReceive,
      confirmAnular,
      confirmDevolver
    }),
    [
      mode,
      loading,
      submitting,
      catalogLoading,
      catalogError,
      catalogs,
      solicitudes,
      openNew,
      openEdit,
      openDetail,
      selected,
      form,
      itemDraft,
      addItem,
      removeItem,
      persistSolicitud,
      setStatus,
      pendingAction,
      closeActionModal,
      openReceiveModal,
      openAnularModal,
      openDevolverModal,
      confirmReceive,
      confirmAnular,
      confirmDevolver
    ]
  );

  return (
    <SolicitudContext.Provider value={valueMemo}>
      {children}
    </SolicitudContext.Provider>
  );
};
