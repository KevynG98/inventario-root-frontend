import React from 'react';
import { Badge, Button, Card } from 'react-bootstrap';
import { useNotasEnfermeriaContext } from './Context';

const NotasEnfermeriaList = () => {
  const { title, notas, loading, error, setMode, setActive, handlers } =
    useNotasEnfermeriaContext();

  return (
    <Card className="shadow-sm border-0">
      <Card.Header className="bg-white border-0 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <div>
          <h4 className="mb-0">{title}</h4>
          <small className="text-muted">
            Registro cronológico de notas por turno.
          </small>
        </div>
        <Button onClick={() => setMode('CREATE')}>Nueva nota</Button>
      </Card.Header>
      <Card.Body>
        {error ? (
          <div className="text-danger text-center py-3">{error}</div>
        ) : null}
        {loading && notas.length === 0 ? (
          <div className="text-muted text-center py-3">Cargando notas…</div>
        ) : null}
        {notas.length === 0 && !loading ? (
          <div className="text-muted text-center py-3">
            Aún no hay notas registradas.
          </div>
        ) : null}
        <div className="d-flex flex-column gap-3">
          {notas.map((nota) => (
            <Card key={nota.id} className="border-0 shadow-sm">
              <Card.Body>
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-3 mb-2">
                  <div>
                    <Badge bg="light" text="dark" className="me-2">
                      {nota.turno}
                    </Badge>
                    <Badge bg={nota.estado === 'CERRADA' ? 'secondary' : 'primary'}>
                      {nota.estado}
                    </Badge>
                  </div>
                  <div className="text-end small text-muted">
                    <div>Autor: {nota.autor || '—'}</div>
                    <div>Registrado: {nota.creadoEnLabel}</div>
                    {nota.actualizadoEnLabel ? (
                      <div>Actualizado: {nota.actualizadoEnLabel}</div>
                    ) : null}
                  </div>
                </div>
                <div className="bg-light-subtle border rounded p-3" style={{ whiteSpace: 'pre-line' }}>
                  {nota.contenido || '—'}
                </div>
                <div className="d-flex justify-content-end gap-2 mt-3">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => {
                      setActive(nota);
                      setMode('EDIT');
                    }}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => {
                      if (
                        typeof handlers.remove === 'function' &&
                        window.confirm('¿Eliminar esta nota?')
                      ) {
                        handlers.remove(nota.id);
                      }
                    }}
                  >
                    Eliminar
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};

export default NotasEnfermeriaList;
