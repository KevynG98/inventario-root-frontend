import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState
} from 'react';

const TITLE = 'Evoluciones';

const DOCTOR_ROLE_IDS = [1, 16, 17, 18, 19, 26];
const DOCTOR_ROLE_SLUGS = [
  'MEDICO',
  'MÉDICO',
  'MEDICO_RESIDENTE',
  'MÉDICO_RESIDENTE',
  'DOCTOR',
  'MEDICO TRATANTE',
  'MÉDICO TRATANTE'
];
const NURSE_ROLE_IDS = [15];
const NURSE_ROLE_SLUGS = ['ENFERMERIA', 'ENFERMERÍA', 'ENFERMERA', 'ENFERMERO'];

const formatDateTime = (iso) => {
  if (!iso) {
    return '—';
  }
  try {
    return new Intl.DateTimeFormat('es-GT', {
      dateStyle: 'short',
      timeStyle: 'short'
    }).format(new Date(iso));
  } catch (error) {
    return iso;
  }
};

const getCurrentUser = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    const raw = window.localStorage?.getItem('user');
    if (!raw) {
      return null;
    }
    return JSON.parse(raw);
  } catch (error) {
    console.warn('No se pudo leer el usuario actual desde localStorage.', error);
    return null;
  }
};

const normalizeIdentifier = (value) =>
  typeof value === 'string' ? value.trim().toLowerCase() : '';

const mapRoleIds = (roles) =>
  Array.isArray(roles)
    ? roles
        .map((role) => {
          const roleId = role?.id ?? role;
          const parsed = Number(roleId);
          return Number.isNaN(parsed) ? null : parsed;
        })
        .filter((roleId) => roleId !== null)
    : [];

const mapRoleNames = (roles) =>
  Array.isArray(roles)
    ? roles
        .map((role) => {
          const name = role?.slug ?? role?.codigo ?? role?.clave ?? role?.nombre ?? role?.name ?? '';
          return typeof name === 'string' ? name.trim().toUpperCase() : '';
        })
        .filter(Boolean)
    : [];

const buildEditorState = (record) => ({
  resumen: record?.resumen ?? '',
  contenido: record?.contenido ?? ''
});

const EvolucionContext = createContext(null);

export const useEvolucionContext = () => {
  const context = useContext(EvolucionContext);
  if (!context) {
    throw new Error('useEvolucionContext debe usarse dentro de EvolucionProvider');
  }
  return context;
};

export const EvolucionProvider = ({ children, value }) => {
  const notes = Array.isArray(value?.items) ? value.items : [];
  const loading = value?.loading ?? false;
  const error = value?.error ?? null;
  const onCreate = value?.create;
  const onUpdate = value?.update;
  const onRemove = value?.remove;
  const refresh = value?.refresh;
  const onPrint = value?.print;

  const currentUser = useMemo(() => getCurrentUser(), []);
  const roleIds = useMemo(
    () => mapRoleIds(currentUser?.roles),
    [currentUser?.roles]
  );
  const roleNames = useMemo(
    () => mapRoleNames(currentUser?.roles),
    [currentUser?.roles]
  );
  const normalizedUsername = useMemo(
    () =>
      normalizeIdentifier(
        currentUser?.username ??
          currentUser?.usuario ??
          currentUser?.correo ??
          currentUser?.email ??
          ''
      ),
    [currentUser]
  );
  const isMedicoPerfil = currentUser?.perfil?.es_medico === true;
  const isDoctor = useMemo(
    () =>
      isMedicoPerfil ||
      roleIds.some((roleId) => DOCTOR_ROLE_IDS.includes(Number(roleId))) ||
      roleNames.some((name) => DOCTOR_ROLE_SLUGS.includes(name)),
    [isMedicoPerfil, roleIds, roleNames]
  );
  const isEnfermeria = useMemo(
    () =>
      roleIds.some((roleId) => NURSE_ROLE_IDS.includes(Number(roleId))) ||
      roleNames.some((name) => NURSE_ROLE_SLUGS.includes(name)),
    [roleIds, roleNames]
  );
  const canCreate = isDoctor;

  const mappedNotes = useMemo(
    () =>
      notes.map((raw) => {
        const createdAt =
          raw.creado_en ??
          raw.created_at ??
          raw.fecha ??
          raw.fecha_hora ??
          raw.createdAt ??
          null;
        const creatorUsername =
          raw.creado_por ??
          raw.creadoPor ??
          raw.usuario ??
          raw.autor_usuario ??
          raw.medico_username ??
          raw.user_username ??
          raw.username ??
          '';
        const medicoNombre =
          raw.medico_nombre ??
          raw.medico ??
          raw.autor_nombre ??
          raw.autor ??
          raw.creado_por_nombre ??
          raw.usuario_nombre ??
          '';
        const medicoColegiado =
          raw.medico_colegiado ??
          raw.colegiado ??
          raw.medicoColegiado ??
          raw.numero_colegiado ??
          raw.colegiado_medico ??
          '';
        const resumen =
          raw.resumen ??
          raw.resumen_general ??
          raw.descripcion_corta ??
          '';
        const contenido =
          raw.contenido ??
          raw.descripcion ??
          raw.detalle ??
          raw.nota ??
          '';
        const createdByNormalized = normalizeIdentifier(creatorUsername);
        const canEdit =
          isDoctor &&
          normalizedUsername &&
          createdByNormalized &&
          normalizedUsername === createdByNormalized;

        return {
          id: raw.id ?? raw.uuid ?? raw.pk ?? String(Math.random()),
          creadoEn: createdAt,
          creadoEnLabel: formatDateTime(createdAt),
          creadoPor: creatorUsername || '—',
          medicoNombre: medicoNombre || raw.creado_por_nombre || '—',
          medicoColegiado: medicoColegiado || '',
          resumen: resumen || contenido?.slice(0, 160) || '',
          contenido: contenido || '',
          puedeImprimir: true,
          canEdit,
          raw
        };
      }),
    [notes, isDoctor, normalizedUsername]
  );

  const [mode, setMode] = useState('LIST'); // LIST | CREATE | EDIT | VIEW
  const [activeId, setActiveId] = useState(null);
  const [editorState, setEditorState] = useState(buildEditorState());
  const [saving, setSaving] = useState(false);

  const activeNote = useMemo(
    () =>
      mappedNotes.find(
        (record) => String(record.id) === String(activeId)
      ) ?? null,
    [mappedNotes, activeId]
  );

  const startCreate = useCallback(() => {
    if (!canCreate) {
      window.alert('Solo los médicos pueden registrar evoluciones.');
      return;
    }
    setMode('CREATE');
    setActiveId(null);
    setEditorState(buildEditorState());
  }, [canCreate]);

  const startView = useCallback(
    (noteId) => {
      const target = mappedNotes.find(
        (record) => String(record.id) === String(noteId)
      );
      if (!target) {
        return;
      }
      setMode('VIEW');
      setActiveId(target.id);
      setEditorState(buildEditorState(target));
    },
    [mappedNotes]
  );

  const startEdit = useCallback(
    (noteId) => {
      const target = mappedNotes.find(
        (record) => String(record.id) === String(noteId)
      );
      if (!target) {
        return;
      }
      if (!target.canEdit) {
        window.alert(
          'Solo el médico que registró la evolución puede editarla.'
        );
        return;
      }
      setMode('EDIT');
      setActiveId(target.id);
      setEditorState(buildEditorState(target));
    },
    [mappedNotes]
  );

  const returnToList = useCallback(() => {
    setMode('LIST');
    setActiveId(null);
    setEditorState(buildEditorState());
  }, []);

  const setResumen = useCallback((value) => {
    setEditorState((prev) => ({ ...prev, resumen: value }));
  }, []);

  const setContenido = useCallback((value) => {
    setEditorState((prev) => ({ ...prev, contenido: value }));
  }, []);

  const saveNote = useCallback(async () => {
    if (!canCreate) {
      return { success: false, reason: 'PERMISSION' };
    }
    if (!editorState.contenido?.trim()) {
      return { success: false, reason: 'EMPTY' };
    }

    const payload = {
      contenido: editorState.contenido,
      resumen: editorState.resumen?.trim() || null
    };

    setSaving(true);
    try {
      if (mode === 'CREATE') {
        if (typeof onCreate !== 'function') {
          return { success: false, reason: 'UNAVAILABLE' };
        }
        await onCreate(payload);
      } else if (mode === 'EDIT') {
        if (!activeNote?.canEdit) {
          return { success: false, reason: 'PERMISSION' };
        }
        if (typeof onUpdate !== 'function') {
          return { success: false, reason: 'UNAVAILABLE' };
        }
        await onUpdate(activeNote.id, payload);
      } else {
        return { success: false, reason: 'READ_ONLY' };
      }
      await refresh?.();
      returnToList();
      return { success: true };
    } finally {
      setSaving(false);
    }
  }, [
    canCreate,
    editorState,
    mode,
    onCreate,
    onUpdate,
    activeNote,
    refresh,
    returnToList
  ]);

  const deleteNote = useCallback(
    async (noteId) => {
      const target = mappedNotes.find(
        (record) => String(record.id) === String(noteId)
      );
      if (!target || !target.canEdit) {
        window.alert('Solo el médico que creó la nota puede eliminarla.');
        return;
      }
      if (typeof onRemove !== 'function') {
        return;
      }
      await onRemove(noteId);
      if (String(noteId) === String(activeId)) {
        returnToList();
      }
    },
    [mappedNotes, onRemove, activeId, returnToList]
  );

  const printNote = useCallback(
    (note) => {
      if (typeof onPrint === 'function') {
        onPrint(note);
        return;
      }
      window.alert(
        'La impresión de la evolución estará disponible próximamente.'
      );
    },
    [onPrint]
  );

  const contextValue = useMemo(
    () => ({
      title: TITLE,
      notes: mappedNotes,
      loading,
      error,
      mode,
      activeNote,
      editorState,
      canCreate,
      isDoctor,
      isEnfermeria,
      saving,
      startCreate,
      startView,
      startEdit,
      returnToList,
      setResumen,
      setContenido,
      saveNote,
      deleteNote,
      printNote
    }),
    [
      mappedNotes,
      loading,
      error,
      mode,
      activeNote,
      editorState,
      canCreate,
      isDoctor,
      isEnfermeria,
      saving,
      startCreate,
      startView,
      startEdit,
      returnToList,
      setResumen,
      setContenido,
      saveNote,
      deleteNote,
      printNote
    ]
  );

  return (
    <EvolucionContext.Provider value={contextValue}>
      {children}
    </EvolucionContext.Provider>
  );
};
