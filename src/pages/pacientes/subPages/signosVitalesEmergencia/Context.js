import React, {
  createContext,
  useCallback,
  useContext,
  useMemo
} from 'react';

const TITLE = 'Signos Vitales (Emergencia)';

const FIELDS = [
  {
    id: 'peso',
    attr: 'peso_kg',
    label: 'Peso',
    placeholder: 'Ej. 70',
    unit: 'kg',
    type: 'number',
    step: '0.1'
  },
  {
    id: 'estatura',
    attr: 'estatura_cm',
    label: 'Estatura',
    placeholder: 'Ej. 165',
    unit: 'cm',
    type: 'number',
    step: '0.1'
  },
  {
    id: 'presionArterial',
    attr: 'presion_arterial',
    label: 'Presión arterial',
    placeholder: 'Ej. 120/80',
    unit: 'mmHg',
    type: 'text'
  },
  {
    id: 'presionArterialMedia',
    attr: 'presion_arterial_media',
    label: 'Presión arterial media',
    placeholder: 'Ej. 95',
    unit: 'mmHg',
    type: 'number'
  },
  {
    id: 'temperatura',
    attr: 'temperatura_c',
    label: 'Temperatura',
    placeholder: 'Ej. 36.5',
    unit: '°C',
    type: 'number',
    step: '0.1'
  },
  {
    id: 'frecuenciaCardiaca',
    attr: 'frecuencia_cardiaca',
    label: 'Frecuencia cardiaca',
    placeholder: 'Ej. 80',
    unit: 'ppm',
    type: 'number'
  },
  {
    id: 'oxigenacion',
    attr: 'oxigenacion',
    label: 'Oxigenación',
    placeholder: 'Ej. 95',
    unit: '%',
    type: 'number'
  },
  {
    id: 'frecuenciaRespiratoria',
    attr: 'frecuencia_respiratoria',
    label: 'Frecuencia respiratoria',
    placeholder: 'Ej. 18',
    unit: 'rpm',
    type: 'number'
  },
  {
    id: 'glucosa',
    attr: 'glucosa_mg_dl',
    label: 'Glucosa',
    placeholder: 'Ej. 110',
    unit: 'mg/dL',
    type: 'number'
  },
  {
    id: 'insulina',
    attr: 'insulina_u',
    label: 'Insulina',
    placeholder: 'Ej. 8',
    unit: 'U',
    type: 'number'
  }
];

const resolveCurrentUser = () => {
  if (typeof window === 'undefined') return 'Usuario actual';
  try {
    const stored =
      window.localStorage?.getItem('user') ||
      window.localStorage?.getItem('usuario');
    if (!stored) return 'Usuario actual';

    const parsed =
      typeof stored === 'string' && stored.startsWith('{')
        ? JSON.parse(stored)
        : { username: stored };

    return (
      parsed?.nombreCompleto ||
      parsed?.fullName ||
      parsed?.username ||
      parsed?.nombre ||
      'Usuario actual'
    );
  } catch (error) {
    return 'Usuario actual';
  }
};

const normalizeRecord = (record) => {
  const measurements = FIELDS.map((field) => {
    const rawValue = record?.[field.attr];
    const extra = record?.datos_extra?.[field.id];
    const value = rawValue ?? extra?.valor;
    if (value === undefined || value === null || value === '') {
      return null;
    }
    return {
      id: field.id,
      label: field.label,
      unit: field.unit,
      value,
      comment: extra?.comentario || ''
    };
  }).filter(Boolean);

  return {
    id: record.id,
    timestamp: record.tomado_en,
    takenBy: record.registrado_por || '—',
    measurements
  };
};

const SignosVitalesEmergenciaContext = createContext(null);

export const useSignosVitalesEmergenciaContext = () =>
  useContext(SignosVitalesEmergenciaContext);

export const SignosVitalesEmergenciaProvider = ({ children, value }) => {
  const recordsSource = value?.records ?? value?.items ?? [];
  const records = Array.isArray(recordsSource) ? recordsSource : [];
  const loading = value?.loading ?? false;
  const error = value?.error ?? null;
  const create = value?.create;
  const remove = value?.remove;

  const getInitialFormState = useCallback(() => {
    return FIELDS.reduce((acc, field) => {
      acc[field.id] = { value: '', comment: '' };
      return acc;
    }, {});
  }, []);

  const recordVitalSigns = useCallback(
    async (formValues) => {
      if (typeof create !== 'function') {
        return { success: false, reason: 'NO_HANDLER' };
      }

      const payload = {};
      const extra = {};
      const comments = [];

      FIELDS.forEach((field) => {
        const fieldValues = formValues[field.id] || {};
        const value = `${fieldValues.value ?? ''}`.trim();
        const comment = `${fieldValues.comment ?? ''}`.trim();

        if (value === '') {
          return;
        }

        payload[field.attr] = value;
        extra[field.id] = {
          valor: value,
          comentario: comment
        };

        if (comment) {
          comments.push(`${field.label}: ${comment}`);
        }
      });

      if (Object.keys(payload).length === 0) {
        return { success: false, reason: 'EMPTY' };
      }

      payload.datos_extra = extra;
      payload.registrado_por = resolveCurrentUser();
      if (comments.length > 0) {
        payload.comentarios = comments.join('\n');
      }

      await create(payload);
      return { success: true };
    },
    [create]
  );

  const valueMemo = useMemo(
    () => ({
      title: TITLE,
      fields: FIELDS,
      records: records.map(normalizeRecord),
      loading,
      error,
      currentUserName: resolveCurrentUser(),
      getInitialFormState,
      recordVitalSigns,
      removeMeasurement: remove
    }),
    [records, loading, error, getInitialFormState, recordVitalSigns, remove]
  );

  return (
    <SignosVitalesEmergenciaContext.Provider value={valueMemo}>
      {children}
    </SignosVitalesEmergenciaContext.Provider>
  );
};
