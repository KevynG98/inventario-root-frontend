import React, { createContext, useContext, useCallback, useEffect, useMemo, useState } from 'react';
import {
  getData,
  postData,
  putData,
  patchData,
  deleteData
} from '../../../apiService';

const OperacionesContext = createContext();
export const useOperacionesContext = () => useContext(OperacionesContext);

export const OperacionesProvider = ({ children }) => {
  const [mode, setMode] = useState('list'); // list | form | detail
  const [operaciones, setOperaciones] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filters, setFilters] = useState({
    fecha: '',
    estatus: '',
    especialidad: ''
  });

  const catalogs = {
    dias: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
    horas: ['7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'],
    especialidades: ['Cirugía General', 'Pediatría', 'Ginecología', 'Traumatología'],
    seguros: ['Particular', 'IGSS', 'Seguro Universitario']
  };

  const [form, setForm] = useState({
    id: null,
    fecha: '',
    dia: '',
    hora: '',
    paciente: '',
    edad: '',
    especialidad: '',
    procedimiento: '',
    cirujano1: '',
    cirujano2: '',
    cirujano3: '',
    anestesiologo: '',
    pediatra: '',
    seguro: '',
    material: '',
    comentarios: '',
    estatus: 'Programado',
    historial: []
  });

  const resetForm = () => {
    setForm({
      id: null,
      fecha: '',
      dia: '',
      hora: '',
      paciente: '',
      edad: '',
      especialidad: '',
      procedimiento: '',
      cirujano1: '',
      cirujano2: '',
      cirujano3: '',
      anestesiologo: '',
      pediatra: '',
      seguro: '',
      material: '',
      comentarios: '',
      estatus: 'Programado',
      historial: []
    });
  };

  const openNew = () => {
    resetForm();
    setMode('form');
  };

  const openEdit = useCallback((op) => {
    if (!op) return;
    setForm({
      ...op,
      historial: op.historial || []
    });
    setMode('form');
  }, []);

  const openDetail = (op) => {
    setSelected(op);
    setMode('detail');
  };

  const fetchOperaciones = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.fecha) params.append('fecha', filters.fecha);
      if (filters.estatus) params.append('estatus', filters.estatus);
      if (filters.especialidad) params.append('especialidad', filters.especialidad);
      const query = params.toString();
      const response = await getData(`operaciones/${query ? `?${query}` : ''}`);
      const data = response?.data;
      const list = Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : [];
      setOperaciones(list);
    } catch (error) {
      console.error('Error al cargar operaciones', error);
      setOperaciones([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchOperaciones();
  }, [fetchOperaciones]);

  const saveOperacion = async () => {
    setSaving(true);
    try {
      const payload = {
        fecha: form.fecha || null,
        dia: form.dia || '',
        hora: form.hora || '',
        paciente: form.paciente || '',
        edad: Number(form.edad || 0),
        especialidad: form.especialidad || '',
        procedimiento: form.procedimiento || '',
        cirujano1: form.cirujano1 || '',
        cirujano2: form.cirujano2 || null,
        cirujano3: form.cirujano3 || null,
        anestesiologo: form.anestesiologo || null,
        pediatra: form.pediatra || null,
        seguro: form.seguro || '',
        material: form.material || null,
        comentarios: form.comentarios || null,
        estatus: form.estatus || 'Programado'
      };

      if (form.id) {
        await putData(`operaciones/${form.id}/`, payload, { __skipLoader: true });
      } else {
        await postData('operaciones/', payload);
      }
      await fetchOperaciones();
      setMode('list');
      resetForm();
    } catch (error) {
      console.error('No se pudo guardar la operación', error);
    } finally {
      setSaving(false);
    }
  };

  const deleteOperacion = async (id) => {
    if (!id) return;
    try {
      await deleteData(`operaciones/${id}/`);
      await fetchOperaciones();
    } catch (error) {
      console.error('No se pudo eliminar la operación', error);
    }
  };

  const updateStatus = async (id, nuevoEstatus) => {
    if (!id || !nuevoEstatus) return;
    try {
      await patchData(`operaciones/${id}/estatus/`, { estatus: nuevoEstatus });
      await fetchOperaciones();
    } catch (error) {
      console.error('No se pudo actualizar el estatus', error);
    }
  };

  const value = {
    mode,
    setMode,
    operaciones,
    openNew,
    openEdit,
    openDetail,
    saveOperacion,
    updateStatus,
    selected,
    catalogs,
    form,
    setForm,
    loading,
    saving,
    deleteOperacion,
    filters,
    setFilters,
    refresh: fetchOperaciones
  };

  return (
    <OperacionesContext.Provider value={value}>
      {children}
    </OperacionesContext.Provider>
  );
};
