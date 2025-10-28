import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState
} from 'react';

const TITLE = 'Signos Vitales (Encamamiento)';

const FIELDS = [
  {
    id: 'frecuenciaRespiratoria',
    label: 'FR (rpm)',
    tableHeader: ['Frecuencia', 'Respiratoria']
  },
  {
    id: 'presionArterial',
    label: 'PA (mmHg)',
    tableHeader: ['Presion', 'Arterial']
  },
  {
    id: 'presionArterialMedia',
    label: 'PAM',
    tableHeader: ['Presion Arterial', 'Media']
  },
  {
    id: 'temperatura',
    label: 'Temp °C',
    tableHeader: ['Temperatura °C']
  },
  {
    id: 'frecuenciaCardiaca',
    label: 'FC (ppm)',
    tableHeader: ['Frecuencia', 'Cardiaca']
  },
  {
    id: 'oxigenacion',
    label: 'SpO₂ (%)',
    tableHeader: ['Oxigenacion', '(%)']
  },
  {
    id: 'glucosa',
    label: 'Glucosa',
    tableHeader: ['Glucosa']
  },
  {
    id: 'insulina',
    label: 'Insulina (UI)',
    tableHeader: ['Insulina', '(U)']
  }
];

const SignosEncamamientoContext = createContext(null);

const TIMELINE_ROWS = (() => {
  const rows = [];
  for (let hour = 7; hour < 24; hour += 1) {
    const start = String(hour).padStart(2, '0');
    const nextHour = (hour + 1) % 24;
    const end = nextHour === 0 ? '24' : String(nextHour).padStart(2, '0');
    rows.push(`${start}-${end}`);
  }
  rows.push('24-01');
  for (let hour = 1; hour <= 6; hour += 1) {
    const start = String(hour).padStart(2, '0');
    const nextHour = (hour + 1) % 24;
    const end = String(nextHour).padStart(2, '0');
    rows.push(`${start}-${end}`);
  }
  return rows;
})();

const rowLabelToStartHour = (label) => {
  if (!label || typeof label !== 'string') {
    return 0;
  }
  const [start] = label.split('-');
  const parsed = parseInt(start, 10);
  if (Number.isNaN(parsed)) {
    return 0;
  }
  if (parsed === 24) {
    return 0;
  }
  return parsed % 24;
};

const todayDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const normalizeDateInput = (value) => {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }
  return todayDateString();
};

const normalizeTimeInput = (value, fallbackHour) => {
  if (typeof value === 'string' && /^\d{2}:\d{2}$/.test(value)) {
    return value;
  }
  const hour = rowLabelToStartHour(String(fallbackHour ?? 0));
  return `${String(hour).padStart(2, '0')}:00`;
};

const buildTimestampFromInputs = (dateInput, timeInput, rowLabel) => {
  const baseDate = normalizeDateInput(dateInput);
  const baseTime = normalizeTimeInput(timeInput, rowLabelToStartHour(rowLabel));
  const candidate = new Date(`${baseDate}T${baseTime}`);
  if (Number.isNaN(candidate.getTime())) {
    return new Date().toISOString();
  }
  return candidate.toISOString();
};

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
  const update = value?.update;
  const remove = value?.remove;
  const loading = value?.loading ?? false;
  const error = value?.error ?? null;

  const registros = useMemo(() => items.map(normalizeRecord), [items]);
  const timelineRecords = useMemo(() => {
    const map = new Map();
    registros.forEach((registro) => {
      if (!registro.tomadoEn) {
        return;
      }
      const date = new Date(registro.tomadoEn);
      if (Number.isNaN(date.getTime())) {
        return;
      }
      const hour = date.getHours();
      const startLabel =
        hour === 0 ? '24' : String(hour).padStart(2, '0');
      const nextHour = (hour + 1) % 24;
      const endLabel =
        hour === 23
          ? '24'
          : hour === 0
          ? '01'
          : String(nextHour).padStart(2, '0');
      const label = `${startLabel}-${endLabel}`;
      const current = map.get(label);
      if (!current) {
        map.set(label, registro);
        return;
      }
      const currentDate = new Date(current.tomadoEn);
      if (Number.isNaN(currentDate.getTime()) || date > currentDate) {
        map.set(label, registro);
      }
    });
    return map;
  }, [registros]);
  const timelineRows = useMemo(
    () =>
      TIMELINE_ROWS.map((label) => ({
        label,
        registro: timelineRecords.get(label) ?? null
      })),
    [timelineRecords]
  );
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

  const saveCellMeasurement = useCallback(
    async ({
      rowLabel,
      fieldId,
      value,
      comment,
      date,
      time,
      registroId,
      existingValues
    }) => {
      if (!fieldId) {
        return { success: false };
      }
      const preparedValues =
        existingValues && typeof existingValues === 'object'
          ? { ...existingValues }
          : FIELDS.reduce(
              (acc, field) => ({
                ...acc,
                [field.id]: ''
              }),
              {}
            );
      const sanitizedValue =
        value === null || value === undefined ? '' : String(value);
      const sanitizedComment =
        comment === null || comment === undefined ? '' : String(comment);
      const mediciones = FIELDS.reduce((acc, field) => {
        if (field.id === fieldId) {
          acc[field.id] = sanitizedValue;
        } else {
          acc[field.id] =
            preparedValues[field.id] !== undefined
              ? preparedValues[field.id]
              : '';
        }
        return acc;
      }, {});
      const payload = {
        tomado_en: buildTimestampFromInputs(date, time, rowLabel),
        registrado_por: resolveUser(),
        comentarios: sanitizedComment,
        mediciones
      };

      if (registroId && typeof update === 'function') {
        await update(registroId, payload);
      } else if (typeof create === 'function') {
        await create(payload);
      } else {
        return { success: false };
      }

      return { success: true };
    },
    [create, update]
  );

  const contextValue = useMemo(
    () => ({
      title: TITLE,
      fields: FIELDS,
      registros,
      timelineRows,
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
      formatDate,
      saveCellMeasurement
    }),
    [
      registros,
      timelineRows,
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
      saveCellMeasurement
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
