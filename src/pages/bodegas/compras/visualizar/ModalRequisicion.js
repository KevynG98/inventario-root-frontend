// ModalRequisicion.js
import React, { useContext, useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
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

    useEffect(() => {
        if (requisicionSeleccionada) {
            setEstadoSimulado(requisicionSeleccionada.estado);
            setObservacion('');
        }
    }, [requisicionSeleccionada]);

    if (!requisicionSeleccionada) return null;

    const lanzarSweetAlert = (titulo, nuevoEstado) => {
        cerrarModal(); // Oculta el modal primero
        setTimeout(() => {
            Swal.fire({
                title: titulo,
                text: `Observación: ${observacion || 'Sin observaciones'}`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Confirmar',
                cancelButtonText: 'Cancelar',
            }).then((result) => {
                if (result.isConfirmed) {
                    actualizarEstado(requisicionSeleccionada.id, nuevoEstado); // Cambia estado
                } else {
                    setTimeout(() => abrirModal(requisicionSeleccionada), 100); // Reactiva modal
                }
            });
        }, 200);
    };

    const handleGuardar = () => lanzarSweetAlert('Cambios guardados', estadoSimulado);
    const handleNoRequiereVB = () => lanzarSweetAlert('Marcada como "No requiere visto bueno"', 'Orden de Compra');
    const handlePendienteVB = () => lanzarSweetAlert('Marcada como "Pendiente de visto bueno"', 'Revisión');
    const handleDarVB = () => lanzarSweetAlert('Visto bueno otorgado', 'Orden de Compra');
    const handleAnular = () => lanzarSweetAlert('Requisición anulada', 'Anulada');

    return (
        <Modal show={showModal} onHide={cerrarModal} size="lg" centered>
            <Modal.Header closeButton className="bg-primary text-white">
                <Modal.Title>Requisición #{requisicionSeleccionada.id}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-3">
                    <strong>Proveedor:</strong> {requisicionSeleccionada.proveedor}
                </div>
                <div className="mb-3">
                    <strong>Fecha:</strong> {requisicionSeleccionada.fecha}
                </div>
                <div className="mb-3">
                    <strong>Estado actual:</strong> {estadoSimulado}
                </div>

                <Form.Group>
                    <Form.Label>Observaciones</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={observacion}
                        onChange={(e) => setObservacion(e.target.value)}
                    />
                </Form.Group>
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
