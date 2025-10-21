import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useNotasEnfermeriaContext } from './Context';

const initialState = {
  turno: '',
  estado: 'EDICION',
  contenido: ''
};

const NotasEnfermeriaForm = () => {
  const { mode, active, turnos, estados, setMode, handlers } =
    useNotasEnfermeriaContext();
  const [formState, setFormState] = useState(initialState);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (mode === 'EDIT' && active) {
      setFormState({
        turno: active.turno,
        estado: active.estado,
        contenido: active.contenido || ''
      });
    } else {
      setFormState(initialState);
    }
  }, [mode, active]);

  const handleChange = (field) => (event) => {
    setFormState((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formState.turno) {
      window.alert('Selecciona un turno.');
      return;
    }
    if (!formState.contenido?.trim()) {
      window.alert('Ingresa el contenido de la nota.');
      return;
    }

    setSaving(true);
    try {
      if (mode === 'EDIT' && active && typeof handlers.update === 'function') {
        await handlers.update(active.id, {
          turno: formState.turno,
          estado: formState.estado,
          contenido: formState.contenido
        });
      } else if (typeof handlers.create === 'function') {
        await handlers.create({
          turno: formState.turno,
          estado: formState.estado,
          contenido: formState.contenido
        });
      }
      setMode('LIST');
    } finally {
      setSaving(false);
    }
  };

  if (mode === 'LIST') {
    return null;
  }

  return (
    <Card className="shadow-sm border-0 mb-4">
      <Card.Header className="bg-white border-0 d-flex justify-content-between align-items-center">
        <h4 className="mb-0">
          {mode === 'EDIT' ? 'Editar nota de enfermería' : 'Nueva nota de enfermería'}
        </h4>
        <Button variant="outline-secondary" onClick={() => setMode('LIST')}>
          Cerrar
        </Button>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          <Row className="g-3">
            <Col md={4}>
              <Form.Group controlId="nota-turno">
                <Form.Label>Turno</Form.Label>
                <Form.Control
                  as="select"
                  value={formState.turno}
                  onChange={handleChange('turno')}
                  required
                >
                  <option value="">Seleccionar</option>
                  {turnos.map((turno) => (
                    <option key={turno} value={turno}>
                      {turno}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="nota-estado">
                <Form.Label>Estado</Form.Label>
                <Form.Control
                  as="select"
                  value={formState.estado}
                  onChange={handleChange('estado')}
                >
                  {estados.map((estado) => (
                    <option key={estado.value} value={estado.value}>
                      {estado.label}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Form.Group controlId="nota-contenido">
            <Form.Label>Contenido</Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              value={formState.contenido}
              onChange={handleChange('contenido')}
              placeholder="Describe la atención brindada, evolución y observaciones relevantes"
            />
          </Form.Group>
          <div className="d-flex justify-content-end gap-2">
            <Button
              type="button"
              variant="outline-secondary"
              onClick={() => setMode('LIST')}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? 'Guardando…' : 'Guardar nota'}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default NotasEnfermeriaForm;
