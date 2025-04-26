import React, { useEffect, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Nav
} from 'react-bootstrap';
import { BiSearch } from 'react-icons/bi';
import { convert_fecha_ddmmaa } from '../../../utils/formatUtils'

const FormularioAdmision = () => {

  const [todayDate, setTodayDate] = useState("")

  useEffect(() => {
    const hoy = new Date();
    setTodayDate(convert_fecha_ddmmaa(hoy))
  },[])

  return (
    <Container className="p-4 bg-light rounded shadow-sm">
      {/* Encabezado */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold text-dark">Ficha de Admisión</h4>
        <div className="d-flex align-items-center">
          <span className="mr-3 font-weight-bold">Fecha: {todayDate}</span>
          <Button variant="primary" className="mr-2">Guardar</Button>
          <Button variant="secondary">Cancelar</Button>
        </div>
      </div>

      {/* Información del Paciente */}
      <h5 className="text-primary">Información del Paciente</h5>
      <Row className="mb-3">
        <Col md={4}>
          <Form.Group>
            <Form.Label>ID (Ficha Paciente)</Form.Label>
            <div className="input-group">
              <Form.Control type="text" />
              <div className="input-group-append">
                <span className="input-group-text"><BiSearch /></span>
              </div>
            </div>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Nombre</Form.Label>
            <Form.Control type="text" />
          </Form.Group>
        </Col>
        <Col md={2}>
          <Form.Group>
            <Form.Label>Fecha de nacimiento</Form.Label>
            <Form.Control type="date" />
          </Form.Group>
        </Col>
        <Col md={2}>
          <Form.Group>
            <Form.Label>Edad</Form.Label>
            <Form.Control type="text" disabled />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Dirección</Form.Label>
            <Form.Control type="text" />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Teléfono 1</Form.Label>
            <Form.Control type="text" />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Teléfono 2</Form.Label>
            <Form.Control type="text" />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Religión</Form.Label>
            <Form.Control as="select">
              <option>Seleccione</option>
            </Form.Control>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Tipo Identificación</Form.Label>
            <Form.Control as="select">
              <option>Seleccione</option>
            </Form.Control>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Número Identificación</Form.Label>
            <Form.Control type="text" />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Correo electrónico</Form.Label>
            <Form.Control type="email" />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Observación</Form.Label>
            <Form.Control as="textarea" rows={2} />
          </Form.Group>
        </Col>
      </Row>

      {/* Quien lo acompaña */}
      <h5 className="text-primary mt-4">Quien lo acompaña</h5>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Nombre</Form.Label>
            <Form.Control type="text" />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Teléfono</Form.Label>
            <Form.Control type="text" />
          </Form.Group>
        </Col>
      </Row>

      {/* Información de la Admisión */}
      <h5 className="text-primary mt-4">Información de la Admisión</h5>
      <Row className="mb-3">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Área de Admisión</Form.Label>
            <Form.Control as="select">
              <option>Seleccione</option>
            </Form.Control>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Habitación</Form.Label>
            <Form.Control as="select">
              <option>Seleccione</option>
            </Form.Control>
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Médico Tratante</Form.Label>
            <Form.Control as="select">
              <option>Seleccione</option>
            </Form.Control>
          </Form.Group>
        </Col>
        <Col md={1}>
          <Form.Group>
            <Form.Label>Maternidad</Form.Label>
            <Form.Control as="select">
              <option>No</option>
              <option>Sí</option>
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>

      {/* Datos del Seguro (simulando Tabs con Nav) */}
      <h5 className="text-primary mt-4">Datos del Seguro</h5>
      <Nav variant="tabs" defaultActiveKey="1">
        <Nav.Item>
          <Nav.Link eventKey="1">Datos del Seguro</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="2">Garantía de Pago</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="3">Datos Laborales</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="4">Responsable</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="5">Esposo(a)</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="6">Estado de Cuenta</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="7">Documentos</Nav.Link>
        </Nav.Item>
      </Nav>

      {/* Aquí puedes agregar los contenidos específicos por tab más adelante */}

    </Container>
  );
};

export default FormularioAdmision;
