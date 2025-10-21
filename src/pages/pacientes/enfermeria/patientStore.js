const STORAGE_KEY = 'nursingPatientSelection';

const safeParse = (value) => {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    console.warn('No se pudo parsear la selección de enfermería almacenada', error);
    return null;
  }
};

export const getStoredSelection = () => {
  if (typeof window === 'undefined') {
    return { summary: null, detail: null };
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  const parsed = safeParse(raw);

  if (!parsed || typeof parsed !== 'object') {
    return { summary: null, detail: null };
  }

  return {
    summary: parsed.summary ?? parsed.patient ?? null,
    detail: parsed.detail ?? null
  };
};

export const persistSelection = (summary, detail) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const payload = JSON.stringify({
      summary: summary ?? null,
      detail: detail ?? null,
      timestamp: new Date().toISOString()
    });
    window.localStorage.setItem(STORAGE_KEY, payload);
  } catch (error) {
    console.error('No se pudo guardar la selección de enfermería', error);
  }
};

export const clearStoredSelection = () => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
};

export const subscribeSelection = (listener) => {
  if (typeof window === 'undefined' || typeof listener !== 'function') {
    return () => {};
  }

  const handler = (event) => {
    if (event.key === STORAGE_KEY) {
      listener(getStoredSelection());
    }
  };

  window.addEventListener('storage', handler);
  return () => window.removeEventListener('storage', handler);
};
