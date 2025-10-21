import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useControlMedicamentoContext } from './Context';

const initialState = {
  medicamento: '',
  dosis: '',
  frecuencia: '',
  via: '',
  indicaciones: ''
};

const ControlMedicamentoForm = () => {
  const { options, handlers } = useControlMedicamentoContext();
  const [formState, setFormState] = useState(initialState);
  const [saving, setSaving] = useState(false);

  const handleChange = (field) => (event) => {
    setFormState((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formState.medicamento?.trim()) {
      window.alert('Ingresa el nombre del medicamento.');
      return;
    }
    if (typeof handlers.create !== 'function') return;
    setSaving(true);
    try {
      await handlers.create({
        medicamento: formState.medicamento,
        dosis: formState.dosis,
        frecuencia: formState.frecuencia,
        via: formState.via,
        indicaciones: formState.indicaciones,
        activo: true
      });
      setFormState(initialState);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="shadow-sm border-0 mb-4">
      <Card.Header className="bg-white border-0">
        <h4 className="mb-0">Registrar nuevo medicamento</h4>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          <Row className="g-3">
            <Col md={4}>
              <Form.Group controlId="control-medicamento-nombre">
                <Form.Label>Medicamento</Form.Label>
                <Form.Control
                  type="text"
                  value={formState.medicamento}
                  onChange={handleChange('medicamento')}
                  placeholder="Nombre del medicamento"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="control-medicamento-dosis">
                <Form.Label>Dosis</Form.Label>
                <Form.Control
                  type="text"
                  value={formState.dosis}
                  onChange={handleChange('dosis')}
                  placeholder="Ej. 500 mg"
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group controlId="control-medicamento-frecuencia">
                <Form.Label>Frecuencia</Form.Label>
                <Form.Control
                  as="select"
                  value={formState.frecuencia}
                  onChange={handleChange('frecuencia')}
                >
                  <option value="">Seleccionar</option>
                  {options.frequency.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group controlId="control-medicamento-via">
                <Form.Label>Vía</Form.Label>
                <Form.Control
                  as="select"
                  value={formState.via}
                  onChange={handleChange('via')}
                >
                  <option value="">Seleccionar</option>
                  {options.route.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Form.Group controlId="control-medicamento-indicaciones">
            <Form.Label>Indicaciones</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={formState.indicaciones}
              onChange={handleChange('indicaciones')}
              placeholder="Notas adicionales sobre la administración"
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
              {saving ? 'Guardando…' : 'Agregar medicamento'}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ControlMedicamentoForm;
