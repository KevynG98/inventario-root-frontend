import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  deleteData,
  getData,
  patchData,
  postData,
  putData
} from '../../../apiService';

const asArray = (payload) => {
  if (!payload) {
    return [];
  }
  if (Array.isArray(payload)) {
    return payload;
  }
  if (Array.isArray(payload.results)) {
    return payload.results;
  }
  return [];
};

const baseParams = (admisionId) =>
  admisionId ? `?admision=${admisionId}&page_size=200` : '';

export const useEnfermeriaData = (admisionId) => {
  const [medicos, setMedicos] = useState([]);
  const [signosEmergencia, setSignosEmergencia] = useState([]);
  const [signosEncamamiento, setSignosEncamamiento] = useState([]);
  const [antecedentes, setAntecedentes] = useState([]);
  const [controles, setControles] = useState([]);
  const [notas, setNotas] = useState([]);
  const [dietas, setDietas] = useState([]);
  const [evoluciones, setEvoluciones] = useState([]);
  const [ingestaExcreta, setIngestaExcreta] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [ordenes, setOrdenes] = useState([]);
  const [historia, setHistoria] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const resetState = useCallback(() => {
    setMedicos([]);
    setSignosEmergencia([]);
    setSignosEncamamiento([]);
    setAntecedentes([]);
    setControles([]);
    setNotas([]);
    setDietas([]);
    setEvoluciones([]);
    setIngestaExcreta([]);
    setSolicitudes([]);
    setOrdenes([]);
    setHistoria(null);
  }, []);

  const fetchMedicos = useCallback(async () => {
    if (!admisionId) {
      setMedicos([]);
      return;
    }
    const response = await getData(
      `enfermeria/medicos-tratantes/${baseParams(admisionId)}`
    );
    setMedicos(asArray(response.data));
  }, [admisionId]);

  const fetchSignosEmergencia = useCallback(async () => {
    if (!admisionId) {
      setSignosEmergencia([]);
      return;
    }
    const response = await getData(
      `enfermeria/signos-vitales-emergencia/${baseParams(admisionId)}`
    );
    setSignosEmergencia(asArray(response.data));
  }, [admisionId]);

  const fetchSignosEncamamiento = useCallback(async () => {
    if (!admisionId) {
      setSignosEncamamiento([]);
      return;
    }
    const response = await getData(
      `enfermeria/signos-vitales-encamamiento/${baseParams(admisionId)}`
    );
    setSignosEncamamiento(asArray(response.data));
  }, [admisionId]);

  const fetchAntecedentes = useCallback(async () => {
    if (!admisionId) {
      setAntecedentes([]);
      return;
    }
    const response = await getData(
      `enfermeria/antecedentes/${baseParams(admisionId)}`
    );
    setAntecedentes(asArray(response.data));
  }, [admisionId]);

  const fetchControles = useCallback(async () => {
    if (!admisionId) {
      setControles([]);
      return;
    }
    const response = await getData(
      `enfermeria/controles-medicamentos/${baseParams(admisionId)}`
    );
    setControles(asArray(response.data));
  }, [admisionId]);

  const fetchNotas = useCallback(async () => {
    if (!admisionId) {
      setNotas([]);
      return;
    }
    const response = await getData(
      `enfermeria/notas-enfermeria/${baseParams(admisionId)}`
    );
    setNotas(asArray(response.data));
  }, [admisionId]);

  const fetchDietas = useCallback(async () => {
    if (!admisionId) {
      setDietas([]);
      return;
    }
    const response = await getData(
      `enfermeria/dietas/${baseParams(admisionId)}`
    );
    setDietas(asArray(response.data));
  }, [admisionId]);

  const fetchIngestaExcreta = useCallback(async () => {
    if (!admisionId) {
      setIngestaExcreta([]);
      return;
    }
    const response = await getData(
      `enfermeria/ingesta-excreta/${baseParams(admisionId)}`
    );
    setIngestaExcreta(asArray(response.data));
  }, [admisionId]);

  const fetchEvoluciones = useCallback(async () => {
    if (!admisionId) {
      setEvoluciones([]);
      return;
    }
    try {
      const response = await getData(
        `enfermeria/evoluciones/${baseParams(admisionId)}`
      );
      setEvoluciones(asArray(response.data));
    } catch (err) {
      const status = err?.response?.status ?? err?.status ?? null;
      if (status && status >= 500) {
        throw err;
      }
      console.warn('No se pudieron obtener las evoluciones, se continuará con lista vacía.', err);
      setEvoluciones([]);
    }
  }, [admisionId]);

  const fetchOrdenes = useCallback(async () => {
    if (!admisionId) {
      setOrdenes([]);
      return;
    }
    const response = await getData(
      `enfermeria/ordenes-medicas/${baseParams(admisionId)}`
    );
    setOrdenes(asArray(response.data));
  }, [admisionId]);

  const fetchSolicitudes = useCallback(async () => {
    if (!admisionId) {
      setSolicitudes([]);
      return;
    }
    const response = await getData(
      `enfermeria/solicitudes-medicamentos/${baseParams(admisionId)}`
    );
    setSolicitudes(asArray(response.data));
  }, [admisionId]);

  const fetchHistoria = useCallback(async () => {
    if (!admisionId) {
      setHistoria(null);
      return;
    }
    const response = await getData(
      `enfermeria/historias-enfermedad/${admisionId}/`
    );
    setHistoria(response.data);
  }, [admisionId]);

  const refreshAll = useCallback(async () => {
    if (!admisionId) {
      resetState();
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await Promise.all([
        fetchMedicos(),
        fetchSignosEmergencia(),
        fetchSignosEncamamiento(),
        fetchAntecedentes(),
        fetchControles(),
        fetchNotas(),
        fetchDietas(),
        fetchEvoluciones(),
        fetchIngestaExcreta(),
        fetchSolicitudes(),
        fetchOrdenes(),
        fetchHistoria()
      ]);
    } catch (err) {
      console.error('Error al cargar datos de enfermería', err);
      setError('No se pudieron cargar los datos de enfermería.');
    } finally {
      setLoading(false);
    }
  }, [
    admisionId,
    resetState,
    fetchMedicos,
    fetchSignosEmergencia,
    fetchSignosEncamamiento,
    fetchAntecedentes,
    fetchControles,
    fetchNotas,
    fetchDietas,
    fetchEvoluciones,
    fetchIngestaExcreta,
    fetchSolicitudes,
    fetchOrdenes,
    fetchHistoria
  ]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  /** CRUD helpers **/

  const createMedico = useCallback(
    async (payload) => {
      await postData('enfermeria/medicos-tratantes/', {
        ...payload,
        admision: admisionId
      });
      await fetchMedicos();
    },
    [admisionId, fetchMedicos]
  );

  const updateMedico = useCallback(
    async (id, payload) => {
      await putData(
        `enfermeria/medicos-tratantes/${id}/`,
        {
          ...payload,
          admision: admisionId
        },
        { __skipLoader: true }
      );
      await fetchMedicos();
    },
    [admisionId, fetchMedicos]
  );

  const deleteMedico = useCallback(
    async (id) => {
      await deleteData(`enfermeria/medicos-tratantes/${id}/`);
      await fetchMedicos();
    },
    [fetchMedicos]
  );

  const saveHistoria = useCallback(
    async (payload) => {
      await putData(
        `enfermeria/historias-enfermedad/${admisionId}/`,
        payload,
        { __skipLoader: true }
      );
      await fetchHistoria();
    },
    [admisionId, fetchHistoria]
  );

  const createSignoEmergencia = useCallback(
    async (payload) => {
      await postData('enfermeria/signos-vitales-emergencia/', {
        ...payload,
        admision: admisionId
      });
      await fetchSignosEmergencia();
    },
    [admisionId, fetchSignosEmergencia]
  );

  const deleteSignoEmergencia = useCallback(
    async (id) => {
      await deleteData(`enfermeria/signos-vitales-emergencia/${id}/`);
      await fetchSignosEmergencia();
    },
    [fetchSignosEmergencia]
  );

  const createSignoEncamamiento = useCallback(
    async (payload) => {
      await postData('enfermeria/signos-vitales-encamamiento/', {
        ...payload,
        admision: admisionId
      });
      await fetchSignosEncamamiento();
    },
    [admisionId, fetchSignosEncamamiento]
  );

  const updateSignoEncamamiento = useCallback(
    async (id, payload) => {
      await patchData(`enfermeria/signos-vitales-encamamiento/${id}/`, payload);
      await fetchSignosEncamamiento();
    },
    [fetchSignosEncamamiento]
  );

  const deleteSignoEncamamiento = useCallback(
    async (id) => {
      await deleteData(`enfermeria/signos-vitales-encamamiento/${id}/`);
      await fetchSignosEncamamiento();
    },
    [fetchSignosEncamamiento]
  );

  const createAntecedente = useCallback(
    async (payload) => {
      await postData('enfermeria/antecedentes/', {
        ...payload,
        admision: admisionId
      });
      await fetchAntecedentes();
    },
    [admisionId, fetchAntecedentes]
  );

  const updateAntecedente = useCallback(
    async (id, payload) => {
      await patchData(`enfermeria/antecedentes/${id}/`, payload);
      await fetchAntecedentes();
    },
    [fetchAntecedentes]
  );

  const deleteAntecedente = useCallback(
    async (id) => {
      await deleteData(`enfermeria/antecedentes/${id}/`);
      await fetchAntecedentes();
    },
    [fetchAntecedentes]
  );

  const createControl = useCallback(
    async (payload) => {
      await postData('enfermeria/controles-medicamentos/', {
        ...payload,
        admision: admisionId
      });
      await fetchControles();
    },
    [admisionId, fetchControles]
  );

  const updateControl = useCallback(
    async (id, payload) => {
      await patchData(`enfermeria/controles-medicamentos/${id}/`, payload);
      await fetchControles();
    },
    [fetchControles]
  );

  const deleteControl = useCallback(
    async (id) => {
      await deleteData(`enfermeria/controles-medicamentos/${id}/`);
      await fetchControles();
    },
    [fetchControles]
  );

  const createControlRegistro = useCallback(
    async (payload) => {
      await postData('enfermeria/controles-medicamentos-registros/', payload);
      await fetchControles();
    },
    [fetchControles]
  );

  const updateControlRegistro = useCallback(
    async (id, payload) => {
      await patchData(`enfermeria/controles-medicamentos-registros/${id}/`, payload);
      await fetchControles();
    },
    [fetchControles]
  );

  const createNota = useCallback(
    async (payload) => {
      await postData('enfermeria/notas-enfermeria/', {
        ...payload,
        admision: admisionId
      });
      await fetchNotas();
    },
    [admisionId, fetchNotas]
  );

  const updateNota = useCallback(
    async (id, payload) => {
      await patchData(`enfermeria/notas-enfermeria/${id}/`, payload);
      await fetchNotas();
    },
    [fetchNotas]
  );

  const deleteNota = useCallback(
    async (id) => {
      await deleteData(`enfermeria/notas-enfermeria/${id}/`);
      await fetchNotas();
    },
    [fetchNotas]
  );

  const createIngestaRegistro = useCallback(
    async ({ fecha, columnas = {}, registros = [] }) => {
      if (!admisionId) {
        throw new Error('Se requiere una admisión para guardar ingesta/excreta.');
      }
      const response = await postData('enfermeria/ingesta-excreta/', {
        admision: admisionId,
        fecha,
        columnas_personalizadas: columnas,
        registros
      });
      await fetchIngestaExcreta();
      return response.data;
    },
    [admisionId, fetchIngestaExcreta]
  );

  const updateIngestaRegistro = useCallback(
    async (id, payload) => {
      const response = await putData(
        `enfermeria/ingesta-excreta/${id}/`,
        payload,
        { __skipLoader: true }
      );
      await fetchIngestaExcreta();
      return response.data;
    },
    [fetchIngestaExcreta]
  );

  const createSolicitudMedicamento = useCallback(
    async (payload) => {
      const response = await postData('enfermeria/solicitudes-medicamentos/', {
        ...payload,
        admision: admisionId
      });
      await fetchSolicitudes();
      return response.data;
    },
    [admisionId, fetchSolicitudes]
  );

  const updateSolicitudMedicamento = useCallback(
    async (id, payload) => {
      const response = await putData(
        `enfermeria/solicitudes-medicamentos/${id}/`,
        payload,
        { __skipLoader: true }
      );
      await fetchSolicitudes();
      return response.data;
    },
    [fetchSolicitudes]
  );

  const enviarSolicitudMedicamento = useCallback(
    async (id) => {
      const response = await postData(
        `enfermeria/solicitudes-medicamentos/${id}/enviar/`,
        {}
      );
      await fetchSolicitudes();
      return response.data;
    },
    [fetchSolicitudes]
  );

  const marcarPendienteRecibirSolicitud = useCallback(
    async (id) => {
      const response = await postData(
        `enfermeria/solicitudes-medicamentos/${id}/marcar-pendiente-recibir/`,
        {}
      );
      await fetchSolicitudes();
      return response.data;
    },
    [fetchSolicitudes]
  );

  const recibirSolicitudMedicamento = useCallback(
    async (id, payload) => {
      const response = await postData(
        `enfermeria/solicitudes-medicamentos/${id}/recibir/`,
        payload
      );
      await fetchSolicitudes();
      return response.data;
    },
    [fetchSolicitudes]
  );

  const cargarSolicitudEstadoCuenta = useCallback(
    async (id) => {
      const response = await postData(
        `enfermeria/solicitudes-medicamentos/${id}/cargar-estado-cuenta/`,
        {}
      );
      await fetchSolicitudes();
      return response.data;
    },
    [fetchSolicitudes]
  );

  const anularSolicitudMedicamento = useCallback(
    async (id, payload = {}) => {
      const response = await postData(
        `enfermeria/solicitudes-medicamentos/${id}/anular/`,
        payload
      );
      await fetchSolicitudes();
      return response.data;
    },
    [fetchSolicitudes]
  );

  const devolverItemSolicitud = useCallback(
    async (solicitudId, itemId, payload) => {
      const response = await postData(
        `enfermeria/solicitudes-medicamentos/${solicitudId}/items/${itemId}/devolver/`,
        payload
      );
      await fetchSolicitudes();
      return response.data;
    },
    [fetchSolicitudes]
  );

  const createDieta = useCallback(
    async (payload) => {
      await postData('enfermeria/dietas/', {
        ...payload,
        admision: admisionId
      });
      await fetchDietas();
    },
    [admisionId, fetchDietas]
  );

  const deleteDieta = useCallback(
    async (id) => {
      await deleteData(`enfermeria/dietas/${id}/`);
      await fetchDietas();
    },
    [fetchDietas]
  );

  const createEvolucion = useCallback(
    async (payload) => {
      await postData('enfermeria/evoluciones/', {
        ...payload,
        admision: admisionId
      });
      await fetchEvoluciones();
    },
    [admisionId, fetchEvoluciones]
  );

  const updateEvolucion = useCallback(
    async (id, payload) => {
      await patchData(`enfermeria/evoluciones/${id}/`, payload);
      await fetchEvoluciones();
    },
    [fetchEvoluciones]
  );

  const deleteEvolucion = useCallback(
    async (id) => {
      await deleteData(`enfermeria/evoluciones/${id}/`);
      await fetchEvoluciones();
    },
    [fetchEvoluciones]
  );

  const createOrden = useCallback(
    async (payload) => {
      await postData('enfermeria/ordenes-medicas/', {
        ...payload,
        admision: admisionId
      });
      await fetchOrdenes();
    },
    [admisionId, fetchOrdenes]
  );

  const updateOrden = useCallback(
    async (id, payload) => {
      await patchData(`enfermeria/ordenes-medicas/${id}/`, payload);
      await fetchOrdenes();
    },
    [fetchOrdenes]
  );

  const deleteOrden = useCallback(
    async (id) => {
      await deleteData(`enfermeria/ordenes-medicas/${id}/`);
      await fetchOrdenes();
    },
    [fetchOrdenes]
  );

  const crearEventoOrden = useCallback(
    async (ordenId, payload) => {
      await postData(`enfermeria/ordenes-medicas/${ordenId}/evento/`, payload);
      await fetchOrdenes();
    },
    [fetchOrdenes]
  );

  const value = useMemo(
    () => ({
      loading,
      error,
      refreshAll,
      historia,
      historiaActions: {
        save: saveHistoria
      },
      medicos: {
        items: medicos,
        refresh: fetchMedicos,
        create: createMedico,
        update: updateMedico,
        remove: deleteMedico
      },
      signosEmergencia: {
        items: signosEmergencia,
        refresh: fetchSignosEmergencia,
        create: createSignoEmergencia,
        remove: deleteSignoEmergencia
      },
      signosEncamamiento: {
        items: signosEncamamiento,
        refresh: fetchSignosEncamamiento,
        create: createSignoEncamamiento,
        update: updateSignoEncamamiento,
        remove: deleteSignoEncamamiento
      },
      antecedentes: {
        items: antecedentes,
        refresh: fetchAntecedentes,
        create: createAntecedente,
        update: updateAntecedente,
        remove: deleteAntecedente
      },
      controles: {
        items: controles,
        refresh: fetchControles,
        create: createControl,
        update: updateControl,
        remove: deleteControl,
        createRegistro: createControlRegistro,
        updateRegistro: updateControlRegistro
      },
      notas: {
        items: notas,
        refresh: fetchNotas,
        create: createNota,
        update: updateNota,
        remove: deleteNota
      },
      dietas: {
        items: dietas,
        refresh: fetchDietas,
        create: createDieta,
        remove: deleteDieta
      },
      solicitudes: {
        items: solicitudes,
        refresh: fetchSolicitudes,
        create: createSolicitudMedicamento,
        update: updateSolicitudMedicamento,
        enviar: enviarSolicitudMedicamento,
        marcarPendienteRecibir: marcarPendienteRecibirSolicitud,
        recibir: recibirSolicitudMedicamento,
        cargarEstadoCuenta: cargarSolicitudEstadoCuenta,
        anular: anularSolicitudMedicamento,
        devolverItem: devolverItemSolicitud
      },
      ingestaExcreta: {
        items: ingestaExcreta,
        refresh: fetchIngestaExcreta,
        create: createIngestaRegistro,
        update: updateIngestaRegistro
      },
      evoluciones: {
        items: evoluciones,
        refresh: fetchEvoluciones,
        create: createEvolucion,
        update: updateEvolucion,
        remove: deleteEvolucion
      },
      ordenes: {
        items: ordenes,
        refresh: fetchOrdenes,
        create: createOrden,
        update: updateOrden,
        remove: deleteOrden,
        crearEvento: crearEventoOrden
      }
    }),
    [
      loading,
      error,
      refreshAll,
      historia,
      medicos,
      signosEmergencia,
      signosEncamamiento,
      antecedentes,
      controles,
      notas,
      dietas,
      solicitudes,
      ingestaExcreta,
      evoluciones,
      ordenes,
      fetchMedicos,
      createMedico,
      updateMedico,
      deleteMedico,
      fetchSignosEmergencia,
      createSignoEmergencia,
      deleteSignoEmergencia,
      fetchSignosEncamamiento,
      createSignoEncamamiento,
      updateSignoEncamamiento,
      deleteSignoEncamamiento,
      fetchAntecedentes,
      createAntecedente,
      updateAntecedente,
      deleteAntecedente,
      fetchControles,
      createControl,
      updateControl,
      deleteControl,
      createControlRegistro,
      updateControlRegistro,
      fetchNotas,
      createNota,
      updateNota,
      deleteNota,
      fetchDietas,
      createDieta,
      deleteDieta,
      fetchSolicitudes,
      createSolicitudMedicamento,
      updateSolicitudMedicamento,
      enviarSolicitudMedicamento,
      marcarPendienteRecibirSolicitud,
      recibirSolicitudMedicamento,
      cargarSolicitudEstadoCuenta,
      anularSolicitudMedicamento,
      devolverItemSolicitud,
      fetchIngestaExcreta,
      createIngestaRegistro,
      updateIngestaRegistro,
      fetchEvoluciones,
      createEvolucion,
      updateEvolucion,
      deleteEvolucion,
      fetchOrdenes,
      createOrden,
      updateOrden,
      deleteOrden,
      crearEventoOrden,
      saveHistoria
    ]
  );

  return value;
};
