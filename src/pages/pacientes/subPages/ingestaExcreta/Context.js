import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';

const SHIFT_DEFINITIONS = [
  {
    id: 'turno1',
    label: 'Turno #1 (07:00 - 13:00)'
  },
  {
    id: 'turno2',
    label: 'Turno #2 (13:00 - 19:00)'
  },
  {
    id: 'turno3',
    label: 'Turno #3 (19:00 - 07:00)'
  }
];

const resolveShiftByHour = (hour) => {
  if (hour >= 7 && hour < 13) {
    return 'turno1';
  }
  if (hour >= 13 && hour < 19) {
    return 'turno2';
  }
  return 'turno3';
};

const buildTimeSlots = () => {
  const slots = [];

  for (let hour = 7; hour < 24; hour += 1) {
    const label = `${String(hour).padStart(2, '0')}:00`;
    slots.push({
      id: label,
      label,
      hour,
      shiftId: resolveShiftByHour(hour)
    });
  }

  for (let hour = 0; hour <= 6; hour += 1) {
    const label = `${String(hour).padStart(2, '0')}:00`;
    slots.push({
      id: label,
      label,
      hour,
      shiftId: resolveShiftByHour(hour)
    });
  }

  return slots;
};

export const TIME_SLOTS = buildTimeSlots();

const TIME_SLOTS_MAP = new Map(TIME_SLOTS.map((slot) => [slot.id, slot]));

export const INGESTA_COLUMNS = [
  { id: 'ingesta_oral', defaultLabel: 'Oral' },
  { id: 'ingesta_enteral', defaultLabel: 'Enteral' },
  { id: 'ingesta_parenteral', defaultLabel: 'Parenteral' },
  ...Array.from({ length: 12 }, (_, index) => ({
    id: `ingesta_iv_${index + 1}`,
    defaultLabel: `IV ${index + 1}`
  })),
  { id: 'ingesta_extra_1', defaultLabel: 'Ingesta Extra 1' },
  { id: 'ingesta_extra_2', defaultLabel: 'Ingesta Extra 2' }
];

export const EXCRETA_COLUMNS = [
  { id: 'excreta_orina', defaultLabel: 'Orina' },
  { id: 'excreta_deposicion', defaultLabel: 'Deposición' },
  { id: 'excreta_vomito', defaultLabel: 'Vómito' },
  { id: 'excreta_drenaje', defaultLabel: 'Drenaje' },
  ...Array.from({ length: 6 }, (_, index) => ({
    id: `excreta_otro_${index + 1}`,
    defaultLabel: `Excreta Otro ${index + 1}`
  }))
];

const DATA_COLUMNS = [...INGESTA_COLUMNS, ...EXCRETA_COLUMNS];
const DATA_COLUMN_IDS = DATA_COLUMNS.map((column) => column.id);

const createEmptyValues = () =>
  DATA_COLUMN_IDS.reduce((acc, columnId) => {
    acc[columnId] = '';
    return acc;
  }, {});

const normalizeDate = (value) => {
  if (!value) {
    return null;
  }
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }
  const candidate = new Date(value);
  if (Number.isNaN(candidate.getTime())) {
    return null;
  }
  const year = candidate.getFullYear();
  const month = String(candidate.getMonth() + 1).padStart(2, '0');
  const day = String(candidate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatDateFriendly = (value) => {
  if (!value) {
    return '—';
  }
  try {
    const [year, month, day] = value.split('-');
    return `${day}/${month}/${year}`;
  } catch (error) {
    return value;
  }
};

const sortTables = (items) =>
  items
    .slice()
    .sort((a, b) => (a.date === b.date ? 0 : a.date < b.date ? 1 : -1));

const toNumericValue = (raw) => {
  if (raw === null || raw === undefined) {
    return 0;
  }
  if (typeof raw === 'number') {
    return Number.isFinite(raw) ? raw : 0;
  }
  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (!trimmed) {
      return 0;
    }
    const normalized = trimmed.replace(',', '.');
    const parsed = Number(normalized);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

const sumColumnsForRows = (rows) => {
  const columnTotals = DATA_COLUMNS.reduce(
    (acc, column) => ({
      ...acc,
      [column.id]: rows.reduce(
        (total, row) => total + toNumericValue(row.values[column.id]),
        0
      )
    }),
    {}
  );

  const totalIngesta = INGESTA_COLUMNS.reduce(
    (total, column) => total + (columnTotals[column.id] ?? 0),
    0
  );
  const totalExcreta = EXCRETA_COLUMNS.reduce(
    (total, column) => total + (columnTotals[column.id] ?? 0),
    0
  );

  return {
    columnTotals,
    totalIngesta,
    totalExcreta,
    balance: totalIngesta - totalExcreta
  };
};

const buildEmptyRow = (slot) => ({
  slotId: slot.id,
  shiftId: slot.shiftId,
  values: createEmptyValues()
});

const buildEmptyTable = (date, id = null) => ({
  id,
  date,
  rows: TIME_SLOTS.map(buildEmptyRow),
  titleOverrides: {},
  dirty: false,
  lastEditedAt: null,
  lastSavedAt: null
});

const normalizeTitleOverridesFromApi = (overrides) => {
  if (!overrides || typeof overrides !== 'object') {
    return {};
  }
  return Object.keys(overrides).reduce((acc, key) => {
    if (DATA_COLUMN_IDS.includes(key)) {
      const value = overrides[key];
      acc[key] = value === null || value === undefined ? '' : String(value);
    }
    return acc;
  }, {});
};

const normalizeRowFromApi = (slot, registro) => {
  const values = createEmptyValues();
  if (registro && registro.valores && typeof registro.valores === 'object') {
    DATA_COLUMN_IDS.forEach((columnId) => {
      const raw = registro.valores[columnId];
      if (raw === null || raw === undefined) {
        values[columnId] = '';
      } else if (typeof raw === 'number') {
        values[columnId] = Number.isFinite(raw) ? String(raw) : '';
      } else {
        values[columnId] = String(raw);
      }
    });
  }
  return {
    slotId: slot.id,
    shiftId: registro?.turno ?? slot.shiftId,
    values
  };
};

const normalizeTableFromApi = (item) => {
  if (!item) {
    return null;
  }
  const normalizedDate = normalizeDate(item.fecha) ?? item.fecha;
  const registros = Array.isArray(item.registros) ? item.registros : [];
  const registrosPorSlot = new Map(
    registros
      .filter((registro) => registro && registro.slot)
      .map((registro) => [registro.slot, registro])
  );
  return {
    id: item.id ?? null,
    date: normalizedDate,
    rows: TIME_SLOTS.map((slot) =>
      normalizeRowFromApi(slot, registrosPorSlot.get(slot.id))
    ),
    titleOverrides: normalizeTitleOverridesFromApi(item.columnas_personalizadas),
    dirty: false,
    lastEditedAt: null,
    lastSavedAt: item.actualizado_en ?? item.creado_en ?? null,
    resumen: item.resumen_totales ?? null
  };
};

const normalizeTitleOverridesForSave = (overrides) => {
  if (!overrides || typeof overrides !== 'object') {
    return {};
  }
  return DATA_COLUMN_IDS.reduce((acc, columnId) => {
    const raw = overrides[columnId];
    if (raw === null || raw === undefined) {
      return acc;
    }
    const text = String(raw).trim();
    if (text) {
      acc[columnId] = text;
    }
    return acc;
  }, {});
};

const normalizeValueForPayload = (value) => {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) {
      return null;
    }
    const normalized = trimmed.replace(',', '.');
    const parsed = Number(normalized);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
    return trimmed;
  }
  return value;
};

const serializeTableForSave = (table) => ({
  fecha: table.date,
  columnas_personalizadas: normalizeTitleOverridesForSave(table.titleOverrides),
  registros: table.rows.map((row) => ({
    slot: row.slotId,
    turno: row.shiftId,
    valores: DATA_COLUMN_IDS.reduce((acc, columnId) => {
      acc[columnId] = normalizeValueForPayload(row.values[columnId]);
      return acc;
    }, {})
  }))
});

const IngestaExcretaContext = createContext(null);

export const useIngestaExcretaContext = () => useContext(IngestaExcretaContext);

export const IngestaExcretaProvider = ({ children, value }) => {
  const remoteItems = value?.items;
  const remoteCreate = value?.create;
  const remoteUpdate = value?.update;
  const refresh = value?.refresh ?? (() => {});
  const loading = Boolean(value?.loading);
  const error = value?.error ?? null;

  const normalizedRemoteTables = useMemo(() => {
    if (!Array.isArray(remoteItems)) {
      return [];
    }
    return remoteItems
      .map(normalizeTableFromApi)
      .filter((table) => table && table.date);
  }, [remoteItems]);

  const [tables, setTables] = useState(() =>
    sortTables(normalizedRemoteTables)
  );
  const [activeDate, setActiveDate] = useState(
    normalizedRemoteTables.length ? normalizedRemoteTables[0].date : null
  );

  useEffect(() => {
    setTables((prev) => {
      const prevByDate = new Map(prev.map((table) => [table.date, table]));
      const remoteByDate = new Map(
        normalizedRemoteTables.map((table) => [table.date, table])
      );
      const merged = normalizedRemoteTables.map((table) => {
        const existing = prevByDate.get(table.date);
        if (existing && existing.dirty) {
          return existing;
        }
        return table;
      });
      prev.forEach((table) => {
        if (!remoteByDate.has(table.date) && table.dirty) {
          merged.push(table);
        }
      });
      return sortTables(merged);
    });
  }, [normalizedRemoteTables]);

  useEffect(() => {
    if (!tables.length) {
      if (activeDate !== null) {
        setActiveDate(null);
      }
      return;
    }
    if (!activeDate || !tables.some((table) => table.date === activeDate)) {
      setActiveDate(tables[0].date);
    }
  }, [tables, activeDate]);

  const selectDate = useCallback((date) => {
    setActiveDate(date);
  }, []);

  const createTable = useCallback(
    async (date) => {
      const normalizedDate = normalizeDate(date);
      if (!normalizedDate) {
        return { success: false, reason: 'invalid-date' };
      }
      if (tables.some((table) => table.date === normalizedDate)) {
        setActiveDate(normalizedDate);
        return { success: false, reason: 'duplicate' };
      }
      if (!remoteCreate) {
        const newTable = buildEmptyTable(normalizedDate, null);
        setTables((prev) => sortTables([...prev, newTable]));
        setActiveDate(normalizedDate);
        return { success: true, reason: 'created-local', table: newTable };
      }
      try {
        const response = await remoteCreate({ fecha: normalizedDate });
        const normalizedTable = normalizeTableFromApi(response);
        if (normalizedTable) {
          setTables((prev) => sortTables([...prev, normalizedTable]));
        }
        setActiveDate(normalizedDate);
        return { success: true, reason: 'created', table: normalizedTable };
      } catch (err) {
        console.error('Error al crear la tabla de ingesta/excreta', err);
        return { success: false, reason: 'request-failed', error: err };
      }
    },
    [tables, remoteCreate]
  );

  const updateColumnTitle = useCallback((date, columnId, label) => {
    if (!DATA_COLUMN_IDS.includes(columnId)) {
      return;
    }
    setTables((prev) =>
      prev.map((table) => {
        if (table.date !== date) {
          return table;
        }
        const text =
          label === null || label === undefined ? '' : String(label);
        return {
          ...table,
          titleOverrides: {
            ...table.titleOverrides,
            [columnId]: text
          },
          dirty: true,
          lastEditedAt: new Date().toISOString()
        };
      })
    );
  }, []);

  const updateCellValue = useCallback((date, slotId, columnId, value) => {
    if (!DATA_COLUMN_IDS.includes(columnId)) {
      return;
    }
    setTables((prev) =>
      prev.map((table) => {
        if (table.date !== date) {
          return table;
        }

        const nextRows = table.rows.map((row) => {
          if (row.slotId !== slotId) {
            return row;
          }
          return {
            ...row,
            values: {
              ...row.values,
              [columnId]:
                value === null || value === undefined ? '' : String(value)
            }
          };
        });

        return {
          ...table,
          rows: nextRows,
          dirty: true,
          lastEditedAt: new Date().toISOString()
        };
      })
    );
  }, []);

  const saveTable = useCallback(
    async (date) => {
      const normalizedDate = normalizeDate(date);
      if (!normalizedDate) {
        return { success: false, reason: 'missing-date' };
      }
      const target = tables.find((table) => table.date === normalizedDate);
      if (!target) {
        return { success: false, reason: 'not-found' };
      }
      if (!target.id) {
        return { success: false, reason: 'missing-id' };
      }
      if (!remoteUpdate) {
        return { success: false, reason: 'missing-handler' };
      }
      const payload = serializeTableForSave(target);
      try {
        const response = await remoteUpdate(target.id, payload);
        const normalized = normalizeTableFromApi(response);
        setTables((prev) =>
          prev.map((table) => {
            if (table.date !== normalizedDate) {
              return table;
            }
            if (normalized) {
              return {
                ...normalized,
                dirty: false,
                lastEditedAt: null
              };
            }
            return {
              ...table,
              dirty: false,
              lastEditedAt: null,
              lastSavedAt: new Date().toISOString()
            };
          })
        );
        return { success: true, reason: 'saved', table: normalized ?? target };
      } catch (err) {
        console.error('Error al guardar la tabla de ingesta/excreta', err);
        return { success: false, reason: 'request-failed', error: err };
      }
    },
    [tables, remoteUpdate]
  );

  const activeTable = useMemo(
    () => tables.find((table) => table.date === activeDate) ?? null,
    [tables, activeDate]
  );

  const computeSummariesForTable = useCallback((table) => {
    if (!table) {
      return null;
    }

    const rowSummaries = table.rows.map((row) => {
      const slot = TIME_SLOTS_MAP.get(row.slotId);
      const ingestionTotal = INGESTA_COLUMNS.reduce(
        (total, column) => total + toNumericValue(row.values[column.id]),
        0
      );
      const excretaTotal = EXCRETA_COLUMNS.reduce(
        (total, column) => total + toNumericValue(row.values[column.id]),
        0
      );

      return {
        slotId: row.slotId,
        label: slot?.label ?? row.slotId,
        shiftId: row.shiftId,
        values: row.values,
        totals: {
          ingestion: ingestionTotal,
          excreta: excretaTotal,
          balance: ingestionTotal - excretaTotal
        }
      };
    });

    const totals24h = sumColumnsForRows(table.rows);

    const shiftSummaries = SHIFT_DEFINITIONS.map((shift) => {
      const shiftRows = table.rows.filter((row) => row.shiftId === shift.id);
      const totals = sumColumnsForRows(shiftRows);
      return {
        shiftId: shift.id,
        label: shift.label,
        ...totals
      };
    });

    return {
      rows: rowSummaries,
      totals24h,
      shiftSummaries
    };
  }, []);

  const contextValue = useMemo(
    () => ({
      columns: {
        ingesta: INGESTA_COLUMNS,
        excreta: EXCRETA_COLUMNS
      },
      shifts: SHIFT_DEFINITIONS,
      timeSlots: TIME_SLOTS,
      tables,
      activeDate,
      activeTable,
      loading,
      error,
      helpers: {
        formatDateFriendly,
        computeSummariesForTable
      },
      actions: {
        selectDate,
        createTable,
        updateColumnTitle,
        updateCellValue,
        saveTable,
        refresh
      }
    }),
    [
      tables,
      activeDate,
      activeTable,
      loading,
      error,
      selectDate,
      createTable,
      updateColumnTitle,
      updateCellValue,
      saveTable,
      refresh,
      computeSummariesForTable
    ]
  );

  return (
    <IngestaExcretaContext.Provider value={contextValue}>
      {children}
    </IngestaExcretaContext.Provider>
  );
};
