import React, { createContext, useContext, useMemo } from 'react';

const TIEMPOS = [
  'DESAYUNO',
  'ALMUERZO',
  'CENA',
  'MERIENDA',
  'SNACK',
  'OTRO'
];

const DietasContext = createContext(null);

const mapRegistro = (registro) => ({
  ...registro,
  registradoEnLabel: registro.registrado_en
    ? new Intl.DateTimeFormat('es-GT', {
        dateStyle: 'short',
        timeStyle: 'short'
      }).format(new Date(registro.registrado_en))
    : ''
});

export const DietasProvider = ({ children, value }) => {
  const registros = useMemo(
    () => (value?.items ?? []).map(mapRegistro),
    [value?.items]
  );

  const contextValue = useMemo(
    () => ({
      title: 'Registros de dieta',
      tiempos: TIEMPOS,
      registros,
      loading: value?.loading ?? false,
      error: value?.error ?? null,
      handlers: {
        create: value?.create,
        remove: value?.remove
      }
    }),
    [registros, value]
  );

  return (
    <DietasContext.Provider value={contextValue}>
      {children}
    </DietasContext.Provider>
  );
};

export const useDietasContext = () => {
  const context = useContext(DietasContext);
  if (!context) {
    throw new Error('useDietasContext must be used within DietasProvider');
  }
  return context;
};

