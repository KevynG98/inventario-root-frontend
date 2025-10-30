import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Card, Badge, Button, Table, Form, Spinner, Alert } from 'react-bootstrap';
import { getData } from '../../../apiService';

const todayISO = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const asArray = (data) => {
  if (!data) {
    return [];
  }
  if (Array.isArray(data)) {
    return data;
  }
  if (Array.isArray(data.results)) {
    return data.results;
  }
  return [];
};

const formatDateTime = (value) => {
  if (!value) return '—';
  try {
    return new Intl.DateTimeFormat('es-GT', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(new Date(value));
  } catch (error) {
    return value;
  }
};

const toLocalISODate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const joinNameParts = (source) => {
  if (!source || typeof source !== 'object') {
    return null;
  }
  const nameKeys = [
    'primer_nombre',
    'segundo_nombre',
    'tercer_nombre',
    'primer_apellido',
    'segundo_apellido',
    'apellido_casada'
  ];
  const pieces = nameKeys
    .map((key) => {
      const value = source[key];
      if (typeof value === 'string') {
        const trimmed = value.trim();
        return trimmed.length > 0 ? trimmed : null;
      }
      return null;
    })
    .filter(Boolean);

  if (pieces.length > 0) {
    return pieces.join(' ');
  }

  return null;
};

const coerceToString = (value, visited = new WeakSet()) => {
  if (value == null) {
    return null;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  if (Array.isArray(value)) {
    const joined = value
      .map((entry) => coerceToString(entry, visited))
      .filter(Boolean)
      .join(' ');
    return joined.length > 0 ? joined : null;
  }

  if (typeof value === 'object') {
    if (visited.has(value)) {
      return null;
    }
    visited.add(value);

    const name = joinNameParts(value);
    if (name) {
      return name;
    }

    const candidateKeys = [
      'nombre_completo',
      'nombre',
      'nombre_area',
      'nombre_corto',
      'detalle',
      'descripcion',
      'texto',
      'label',
      'value',
      'titulo',
      'codigo',
      'codigo_cama',
      'numero'
    ];

    for (const key of candidateKeys) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        const resolved = coerceToString(value[key], visited);
        if (resolved) {
          return resolved;
        }
      }
    }

    if (Object.prototype.hasOwnProperty.call(value, 'id')) {
      const identifier = value.id;
      if (typeof identifier === 'number' || typeof identifier === 'string') {
        return String(identifier);
      }
    }

    return null;
  }

  return null;
};

const safeText = (value, fallback = '—') => coerceToString(value) ?? fallback;

const pickFirstMeaningful = (values, fallback = '—') => {
  for (const candidate of values) {
    const text = coerceToString(candidate);
    if (text) {
      return text;
    }
  }
  return fallback;
};

const fetchAllPaginated = async (initialUrl) => {
  let results = [];
  let next = initialUrl;
  const visited = new Set();

  while (next && !visited.has(next)) {
    visited.add(next);
    const response = await getData(next);
    const data = response?.data ?? {};
    const items = asArray(data);
    results = results.concat(items);
    next = data.next || null;
  }

  return results;
};

const DietasMonitorContent = () => {
  const [filterDate, setFilterDate] = useState(todayISO());
  const [remoteDietas, setRemoteDietas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);
  const pollRef = useRef(null);

  const listarRemotas = useCallback(async () => {
    if (!isMounted.current) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const registros = await fetchAllPaginated('enfermeria/dietas/?page_size=200');
      const filtered = registros.filter((registro) => {
        const registrado = toLocalISODate(registro?.registrado_en);
        return registrado === filterDate;
      });
      if (!isMounted.current) {
        return;
      }
      const admisionIds = Array.from(
        new Set(
          filtered
            .map((item) => item?.admision)
            .filter((value) => value !== null && value !== undefined)
        )
      );

      const cache = new Map();
      await Promise.all(
        admisionIds.map(async (admisionId) => {
          try {
            const response = await getData(`admisiones/${admisionId}/`);
            cache.set(admisionId, response?.data ?? null);
          } catch (err) {
            console.warn('No se pudo cargar la admisión', admisionId, err);
            cache.set(admisionId, null);
          }
        })
      );

      const enriched = filtered
        .map((item) => ({
          ...item,
          admisionDetalle: cache.get(item.admision) ?? null
        }))
        .sort((a, b) => {
          const dateA = a.registrado_en ? new Date(a.registrado_en) : 0;
          const dateB = b.registrado_en ? new Date(b.registrado_en) : 0;
          return dateB - dateA;
        });

      setRemoteDietas(enriched);
    } catch (err) {
      console.error('Error obteniendo dietas del backend', err);
      if (isMounted.current) {
        setError('No se pudieron cargar las dietas registradas por enfermería.');
        setRemoteDietas([]);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [filterDate]);

  useEffect(() => {
    isMounted.current = true;
    listarRemotas();

    if (pollRef.current) {
      clearInterval(pollRef.current);
    }

    pollRef.current = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
        return;
      }
      listarRemotas();
    }, 60 * 60 * 1000); // cada hora

    return () => {
      isMounted.current = false;
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [listarRemotas]);

  const handleDateChange = (event) => {
    const next = event?.target ? event.target.value : '';
    setFilterDate(next);
  };

  const infoPaciente = (detalle) => {
    if (!detalle) {
      return {
        paciente: '—',
        area: '—',
        habitacion: '—',
        motivo: '—'
      };
    }

    const nombre = pickFirstMeaningful(
      [
        detalle.paciente,
        detalle.paciente_detalle,
        detalle.paciente_info,
        detalle.nombre_paciente
      ],
      '—'
    );

    const area = pickFirstMeaningful(
      [detalle.area, detalle.area_nombre, detalle.area_atencion],
      '—'
    );

    const habitacion = pickFirstMeaningful(
      [detalle.habitacion, detalle.habitacion_nombre, detalle.cubiculo, detalle.cama],
      '—'
    );

    const motivo = pickFirstMeaningful(
      [detalle.motivo_consulta, detalle.motivo_ingreso, detalle.sintoma],
      '—'
    );

    return {
      paciente: nombre,
      area,
      habitacion,
      motivo
    };
  };

  return (
    <div className="p-3">
      <Card className="mb-3">
        <Card.Body className="d-flex flex-column flex-lg-row align-items-lg-end gap-3">
          <div>
            <Card.Title className="mb-1">Dietas registradas por enfermería</Card.Title>
            <Card.Subtitle className="text-muted">
              Selecciona la fecha para visualizar en tiempo real las dietas capturadas.
            </Card.Subtitle>
          </div>
          <Form className="d-flex flex-column flex-sm-row align-items-sm-center gap-2 ms-lg-auto">
            <Form.Group controlId="filter-date" className="mb-0">
              <Form.Label className="mb-0 small text-muted">Fecha</Form.Label>
              <Form.Control type="date" value={filterDate} onChange={handleDateChange} />
            </Form.Group>
            <Button variant="primary" onClick={listarRemotas} disabled={loading}>
              {loading ? 'Actualizando…' : 'Buscar'}
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {error ? (
        <Alert variant="danger">{error}</Alert>
      ) : null}

      <Card>
        <Card.Header className="bg-white border-0 d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-0">Registros del día</h5>
            <small className="text-muted">
              Sólo se muestran las dietas registradas el {filterDate}.
            </small>
          </div>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={listarRemotas}
            disabled={loading}
          >
            {loading ? 'Sincronizando…' : 'Refrescar'}
          </Button>
        </Card.Header>
        <Card.Body className="p-0">
          {loading && remoteDietas.length === 0 ? (
            <div className="d-flex justify-content-center py-5">
              <Spinner animation="border" />
            </div>
          ) : remoteDietas.length === 0 ? (
            <div className="text-center py-5 text-muted">
              No hay dietas registradas para esta fecha.
            </div>
          ) : (
            <div className="table-responsive">
              <Table bordered hover size="sm" className="mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Admisión</th>
                    <th>Paciente</th>
                    <th>Área</th>
                    <th>Habitación/Cubículo</th>
                    <th>Síntoma</th>
                    <th>Dieta</th>
                    <th>Observaciones</th>
                    <th>Registrado</th>
                  </tr>
                </thead>
                <tbody>
                  {remoteDietas.map((registro) => {
                    const detalle = infoPaciente(registro.admisionDetalle);
                    const admisionLabel = safeText(registro.admision);
                    const tiempoLabel = safeText(registro.tiempo);
                    const dietaLabel = safeText(registro.dieta);
                    const observacionesLabel = safeText(registro.observaciones);
                    const rowKey =
                      registro.id ??
                      `${admisionLabel || 'adm'}-${registro.registrado_en || 'sin-fecha'}`;
                    return (
                      <tr key={`dieta-${rowKey}`}>
                        <td>{admisionLabel}</td>
                        <td>{detalle.paciente}</td>
                        <td>{detalle.area}</td>
                        <td>{detalle.habitacion}</td>
                        <td>{detalle.motivo}</td>
                        <td>
                          <Badge bg="primary" className="text-uppercase">
                            {tiempoLabel}
                          </Badge>
                          <div className="mt-1">
                            {dietaLabel}
                          </div>
                        </td>
                        <td style={{ whiteSpace: 'pre-line' }}>
                          {observacionesLabel}
                        </td>
                        <td>{formatDateTime(registro.registrado_en)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

const DietasMonitor = () => (
  <div className="p-3">
    <DietasMonitorContent />
  </div>
);

export default DietasMonitor;
