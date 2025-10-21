import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';

const TITLE = 'Antecedentes';

const TIPO_LABELS = {
  PERSONALES: 'Personales',
  FAMILIARES: 'Familiares',
  QUIRURGICOS: 'Quirúrgicos',
  FARMACOLOGICOS: 'Farmacológicos',
  ALERGIAS: 'Alergias',
  OTROS: 'Otros'
};

const buildEditorState = (record) => ({
  descripcion: record?.descripcion ?? '',
  tipo: record?.tipo ?? 'OTROS',
  es_activo: record?.es_activo ?? true
});

const AntecedentesContext = createContext(null);

const formatDate = (isoString) => {
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('es-GT', {
      dateStyle: 'short',
      timeStyle: 'short'
    }).format(date);
  } catch (error) {
    return isoString || '';
  }
};

export const AntecedentesProvider = ({ children, value }) => {
  const registros = value?.records ?? [];
  const loading = value?.loading ?? false;
  const error = value?.error ?? null;
  const onCreate = value?.create;
  const onUpdate = value?.update;
  const onRemove = value?.remove;
  const refresh = value?.refresh;

  const formattedRecords = useMemo(
    () =>
      registros.map((record) => ({
        id: record.id,
        tipo: record.tipo,
        tipoLabel: TIPO_LABELS[record.tipo] ?? record.tipo,
        descripcion: record.descripcion,
        es_activo: record.es_activo,
        registrado_por: record.registrado_por || '—',
        registrado_en: record.registrado_en,
        registradoEnLabel: formatDate(record.registrado_en),
        actualizado_en: record.actualizado_en,
        actualizadoEnLabel: record.actualizado_en
          ? formatDate(record.actualizado_en)
          : null
      })),
    [registros]
  );

  const [mode, setMode] = useState('LIST'); // LIST | CREATE | EDIT | VIEW
  const [activeRecordId, setActiveRecordId] = useState(null);
  const [editorState, setEditorState] = useState(buildEditorState());
  const [saving, setSaving] = useState(false);

  const activeRecord = useMemo(
    () =>
      formattedRecords.find((record) => String(record.id) === String(activeRecordId)) ??
      null,
    [formattedRecords, activeRecordId]
  );

  useEffect(() => {
    if (!activeRecord) {
      setEditorState(buildEditorState());
      return;
    }
    setEditorState(buildEditorState(activeRecord));
  }, [activeRecord]);

  const startCreate = useCallback(() => {
    setMode('CREATE');
    setActiveRecordId(null);
    setEditorState(buildEditorState());
  }, []);

  const startEdit = useCallback(
    (recordId) => {
      const target = formattedRecords.find(
        (record) => String(record.id) === String(recordId)
      );
      if (!target) {
        return;
      }

      setMode('EDIT');
      setActiveRecordId(recordId);
      setEditorState(buildEditorState(target));
    },
    [formattedRecords]
  );

  const startViewOnly = useCallback(
    (recordId) => {
      const target = formattedRecords.find(
        (record) => String(record.id) === String(recordId)
      );
      if (!target) {
        return;
      }

      setMode('VIEW');
      setActiveRecordId(recordId);
      setEditorState(buildEditorState(target));
    },
    [formattedRecords]
  );

  const returnToList = useCallback(() => {
    setMode('LIST');
    setActiveRecordId(null);
    setEditorState(buildEditorState());
  }, []);

  const saveRecord = useCallback(async () => {
    if (mode !== 'CREATE' && mode !== 'EDIT') {
      return { success: false, reason: 'READ_ONLY' };
    }
    if (!editorState.descripcion?.trim()) {
      return { success: false, reason: 'EMPTY' };
    }

    const payload = {
      descripcion: editorState.descripcion,
      tipo: editorState.tipo,
      es_activo: editorState.es_activo
    };

    setSaving(true);
    try {
      if (mode === 'CREATE') {
        if (typeof onCreate === 'function') {
          await onCreate(payload);
        }
      } else if (mode === 'EDIT' && activeRecordId && typeof onUpdate === 'function') {
        await onUpdate(activeRecordId, payload);
      }
      await refresh?.();
      returnToList();
      return { success: true };
    } finally {
      setSaving(false);
    }
  }, [
    mode,
    editorState,
    activeRecordId,
    onCreate,
    onUpdate,
    refresh,
    returnToList
  ]);

  const handleDelete = useCallback(
    async (recordId) => {
      if (typeof onRemove !== 'function') {
        return;
      }
      await onRemove(recordId);
      if (String(recordId) === String(activeRecordId)) {
        returnToList();
      }
    },
    [onRemove, activeRecordId, returnToList]
  );

  const setDescripcion = useCallback((nextValue) => {
    setEditorState((prev) => ({ ...prev, descripcion: nextValue }));
  }, []);

  const setTipo = useCallback((nextValue) => {
    setEditorState((prev) => ({ ...prev, tipo: nextValue }));
  }, []);

  const setEsActivo = useCallback((nextValue) => {
    setEditorState((prev) => ({ ...prev, es_activo: nextValue }));
  }, []);

  const contextValue = useMemo(
    () => ({
      title: TITLE,
      records: formattedRecords,
      loading,
      error,
      mode,
      activeRecordId,
      activeRecord,
      editorState,
      setDescripcion,
      setTipo,
      setEsActivo,
      startCreate,
      startEdit,
      startViewOnly,
      returnToList,
      saveRecord,
      saving,
      handleDelete
    }),
    [
      formattedRecords,
      loading,
      error,
      mode,
      activeRecordId,
      activeRecord,
      editorState,
      setDescripcion,
      setTipo,
      setEsActivo,
      startCreate,
      startEdit,
      startViewOnly,
      returnToList,
      saveRecord,
      saving,
      handleDelete
    ]
  );

  return (
    <AntecedentesContext.Provider value={contextValue}>
      {children}
    </AntecedentesContext.Provider>
  );
};

export const useAntecedentesContext = () => {
  const context = useContext(AntecedentesContext);
  if (!context) {
    throw new Error('useAntecedentesContext must be used within AntecedentesProvider');
  }
  return context;
};
