import React from 'react';
import { Card, Row, Col, Form } from 'react-bootstrap';

const buildFullName = (person = {}) =>
  [
    person.primer_nombre,
    person.segundo_nombre,
    person.primer_apellido,
    person.segundo_apellido,
    person.apellido_casada
  ]
    .filter(Boolean)
    .join(' ')
    .trim();

const FormData = ({ data }) => {
  // Example shape:
  // data = {
  //   paciente: {
  //     fechaNacimiento: "1990-05-12",
  //     religion: "Católica",
  //     direccion: "Zona 10, Ciudad de Guatemala",
  //     telefono: "5555-1234",
  //     tipoIdentificacion: "DPI",
  //     numeroIdentificacion: "1234567890101"
  //   },
  //   acompanante: {
  //     parentesco: "Hermano",
  //     nombre: "Luis Pérez",
  //     correo: "luis@example.com",
  //     telefono: "5555-9876"
  //   }
  // }

  const hasData = Boolean(data);
  const paciente = data?.paciente ?? {};
  const acompanante = data?.acompanante ?? null;
  const acompanantesExtra = Array.isArray(data?.raw?.acompanantes)
    ? data.raw.acompanantes
    : [];
  const acompanantesSecundarios = acompanantesExtra.filter(
    (item) => item && item !== acompanante
  );

  return (
    <Card className="p-4 shadow-sm border-0">
      <h4 className="mb-4 text-primary fw-bold">
        Información Detallada del Paciente
      </h4>
      {!hasData && (
        <p className="text-muted">
          Selecciona una admisión desde la ficha principal para ver la información
          completa. Mientras tanto, puedes revisar los campos disponibles.
        </p>
      )}

      {/* PACIENTE */}
      <h5 className="text-secondary mb-3">Paciente</h5>
      <Row className="mb-3">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Fecha de Nacimiento</Form.Label>
            <Form.Control
              type="text"
              readOnly
              value={paciente?.fechaNacimiento || ''}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Religión</Form.Label>
            <Form.Control
              type="text"
              readOnly
              value={paciente?.religion || ''}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              type="text"
              readOnly
              value={paciente?.telefono || ''}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Dirección</Form.Label>
            <Form.Control
              type="text"
              readOnly
              value={paciente?.direccion || ''}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Tipo de Identificación</Form.Label>
            <Form.Control
              type="text"
              readOnly
              value={paciente?.tipoIdentificacion || ''}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Número de Identificación</Form.Label>
            <Form.Control
              type="text"
              readOnly
              value={paciente?.numeroIdentificacion || ''}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Correo</Form.Label>
            <Form.Control
              type="text"
              readOnly
              value={paciente?.correo || ''}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>NIT</Form.Label>
            <Form.Control
              type="text"
              readOnly
              value={paciente?.nit || ''}
            />
          </Form.Group>
        </Col>
      </Row>

      <hr className="my-4" />

      {/* ACOMPAÑANTE */}
      <h5 className="text-secondary mb-3">Acompañante</h5>
      {acompanante ? (
        <Row className="mb-3">
          <Col md={3}>
            <Form.Group>
              <Form.Label>Parentesco</Form.Label>
              <Form.Control
                type="text"
                readOnly
                value={acompanante?.parentesco || ''}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                readOnly
                value={acompanante?.nombre || ''}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Correo</Form.Label>
              <Form.Control
                type="text"
                readOnly
                value={acompanante?.correo || ''}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="text"
                readOnly
                value={acompanante?.telefono || ''}
              />
            </Form.Group>
          </Col>
        </Row>
      ) : (
        <p className="text-muted fst-italic">
          No se registró un acompañante para esta admisión.
        </p>
      )}

      {acompanantesSecundarios.length > 0 && (
        <>
          <hr className="my-4" />
          <h6 className="text-secondary mb-2">Acompañantes adicionales</h6>
          {acompanantesSecundarios.map((item, index) => (
            <Row className="mb-3" key={`${item.id || item.nombre || index}`}>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Parentesco</Form.Label>
                  <Form.Control
                    type="text"
                    readOnly
                    value={
                      item.parentesco ??
                      item.tipo ??
                      item.relacion ??
                      ''
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    readOnly
                    value={item.nombre ?? buildFullName(item) ?? ''}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Correo</Form.Label>
                  <Form.Control
                    type="text"
                    readOnly
                    value={
                      item.correo ??
                      item.correo_contacto ??
                      item.correo_empresa ??
                      item.email ??
                      ''
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control
                    type="text"
                    readOnly
                    value={
                      item.telefono ??
                      item.telefono_contacto ??
                      item.telefono_empresa ??
                      item.telefono1 ??
                      item.telefono2 ??
                      ''
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
          ))}
        </>
      )}
    </Card>
  );
};

export default FormData;
