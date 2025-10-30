
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { getData, postData, putData } from '../../../apiService';

const SolicitudesContext = createContext(null);
export const useSolicitudesContext = () => useContext(SolicitudesContext);

const initialState = {
  solicitudes: [],
  filtros: {
    fecha: new Date().toISOString().slice(0, 10),
    bodega: '',
    estatus: 'Nueva',
  },
  modal: {
    show: false,
    mode: 'ver',
    data: null,
  },
};

export const SolicitudesProvider = ({ children }) => {
  const [state, setState] = useState(initialState);

  const fetchSolicitudes = useCallback(async () => {
    const { fecha, bodega, estatus } = state.filtros;
    let url = `enfermeria/solicitudes-medicamentos/?fecha=${fecha}&estatus=${estatus}`;
    if (bodega) {
      url += `&bodega=${bodega}`;
    }
    try {
      const response = await getData(url);
      setState((prevState) => ({
        ...prevState,
        solicitudes: response.data.results,
      }));
    } catch (error) {
      console.error('Error fetching solicitudes:', error);
    }
  }, [state.filtros]);

  useEffect(() => {
    fetchSolicitudes();
  }, [fetchSolicitudes]);

  const setFiltros = (filtros) => {
    setState((prevState) => ({ ...prevState, filtros }));
  };

  const openModal = (mode, data) => {
    setState((prevState) => ({
      ...prevState,
      modal: { show: true, mode, data },
    }));
  };

  const closeModal = () => {
    setState((prevState) => ({ ...prevState, modal: { ...prevState.modal, show: false } }));
  };

  const handleChangeDetalle = (index, field, value) => {
    const { data } = state.modal;
    const newDetalle = [...data.detalle];
    newDetalle[index][field] = value;
    setState((prevState) => ({
      ...prevState,
      modal: { ...prevState.modal, data: { ...data, detalle: newDetalle } },
    }));
  };

  const guardarEdicion = async () => {
    const { data } = state.modal;
    try {
      await putData(`enfermeria/solicitudes-medicamentos/${data.id}/`, data);
      fetchSolicitudes();
      closeModal();
    } catch (error) {
      console.error('Error updating solicitud:', error);
    }
  };

  const enviarSolicitud = async () => {
    const { data } = state.modal;
    try {
      await postData(`enfermeria/solicitudes-medicamentos/${data.id}/enviar/`);
      fetchSolicitudes();
      closeModal();
    } catch (error) {
      console.error('Error sending solicitud:', error);
    }
  };

  const value = useMemo(
    () => ({
      ...state,
      setFiltros,
      openModal,
      closeModal,
      handleChangeDetalle,
      guardarEdicion,
      enviarSolicitud,
    }),
    [state]
  );

  return (
    <SolicitudesContext.Provider value={value}>
      {children}
    </SolicitudesContext.Provider>
  );
};
