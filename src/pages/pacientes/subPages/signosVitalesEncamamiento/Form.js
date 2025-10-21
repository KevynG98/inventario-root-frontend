import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useSignosEncamamientoContext } from './Context';

const SignosEncamamientoForm = () => {
  const {
    title,
    fields,
    formState,
    saving,
    handleFieldChange,
    handleTimestampChange,
    handleCommentsChange,
    resetForm,
    saveRecord
  } = useSignosEncamamientoContext();

  const handleSubmit = async (event) => {
    event.preventDefault();
    await saveRecord();
  };

  return (
    <Card className="shadow-sm border-0 mb-4">
      <Card.Header className="bg-white border-0">
        <h4 className="mb-0">{title} - Nuevo registro</h4>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          <Row className="g-3 align-items-end">
            <Col md={4}>
              <Form.Group controlId="signos-encam-timestamp">
                <Form.Label>Fecha y hora</Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={formState.tomadoEn}
                  onChange={(event) => handleTimestampChange(event.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={8}>
              <Form.Group controlId="signos-encam-comentarios">
                <Form.Label>Comentarios</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={1}
                  placeholder="Observaciones generales"
                  value={formState.comentarios}
                  onChange={(event) => handleCommentsChange(event.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="g-3">
            {fields.map((field) => (
              <Col md={3} key={field.id}>
                <Form.Group controlId={`signos-encam-${field.id}`}>
                  <Form.Label>{field.label}</Form.Label>
                  <Form.Control
                    type="text"
                    value={formState.valores[field.id] ?? ''}
                    onChange={(event) => handleFieldChange(field.id, event.target.value)}
                    placeholder="—"
                  />
                </Form.Group>
              </Col>
            ))}
          </Row>

          <div className="d-flex justify-content-end gap-2">
            <Button
              type="button"
              variant="outline-secondary"
              onClick={resetForm}
              disabled={saving}
            >
              Limpiar
            </Button>
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? 'Guardando…' : 'Registrar signos'}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default SignosEncamamientoForm;
