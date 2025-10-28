import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useDietasContext } from './Context';

const initialState = {
  tiempo: 'DESAYUNO',
  dieta: '',
  observaciones: ''
};

const DietasForm = () => {
  const { tiempos, handlers } = useDietasContext();
  const [formState, setFormState] = useState(initialState);
  const [saving, setSaving] = useState(false);

  const handleChange = (field) => (event) => {
    const { value } = event.target;
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formState.dieta?.trim()) {
      window.alert('Ingresa la dieta indicada.');
      return;
    }
    if (typeof handlers.create !== 'function') return;

    setSaving(true);
    try {
      await handlers.create({
        tiempo: formState.tiempo,
        dieta: formState.dieta,
        observaciones: formState.observaciones
      });
      setFormState(initialState);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="shadow-sm border-0 mb-4">
      <Card.Header className="bg-white border-0">
        <h4 className="mb-0">Registrar dieta</h4>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          <Row className="g-3">
            <Col md={4}>
              <Form.Group controlId="dieta-tiempo">
                <Form.Label>Tiempo</Form.Label>
                <Form.Control
                  as="select"
                  value={formState.tiempo}
                  onChange={handleChange('tiempo')}
                >
                  {tiempos.map((tiempo) => (
                    <option key={tiempo} value={tiempo}>
                      {tiempo}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={8}>
              <Form.Group controlId="dieta-nombre">
                <Form.Label>Dieta indicada</Form.Label>
                <Form.Control
                  type="text"
                  value={formState.dieta}
                  onChange={handleChange('dieta')}
                  placeholder="Ej. Dieta blanda"
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group controlId="dieta-observaciones">
            <Form.Label>Observaciones</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={formState.observaciones}
              onChange={handleChange('observaciones')}
              placeholder="Notas adicionales (opcional)"
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
              {saving ? 'Guardando…' : 'Agregar registro'}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default DietasForm;
