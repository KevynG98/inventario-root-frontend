import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useSeguimientoOrdenesContext } from './Context';

const initialState = {
  titulo: '',
  descripcion: '',
  prioridad: 'MEDIA'
};

const OrdenMedicaForm = () => {
  const { prioridades, handlers } = useSeguimientoOrdenesContext();
  const [formState, setFormState] = useState(initialState);
  const [saving, setSaving] = useState(false);

  const handleChange = (field) => (event) => {
    const { value } = event.target;
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formState.titulo?.trim()) {
      window.alert('Ingresa el título de la orden.');
      return;
    }
    if (typeof handlers.create !== 'function') {
      return;
    }
    setSaving(true);
    try {
      await handlers.create({
        titulo: formState.titulo,
        descripcion: formState.descripcion,
        prioridad: formState.prioridad,
        estado: 'ACTIVA'
      });
      setFormState(initialState);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="shadow-sm border-0 mb-4">
      <Card.Header className="bg-white border-0">
        <h4 className="mb-0">Nueva orden médica</h4>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          <Row className="g-3">
            <Col md={8}>
              <Form.Group controlId="orden-titulo">
                <Form.Label>Título</Form.Label>
                <Form.Control
                  type="text"
                  value={formState.titulo}
                  onChange={handleChange('titulo')}
                  placeholder="Descripción corta"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="orden-prioridad">
                <Form.Label>Prioridad</Form.Label>
                <Form.Control
                  as="select"
                  value={formState.prioridad}
                  onChange={handleChange('prioridad')}
                >
                  {prioridades.map((opcion) => (
                    <option key={opcion.value} value={opcion.value}>
                      {opcion.label}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Form.Group controlId="orden-descripcion">
            <Form.Label>Descripción / Indicaciones</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={formState.descripcion}
              onChange={handleChange('descripcion')}
              placeholder="Detalle la orden médica"
            />
          </Form.Group>
          <div className="d-flex justify-content-end gap-2">
            <Button
              type="button"
              variant="outline-secondary"
              onClick={() => setFormState(initialState)}
              disabled={saving}
            >
              Limpiar
            </Button>
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? 'Guardando…' : 'Crear orden'}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default OrdenMedicaForm;
