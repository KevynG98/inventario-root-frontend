import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState
} from 'react';

const TITLE = 'Signos Vitales (Encamamiento)';

const FIELDS = [
  { id: 'frecuenciaRespiratoria', label: 'FR (rpm)' },
  { id: 'presionArterial', label: 'PA (mmHg)' },
  { id: 'presionArterialMedia', label: 'PAM' },
  { id: 'temperatura', label: 'Temp °C' },
  { id: 'frecuenciaCardiaca', label: 'FC (ppm)' },
  { id: 'oxigenacion', label: 'SpO₂ (%)' },
  { id: 'glucosa', label: 'Glucosa' },
  { id: 'insulina', label: 'Insulina (UI)' }
];

const SignosEncamamientoContext = createContext(null);

const normalizeRecord = (record) => {
  const mediciones = record?.mediciones || {};
  return {
    id: record.id,
    tomadoEn: record.tomado_en,
    tomadoPor: record.registrado_por || '—',
    comentarios: record.comentarios || '',
    valores: {
      frecuenciaRespiratoria: mediciones.frecuenciaRespiratoria ?? mediciones.frecuencia_respiratoria ?? '',
      presionArterial: mediciones.presionArterial ?? mediciones.presion_arterial ?? '',
      presionArterialMedia: mediciones.presionArterialMedia ?? mediciones.presion_arterial_media ?? '',
      temperatura: mediciones.temperatura ?? mediciones.temperatura_c ?? '',
      frecuenciaCardiaca: mediciones.frecuenciaCardiaca ?? mediciones.frecuencia_cardiaca ?? '',
      oxigenacion: mediciones.oxigenacion ?? '',
      glucosa: mediciones.glucosa ?? mediciones.glucosa_mg_dl ?? '',
      insulina: mediciones.insulina ?? mediciones.insulina_u ?? ''
    }
  };
};

const formatDate = (iso) => {
  if (!iso) {
    return '—';
  }
  try {
    const date = new Date(iso);
    return new Intl.DateTimeFormat('es-GT', {
      dateStyle: 'short',
      timeStyle: 'short'
    }).format(date);
  } catch (error) {
    return iso;
  }
};

const resolveUser = () => {
  if (typeof window === 'undefined') return 'Usuario Enfermería';
  try {
    const stored =
      window.localStorage?.getItem('user') ||
      window.localStorage?.getItem('usuario');
    if (!stored) return 'Usuario Enfermería';
    const parsed =
      typeof stored === 'string' && stored.startsWith('{')
        ? JSON.parse(stored)
        : { username: stored };
    return (
      parsed?.nombreCompleto ||
      parsed?.fullName ||
      parsed?.username ||
      parsed?.nombre ||
      'Usuario Enfermería'
    );
  } catch (error) {
    return 'Usuario Enfermería';
  }
};

export const SignosEncamamientoProvider = ({ children, value }) => {
  const items = value?.items ?? [];
  const create = value?.create;
  const remove = value?.remove;
  const loading = value?.loading ?? false;
  const error = value?.error ?? null;

  const registros = useMemo(() => items.map(normalizeRecord), [items]);
  const [formState, setFormState] = useState(() => ({
    tomadoEn: '',
    valores: FIELDS.reduce((acc, field) => ({ ...acc, [field.id]: '' }), {}),
    comentarios: ''
  }));
  const [saving, setSaving] = useState(false);

  const handleFieldChange = useCallback((fieldId, value) => {
    setFormState((prev) => ({
      ...prev,
      valores: {
        ...prev.valores,
        [fieldId]: value
      }
    }));
  }, []);

  const handleTimestampChange = useCallback((value) => {
    setFormState((prev) => ({
      ...prev,
      tomadoEn: value
    }));
  }, []);

  const handleCommentsChange = useCallback((value) => {
    setFormState((prev) => ({
      ...prev,
      comentarios: value
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormState({
      tomadoEn: '',
      valores: FIELDS.reduce((acc, field) => ({ ...acc, [field.id]: '' }), {}),
      comentarios: ''
    });
  }, []);

  const saveRecord = useCallback(async () => {
    if (typeof create !== 'function') {
      return { success: false };
    }
    const payload = {
      tomado_en: formState.tomadoEn || new Date().toISOString(),
      registrado_por: resolveUser(),
      comentarios: formState.comentarios,
      mediciones: { ...formState.valores }
    };
    setSaving(true);
    try {
      await create(payload);
      resetForm();
      return { success: true };
    } finally {
      setSaving(false);
    }
  }, [create, formState, resetForm]);

  const deleteRecord = useCallback(
    async (id) => {
      if (typeof remove !== 'function') {
        return;
      }
      await remove(id);
    },
    [remove]
  );

  const contextValue = useMemo(
    () => ({
      title: TITLE,
      fields: FIELDS,
      registros,
      loading,
      error,
      formState,
      saving,
      handleFieldChange,
      handleTimestampChange,
      handleCommentsChange,
      resetForm,
      saveRecord,
      deleteRecord,
      formatDate
    }),
    [
      registros,
      loading,
      error,
      formState,
      saving,
      handleFieldChange,
      handleTimestampChange,
      handleCommentsChange,
      resetForm,
      saveRecord,
      deleteRecord
    ]
  );

  return (
    <SignosEncamamientoContext.Provider value={contextValue}>
      {children}
    </SignosEncamamientoContext.Provider>
  );
};

export const useSignosEncamamientoContext = () => {
  const context = useContext(SignosEncamamientoContext);
  if (!context) {
    throw new Error(
      'useSignosEncamamientoContext must be used within SignosEncamamientoProvider'
    );
  }
  return context;
};

