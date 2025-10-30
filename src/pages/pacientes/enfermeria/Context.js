import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { getData } from '../../../apiService';
import { menu as menuConfig } from './pages';
import { persistSelection, startSelectionSession } from './patientStore';

const NursingContext = createContext(null);

const parseLatinDate = (value) => {
  if (typeof value !== 'string') {
    return null;
  }

  const [day, month, year] = value.split('/').map((part) => Number(part));
  if (
    Number.isNaN(day) ||
    Number.isNaN(month) ||
    Number.isNaN(year) ||
    day <= 0 ||
    month <= 0
  ) {
    return null;
  }

  const parsed = new Date(year, month - 1, day);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const extractNameAndBirth = (value) => {
  if (typeof value !== 'string') {
    return { name: '', birthDate: null };
  }

  const match = value.match(/\(NAC:\s*([0-9]{2}\/[0-9]{2}\/[0-9]{4})\)/i);
  const birthDate = match ? parseLatinDate(match[1]) : null;
  const name = match ? value.replace(match[0], '').trim() : value.trim();

  return { name: name.replace(/\s+/g, ' '), birthDate };
};

const calculateAgeLabel = (birthDate) => {
  if (!(birthDate instanceof Date) || Number.isNaN(birthDate.getTime())) {
    return '—';
  }

  const now = new Date();
  let years = now.getFullYear() - birthDate.getFullYear();
  const monthDiff = now.getMonth() - birthDate.getMonth();
  const dayDiff = now.getDate() - birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    years -= 1;
  }

  if (years > 0) {
    return `${years} año${years === 1 ? '' : 's'}`;
  }

  const totalMonths =
    (now.getFullYear() - birthDate.getFullYear()) * 12 +
    now.getMonth() -
    birthDate.getMonth() -
    (now.getDate() < birthDate.getDate() ? 1 : 0);

  if (totalMonths > 0) {
    return `${totalMonths} mes${totalMonths === 1 ? '' : 'es'}`;
  }

  const diffDays = Math.max(
    1,
    Math.floor((now.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24))
  );
  return `${diffDays} día${diffDays === 1 ? '' : 's'}`;
};

const buildPatientFromAdmission = (admission) => {
  if (!admission) {
    return null;
  }

  const admissionId = admission.id_admision ?? admission.id ?? '';
  const admissionDate = parseLatinDate(admission.fecha_admision);
  const { name, birthDate } = extractNameAndBirth(admission.paciente);

  return {
    admissionNumber: admissionId || '—',
    admissionId: admissionId || null,
    admissionDate,
    name: name || '—',
    age: calculateAgeLabel(birthDate),
    areaType: admission.area ?? '—',
    location: admission.habitacion ?? '',
    insurer: admission.aseguradora ?? '—',
    bloodType:
      admission.tipo_sangre && admission.tipo_sangre !== 'N/D'
        ? admission.tipo_sangre
        : '—',
    allergies: admission.alergias ?? 'Información no disponible',
    consultationReason:
      admission.motivo_consulta ?? 'Información no disponible',
    weightKg: admission.peso ?? '',
    raw: admission
  };
};

const parsePageFromUrl = (url) => {
  if (!url) {
    return null;
  }

  try {
    const parsed = new URL(url, window.location.origin);
    const page = parsed.searchParams.get('page');
    return page ? Number(page) : null;
  } catch (error) {
    return null;
  }
};

const findFirstLeaf = (items) => {
  if (!Array.isArray(items)) {
    return null;
  }

  for (const item of items) {
    if (item?.children && item.children.length > 0) {
      const nested = findFirstLeaf(item.children);
      if (nested) {
        return nested;
      }
    } else if (item) {
      return item;
    }
  }

  return null;
};

const findByKey = (items, key) => {
  if (!Array.isArray(items) || !key) {
    return null;
  }

  for (const item of items) {
    if (item?.key === key) {
      return item;
    }
    if (item?.children) {
      const nested = findByKey(item.children, key);
      if (nested) {
        return nested;
      }
    }
  }

  return null;
};

const resolveIframeSrc = (item) => {
  if (!item) {
    return '';
  }

  if (item.iframe) {
    return item.iframe;
  }

  return '';
};

export const ContextProvider = ({ children }) => {
  const sessionRef = useRef(null);
  if (sessionRef.current === null && typeof window !== 'undefined') {
    sessionRef.current = startSelectionSession();
  }

  const [menuItems] = useState(() => menuConfig);

  const firstItem = useMemo(() => findFirstLeaf(menuItems), [menuItems]);

  const [activeMenuKey, setActiveMenuKey] = useState(firstItem?.key ?? null);
  const [iframeSrc, setIframeSrc] = useState(() => resolveIframeSrc(firstItem));
  const [patient, setPatient] = useState(null);
  const [lastSubmission, setLastSubmission] = useState(null);
  const [admissions, setAdmissions] = useState([]);
  const [admissionsLoading, setAdmissionsLoading] = useState(false);
  const [admissionsError, setAdmissionsError] = useState(null);
  const [admissionsModalOpen, setAdmissionsModalOpen] = useState(true);
  const [admissionsPage, setAdmissionsPage] = useState(1);
  const [admissionsNextPage, setAdmissionsNextPage] = useState(null);
  const [admissionsPrevPage, setAdmissionsPrevPage] = useState(null);
  const [selectedAdmissionId, setSelectedAdmissionId] = useState(null);
  const [selectedAdmissionDetail, setSelectedAdmissionDetail] = useState(null);
  const [admissionDetailLoading, setAdmissionDetailLoading] = useState(false);
  const [lastDetailRequestId, setLastDetailRequestId] = useState(null);

  useEffect(() => {
    const initialItem = findFirstLeaf(menuItems);
    setActiveMenuKey(initialItem?.key ?? null);
    setIframeSrc(resolveIframeSrc(initialItem));
  }, [menuItems]);

  const fetchAdmissions = useCallback(
    async (page = 1) => {
      const resolvedPage = Number(page) || 1;
      setAdmissionsLoading(true);
      setAdmissionsError(null);

      try {
        const response = await getData(
          `admisiones/admisiones-resumen/?page=${resolvedPage}&page_size=25`
        );
        const payload = response?.data;
        const results = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.results)
          ? payload.results
          : [];

        setAdmissions(results);
        setAdmissionsPage(resolvedPage);
        setAdmissionsNextPage(parsePageFromUrl(payload?.next));
        setAdmissionsPrevPage(parsePageFromUrl(payload?.previous));
      } catch (error) {
        console.error('Failed to load admissions summary:', error);
        setAdmissionsError(
          'No se pudieron cargar las admisiones. Intenta nuevamente.'
        );
        setAdmissions([]);
        setAdmissionsPage(resolvedPage);
        setAdmissionsNextPage(null);
        setAdmissionsPrevPage(null);
      } finally {
        setAdmissionsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchAdmissions(1);
  }, [fetchAdmissions]);

  const resolveItemByKey = useCallback((key) => findByKey(menuItems, key), [menuItems]);

  const handleMenuSelect = useCallback(
    (key, item, event) => {
      if (event?.preventDefault) {
        event.preventDefault();
      }

      const resolvedItem = item?.key === key ? item : resolveItemByKey(key);
      setActiveMenuKey(key ?? null);
      setIframeSrc(resolveIframeSrc(resolvedItem));
    },
    [resolveItemByKey]
  );

  const handlePatientFormSubmit = useCallback(
    (payload) => {
      if (payload?.patient) {
        setPatient((prev) => {
          const next = {
            ...prev,
            ...payload.patient
          };
          persistSelection(next, selectedAdmissionDetail);
          return next;
        });
      } else {
        persistSelection(patient, selectedAdmissionDetail);
      }
      setLastSubmission(payload ?? null);
    },
    [patient, selectedAdmissionDetail]
  );

  const loadAdmissionDetail = useCallback(
    async (id, summarySnapshot = null) => {
      if (!id) {
        setSelectedAdmissionDetail(null);
        persistSelection(summarySnapshot ?? patient, null);
        return null;
      }

      setAdmissionDetailLoading(true);
      try {
        const response = await getData(`admisiones/${id}/`);
        const detail = response?.data ?? null;
        setSelectedAdmissionDetail(detail);
        const summaryToPersist =
          summarySnapshot ??
          (patient?.admissionId === id ? patient : summarySnapshot ?? patient);
        persistSelection(summaryToPersist, detail);
        return detail;
      } catch (error) {
        console.error('No se pudo obtener el detalle de la admisión:', error);
        persistSelection(summarySnapshot ?? patient, null);
        setSelectedAdmissionDetail(null);
        return null;
      } finally {
        setAdmissionDetailLoading(false);
      }
    },
    [patient]
  );

  const handleAdmissionSelect = useCallback(
    async (admission) => {
      if (!admission) {
        return;
      }

      const mappedPatient = buildPatientFromAdmission(admission);
      const admissionId = admission.id_admision ?? admission.id ?? null;

      setSelectedAdmissionId(admissionId);
      setPatient(mappedPatient);
      setAdmissionsModalOpen(false);
      setSelectedAdmissionDetail(null);
      setLastDetailRequestId(admissionId);
      persistSelection(mappedPatient, null);

      if (admissionId) {
        await loadAdmissionDetail(admissionId, mappedPatient);
      }
    },
    [loadAdmissionDetail]
  );

  const openAdmissionsModal = useCallback(() => {
    setAdmissionsModalOpen(true);
  }, []);

  const closeAdmissionsModal = useCallback(() => {
    setAdmissionsModalOpen(false);
  }, []);

  const loadNextAdmissionsPage = useCallback(() => {
    if (admissionsNextPage) {
      fetchAdmissions(admissionsNextPage);
    }
  }, [admissionsNextPage, fetchAdmissions]);

  const loadPrevAdmissionsPage = useCallback(() => {
    if (admissionsPrevPage) {
      fetchAdmissions(admissionsPrevPage);
    }
  }, [admissionsPrevPage, fetchAdmissions]);

  useEffect(() => {
    const targetId = patient?.admissionId ?? patient?.admissionNumber ?? null;
    if (
      targetId &&
      !selectedAdmissionDetail &&
      !admissionDetailLoading &&
      lastDetailRequestId !== targetId
    ) {
      setLastDetailRequestId(targetId);
      loadAdmissionDetail(targetId, patient);
    }
  }, [
    patient,
    selectedAdmissionDetail,
    admissionDetailLoading,
    lastDetailRequestId,
    loadAdmissionDetail
  ]);

  const value = useMemo(
    () => ({
      menuItems,
      activeMenuKey,
      iframeSrc,
      patient,
      lastSubmission,
      admissions,
      admissionsLoading,
      admissionsError,
      admissionsModalOpen,
      admissionsPage,
      admissionsNextPage,
      admissionsPrevPage,
      selectedAdmissionId,
      selectedAdmissionDetail,
      admissionDetailLoading,
      handleMenuSelect,
      setIframeSrc,
      setPatient,
      handlePatientFormSubmit,
      fetchAdmissions,
      handleAdmissionSelect,
      loadAdmissionDetail,
      openAdmissionsModal,
      closeAdmissionsModal,
      loadNextAdmissionsPage,
      loadPrevAdmissionsPage
    }),
    [
      menuItems,
      activeMenuKey,
      iframeSrc,
      patient,
      lastSubmission,
      admissions,
      admissionsLoading,
      admissionsError,
      admissionsModalOpen,
      admissionsPage,
      admissionsNextPage,
      admissionsPrevPage,
      selectedAdmissionId,
      selectedAdmissionDetail,
      admissionDetailLoading,
      handleMenuSelect,
      fetchAdmissions,
      handleAdmissionSelect,
      loadAdmissionDetail,
      openAdmissionsModal,
      closeAdmissionsModal,
      loadNextAdmissionsPage,
      loadPrevAdmissionsPage
    ]
  );

  return <NursingContext.Provider value={value}>{children}</NursingContext.Provider>;
};

export const useMyContext = (options = {}) => {
  const { optional = false } = options;
  const context = useContext(NursingContext);
  if (!context) {
    if (optional) {
      return null;
    }
    throw new Error('useMyContext must be used within a ContextProvider');
  }
  return context;
};
