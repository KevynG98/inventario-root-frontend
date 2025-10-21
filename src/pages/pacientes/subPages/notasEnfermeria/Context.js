import React, { createContext, useContext, useMemo, useState } from 'react';

const TURNOS = [
  '07:00-13:00',
  '13:00-19:00',
  '19:00-23:59',
  '00:00-06:59'
];

const ESTADOS = [
  { value: 'EDICION', label: 'En edición' },
  { value: 'CERRADA', label: 'Cerrada' }
];

const NotasEnfermeriaContext = createContext(null);

const mapNota = (nota) => ({
  ...nota,
  creadoEnLabel: nota.creado_en
    ? new Intl.DateTimeFormat('es-GT', {
        dateStyle: 'short',
        timeStyle: 'short'
      }).format(new Date(nota.creado_en))
    : '',
  actualizadoEnLabel: nota.actualizado_en
    ? new Intl.DateTimeFormat('es-GT', {
        dateStyle: 'short',
        timeStyle: 'short'
      }).format(new Date(nota.actualizado_en))
    : null
});

export const NotasEnfermeriaProvider = ({ children, value }) => {
  const notas = useMemo(
    () => (value?.items ?? []).map(mapNota),
    [value?.items]
  );
  const [active, setActive] = useState(null);
  const [mode, setMode] = useState('LIST');

  const contextValue = useMemo(
    () => ({
      title: 'Notas de Enfermería',
      notas,
      loading: value?.loading ?? false,
      error: value?.error ?? null,
      mode,
      active,
      turnos: TURNOS,
      estados: ESTADOS,
      setMode,
      setActive,
      handlers: {
        create: value?.create,
        update: value?.update,
        remove: value?.remove
      }
    }),
    [notas, value, mode, active]
  );

  return (
    <NotasEnfermeriaContext.Provider value={contextValue}>
      {children}
    </NotasEnfermeriaContext.Provider>
  );
};

export const useNotasEnfermeriaContext = () => {
  const context = useContext(NotasEnfermeriaContext);
  if (!context) {
    throw new Error(
      'useNotasEnfermeriaContext must be used within NotasEnfermeriaProvider'
    );
  }
  return context;
};

