import React from 'react';
import { Badge, Button, Card, Spinner } from 'react-bootstrap';
import { useEvolucionContext } from './Context';

const EvolucionList = () => {
  const {
    title,
    notes,
    loading,
    error,
    canCreate,
    startCreate,
    startView,
    startEdit,
    printNote
  } = useEvolucionContext();

  return (
    <Card className="shadow-sm border-0">
      <Card.Header className="bg-white border-0 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <div>
          <h4 className="mb-0">{title}</h4>
          <small className="text-muted">
            Registro cronológico de las evoluciones médicas del paciente.
          </small>
        </div>
        <Button
          onClick={startCreate}
          disabled={!canCreate}
          title={
            canCreate
              ? undefined
              : 'Solo los médicos pueden registrar nuevas evoluciones.'
          }
        >
          Registrar evolución
        </Button>
      </Card.Header>
      <Card.Body>
        {error ? (
          <div className="text-danger text-center py-3">{error}</div>
        ) : null}
        {loading && notes.length === 0 ? (
          <div className="text-center text-muted py-4 d-flex flex-column align-items-center gap-2">
            <Spinner animation="border" size="sm" />
            <span>Cargando evoluciones…</span>
          </div>
        ) : null}
        {!loading && notes.length === 0 ? (
          <div className="text-center text-muted py-4">
            Aún no se han registrado evoluciones para este paciente.
          </div>
        ) : null}
        <div className="d-flex flex-column gap-3">
          {notes.map((note) => {
            const colegiadoLabel = note.medicoColegiado
              ? ` · Colegiado ${note.medicoColegiado}`
              : '';
            return (
              <Card key={note.id} className="border-0 shadow-sm">
                <Card.Body className="d-flex flex-column gap-3">
                  <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
                    <div>
                      <Badge bg="light" text="dark" className="me-2">
                        {note.creadoEnLabel}
                      </Badge>
                      <Badge bg="primary" className="text-uppercase">
                        Evolución
                      </Badge>
                    </div>
                    <div className="text-md-end text-muted small">
                      <div>
                        Médico: <strong>{note.medicoNombre}</strong>
                        {colegiadoLabel}
                      </div>
                    </div>
                  </div>
                  {note.resumen ? (
                    <div className="fw-semibold text-muted">{note.resumen}</div>
                  ) : null}
                  <div
                    className="border rounded p-3 bg-light-subtle"
                    style={{ whiteSpace: 'pre-line', textAlign: 'justify' }}
                  >
                    {note.contenido || '—'}
                  </div>
                  <div className="d-flex flex-wrap justify-content-end gap-2">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => printNote(note)}
                    >
                      Imprimir
                    </Button>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => startView(note.id)}
                    >
                      Ver
                    </Button>
                    {note.canEdit ? (
                      <Button
                        variant="outline-success"
                        size="sm"
                        onClick={() => startEdit(note.id)}
                      >
                        Editar
                      </Button>
                    ) : null}
                  </div>
                </Card.Body>
              </Card>
            );
          })}
        </div>
      </Card.Body>
    </Card>
  );
};

export default EvolucionList;
