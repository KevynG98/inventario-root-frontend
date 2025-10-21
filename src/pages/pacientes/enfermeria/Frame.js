import React, { useEffect, useMemo, useState } from 'react';
import { menu } from './pages';
import {
  getStoredSelection,
  subscribeSelection
} from './patientStore';
import { useEnfermeriaData } from './useEnfermeriaData';

const buildMenuMap = (items, acc = new Map()) => {
  if (!Array.isArray(items)) {
    return acc;
  }

  items.forEach((item) => {
    if (item?.key) {
      acc.set(item.key, item);
    }
    if (item?.children && item.children.length > 0) {
      buildMenuMap(item.children, acc);
    }
  });

  return acc;
};

const menuMap = buildMenuMap(menu);

const styles = {
  wrapper: {
    minHeight: '100vh',
    padding: '2rem',
    backgroundColor: '#f6f7fb'
  },
  card: {
    margin: '0 auto',
    maxWidth: '920px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 20px 50px rgba(15, 23, 42, 0.08)',
    padding: '2.5rem 3rem'
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: 700,
    marginBottom: '1rem',
    color: '#1f2937'
  },
  subtitle: {
    color: '#6b7280',
    marginBottom: '1.5rem',
    lineHeight: 1.6
  },
  tone: {
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: '0.95rem',
    color: '#2563eb',
    backgroundColor: 'rgba(37, 99, 235, 0.08)',
    padding: '0.35rem 0.75rem',
    borderRadius: '999px',
    fontWeight: 600,
    letterSpacing: '0.02em'
  }
};

const defaultView = {
  label: 'Vista no disponible',
  description:
    'Todavía no se ha configurado contenido para esta sección. Consulta con el equipo de producto para definir los requisitos.'
};

const formatDateValue = (value) => {
  if (!value) {
    return '';
  }

  const date =
    value instanceof Date ? value : new Date(typeof value === 'number' ? value * 1000 : value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();

  return `${dd}/${mm}/${yyyy}`;
};

const buildFullName = (person = {}) =>
  [
    person.primer_nombre,
    person.segundo_nombre,
    person.primer_apellido,
    person.segundo_apellido,
    person.apellido_casada
  ]
    .filter(Boolean)
    .join(' ')
    .trim();

const mapDetailToInfoPaciente = (detail, summary) => {
  if (!detail && !summary) {
    return null;
  }

  const paciente = detail?.paciente ?? {};
  const acompanantes = Array.isArray(detail?.acompanantes)
    ? detail.acompanantes
    : [];

  const principalAcompanante =
    acompanantes.find((item) => item?.responsable_cuenta) ??
    acompanantes[0] ??
    null;

  const telefonoPaciente =
    paciente.telefono1 ??
    paciente.telefono2 ??
    paciente.telefono ??
    paciente.telefono_casa ??
    paciente.telefono_oficina ??
    '';

  const acompananteNombre =
    principalAcompanante?.nombre ??
    buildFullName(principalAcompanante ?? {}) ??
    '';

  return {
    paciente: {
      fechaNacimiento: formatDateValue(paciente.fecha_nacimiento),
      religion: paciente.religion ?? '',
      direccion: paciente.direccion ?? '',
      telefono: telefonoPaciente,
      tipoIdentificacion: paciente.tipo_identificacion ?? '',
      numeroIdentificacion: paciente.numero_identificacion ?? '',
      correo: paciente.correo ?? '',
      nit: paciente.nit ?? ''
    },
    acompanante: principalAcompanante
      ? {
          parentesco:
            principalAcompanante.parentesco ??
            principalAcompanante.tipo ??
            principalAcompanante.relacion ??
            '',
          nombre: acompananteNombre,
          correo:
            principalAcompanante.correo ??
            principalAcompanante.correo_contacto ??
            principalAcompanante.correo_empresa ??
            principalAcompanante.email ??
            '',
          telefono:
            principalAcompanante.telefono ??
            principalAcompanante.telefono_contacto ??
            principalAcompanante.telefono_empresa ??
            principalAcompanante.telefono1 ??
            principalAcompanante.telefono2 ??
            ''
        }
      : null,
    raw: detail,
    summary
  };
};

const PacientesEnfermeriaFrame = ({ match }) => {
  const viewKey = match?.params?.view;
  const entry = menuMap.get(viewKey) ?? defaultView;
  const [storedSelection, setStoredSelection] = useState(() => getStoredSelection());

  useEffect(() => {
    const unsubscribe = subscribeSelection((nextState) => {
      setStoredSelection(nextState);
    });

    // Sincroniza en caliente por si se actualizó antes de montar el listener
    setStoredSelection(getStoredSelection());

    return unsubscribe;
  }, []);

  const resolvedAdmissionId = useMemo(() => {
    const summary = storedSelection?.summary;
    if (!summary) {
      return null;
    }
    const raw = summary.admissionId ?? summary.admissionNumber ?? summary.admission;
    if (!raw) {
      return null;
    }
    const parsed = Number(raw);
    return Number.isNaN(parsed) ? null : parsed;
  }, [storedSelection]);

  const enfermeriaData = useEnfermeriaData(resolvedAdmissionId);

  const infoPacienteValue = useMemo(
    () =>
      viewKey === 'informacion-paciente'
        ? {
            data: mapDetailToInfoPaciente(
              storedSelection?.detail,
              storedSelection?.summary
            )
          }
        : undefined,
    [storedSelection, viewKey]
  );

  const medicosValue = useMemo(
    () => ({
      items: enfermeriaData.medicos.items,
      loading: enfermeriaData.loading,
      error: enfermeriaData.error,
      onCreate: enfermeriaData.medicos.create,
      onUpdate: enfermeriaData.medicos.update,
      onRemove: enfermeriaData.medicos.remove,
      refresh: enfermeriaData.medicos.refresh
    }),
    [enfermeriaData]
  );

  const historiaValue = useMemo(
    () => ({
      loading: enfermeriaData.loading,
      error: enfermeriaData.error,
      historia: enfermeriaData.historia,
      save: enfermeriaData.historiaActions.save
    }),
    [enfermeriaData]
  );

  const signosEmergenciaValue = useMemo(
    () => ({
      items: enfermeriaData.signosEmergencia.items,
      loading: enfermeriaData.loading,
      error: enfermeriaData.error,
      create: enfermeriaData.signosEmergencia.create,
      remove: enfermeriaData.signosEmergencia.remove,
      refresh: enfermeriaData.signosEmergencia.refresh
    }),
    [enfermeriaData]
  );

  const signosEncamamientoValue = useMemo(
    () => ({
      items: enfermeriaData.signosEncamamiento.items,
      loading: enfermeriaData.loading,
      error: enfermeriaData.error,
      create: enfermeriaData.signosEncamamiento.create,
      remove: enfermeriaData.signosEncamamiento.remove,
      refresh: enfermeriaData.signosEncamamiento.refresh
    }),
    [enfermeriaData]
  );

  const antecedentesValue = useMemo(
    () => ({
      records: enfermeriaData.antecedentes.items,
      loading: enfermeriaData.loading,
      error: enfermeriaData.error,
      create: enfermeriaData.antecedentes.create,
      update: enfermeriaData.antecedentes.update,
      remove: enfermeriaData.antecedentes.remove,
      refresh: enfermeriaData.antecedentes.refresh
    }),
    [enfermeriaData]
  );

  const controlesValue = useMemo(
    () => ({
      items: enfermeriaData.controles.items,
      loading: enfermeriaData.loading,
      error: enfermeriaData.error,
      create: enfermeriaData.controles.create,
      update: enfermeriaData.controles.update,
      remove: enfermeriaData.controles.remove,
      createRegistro: enfermeriaData.controles.createRegistro,
      updateRegistro: enfermeriaData.controles.updateRegistro,
      refresh: enfermeriaData.controles.refresh
    }),
    [enfermeriaData]
  );

  const notasValue = useMemo(
    () => ({
      items: enfermeriaData.notas.items,
      loading: enfermeriaData.loading,
      error: enfermeriaData.error,
      create: enfermeriaData.notas.create,
      update: enfermeriaData.notas.update,
      remove: enfermeriaData.notas.remove,
      refresh: enfermeriaData.notas.refresh
    }),
    [enfermeriaData]
  );

  const dietasValue = useMemo(
    () => ({
      items: enfermeriaData.dietas.items,
      loading: enfermeriaData.loading,
      error: enfermeriaData.error,
      create: enfermeriaData.dietas.create,
      remove: enfermeriaData.dietas.remove,
      refresh: enfermeriaData.dietas.refresh
    }),
    [enfermeriaData]
  );

  const ordenesValue = useMemo(
    () => ({
      items: enfermeriaData.ordenes.items,
      loading: enfermeriaData.loading,
      error: enfermeriaData.error,
      create: enfermeriaData.ordenes.create,
      update: enfermeriaData.ordenes.update,
      remove: enfermeriaData.ordenes.remove,
      crearEvento: enfermeriaData.ordenes.crearEvento,
      refresh: enfermeriaData.ordenes.refresh
    }),
    [enfermeriaData]
  );

  const bindings = useMemo(
    () => ({
      'informacion-paciente': infoPacienteValue,
      'medico-tratante': medicosValue,
      'historia-enfermedad': historiaValue,
      'signos-vitales-emergencia': signosEmergenciaValue,
      'signos-vitales-encamamiento': signosEncamamientoValue,
      'antecedentes': antecedentesValue,
      'control-medicamento': controlesValue,
      'notas-enfermeria': notasValue,
      'dietas': dietasValue,
      'seguimiento-ordenes-medicas': ordenesValue,
      'solicitud-medicamentos': ordenesValue,
      'laboratorios': {},
      'imagenes': {},
      'evolucion': {},
      'ingesta-excreta': {}
    }),
    [
      infoPacienteValue,
      medicosValue,
      historiaValue,
      signosEmergenciaValue,
      signosEncamamientoValue,
      antecedentesValue,
      controlesValue,
      notasValue,
      dietasValue,
      ordenesValue
    ]
  );

  if (entry.component) {
    const Component = entry.component;
    const componentProps = {};
    if (bindings[viewKey]) {
      componentProps.value = bindings[viewKey];
    }
    return <Component {...componentProps} />;
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.tone}>Módulo de Enfermería</div>
        <h1 style={styles.title}>{entry.label}</h1>
        <p style={styles.subtitle}>
          {entry.description ?? defaultView.description}
        </p>
        {entry.component ? <entry.component /> : null}
      </div>
    </div>
  );
};

export default PacientesEnfermeriaFrame;
