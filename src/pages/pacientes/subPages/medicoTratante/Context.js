import React, { createContext, useContext, useMemo, useState } from 'react';

const DEFAULT_STATE = {
  title: 'Médico Tratante',
  columns: [
    { key: 'nombre', label: 'Médico' },
    { key: 'especialidad', label: 'Especialidad' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'correo', label: 'Correo' },
    { key: 'estado', label: 'Estado' },
    { key: 'observaciones', label: 'Observaciones' }
  ],
  items: [],
  loading: false,
  error: null,
  onCreate: async () => {},
  onUpdate: async () => {},
  onRemove: async () => {}
};

const MedicoTratanteContext = createContext(DEFAULT_STATE);

export const useMedicoTratanteContext = () => useContext(MedicoTratanteContext);

export const MedicoTratanteProvider = ({ children, value }) => {
  const [editing, setEditing] = useState(null);

  const contextValue = useMemo(() => {
    const merged = { ...DEFAULT_STATE, ...(value || {}) };
    return {
      ...merged,
      editing,
      startEditing: setEditing,
      clearEditing: () => setEditing(null)
    };
  }, [value, editing]);

  return (
    <MedicoTratanteContext.Provider value={contextValue}>
      {children}
    </MedicoTratanteContext.Provider>
  );
};
