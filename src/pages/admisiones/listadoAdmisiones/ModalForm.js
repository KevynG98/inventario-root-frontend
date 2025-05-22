// Este archivo combina el layout visual del formulario "ficha del paciente"
// con la estructura funcional del modal existente para conservar su lógica, contexto y tabs

import React, { useContext } from 'react';
import { Modal, Button, Form, Row, Col, Tabs, Tab, Container } from 'react-bootstrap';
import { AppContext } from './Context';
import { FiAlignJustify } from 'react-icons/fi';

const ModalAdmision = () => {
    const {
        mostrarModal, setMostrarModal, modoFormulario, handleSubmit, onSubmit, loading,
        register, seccionActiva, setSeccionActiva, listarHabitaciones,
    } = useContext(AppContext);

    const readOnly = modoFormulario === 'ver';
    const todayDate = new Date().toISOString().split('T')[0];

    if (!mostrarModal) return null;

    return (
        <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} size="xl" centered scrollable>
            <Modal.Header closeButton>
                <Modal.Title className="fw-bold text-dark">Ficha del Paciente</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container className="bg-light rounded shadow-sm">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h5 className="fw-bold text-dark mb-0">Ficha del Paciente</h5>
                        <div className="d-flex align-items-center gap-2">
                            <span className="text-muted">Fecha: {todayDate}</span>
                            {!readOnly && (
                                <Button variant="primary" disabled={loading} onClick={handleSubmit(onSubmit)}>
                                    {loading ? 'Guardando...' : 'Guardar'}
                                </Button>
                            )}
                        </div>
                    </div>

                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <div className="p-3 rounded border mb-3" style={{ backgroundColor: '#ededed' }}>
                            <h6 className="text-primary mb-3">Datos Generales del Paciente</h6>
                            <Row className="mb-3">
                                <Col md={3}><Form.Group><Form.Label>Primer nombre</Form.Label><Form.Control type="text" {...register('primerNombre')} readOnly={readOnly} /></Form.Group></Col>
                                <Col md={3}><Form.Group><Form.Label>Segundo nombre</Form.Label><Form.Control type="text" {...register('segundoNombre')} readOnly={readOnly} /></Form.Group></Col>
                                <Col md={3}><Form.Group><Form.Label>Primer apellido</Form.Label><Form.Control type="text" {...register('primerApellido')} readOnly={readOnly} /></Form.Group></Col>
                                <Col md={3}><Form.Group><Form.Label>Segundo apellido</Form.Label><Form.Control type="text" {...register('segundoApellido')} readOnly={readOnly} /></Form.Group></Col>
                            </Row>

                            <Row className="mb-3">
                                <Col md={3}><Form.Group><Form.Label>Apellido de casada</Form.Label><Form.Control type="text" {...register('apellidoCasada')} readOnly={readOnly} /></Form.Group></Col>
                                <Col md={3}><Form.Group><Form.Label>Género</Form.Label><Form.Control as="select" {...register('genero')} disabled={readOnly}><option>Seleccione</option><option>MASCULINO</option><option>FEMENINO</option></Form.Control></Form.Group></Col>
                                <Col md={3}><Form.Group><Form.Label>Estado Civil</Form.Label><Form.Control as="select" {...register('estadoCivil')} disabled={readOnly}><option>Seleccione</option><option>SOLTERO</option><option>CASADO</option><option>DIVORCIADO</option><option>VIUDO</option></Form.Control></Form.Group></Col>
                                <Col md={3}><Form.Group><Form.Label>Tipo de Sangre</Form.Label><Form.Control type="text" {...register('tipoSangre')} readOnly={readOnly} /></Form.Group></Col>
                            </Row>

                            <Row className="mb-3">
                                <Col md={3}><Form.Group><Form.Label>Fecha nacimiento</Form.Label><Form.Control type="date" {...register('fechaNacimiento')} readOnly={readOnly} /></Form.Group></Col>
                                <Col md={2}><Form.Group><Form.Label>Edad</Form.Label><Form.Control type="text" {...register('edad')} disabled /></Form.Group></Col>
                                <Col md={3}><Form.Group><Form.Label>Tipo de Identificación</Form.Label><Form.Control as="select" {...register('tipoIdentificacion')} disabled={readOnly}><option>Seleccione</option><option>DPI</option><option>PASAPORTE</option></Form.Control></Form.Group></Col>
                                <Col md={4}><Form.Group><Form.Label>Número de Identificación</Form.Label><Form.Control type="text" {...register('numeroIdentificacion')} readOnly={readOnly} /></Form.Group></Col>
                            </Row>

                            <Row className="mb-3">
                                <Col md={12}><Form.Group><Form.Label>Dirección</Form.Label><Form.Control type="text" {...register('direccion')} readOnly={readOnly} /></Form.Group></Col>
                            </Row>

                            <Row className="mb-3">
                                <Col md={4}><Form.Group><Form.Label>Teléfono 1</Form.Label><Form.Control type="text" {...register('telefono1')} readOnly={readOnly} /></Form.Group></Col>
                                <Col md={4}><Form.Group><Form.Label>Teléfono 2</Form.Label><Form.Control type="text" {...register('telefono2')} readOnly={readOnly} /></Form.Group></Col>
                                <Col md={4}><Form.Group><Form.Label>Correo electrónico</Form.Label><Form.Control type="email" {...register('correo')} readOnly={readOnly} /></Form.Group></Col>
                            </Row>

                            <Row className="mb-3">
                                <Col md={4}><Form.Group><Form.Label>Religión</Form.Label><Form.Control as="select" {...register('religion')} disabled={readOnly}><option>Seleccione</option><option>CATOLICA</option><option>EVANGELICA</option><option>JUDIA</option><option>MORMONA</option><option>MUSULMANA</option><option>NO DEFINIDO</option><option>TESTIGO DE JEHOVA</option></Form.Control></Form.Group></Col>
                                <Col md={4}><Form.Group><Form.Label>NIT</Form.Label><Form.Control type="text" {...register('nit')} readOnly={readOnly} /></Form.Group></Col>
                                <Col md={4}><Form.Group><Form.Label>Observación</Form.Label><Form.Control as="textarea" rows={2} {...register('observacion')} readOnly={readOnly} /></Form.Group></Col>
                            </Row>

                            <Form.Group controlId="responsableCuenta" className="d-flex align-items-center">
                                <Form.Check type="checkbox" {...register('responsableCuenta')} className="me-2" disabled={readOnly} />
                                <Form.Label className="mb-0">Responsable de Cuenta</Form.Label>
                            </Form.Group>
                        </div>
                    </Form>
                </Container>
            </Modal.Body>
        </Modal>
    );
};

export default ModalAdmision;