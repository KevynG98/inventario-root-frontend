import React from 'react';
import { Badge, Button, Card, Form } from 'react-bootstrap';
import { useSeguimientoOrdenesContext } from './Context';

const SeguimientoOrdenesList = () => {
  const { ordenes, loading, error, estados, handlers } =
    useSeguimientoOrdenesContext();

  return (
    <Card className="shadow-sm border-0">
      <Card.Header className="bg-white border-0">
        <h4 className="mb-0">Órdenes activas</h4>
      </Card.Header>
      <Card.Body>
        {error ? (
          <div className="text-danger text-center py-3">{error}</div>
        ) : null}
        {loading && ordenes.length === 0 ? (
          <div className="text-muted text-center py-3">Cargando órdenes…</div>
        ) : null}
        {ordenes.length === 0 && !loading ? (
          <div className="text-muted text-center py-3">
            No hay órdenes registradas.
          </div>
        ) : null}
        <div className="d-flex flex-column gap-3">
          {ordenes.map((orden) => (
            <Card key={orden.id} className="border-0 shadow-sm">
              <Card.Body className="d-flex flex-column gap-2">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-3">
                  <div>
                    <h5 className="mb-1">{orden.titulo}</h5>
                    <div className="text-muted small">
                      Creada {orden.creadoEnLabel}
                      {orden.cerradoEnLabel ? ` · Cerrada ${orden.cerradoEnLabel}` : ''}
                    </div>
                    {orden.descripcion ? (
                      <p className="mb-0" style={{ whiteSpace: 'pre-line' }}>
                        {orden.descripcion}
                      </p>
                    ) : null}
                  </div>
                  <div className="d-flex flex-column align-items-end gap-2">
                    <Badge bg="info" text="dark">
                      Prioridad {orden.prioridad}
                    </Badge>
                    <Badge
                      bg={orden.estado === 'FINALIZADA' ? 'success' : 'primary'}
                      className="text-uppercase"
                    >
                      {orden.estado}
                    </Badge>
                    <div className="d-flex gap-2">
                      {typeof handlers.remove === 'function' ? (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => {
                            if (window.confirm('¿Eliminar esta orden?')) {
                              handlers.remove(orden.id);
                            }
                          }}
                        >
                          Eliminar
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="border rounded p-3 bg-light-subtle">
                  <h6 className="mb-3">Actualizar estado</h6>
                  <Form
                    className="d-flex flex-column flex-md-row gap-3 align-items-md-end"
                    onSubmit={async (event) => {
                      event.preventDefault();
                      const formData = new FormData(event.currentTarget);
                      const estado = formData.get('estado');
                      const comentario = formData.get('comentario');
                      if (!estado) {
                        window.alert('Selecciona el nuevo estado.');
                        return;
                      }
                      if (typeof handlers.crearEvento === 'function') {
                        await handlers.crearEvento(orden.id, {
                          estado,
                          comentario
                        });
                        const formElement = event.currentTarget;
                        if (
                          formElement &&
                          typeof formElement.reset === 'function'
                        ) {
                          formElement.reset();
                        }
                      }
                    }}
                  >
                    <Form.Control as="select" name="estado" defaultValue="">
                      <option value="">Seleccionar estado</option>
                      {estados.map((estado) => (
                        <option key={estado.value} value={estado.value}>
                          {estado.label}
                        </option>
                      ))}
                    </Form.Control>
                    <Form.Control
                      name="comentario"
                      type="text"
                      placeholder="Comentario opcional"
                    />
                    <Button type="submit" variant="primary">
                      Registrar evento
                    </Button>
                  </Form>
                </div>
                {orden.eventos?.length ? (
                  <div className="d-flex flex-column gap-2">
                    <h6 className="mb-2">Historial</h6>
                    {orden.eventos.map((evento) => (
                      <div
                        key={evento.id}
                        className="border rounded p-2 bg-light"
                        style={{ fontSize: '0.9rem' }}
                      >
                        <div className="d-flex justify-content-between">
                          <strong>{evento.estado}</strong>
                          <span className="text-muted">{evento.creadoEnLabel}</span>
                        </div>
                        <div className="text-muted">
                          {evento.creado_por || '—'}
                          {evento.comentario ? ` · ${evento.comentario}` : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </Card.Body>
            </Card>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};

export default SeguimientoOrdenesList;
