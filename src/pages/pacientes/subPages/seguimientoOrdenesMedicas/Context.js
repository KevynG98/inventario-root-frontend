import React, { createContext, useContext, useMemo, useState } from 'react';

const ESTADOS = [
  { value: 'ACTIVA', label: 'Activa' },
  { value: 'EN_PROCESO', label: 'En proceso' },
  { value: 'FINALIZADA', label: 'Finalizada' },
  { value: 'CANCELADA', label: 'Cancelada' }
];

const PRIORIDADES = [
  { value: 'BAJA', label: 'Baja' },
  { value: 'MEDIA', label: 'Media' },
  { value: 'ALTA', label: 'Alta' },
  { value: 'URGENTE', label: 'Urgente' }
];

const SeguimientoContext = createContext(null);

const formatDateTime = (iso) => {
  if (!iso) return '—';
  try {
    return new Intl.DateTimeFormat('es-GT', {
      dateStyle: 'short',
      timeStyle: 'short'
    }).format(new Date(iso));
  } catch (error) {
    return iso;
  }
};

const mapOrden = (orden) => ({
  ...orden,
  creadoEnLabel: formatDateTime(orden.creado_en),
  actualizadoEnLabel: formatDateTime(orden.actualizado_en),
  cerradoEnLabel: formatDateTime(orden.cerrado_en),
  eventos: (orden.eventos || []).map((evento) => ({
    ...evento,
    creadoEnLabel: formatDateTime(evento.creado_en)
  }))
});

export const SeguimientoOrdenesProvider = ({ children, value }) => {
  const ordenes = useMemo(
    () => (value?.items ?? []).map(mapOrden),
    [value?.items]
  );
  const [activeId, setActiveId] = useState(ordenes[0]?.id ?? null);

  const contextValue = useMemo(
    () => ({
      title: 'Seguimiento de Órdenes Médicas',
      ordenes,
      loading: value?.loading ?? false,
      error: value?.error ?? null,
      activeId,
      setActiveId,
      estados: ESTADOS,
      prioridades: PRIORIDADES,
      handlers: {
        create: value?.create,
        update: value?.update,
        remove: value?.remove,
        crearEvento: value?.crearEvento
      }
    }),
    [ordenes, value, activeId]
  );

  return (
    <SeguimientoContext.Provider value={contextValue}>
      {children}
    </SeguimientoContext.Provider>
  );
};

export const useSeguimientoOrdenesContext = () => {
  const context = useContext(SeguimientoContext);
  if (!context) {
    throw new Error(
      'useSeguimientoOrdenesContext must be used within SeguimientoOrdenesProvider'
    );
  }
  return context;
};

