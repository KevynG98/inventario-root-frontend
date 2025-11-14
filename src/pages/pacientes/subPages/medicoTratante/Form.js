import React, { useEffect, useMemo, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import { useMedicoTratanteContext } from './Context';

const DEFAULT_STATE = {
  nombre: '',
  especialidad: '',
  telefono: '',
  correo: '',
  estado: 'ACTIVO',
  observaciones: ''
};

const MedicoTratanteForm = () => {
  const {
    editing,
    startEditing,
    clearEditing,
    onCreate,
    onUpdate,
    loading
  } = useMedicoTratanteContext();

  const initialState = useMemo(
    () => (editing ? { ...DEFAULT_STATE, ...editing } : DEFAULT_STATE),
    [editing]
  );

  const [formState, setFormState] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setFormState(initialState);
  }, [initialState]);

  const handleChange = (field) => (event) => {
    const { value } = event.target;
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formState.nombre?.trim()) {
      return;
    }
    setSubmitting(true);
    try {
      if (editing?.id) {
        await onUpdate?.(editing.id, formState);
      } else {
        await onCreate?.(formState);
      }
      clearEditing?.();
      setFormState(DEFAULT_STATE);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    clearEditing?.();
    setFormState(DEFAULT_STATE);
  };

  return (
    <Card className="shadow-sm border-0 mb-4">
      <Card.Header className="bg-white border-0">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <h5 className="mb-0">
            {editing ? 'Editar médico tratante' : 'Registrar médico tratante'}
          </h5>
          {editing ? (
            <Button variant="outline-secondary" size="sm" onClick={handleCancel}>
              Cancelar edición
            </Button>
          ) : null}
        </div>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group controlId="medico-nombre">
                <Form.Label>Nombre completo</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Dr. / Dra."
                  value={formState.nombre}
                  onChange={handleChange('nombre')}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="medico-especialidad">
                <Form.Label>Especialidad</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Especialidad médica"
                  value={formState.especialidad}
                  onChange={handleChange('especialidad')}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="medico-telefono">
                <Form.Label>Teléfono</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Teléfono"
                  value={formState.telefono}
                  onChange={handleChange('telefono')}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="medico-correo">
                <Form.Label>Correo electrónico</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="correo@inventario.com"
                  value={formState.correo}
                  onChange={handleChange('correo')}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="medico-estado">
                <Form.Label>Estado</Form.Label>
                <Form.Control
                  as="select"
                  value={formState.estado}
                  onChange={handleChange('estado')}
                >
                  <option value="ACTIVO">Activo</option>
                  <option value="INACTIVO">Inactivo</option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group controlId="medico-observaciones">
                <Form.Label>Observaciones</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Notas relevantes sobre el médico tratante"
                  value={formState.observaciones}
                  onChange={handleChange('observaciones')}
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-end gap-2 mt-4">
            <Button
              type="button"
              variant="outline-secondary"
              onClick={handleCancel}
              disabled={submitting || loading}
            >
              Limpiar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={submitting || loading}
            >
              {editing ? 'Actualizar' : 'Guardar'}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default MedicoTratanteForm;
