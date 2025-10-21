import React, { useMemo } from 'react';
import { Badge, Button, Card, Table } from 'react-bootstrap';
import { useSignosVitalesEmergenciaContext } from './Context';

const formatDateTime = (iso) => {
  if (!iso) return 'N/D';
  try {
    const date = new Date(iso);
    return new Intl.DateTimeFormat('es-GT', {
      dateStyle: 'short',
      timeStyle: 'medium'
    }).format(date);
  } catch (error) {
    return iso;
  }
};

const SignosVitalesEmergenciaList = () => {
  const { records, loading, error, removeMeasurement } =
    useSignosVitalesEmergenciaContext();
  const totalSessions = useMemo(() => records.length, [records]);

  return (
    <Card className="shadow-sm border-0">
      <Card.Header className="bg-white border-0 d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <h4 className="mb-0">Historial de signos vitales</h4>
          <small className="text-muted">
            Cada registro agrupa los signos tomados en una misma sesión de
            emergencia.
          </small>
        </div>
        <Badge bg="primary" pill>
          {totalSessions} {totalSessions === 1 ? 'toma' : 'tomas'}
        </Badge>
      </Card.Header>
      <Card.Body className="p-0">
        {error ? (
          <div className="p-4 text-center text-danger">{error}</div>
        ) : null}
        {loading && records.length === 0 ? (
          <div className="p-4 text-center text-muted">
            Cargando signos vitales...
          </div>
        ) : null}
        {records.length === 0 ? (
          !loading && !error ? (
          <div className="p-4 text-center text-muted">
            Todavía no hay signos registrados. Usa el formulario para crear la
            primera toma.
          </div>
          ) : null
        ) : (
          <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead>
                <tr>
                  <th style={{ minWidth: '160px' }}>Fecha y hora</th>
                  <th>Signo</th>
                  <th style={{ minWidth: '150px' }}>Valor</th>
                  <th>Comentario</th>
                  <th style={{ minWidth: '200px' }}>Tomado por</th>
                  <th className="text-end" style={{ minWidth: '120px' }}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => {
                  const measurements = record.measurements ?? [];
                  return measurements.map((measurement, index) => (
                    <tr key={`${record.id}-${measurement.id}`}>
                      {index === 0 ? (
                        <td rowSpan={measurements.length}>
                          {formatDateTime(record.timestamp)}
                        </td>
                      ) : null}
                      <td>{measurement.label}</td>
                      <td>
                        {measurement.value}{' '}
                        {measurement.unit ? (
                          <span className="text-muted">{measurement.unit}</span>
                        ) : null}
                      </td>
                      <td>{measurement.comment || '—'}</td>
                      {index === 0 ? (
                        <>
                          <td rowSpan={measurements.length}>
                            {record.takenBy}
                          </td>
                          <td rowSpan={measurements.length} className="text-end">
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => removeMeasurement?.(record.id)}
                            >
                              Eliminar
                            </Button>
                          </td>
                        </>
                      ) : null}
                    </tr>
                  ));
                })}
              </tbody>
            </Table>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default SignosVitalesEmergenciaList;
