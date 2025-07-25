import React, { useContext, useEffect, useState } from 'react';
import { Modal, Button, Form, Row, Col, Table } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { AppContext } from './Context';

const ModalRequisicion = () => {
    const {
        showModal,
        cerrarModal,
        requisicionSeleccionada,
        actualizarEstado,
        abrirModal
    } = useContext(AppContext);

    const [estadoSimulado, setEstadoSimulado] = useState('');
    const [observacion, setObservacion] = useState('');
    const [formData, setFormData] = useState({
        proveedor: '',
        fecha: '',
    });

    useEffect(() => {
        if (requisicionSeleccionada) {
            setEstadoSimulado(requisicionSeleccionada.estado || '');
            setObservacion('');
            setFormData({
                proveedor: requisicionSeleccionada.proveedor || '',
                fecha: requisicionSeleccionada.fecha || '',
            });
        }
    }, [requisicionSeleccionada]);

    if (!requisicionSeleccionada) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const lanzarSweetAlert = (titulo, nuevoEstado) => {
        cerrarModal();
        setTimeout(() => {
            Swal.fire({
                title: titulo,
                html: `
          <strong>Proveedor:</strong> ${formData.proveedor}<br/>
          <strong>Fecha:</strong> ${formData.fecha}<br/>
          <strong>Estado:</strong> ${nuevoEstado}<br/>
          <strong>Observación:</strong> ${observacion || 'Sin observaciones'}
        `,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Confirmar',
                cancelButtonText: 'Cancelar',
            }).then((result) => {
                if (result.isConfirmed) {
                    actualizarEstado(requisicionSeleccionada.id, nuevoEstado);
                } else {
                    setTimeout(() => abrirModal(requisicionSeleccionada), 100);
                }
            });
        }, 200);
    };

    const handleGuardar = () => lanzarSweetAlert('Cambios guardados', estadoSimulado);
    const handleNoRequiereVB = () => lanzarSweetAlert('Marcada como "No requiere visto bueno"', 'Orden de Compra');
    const handlePendienteVB = () => lanzarSweetAlert('Marcada como "Pendiente de visto bueno"', 'Revisión');
    const handleDarVB = () => lanzarSweetAlert('Visto bueno otorgado', 'Orden de Compra');
    const handleAnular = () => lanzarSweetAlert('Requisición anulada', 'Anulada');

    const renderDetalle = () => {
        const { tipo_requisicion, productos, servicios } = requisicionSeleccionada;

        const data = tipo_requisicion === 'bien' ? productos : servicios;

        if (!data || data.length === 0) {
            return <p className="text-muted mt-3">Sin {tipo_requisicion === 'bien' ? 'productos' : 'servicios'} registrados.</p>;
        }

        return (
            <div className="mt-4">
                <h5>{tipo_requisicion === 'bien' ? 'Productos' : 'Servicios'} asociados</h5>
                <Table striped bordered hover size="sm">
                    <thead className="table-light">
                        <tr>
                            <th>#</th>
                            <th>{tipo_requisicion === 'bien' ? 'SKU' : 'Descripción'}</th>
                            <th>Cantidad</th>
                            <th>Precio</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, idx) => (
                            <tr key={idx}>
                                <td>{idx + 1}</td>
                                <td>{tipo_requisicion === 'bien' ? item.sku : item.descripcion}</td>
                                <td>{item.cantidad}</td>
                                <td>{item.precio}</td>
                                <td>{item.total}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        );
    };

    return (
        <Modal show={showModal} onHide={cerrarModal} size="lg" centered>
            <Modal.Header closeButton className="bg-primary text-white">
                <Modal.Title>Requisición #{requisicionSeleccionada.id}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Proveedor</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="proveedor"
                                    value={formData.proveedor}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Fecha</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="fecha"
                                    value={formData.fecha}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>Estado actual</Form.Label>
                        <Form.Control
                            type="text"
                            value={estadoSimulado}
                            onChange={(e) => setEstadoSimulado(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Observaciones</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={observacion}
                            onChange={(e) => setObservacion(e.target.value)}
                        />
                    </Form.Group>
                </Form>

                {/* Detalle dinámico de productos o servicios */}
                {renderDetalle()}
            </Modal.Body>

            <Modal.Footer className="justify-content-between flex-wrap gap-2">
                <Button variant="success" className="w-100" onClick={handleGuardar}>Guardar</Button>
                <Button variant="warning" className="w-100" onClick={handleNoRequiereVB}>No requiere visto bueno</Button>
                <Button variant="info" className="w-100" onClick={handlePendienteVB}>Pendiente de visto bueno</Button>
                <Button variant="primary" className="w-100" onClick={handleDarVB}>Dar visto bueno</Button>
                <Button variant="danger" className="w-100" onClick={handleAnular}>Anular</Button>
                <Button variant="secondary" className="w-100" onClick={cerrarModal}>Cerrar</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalRequisicion;
