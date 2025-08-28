import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Modal, Button, Form, Row, Col, Table } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { AppContext } from './Context';

const ModalRequisicion = () => {
    const {
        showModal,
        cerrarModal,
        requisicionSeleccionada,
        actualizarEstado,
        abrirModal,
        actualizarRequisicion,
        bodegas,
        skus,
    } = useContext(AppContext);

    const [observacion, setObservacion] = useState('');
    const [formData, setFormData] = useState({
        fecha: '',
    });

    const [productos, setProductos] = useState([]);
    const [servicios, setServicios] = useState([]);

    // Campos para agregar nuevo producto/servicio
    const [nuevoSkuId, setNuevoSkuId] = useState('');
    const [nuevaCantidad, setNuevaCantidad] = useState('');
    const [nuevoPrecio, setNuevoPrecio] = useState('');
    const [nuevaDescServicio, setNuevaDescServicio] = useState('');
    const [nuevaCantServicio, setNuevaCantServicio] = useState('');
    const [nuevoPrecioServicio, setNuevoPrecioServicio] = useState('');

    useEffect(() => {
        if (requisicionSeleccionada) {
            setObservacion(requisicionSeleccionada.descripcion || '');
            setFormData({
                fecha: requisicionSeleccionada.fecha || '',
            });
            setProductos(requisicionSeleccionada.productos || []);
            setServicios(requisicionSeleccionada.servicios || []);
            setNuevoSkuId('');
            setNuevaCantidad('');
            setNuevoPrecio('');
            setNuevaDescServicio('');
            setNuevaCantServicio('');
            setNuevoPrecioServicio('');
        }
    }, [requisicionSeleccionada]);

    // useMemo must not be called conditionally
    const bodegaNombre = useMemo(() => {
        if (!requisicionSeleccionada) return '';
        const bId = String(requisicionSeleccionada.bodega ?? '');
        const b = (bodegas || []).find((x) => String(x.id) === bId);
        return b ? b.nombre : requisicionSeleccionada.bodega;
    }, [bodegas, requisicionSeleccionada]);

    if (!requisicionSeleccionada) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const lanzarSweetAlertEstado = (titulo, nuevoEstado) => {
        cerrarModal();
        setTimeout(() => {
            Swal.fire({
                title: titulo,
                html: `
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
                    actualizarEstado(requisicionSeleccionada.id, nuevoEstado, observacion);
                } else {
                    setTimeout(() => abrirModal(requisicionSeleccionada), 100);
                }
            });
        }, 200);
    };

    const handleGuardar = async () => {
        if (!observacion || !observacion.trim()) {
            Swal.fire('Observación requerida', 'El campo Observación es obligatorio.', 'warning');
            return;
        }
        const payload = {
            descripcion: observacion,
            productos: requisicionSeleccionada.tipo_requisicion === 'bien' ? productos.map(({ id, ...rest }) => rest) : undefined,
            servicios: requisicionSeleccionada.tipo_requisicion === 'servicio' ? servicios.map(({ id, ...rest }) => rest) : undefined,
        };
        const ok = await actualizarRequisicion(requisicionSeleccionada.id, payload);
        if (ok) {
            Swal.fire('Guardado', 'Requisición actualizada.', 'success');
            cerrarModal();
        } else {
            Swal.fire('Error', 'No se pudo actualizar la requisición.', 'error');
        }
    };

    const requireObs = () => {
        if (!observacion || !observacion.trim()) {
            Swal.fire('Observación requerida', 'El campo Observación es obligatorio.', 'warning');
            return true;
        }
        return false;
    };
    const handleNoRequiereVB = () => { if (requireObs()) return; lanzarSweetAlertEstado('Marcada como "No requiere visto bueno"', 'aprobada'); };
    const handlePendienteVB = () => { if (requireObs()) return; lanzarSweetAlertEstado('Marcada como "Pendiente de visto bueno"', 'pendiente'); };
    const handleDarVB = () => { if (requireObs()) return; lanzarSweetAlertEstado('Visto bueno otorgado', 'aprobada'); };
    const handleAnular = () => { if (requireObs()) return; lanzarSweetAlertEstado('Requisición rechazada', 'rechazada'); };

    const skuTexto = (skuCodeOrId) => {
        // Some records might store ID; others store codigo_sku
        const list = skus || [];
        const fromId = list.find((s) => String(s.id) === String(skuCodeOrId));
        if (fromId) return `${fromId.codigo_sku} - ${fromId.descripcion ?? fromId.nombre}`;
        const fromCode = list.find((s) => String(s.codigo_sku) === String(skuCodeOrId));
        if (fromCode) return `${fromCode.codigo_sku} - ${fromCode.descripcion ?? fromCode.nombre}`;
        return skuCodeOrId;
    };

    const updateProducto = (index, field, value) => {
        setProductos((prev) => {
            const copy = [...prev];
            const item = { ...copy[index] };
            if (field === 'cantidad' || field === 'precio') {
                const num = parseFloat(value || 0);
                item[field] = num;
                const cantidad = parseFloat(item.cantidad || 0);
                const precio = parseFloat(item.precio || 0);
                item.total = cantidad * precio;
            } else {
                item[field] = value;
            }
            copy[index] = item;
            return copy;
        });
    };

    const deleteProducto = (index) => {
        setProductos((prev) => prev.filter((_, i) => i !== index));
    };

    const addProducto = () => {
        if (!nuevoSkuId || !nuevaCantidad || !nuevoPrecio) return;
        const skuObj = (skus || []).find((s) => String(s.id) === String(nuevoSkuId));
        const unidad = skuObj?.unidad_despacho || skuObj?.unidad_compra || '';
        const codigo = skuObj?.codigo_sku || nuevoSkuId;
        const descripcion = skuObj?.nombre || skuObj?.descripcion || '';
        const cantidad = parseFloat(nuevaCantidad);
        const precio = parseFloat(nuevoPrecio);
        setProductos((prev) => [
            ...prev,
            { sku: codigo, descripcion, unidad, cantidad, precio, total: cantidad * precio },
        ]);
        setNuevoSkuId('');
        setNuevaCantidad('');
        setNuevoPrecio('');
    };

    const updateServicio = (index, field, value) => {
        setServicios((prev) => {
            const copy = [...prev];
            const item = { ...copy[index] };
            if (field === 'cantidad' || field === 'precio') {
                const num = parseFloat(value || 0);
                item[field] = num;
                const cantidad = parseFloat(item.cantidad || 0);
                const precio = parseFloat(item.precio || 0);
                item.total = cantidad * precio;
            } else {
                item[field] = value;
            }
            copy[index] = item;
            return copy;
        });
    };

    const deleteServicio = (index) => {
        setServicios((prev) => prev.filter((_, i) => i !== index));
    };

    const addServicio = () => {
        if (!nuevaDescServicio || !nuevaCantServicio || !nuevoPrecioServicio) return;
        const cantidad = parseFloat(nuevaCantServicio);
        const precio = parseFloat(nuevoPrecioServicio);
        setServicios((prev) => [
            ...prev,
            { descripcion: nuevaDescServicio, cantidad, precio, total: cantidad * precio },
        ]);
        setNuevaDescServicio('');
        setNuevaCantServicio('');
        setNuevoPrecioServicio('');
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
                                <Form.Label>Bodega</Form.Label>
                                <Form.Control type="text" value={bodegaNombre || ''} readOnly />
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
                                    readOnly
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Usuario que dio de alta</Form.Label>
                                <Form.Control type="text" value={requisicionSeleccionada.usuario || ''} readOnly />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Centro de Costo</Form.Label>
                                <Form.Control type="text" value={requisicionSeleccionada.centro_costo || ''} readOnly />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Departamento</Form.Label>
                                <Form.Control type="text" value={requisicionSeleccionada.area_solicitante || ''} readOnly />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Proveedor</Form.Label>
                                <Form.Control type="text" value={requisicionSeleccionada.proveedor_nombre || requisicionSeleccionada.proveedor || ''} readOnly />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>Observación</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={observacion}
                            onChange={(e) => setObservacion(e.target.value)}
                            required
                        />
                    </Form.Group>
                </Form>

                {/* Detalle de productos o servicios con edición */}
                {requisicionSeleccionada.tipo_requisicion === 'bien' ? (
                    <div className="mt-4">
                        <h5>Productos</h5>
                        <Table striped bordered hover size="sm">
                            <thead className="table-light">
                                <tr>
                                    <th>#</th>
                                    <th>SKU</th>
                                    <th>Cantidad</th>
                                    <th>Precio</th>
                                    <th>Total</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {(!productos || productos.length === 0) && (
                                    <tr><td colSpan={6} className="text-center text-muted">Sin productos</td></tr>
                                )}
                                {productos.map((item, idx) => (
                                    <tr key={idx}>
                                        <td>{idx + 1}</td>
                                        <td>{skuTexto(item.sku)}</td>
                                        <td style={{ width: 120 }}>
                                            <Form.Control type="number" step="0.01" value={item.cantidad}
                                                onChange={(e) => updateProducto(idx, 'cantidad', e.target.value)} />
                                        </td>
                                        <td style={{ width: 120 }}>
                                            <Form.Control type="number" step="0.01" value={item.precio}
                                                onChange={(e) => updateProducto(idx, 'precio', e.target.value)} />
                                        </td>
                                        <td>{Number(item.total || 0).toFixed(2)}</td>
                                        <td>
                                            <Button variant="outline-danger" size="sm" onClick={() => deleteProducto(idx)}>Quitar</Button>
                                        </td>
                                    </tr>
                                ))}
                                <tr>
                                    <td>+</td>
                                    <td>
                                        <Form.Control as="select" value={nuevoSkuId} onChange={(e) => setNuevoSkuId(e.target.value)}>
                                            <option value="">Selecciona SKU</option>
                                            {(skus || []).map((s) => (
                                                <option key={s.id} value={s.id}>{s.codigo_sku} - {s.descripcion ?? s.nombre}</option>
                                            ))}
                                        </Form.Control>
                                    </td>
                                    <td>
                                        <Form.Control type="number" step="0.01" value={nuevaCantidad} onChange={(e) => setNuevaCantidad(e.target.value)} />
                                    </td>
                                    <td>
                                        <Form.Control type="number" step="0.01" value={nuevoPrecio} onChange={(e) => setNuevoPrecio(e.target.value)} />
                                    </td>
                                    <td colSpan={2}>
                                        <Button variant="outline-primary" size="sm" onClick={addProducto}>Agregar</Button>
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                        <div className="text-end fw-bold">Total General: {productos.reduce((s, it) => s + (parseFloat(it.total)||0), 0).toFixed(2)}</div>
                    </div>
                ) : (
                    <div className="mt-4">
                        <h5>Servicios</h5>
                        <Table striped bordered hover size="sm">
                            <thead className="table-light">
                                <tr>
                                    <th>#</th>
                                    <th>Descripción</th>
                                    <th>Cantidad</th>
                                    <th>Precio</th>
                                    <th>Total</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {(!servicios || servicios.length === 0) && (
                                    <tr><td colSpan={6} className="text-center text-muted">Sin servicios</td></tr>
                                )}
                                {servicios.map((item, idx) => (
                                    <tr key={idx}>
                                        <td>{idx + 1}</td>
                                        <td>
                                            <Form.Control type="text" value={item.descripcion || ''}
                                                onChange={(e) => updateServicio(idx, 'descripcion', e.target.value)} />
                                        </td>
                                        <td style={{ width: 120 }}>
                                            <Form.Control type="number" step="0.01" value={item.cantidad}
                                                onChange={(e) => updateServicio(idx, 'cantidad', e.target.value)} />
                                        </td>
                                        <td style={{ width: 120 }}>
                                            <Form.Control type="number" step="0.01" value={item.precio}
                                                onChange={(e) => updateServicio(idx, 'precio', e.target.value)} />
                                        </td>
                                        <td>{Number(item.total || 0).toFixed(2)}</td>
                                        <td>
                                            <Button variant="outline-danger" size="sm" onClick={() => deleteServicio(idx)}>Quitar</Button>
                                        </td>
                                    </tr>
                                ))}
                                <tr>
                                    <td>+</td>
                                    <td>
                                        <Form.Control type="text" value={nuevaDescServicio} placeholder="Descripción" onChange={(e) => setNuevaDescServicio(e.target.value)} />
                                    </td>
                                    <td>
                                        <Form.Control type="number" step="0.01" value={nuevaCantServicio} onChange={(e) => setNuevaCantServicio(e.target.value)} />
                                    </td>
                                    <td>
                                        <Form.Control type="number" step="0.01" value={nuevoPrecioServicio} onChange={(e) => setNuevoPrecioServicio(e.target.value)} />
                                    </td>
                                    <td colSpan={2}>
                                        <Button variant="outline-primary" size="sm" onClick={addServicio}>Agregar</Button>
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                        <div className="text-end fw-bold">Total General: {servicios.reduce((s, it) => s + (parseFloat(it.total)||0), 0).toFixed(2)}</div>
                    </div>
                )}
            </Modal.Body>

            <Modal.Footer className="justify-content-between flex-wrap gap-2">
                <Button variant="success" className="btn-sm flex-fill" onClick={handleGuardar}>
                    Guardar
                </Button>
                <Button variant="warning" className="btn-sm flex-fill" onClick={handleNoRequiereVB}>
                    No requiere VB
                </Button>
                <Button variant="info" className="btn-sm flex-fill" onClick={handlePendienteVB}>
                    Pendiente VB
                </Button>
                <Button variant="primary" className="btn-sm flex-fill" onClick={handleDarVB}>
                    Dar VB
                </Button>
                <Button variant="danger" className="btn-sm flex-fill" onClick={handleAnular}>
                    Anular
                </Button>
                <Button variant="secondary" className="btn-sm flex-fill" onClick={cerrarModal}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalRequisicion;
