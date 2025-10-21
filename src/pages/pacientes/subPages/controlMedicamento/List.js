import React, { useMemo, useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Form,
  Row,
  Table
} from 'react-bootstrap';
import { useControlMedicamentoContext } from './Context';

const ControlMedicamentoList = () => {
  const {
    title,
    controls,
    loading,
    error,
    options,
    handlers
  } = useControlMedicamentoContext();

  const [registroDrafts, setRegistroDrafts] = useState({});

  const handleRegistroChange = (controlId, key, value) => {
    setRegistroDrafts((prev) => ({
      ...prev,
      [controlId]: {
        bloque: prev[controlId]?.bloque || '',
        estado: prev[controlId]?.estado || '',
        comentario: prev[controlId]?.comentario || '',
        [key]: value
      }
    }));
  };

  const handleRegistroSubmit = async (control) => {
    if (typeof handlers.createRegistro !== 'function') return;
    const draft = registroDrafts[control.id] || {};
    if (!draft.bloque || !draft.estado) {
      window.alert('Selecciona bloque y estado.');
      return;
    }
    await handlers.createRegistro({
      control: control.id,
      bloque: draft.bloque,
      estado: draft.estado,
      comentario: draft.comentario
    });
    setRegistroDrafts((prev) => ({ ...prev, [control.id]: undefined }));
  };

  const renderRegistroEstado = (control) => {
    const registroMap = control.registros.reduce((acc, registro) => {
      acc[registro.bloque] = registro;
      return acc;
    }, {});

    return (
      <Table size="sm" responsive className="mb-3">
        <thead>
          <tr>
            <th>Bloque</th>
            <th>Estado</th>
            <th>Comentario</th>
            <th>Registrado</th>
          </tr>
        </thead>
        <tbody>
          {options.timelineBlocks.map((bloque) => {
            const registro = registroMap[bloque];
            return (
              <tr key={`${control.id}-${bloque}`}>
                <td>{bloque}</td>
                <td>{registro?.estado ?? '—'}</td>
                <td>{registro?.comentario ?? '—'}</td>
                <td>{registro?.registradoEnLabel ?? '—'}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  };

  return (
    <Card className="shadow-sm border-0">
      <Card.Header className="bg-white border-0 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <div>
          <h4 className="mb-0">{title}</h4>
          <small className="text-muted">
            Administra los medicamentos indicados para la admisión.
          </small>
        </div>
      </Card.Header>
      <Card.Body>
        {error ? (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        ) : null}
        {loading && controls.length === 0 ? (
          <div className="text-center text-muted py-3">
            Cargando controles de medicamentos…
          </div>
        ) : null}
        {controls.length === 0 && !loading ? (
          <div className="text-center text-muted py-3">
            No hay controles registrados todavía.
          </div>
        ) : null}
        <div className="d-flex flex-column gap-4">
          {controls.map((control) => {
            const draft = registroDrafts[control.id] || {};
            return (
              <Card key={control.id} className="border-0 shadow-sm">
                <Card.Header className="bg-light d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                  <div>
                    <h5 className="mb-1">{control.medicamento}</h5>
                    <small className="text-muted">
                      Dosis: {control.dosis || '—'} · Frecuencia: {control.frecuencia || '—'} · Vía: {control.via || '—'}
                    </small>
                  </div>
                  <div className="d-flex gap-2 flex-wrap">
                    <Badge bg={control.activo ? 'success' : 'secondary'}>
                      {control.activo ? 'Activo' : 'Inactivo'}
                    </Badge>
                    {typeof handlers.remove === 'function' ? (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => {
                          if (window.confirm('¿Eliminar este control?')) {
                            handlers.remove(control.id);
                          }
                        }}
                      >
                        Eliminar
                      </Button>
                    ) : null}
                    {typeof handlers.update === 'function' ? (
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() =>
                          handlers.update(control.id, { activo: !control.activo })
                        }
                      >
                        {control.activo ? 'Desactivar' : 'Activar'}
                      </Button>
                    ) : null}
                  </div>
                </Card.Header>
                <Card.Body>
                  {control.indicaciones ? (
                    <p className="text-muted small mb-3">{control.indicaciones}</p>
                  ) : null}
                  {renderRegistroEstado(control)}
                  <Form className="border rounded p-3 bg-light-subtle">
                    <Row className="g-3 align-items-end">
                      <Col md={3}>
                        <Form.Group controlId={`registro-bloque-${control.id}`}>
                          <Form.Label>Bloque</Form.Label>
                          <Form.Control
                            as="select"
                            value={draft.bloque || ''}
                            onChange={(event) =>
                              handleRegistroChange(control.id, 'bloque', event.target.value)
                            }
                          >
                            <option value="">Seleccionar</option>
                            {options.timelineBlocks.map((bloque) => (
                              <option key={bloque} value={bloque}>
                                {bloque}
                              </option>
                            ))}
                          </Form.Control>
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group controlId={`registro-estado-${control.id}`}>
                          <Form.Label>Estado</Form.Label>
                          <Form.Control
                            as="select"
                            value={draft.estado || ''}
                            onChange={(event) =>
                              handleRegistroChange(control.id, 'estado', event.target.value)
                            }
                          >
                            <option value="">Seleccionar</option>
                            {options.timelineStates.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </Form.Control>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group controlId={`registro-comentario-${control.id}`}>
                          <Form.Label>Comentario</Form.Label>
                          <Form.Control
                            type="text"
                            value={draft.comentario || ''}
                            onChange={(event) =>
                              handleRegistroChange(control.id, 'comentario', event.target.value)
                            }
                          />
                        </Form.Group>
                      </Col>
                      <Col md={2} className="text-end">
                        <Button
                          variant="primary"
                          onClick={() => handleRegistroSubmit(control)}
                        >
                          Registrar
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </Card.Body>
              </Card>
            );
          })}
        </div>
      </Card.Body>
    </Card>
  );
};

export default ControlMedicamentoList;
