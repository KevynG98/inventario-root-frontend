import React, { useState, useContext } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { AppContext } from './Context';

const FormularioOrdenCompra = () => {
  const { message } = useContext(AppContext); // Si luego deseas usar más variables del contexto, aquí puedes ampliarlo

  const [fechaEntrega, setFechaEntrega] = useState('');
  const [pago, setPago] = useState('');
  const [diasCredito, setDiasCredito] = useState('');
  const [observacion, setObservacion] = useState('');
  const [modo, setModo] = useState('ver'); // puede ser: ver | editar | anular | generado

  const diasOpciones = [7, 15, 21, 30, 45, 60, 75, 90];

  const handleGuardar = () => {
    setModo('generado');
    alert('Orden generada correctamente');
  };

  const handleImprimir = () => {
    alert('Simulación: descargando PDF...');
  };

  return (
    <div className="container mt-4">
      <h4 className="mb-3">Formulario de Orden de Compra</h4>
      <Form>
        <Row>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Fecha de Entrega</Form.Label>
              <Form.Control
                type="date"
                value={fechaEntrega}
                onChange={(e) => setFechaEntrega(e.target.value)}
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label>Condiciones de Pago</Form.Label>
              <Form.Control
                as="select"
                value={pago}
                onChange={(e) => setPago(e.target.value)}
              >
                <option value="">Seleccione</option>
                <option value="Contado">Contado</option>
                <option value="Credito">Crédito</option>
              </Form.Control>
            </Form.Group>
          </Col>

          {pago === 'Credito' && (
            <Col md={4}>
              <Form.Group>
                <Form.Label>Días de Crédito</Form.Label>
                <Form.Control
                  as="select"
                  value={diasCredito}
                  onChange={(e) => setDiasCredito(e.target.value)}
                >
                  <option value="">Seleccione</option>
                  {diasOpciones.map((dia) => (
                    <option key={dia} value={dia}>{dia} días</option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
          )}
        </Row>

        {(modo === 'editar' || modo === 'anular') && (
          <Form.Group className="mt-3">
            <Form.Label>Observaciones</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
              placeholder="Ingrese observaciones..."
            />
          </Form.Group>
        )}

        <div className="mt-4 d-flex gap-2">
          <Button variant="warning" onClick={() => setModo('editar')}>Editar</Button>
          <Button variant="danger" onClick={() => setModo('anular')}>Anular</Button>
          <Button variant="success" onClick={handleGuardar}>Generar</Button>
          {modo === 'generado' && (
            <Button variant="info" onClick={handleImprimir}>Imprimir PDF</Button>
          )}
        </div>
      </Form>
    </div>
  );
};

export default FormularioOrdenCompra;
