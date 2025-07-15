import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Form, Button, Table, Row, Col, Card, Container } from 'react-bootstrap';
import { CajeroContext } from './Context';
import { FaPlus, FaBroom, FaCashRegister, FaSignOutAlt } from 'react-icons/fa';

const CajeroForm = () => {
    const { register, handleSubmit, reset } = useForm();
    const { items, productos, bodegas, bodegaActual, changeBodega, addItem, clearItems } = useContext(CajeroContext);
    const [recordar, setRecordar] = useState(!!localStorage.getItem('bodegaPredeterminada'));

    // 🔄 Recargar automáticamente al entrar (solo cuando no quieres tocar el router)
    useEffect(() => {
        if (!sessionStorage.getItem('cajeroReloaded')) {
            sessionStorage.setItem('cajeroReloaded', 'true');
            window.location.reload();
        } else {
            sessionStorage.removeItem('cajeroReloaded'); // Para que en la próxima vez sí funcione otra vez
        }
    }, []);


    const onSubmit = (data) => {
        const existe = productos.find(p => p.nombre === data.producto);
        if (!existe) {
            alert('El producto no pertenece a esta bodega');
            return;
        }
        addItem(data);
        reset();
    };

    return (
        <Container fluid className="d-flex align-items-center justify-content-center bg-light" style={{ height: '100vh', backgroundColor: '#f5f8fb' }}>
            <Card style={{ minWidth: '900px', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                <Card.Header className="bg-white">
                    <h3 className="text-center mb-0">Registro de Ventas</h3>
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Label>Tienda</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={bodegaActual}
                                    onChange={e => changeBodega(e.target.value, recordar)}
                                >
                                    <option value="">Seleccione una tienda</option>
                                    {bodegas.map(b => (
                                        <option key={b.id} value={b.nombre}>{b.nombre}</option>
                                    ))}
                                </Form.Control>
                            </Col>
                            <Col md={6} className="mt-4">
                                <Form.Check
                                    type="checkbox"
                                    label="Recordar como predeterminada"
                                    checked={recordar}
                                    onChange={e => {
                                        const val = e.target.checked;
                                        setRecordar(val);
                                        if (!val) {
                                            localStorage.removeItem('bodegaPredeterminada');
                                        } else if (bodegaActual) {
                                            localStorage.setItem('bodegaPredeterminada', bodegaActual);
                                        }
                                    }}
                                />
                            </Col>
                        </Row>
                        <Row className="mb-4 align-items-end">
                            <Col md={5}>
                                <Form.Label>Producto</Form.Label>
                                <Form.Control
                                    size="md"
                                    type="text"
                                    placeholder="Nombre del producto"
                                    list="lista-productos"
                                    {...register('producto', { required: true })}
                                />
                                <datalist id="lista-productos">
                                    {productos.map(p => (
                                        <option key={p.id} value={p.nombre} />
                                    ))}
                                </datalist>
                            </Col>

                            <Col md={3}>
                                <Form.Label>Cantidad</Form.Label>
                                <Form.Control
                                    size="md"
                                    type="number"
                                    placeholder="Cantidad"
                                    {...register('cantidad', { required: true, min: 1 })}
                                />
                            </Col>

                            <Col md={4} className="d-flex justify-content-between" style={{ gap: '15px' }}>
                                <Button type="submit" variant="success">
                                    <FaPlus style={{ marginRight: 6 }} /> Agregar
                                </Button>
                                <Button variant="warning" onClick={clearItems}>
                                    <FaBroom style={{ marginRight: 6 }} /> Limpiar
                                </Button>
                                <Button variant="info" disabled>
                                    <FaCashRegister style={{ marginRight: 6 }} /> Cobrar
                                </Button>
                                <Button variant="danger" disabled>
                                    <FaSignOutAlt style={{ marginRight: 6 }} /> Salir
                                </Button>
                            </Col>
                        </Row>
                    </Form>

                    <h6 className="mt-4">Productos agregados:</h6>

                    <div style={{ minHeight: '200px', maxHeight: '200px', overflowY: 'auto' }}>
                        <Table bordered size="sm" style={{ fontSize: '0.85rem' }}>
                            <thead className="thead-light">
                                <tr>
                                    <th>#</th>
                                    <th>Producto</th>
                                    <th>Cantidad</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="text-center text-muted">No hay productos</td>
                                    </tr>
                                ) : (
                                    items.map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.producto}</td>
                                            <td>{item.cantidad}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default CajeroForm;
