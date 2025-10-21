import React from 'react';
import { Badge, Button, Card } from 'react-bootstrap';
import { useDietasContext } from './Context';

const DietasList = () => {
  const { title, registros, loading, error, handlers } = useDietasContext();

  return (
    <Card className="shadow-sm border-0">
      <Card.Header className="bg-white border-0">
        <h4 className="mb-0">{title}</h4>
      </Card.Header>
      <Card.Body>
        {error ? (
          <div className="text-danger text-center py-3">{error}</div>
        ) : null}
        {loading && registros.length === 0 ? (
          <div className="text-muted text-center py-3">Cargando registros…</div>
        ) : null}
        {registros.length === 0 && !loading ? (
          <div className="text-muted text-center py-3">
            No hay registros de dietas todavía.
          </div>
        ) : null}
        <div className="d-flex flex-column gap-3">
          {registros.map((registro) => (
            <Card key={registro.id} className="border-0 shadow-sm">
              <Card.Body className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                <div>
                  <Badge bg="primary" className="me-2">
                    {registro.tiempo}
                  </Badge>
                  <strong>{registro.dieta}</strong>
                  <div className="small text-muted">
                    Registrado {registro.registradoEnLabel} por {registro.registrado_por || '—'}
                  </div>
                  {registro.observaciones ? (
                    <div className="mt-2 text-muted" style={{ whiteSpace: 'pre-line' }}>
                      {registro.observaciones}
                    </div>
                  ) : null}
                </div>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => {
                    if (
                      typeof handlers.remove === 'function' &&
                      window.confirm('¿Eliminar este registro de dieta?')
                    ) {
                      handlers.remove(registro.id);
                    }
                  }}
                >
                  Eliminar
                </Button>
              </Card.Body>
            </Card>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};

export default DietasList;
