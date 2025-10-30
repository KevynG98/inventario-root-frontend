import React from 'react';
import { Button, Card, Row, Col, Form } from 'react-bootstrap';
import { useOperacionesContext } from './Context';

const Formulario = () => {
  const {
    mode,
    setMode,
    form,
    setForm,
    catalogs,
    saveOperacion,
    saving
  } =
    useOperacionesContext();

  if (mode !== 'form') return null;

  const handleChange = (key) => (e) => {
    const nextValue = e?.target ? e.target.value : '';
    setForm((prev) => ({ ...prev, [key]: nextValue }));
  };

  return (
    <Card className="card p-3 mb-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Ingreso de Operación</h4>
        <div>
          <Button
            variant="outline-secondary"
            onClick={() => setMode('list')}
            className="mr-2"
            disabled={saving}
          >
            Regresar
          </Button>
          <Button variant="primary" onClick={saveOperacion} disabled={saving}>
            {saving ? 'Guardando…' : 'Guardar'}
          </Button>
        </div>
      </div>

      <Row>
        <Col md={4}>
          <Form.Label>Fecha</Form.Label>
          <Form.Control
            type="date"
            value={form.fecha}
            onChange={handleChange('fecha')}
          />
        </Col>

        <Col md={4}>
          <Form.Label>Día</Form.Label>
          <Form.Control
            as="select"
            value={form.dia}
            onChange={handleChange('dia')}
          >
            <option value="">Seleccione</option>
            {catalogs.dias.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </Form.Control>
        </Col>

        <Col md={4}>
          <Form.Label>Hora</Form.Label>
          <Form.Control
            as="select"
            value={form.hora}
            onChange={handleChange('hora')}
          >
            <option value="">Seleccione</option>
            {catalogs.horas.map((h) => (
              <option key={h}>{h}</option>
            ))}
          </Form.Control>
        </Col>
      </Row>

      <Row className="mt-3">
        <Col md={6}>
          <Form.Label>Nombre del Paciente</Form.Label>
          <Form.Control
            type="text"
            value={form.paciente}
            onChange={handleChange('paciente')}
          />
        </Col>
        <Col md={2}>
          <Form.Label>Edad</Form.Label>
          <Form.Control
            type="number"
            value={form.edad}
            onChange={handleChange('edad')}
          />
        </Col>
        <Col md={4}>
          <Form.Label>Especialidad</Form.Label>
          <Form.Control
            as="select"
            value={form.especialidad}
            onChange={handleChange('especialidad')}
          >
            <option value="">Seleccione</option>
            {catalogs.especialidades.map((e) => (
              <option key={e}>{e}</option>
            ))}
          </Form.Control>
        </Col>
      </Row>

      <Row className="mt-3">
        <Col>
          <Form.Label>Procedimiento</Form.Label>
          <Form.Control
            as="textarea"
            rows="2"
            value={form.procedimiento}
            onChange={handleChange('procedimiento')}
          />
        </Col>
      </Row>

      <Row className="mt-3">
        {['cirujano1', 'cirujano2', 'cirujano3', 'anestesiologo', 'pediatra'].map(
          (campo, i) => (
            <Col md={4} key={i}>
              <Form.Label>
                {campo === 'cirujano1'
                  ? 'Cirujano Principal'
                  : campo.charAt(0).toUpperCase() + campo.slice(1)}
              </Form.Label>
              <Form.Control
                type="text"
                value={form[campo]}
                onChange={handleChange(campo)}
              />
            </Col>
          )
        )}
      </Row>

      <Row className="mt-3">
        <Col md={6}>
          <Form.Label>Seguro</Form.Label>
          <Form.Control
            as="select"
            value={form.seguro}
            onChange={handleChange('seguro')}
          >
            <option value="">Seleccione</option>
            {catalogs.seguros.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </Form.Control>
        </Col>

        <Col md={6}>
          <Form.Label>Material a utilizar</Form.Label>
          <Form.Control
            as="textarea"
            rows="2"
            value={form.material}
            onChange={handleChange('material')}
          />
        </Col>
      </Row>

      <Row className="mt-3">
        <Col>
          <Form.Label>Comentarios</Form.Label>
          <Form.Control
            as="textarea"
            rows="2"
            value={form.comentarios}
            onChange={handleChange('comentarios')}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default Formulario;
