import React from 'react';
import { Modal, Button, Form, Row, Col, Nav } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { FiAlignJustify } from 'react-icons/fi';
import { useState } from 'react';
import { BiSearch } from 'react-icons/bi';

const ModalAdmision = ({ show, onHide, modo, setValue, getValues, watch, handleSubmit, onSubmit, loading, todayDate, seccionActiva, setSeccionActiva, register }) => {
    const readOnly = modo === 'ver';
    const [mostrarModalFamiliar, setMostrarModalFamiliar] = useState(false);
    const showPrimaryModal = () => setMostrarModalFamiliar(true);

    return (
        <Modal show={show} onHide={onHide} size="xl" centered scrollable>
            <Modal.Header closeButton>
                <Modal.Title>{modo === 'ver' ? 'Ver Admisión' : 'Editar Admisión'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {!readOnly && (
                    <div className="d-flex justify-content-end mb-3">
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Guardando...' : 'Guardar cambios'}
                        </Button>
                    </div>
                )}
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Row className="mb-3">
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>ID (Ficha Paciente)</Form.Label>
                                <div className="input-group">
                                    <Form.Control type="text" {...register('idFicha')} onKeyDown={showPrimaryModal} readOnly />
                                    <div className="input-group-append">
                                        <span className="input-group-text" style={{ cursor: 'pointer' }} onClick={() => setMostrarModalFamiliar(true)}><BiSearch /></span>
                                    </div>
                                </div>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control type="text" {...register('nombre')} readOnly={readOnly} />
                            </Form.Group>
                        </Col>
                        <Col md={2}>
                            <Form.Group>
                                <Form.Label>Fecha de nacimiento</Form.Label>
                                <Form.Control type="date" {...register('fechaNacimiento')} readOnly={readOnly} />
                            </Form.Group>
                        </Col>
                        <Col md={2}>
                            <Form.Group>
                                <Form.Label>Edad</Form.Label>
                                <Form.Control type="text" {...register('edad')} disabled />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Dirección</Form.Label>
                                <Form.Control type="text" {...register('direccion')} readOnly={readOnly} />
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label>Teléfono 1</Form.Label>
                                <Form.Control type="text" {...register('telefono1')} readOnly={readOnly} />
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label>Teléfono 2</Form.Label>
                                <Form.Control type="text" {...register('telefono2')} readOnly={readOnly} />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Religión</Form.Label>
                                <Form.Control as="select" {...register('religion')} readOnly={readOnly} disabled={readOnly}>
                                    <option>Seleccione</option>
                                    <option>CATOLICA</option>
                                    <option>EVANGELICA</option>
                                    <option>JUDIA</option>
                                    <option>MORMONA</option>
                                    <option>MUSULMANA</option>
                                    <option>NO DEFINIDO</option>
                                    <option>TESTIGO DE JEHOVA</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Tipo Identificación</Form.Label>
                                <Form.Control as="select" {...register('tipoIdentificacion')} readOnly={readOnly} disabled={readOnly}>
                                    <option>Seleccione</option>
                                    <option>DPI</option>
                                    <option>PASAPORTE</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Número Identificación</Form.Label>
                                <Form.Control type="text" {...register('numeroIdentificacion')} readOnly={readOnly} />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Correo electrónico</Form.Label>
                                <Form.Control type="email" {...register('correo')} readOnly={readOnly} />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Observación</Form.Label>
                                <Form.Control as="textarea" rows={2} {...register('observacion')} readOnly={readOnly} />
                            </Form.Group>
                        </Col>
                    </Row>

                    <h5 className="text-primary mt-4">Quien lo acompaña</h5>
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control type="text" {...register('acompananteNombre')} readOnly={readOnly} />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Teléfono</Form.Label>
                                <Form.Control type="text" {...register('acompananteTelefono')} readOnly={readOnly} />
                            </Form.Group>
                        </Col>
                    </Row>

                    <h5 className="text-primary mt-4">Información de la Admisión</h5>
                    <Row className="mb-3">
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Área de Admisión</Form.Label>
                                <Form.Control as="select" {...register('area_admision')} readOnly={readOnly} disabled={readOnly}>
                                    <option>Seleccione</option>
                                    <option>EMERGENCIA</option>
                                    <option>ENCAMAMIENTO / HOSPITAL</option>
                                    <option>INTENSIVO</option>
                                    <option>NEONATO</option>
                                    <option>QUIROFANO / CIRUJIA</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Habitación</Form.Label>
                                <Form.Control as="select" {...register('habitacion')} readOnly={readOnly} disabled={readOnly}>
                                    <option>Seleccione</option>
                                    <option>HABITACION 1</option>
                                    <option>HABITACION 2</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Médico Tratante</Form.Label>
                                <Form.Control as="select" {...register('medicoTratante')} readOnly={readOnly} disabled={readOnly}>
                                    <option>Seleccione</option>
                                    <option>MEDICO 1</option>
                                    <option>MEDICO 2</option>
                                    <option>MEDICO 3</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>

                    <h5 className="text-primary mt-4">Datos del Seguro</h5>

                    <Nav variant="tabs" activeKey={seccionActiva} onSelect={(selectedKey) => setSeccionActiva(selectedKey)}>
                        <Nav.Item><Nav.Link eventKey="datos-seguro">Datos del Seguro</Nav.Link></Nav.Item>
                        <Nav.Item><Nav.Link eventKey="garantia">Garantía de Pago</Nav.Link></Nav.Item>
                        <Nav.Item><Nav.Link eventKey="laborales">Datos Laborales</Nav.Link></Nav.Item>
                        <Nav.Item><Nav.Link eventKey="responsable">Responsable</Nav.Link></Nav.Item>
                        <Nav.Item><Nav.Link eventKey="esposo">Esposo(a)</Nav.Link></Nav.Item>
                        {/* <Nav.Item><Nav.Link eventKey="cuenta">Estado de Cuenta</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="documentos">Documentos</Nav.Link></Nav.Item> */}
                    </Nav>

                    <div className="mt-3">
                        {seccionActiva === 'datos-seguro' && (
                            <>
                                <Row className="mb-3">
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label>Aseguradora *</Form.Label>
                                            <Form.Control as="select" {...register('aseguradora')} readOnly={readOnly} disabled={readOnly}>
                                                <option value="">Seleccione</option>
                                                <option value="aseg1">Aseguradora 1</option>
                                                <option value="aseg2">Aseguradora 2</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label>Lista de precios *</Form.Label>
                                            <Form.Control as="select" {...register('listaPrecios')} readOnly={readOnly} disabled={readOnly}>
                                                <option value="">Seleccione</option>
                                                <option value="lista1">Lista 1</option>
                                                <option value="lista2">Lista 2</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label>Carnet</Form.Label>
                                            <Form.Control type="text" {...register('carnet')} readOnly={readOnly} />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className="mb-3">
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label>Certificado</Form.Label>
                                            <Form.Control type="text" {...register('certificado')} readOnly={readOnly} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label>Nombre del titular</Form.Label>
                                            <Form.Control type="text" {...register('nombreTitular')} readOnly={readOnly} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label>% de CoAseguro</Form.Label>
                                            <Form.Control type="number" step="0.01" {...register('coaseguro')} readOnly={readOnly} />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className="mb-3">
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label>Valor Copago</Form.Label>
                                            <Form.Control type="number" step="0.01" {...register('valorCopago')} readOnly={readOnly} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label>Valor Deducible</Form.Label>
                                            <Form.Control type="number" step="0.0001" {...register('valorDeducible')} readOnly={readOnly} disabled={readOnly} />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </>
                        )}

                        {seccionActiva === 'garantia' && (
                            <>
                                <Row className="mb-3">
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label>Garantía de Pago *</Form.Label>
                                            <Form.Control as="select" {...register('garantiaPago')} readOnly={readOnly} disabled={readOnly}>
                                                <option value="">Seleccione ...</option>
                                                <option value="garantia1">Garantía 1</option>
                                                <option value="garantia2">Garantía 2</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label># de TC / Cheque</Form.Label>
                                            <Form.Control type="text" {...register('tcCheque')} readOnly={readOnly} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label>NIT</Form.Label>
                                            <Form.Control type="text" {...register('nit')} readOnly={readOnly} />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className="mb-3">
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label>Nombre factura</Form.Label>
                                            <Form.Control type="text" {...register('nombreFactura')} readOnly={readOnly} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label>Dirección factura</Form.Label>
                                            <Form.Control type="text" {...register('direccionFactura')} readOnly={readOnly} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label>Correo Factura</Form.Label>
                                            <Form.Control type="email" {...register('correoFactura')} readOnly={readOnly} />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </>
                        )}

                        {seccionActiva === 'laborales' && (
                            <>
                                <Row className="mb-3">
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label>Empresa</Form.Label>
                                            <Form.Control type="text" {...register('empresa')} readOnly={readOnly} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label>Dirección</Form.Label>
                                            <Form.Control type="text" {...register('direccionEmpresa')} readOnly={readOnly} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={2}>
                                        <Form.Group>
                                            <Form.Label>Teléfono 1</Form.Label>
                                            <Form.Control type="text" {...register('telefonoEmpresa1')} readOnly={readOnly} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={2}>
                                        <Form.Group>
                                            <Form.Label>Teléfono 2</Form.Label>
                                            <Form.Control type="text" {...register('telefonoEmpresa2')} readOnly={readOnly} />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Ocupación</Form.Label>
                                            <Form.Control type="text" {...register('ocupacion')} readOnly={readOnly} />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </>
                        )}

                        {seccionActiva === 'responsable' && (
                            <>
                                <Row className="mb-3">
                                    <Col md={3}>
                                        <Form.Group>
                                            <Form.Label>Primer nombre</Form.Label>
                                            <Form.Control type="text" {...register('resp_primerNombre')} readOnly={readOnly} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group>
                                            <Form.Label>Segundo nombre</Form.Label>
                                            <Form.Control type="text" {...register('resp_segundoNombre')} readOnly={readOnly} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group>
                                            <Form.Label>Primer apellido</Form.Label>
                                            <Form.Control type="text" {...register('resp_primerApellido')} readOnly={readOnly} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group>
                                            <Form.Label>Segundo apellido</Form.Label>
                                            <Form.Control type="text" {...register('resp_segundoApellido')} readOnly={readOnly} />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className="mb-3">
                                    <Col md={3}>
                                        <Form.Group>
                                            <Form.Label>Tipo identificación</Form.Label>
                                            <Form.Control as="select" {...register('resp_tipoIdentificacion')} readOnly={readOnly} disabled={readOnly}>
                                                <option value="">Seleccione</option>
                                                <option value="dpi">DPI</option>
                                                <option value="pasaporte">Pasaporte</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group>
                                            <Form.Label>Número de identificación</Form.Label>
                                            <Form.Control type="text" {...register('resp_numeroIdentificacion')} readOnly={readOnly} disabled={readOnly} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group>
                                            <Form.Label>Fecha de nacimiento</Form.Label>
                                            <Form.Control type="date" {...register('resp_fechaNacimiento')} readOnly={readOnly} disabled={readOnly} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group>
                                            <Form.Label>Edad</Form.Label>
                                            <Form.Control type="number" {...register('resp_edad')} readOnly={readOnly} disabled={readOnly} />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className="mb-3">
                                    <Col md={3}>
                                        <Form.Group>
                                            <Form.Label>Género</Form.Label>
                                            <Form.Control as="select" {...register('resp_genero')} readOnly={readOnly} disabled={readOnly}>
                                                <option value="">Seleccione</option>
                                                <option value="masculino">Masculino</option>
                                                <option value="femenino">Femenino</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group>
                                            <Form.Label>Relación con el paciente</Form.Label>
                                            <Form.Control as="select" {...register('resp_relacionPaciente')} readOnly={readOnly} disabled={readOnly}>
                                                <option value="">Seleccione</option>
                                                <option value="padre">Padre</option>
                                                <option value="madre">Madre</option>
                                                <option value="conyuge">Cónyuge</option>
                                                <option value="otro">Otro</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group>
                                            <Form.Label>Ocupación</Form.Label>
                                            <Form.Control type="text" {...register('resp_ocupacion')} readOnly={readOnly} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group>
                                            <Form.Label>Domicilio</Form.Label>
                                            <Form.Control type="text" {...register('resp_domicilio')} readOnly={readOnly} />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className="mb-3">
                                    <Col md={3}>
                                        <Form.Group>
                                            <Form.Label>Empresa</Form.Label>
                                            <Form.Control type="text" {...register('resp_empresa')} readOnly={readOnly} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group>
                                            <Form.Label>Dirección</Form.Label>
                                            <Form.Control type="text" {...register('resp_direccion')} readOnly={readOnly} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group>
                                            <Form.Label>Teléfono 1</Form.Label>
                                            <Form.Control type="text" {...register('resp_telefono1')} readOnly={readOnly} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group>
                                            <Form.Label>Teléfono 2</Form.Label>
                                            <Form.Control type="text" {...register('resp_telefono2')} readOnly={readOnly} />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className="mb-3">
                                    <Col md={3}>
                                        <Form.Group>
                                            <Form.Label>Contacto</Form.Label>
                                            <Form.Control type="text" {...register('resp_contacto')} readOnly={readOnly} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label>Correo electrónico</Form.Label>
                                            <Form.Control type="email" {...register('resp_email')} readOnly={readOnly} />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </>
                        )}

                        {seccionActiva === 'esposo' && (
                            <>
                                <Row className="mb-3">
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label>Nombre</Form.Label>
                                            <Form.Control type="text" {...register('esposo_nombre')} readOnly={readOnly} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={2}>
                                        <Form.Group>
                                            <Form.Label>Género</Form.Label>
                                            <Form.Control as="select" {...register('esposo_genero')} readOnly={readOnly} disabled={readOnly}>
                                                <option value="">Seleccione</option>
                                                <option value="masculino">Masculino</option>
                                                <option value="femenino">Femenino</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group>
                                            <Form.Label>Tipo de identificación</Form.Label>
                                            <Form.Control as="select" {...register('esposo_tipoIdentificacion')} readOnly={readOnly} disabled={readOnly}>
                                                <option value="">Seleccione</option>
                                                <option value="dpi">DPI</option>
                                                <option value="pasaporte">Pasaporte</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group>
                                            <Form.Label>Número de identificación</Form.Label>
                                            <Form.Control type="text" {...register('esposo_numeroIdentificacion')} readOnly={readOnly} />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className="mb-3">
                                    <Col md={3}>
                                        <Form.Group>
                                            <Form.Label>Fecha de nacimiento</Form.Label>
                                            <Form.Control type="date" {...register('esposo_fechaNacimiento')} readOnly={readOnly} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={1}>
                                        <Form.Group>
                                            <Form.Label>Edad</Form.Label>
                                            <Form.Control type="number" {...register('esposo_edad')} readOnly={readOnly} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label>Teléfono 1</Form.Label>
                                            <Form.Control type="text" {...register('esposo_telefono1')} readOnly={readOnly} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label>Teléfono 2</Form.Label>
                                            <Form.Control type="text" {...register('esposo_telefono2')} readOnly={readOnly} />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className="mb-3">
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label>Domicilio</Form.Label>
                                            <Form.Control type="text" {...register('esposo_domicilio')} readOnly={readOnly} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label>Ocupación</Form.Label>
                                            <Form.Control type="text" {...register('esposo_ocupacion')} readOnly={readOnly} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label>Empresa</Form.Label>
                                            <Form.Control type="text" {...register('esposo_empresa')} readOnly={readOnly} />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Dirección</Form.Label>
                                            <Form.Control type="text" {...register('esposo_direccion')} readOnly={readOnly} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Correo electrónico</Form.Label>
                                            <Form.Control type="email" {...register('esposo_email')} readOnly={readOnly} />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </>
                        )}

                        {/* {seccionActiva === 'cuenta' && <h1>Estado de Cuenta</h1>}
          {seccionActiva === 'documentos' && <h1>Documentos</h1>} */}
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default ModalAdmision;