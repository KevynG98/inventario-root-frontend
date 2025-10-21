import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';

const DEFAULT_TITLE = 'Historia de la Enfermedad';

const HistoriaEnfermedadContext = createContext({
  title: DEFAULT_TITLE,
  content: '',
  tema: 'SNOW',
  toolbar: 'COMPLETA',
  placeholder: '',
  autoguardado: true,
  soloLectura: false,
  loading: false,
  saving: false,
  error: null,
  handleContentChange: () => {},
  handleConfigChange: () => {},
  handleSave: () => {}
});

export const useHistoriaEnfermedadContext = () =>
  useContext(HistoriaEnfermedadContext);

export const HistoriaEnfermedadProvider = ({ children, value }) => {
  const historia = value?.historia;
  const loading = value?.loading ?? false;
  const error = value?.error ?? null;
  const save = value?.save;

  const [formState, setFormState] = useState(() => ({
    content: historia?.contenido ?? '',
    tema: historia?.editor_tema ?? 'SNOW',
    toolbar: historia?.editor_toolbar ?? 'COMPLETA',
    placeholder: historia?.editor_placeholder ?? '',
    autoguardado: historia?.editor_autoguardado ?? true,
    soloLectura: historia?.editor_solo_lectura ?? false
  }));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFormState({
      content: historia?.contenido ?? '',
      tema: historia?.editor_tema ?? 'SNOW',
      toolbar: historia?.editor_toolbar ?? 'COMPLETA',
      placeholder: historia?.editor_placeholder ?? '',
      autoguardado: historia?.editor_autoguardado ?? true,
      soloLectura: historia?.editor_solo_lectura ?? false
    });
  }, [historia]);

  const handleContentChange = useCallback((nextContent) => {
    setFormState((prev) => ({ ...prev, content: nextContent }));
  }, []);

  const handleConfigChange = useCallback((key, value) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSave = useCallback(async () => {
    if (typeof save !== 'function') {
      return;
    }
    setSaving(true);
    try {
      await save({
        contenido: formState.content,
        editor_tema: formState.tema,
        editor_toolbar: formState.toolbar,
        editor_placeholder: formState.placeholder,
        editor_autoguardado: formState.autoguardado,
        editor_solo_lectura: formState.soloLectura
      });
    } finally {
      setSaving(false);
    }
  }, [save, formState]);

  const memoizedValue = useMemo(
    () => ({
      title: DEFAULT_TITLE,
      content: formState.content,
      tema: formState.tema,
      toolbar: formState.toolbar,
      placeholder: formState.placeholder,
      autoguardado: formState.autoguardado,
      soloLectura: formState.soloLectura,
      loading,
      saving,
      error,
      handleContentChange,
      handleConfigChange,
      handleSave
    }),
    [
      formState,
      loading,
      saving,
      error,
      handleContentChange,
      handleConfigChange,
      handleSave
    ]
  );

  return (
    <HistoriaEnfermedadContext.Provider value={memoizedValue}>
      {children}
    </HistoriaEnfermedadContext.Provider>
  );
};
