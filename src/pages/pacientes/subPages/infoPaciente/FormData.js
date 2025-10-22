import React, { useEffect, useMemo, useState } from 'react';
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
  const hasData = Boolean(data);
  const pacienteData = data?.paciente ?? {};
  const acompananteData = data?.acompanante ?? null;
  const acompanantesExtra = Array.isArray(data?.raw?.acompanantes)
    ? data.raw.acompanantes
    : [];
  const acompanantesSecundarios = acompanantesExtra.filter(
    (item) => item && item !== acompananteData
  );

  const pacienteInitial = useMemo(
    () => ({
      fechaNacimiento: pacienteData.fechaNacimiento ?? '',
      religion: pacienteData.religion ?? '',
      direccion: pacienteData.direccion ?? '',
      telefono: pacienteData.telefono ?? '',
      tipoIdentificacion: pacienteData.tipoIdentificacion ?? '',
      numeroIdentificacion: pacienteData.numeroIdentificacion ?? '',
      correo: pacienteData.correo ?? '',
      nit: pacienteData.nit ?? ''
    }),
    [
      pacienteData.correo,
      pacienteData.direccion,
      pacienteData.fechaNacimiento,
      pacienteData.nit,
      pacienteData.numeroIdentificacion,
      pacienteData.religion,
      pacienteData.telefono,
      pacienteData.tipoIdentificacion
    ]
  );

  const [pacienteForm, setPacienteForm] = useState(pacienteInitial);

  useEffect(() => {
    setPacienteForm(pacienteInitial);
  }, [pacienteInitial]);

  const acompananteInitial = useMemo(
    () =>
      acompananteData
        ? {
            parentesco: acompananteData.parentesco ?? '',
            nombre: acompananteData.nombre ?? '',
            correo: acompananteData.correo ?? '',
            telefono: acompananteData.telefono ?? ''
          }
        : null,
    [
      acompananteData?.correo,
      acompananteData?.nombre,
      acompananteData?.parentesco,
      acompananteData?.telefono
    ]
  );

  const [acompananteForm, setAcompananteForm] = useState(acompananteInitial);

  useEffect(() => {
    setAcompananteForm(acompananteInitial);
  }, [acompananteInitial]);

  const acompanantesExtraInitial = useMemo(
    () =>
      acompanantesSecundarios.map((item, index) => ({
        parentesco: item.parentesco ?? item.tipo ?? item.relacion ?? '',
        nombre: item.nombre ?? buildFullName(item) ?? '',
        correo:
          item.correo ??
          item.correo_contacto ??
          item.correo_empresa ??
          item.email ??
          '',
        telefono:
          item.telefono ??
          item.telefono_contacto ??
          item.telefono_empresa ??
          item.telefono1 ??
          item.telefono2 ??
          '',
        key: item.id ?? `${item.nombre || 'acompanante'}-${index}`
      })),
    [acompanantesSecundarios]
  );

  const [acompanantesExtraForm, setAcompanantesExtraForm] = useState(
    acompanantesExtraInitial
  );

  useEffect(() => {
    setAcompanantesExtraForm(acompanantesExtraInitial);
  }, [acompanantesExtraInitial]);

  const handlePacienteChange = (field) => (event) => {
    const { value } = event.target;
    setPacienteForm((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAcompananteChange = (field) => (event) => {
    const { value } = event.target;
    setAcompananteForm((prev) =>
      prev
        ? {
            ...prev,
            [field]: value
          }
        : prev
    );
  };

  const handleAcompananteExtraChange = (index, field) => (event) => {
    const { value } = event.target;
    setAcompanantesExtraForm((prev) =>
      prev.map((item, currentIndex) =>
        currentIndex === index
          ? {
              ...item,
              [field]: value
            }
          : item
      )
    );
  };

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
              value={pacienteForm.fechaNacimiento}
              onChange={handlePacienteChange('fechaNacimiento')}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Religión</Form.Label>
            <Form.Control
              type="text"
              value={pacienteForm.religion}
              onChange={handlePacienteChange('religion')}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              type="text"
              value={pacienteForm.telefono}
              onChange={handlePacienteChange('telefono')}
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
              value={pacienteForm.direccion}
              onChange={handlePacienteChange('direccion')}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Tipo de Identificación</Form.Label>
            <Form.Control
              type="text"
              value={pacienteForm.tipoIdentificacion}
              onChange={handlePacienteChange('tipoIdentificacion')}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Número de Identificación</Form.Label>
            <Form.Control
              type="text"
              value={pacienteForm.numeroIdentificacion}
              onChange={handlePacienteChange('numeroIdentificacion')}
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
              value={pacienteForm.correo}
              onChange={handlePacienteChange('correo')}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>NIT</Form.Label>
            <Form.Control
              type="text"
              value={pacienteForm.nit}
              onChange={handlePacienteChange('nit')}
            />
          </Form.Group>
        </Col>
      </Row>

      <hr className="my-4" />

      {/* ACOMPAÑANTE */}
      <h5 className="text-secondary mb-3">Acompañante</h5>
      {acompananteForm ? (
        <Row className="mb-3">
          <Col md={3}>
            <Form.Group>
              <Form.Label>Parentesco</Form.Label>
              <Form.Control
                type="text"
                value={acompananteForm.parentesco}
                onChange={handleAcompananteChange('parentesco')}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={acompananteForm.nombre}
                onChange={handleAcompananteChange('nombre')}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Correo</Form.Label>
              <Form.Control
                type="text"
                value={acompananteForm.correo}
                onChange={handleAcompananteChange('correo')}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="text"
                value={acompananteForm.telefono}
                onChange={handleAcompananteChange('telefono')}
              />
            </Form.Group>
          </Col>
        </Row>
      ) : (
        <p className="text-muted fst-italic">
          No se registró un acompañante para esta admisión.
        </p>
      )}

      {acompanantesExtraForm.length > 0 && (
        <>
          <hr className="my-4" />
          <h6 className="text-secondary mb-2">Acompañantes adicionales</h6>
          {acompanantesExtraForm.map((item, index) => (
            <Row className="mb-3" key={item.key || index}>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Parentesco</Form.Label>
                  <Form.Control
                    type="text"
                    value={item.parentesco}
                    onChange={handleAcompananteExtraChange(index, 'parentesco')}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    value={item.nombre}
                    onChange={handleAcompananteExtraChange(index, 'nombre')}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Correo</Form.Label>
                  <Form.Control
                    type="text"
                    value={item.correo}
                    onChange={handleAcompananteExtraChange(index, 'correo')}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control
                    type="text"
                    value={item.telefono}
                    onChange={handleAcompananteExtraChange(index, 'telefono')}
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
