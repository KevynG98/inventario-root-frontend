import React, { createContext, useContext, useMemo } from 'react';

const FREQUENCY_OPTIONS = [
  'STAT',
  'BID',
  'TID',
  'Q2',
  'Q4',
  'Q6',
  'Q8',
  'Q12',
  'Q24',
  'AYUNAS'
];

const ROUTE_OPTIONS = [
  'IV',
  'IM',
  'ORAL',
  'SUBCUTÁNEA',
  'TOPICA',
  'TRANSDERMICA',
  'VAGINAL',
  'RECTAL',
  'INHALATORIA'
];

const TIMELINE_BLOCKS = [
  'STAT',
  '02',
  '04',
  '06',
  '08',
  '10',
  '12',
  '14',
  '16',
  '18',
  '20',
  '22',
  '24'
];

const TIMELINE_STATES = [
  { value: 'PENDIENTE', label: 'Pendiente' },
  { value: 'APLICADO', label: 'Aplicado' },
  { value: 'OMITIDO', label: 'Omitido' },
  { value: 'CAMBIO', label: 'Cambio' }
];

const ControlMedicamentoContext = createContext(null);

const mapControl = (control) => ({
  ...control,
  registros: (control.registros || []).map((registro) => ({
    ...registro,
    registradoEnLabel: registro.registrado_en
      ? new Intl.DateTimeFormat('es-GT', {
          dateStyle: 'short',
          timeStyle: 'short'
        }).format(new Date(registro.registrado_en))
      : ''
  }))
});

export const ControlMedicamentoProvider = ({ children, value }) => {
  const controls = useMemo(
    () => (value?.items ?? []).map(mapControl),
    [value?.items]
  );

  const contextValue = useMemo(
    () => ({
      title: 'Control de Medicamentos',
      controls,
      loading: value?.loading ?? false,
      error: value?.error ?? null,
      options: {
        frequency: FREQUENCY_OPTIONS,
        route: ROUTE_OPTIONS,
        timelineBlocks: TIMELINE_BLOCKS,
        timelineStates: TIMELINE_STATES
      },
      handlers: {
        create: value?.create,
        update: value?.update,
        remove: value?.remove,
        createRegistro: value?.createRegistro,
        updateRegistro: value?.updateRegistro
      }
    }),
    [controls, value]
  );

  return (
    <ControlMedicamentoContext.Provider value={contextValue}>
      {children}
    </ControlMedicamentoContext.Provider>
  );
};

export const useControlMedicamentoContext = () => {
  const context = useContext(ControlMedicamentoContext);
  if (!context) {
    throw new Error(
      'useControlMedicamentoContext must be used within ControlMedicamentoProvider'
    );
  }
  return context;
};

