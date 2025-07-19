// Form.js
import React, { useContext, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Form, Button, Table, Row, Col, Card, Container, Alert } from 'react-bootstrap';
import Select, { createFilter } from 'react-select';
import { CajeroContext } from './Context';
import { FaPlus, FaBroom, FaCashRegister, FaSignOutAlt } from 'react-icons/fa';

const CajeroForm = () => {
  const { register, handleSubmit, reset } = useForm();
  const {
    cajero,
    productos,
    items,
    autenticarCajero,
    addItem,
    clearItems,
    cerrarSesion
  } = useContext(CajeroContext);

  const [clave, setClave] = useState('');
  const [error, setError] = useState('');
  const [productoSel, setProductoSel] = useState(null);

  /* ---------- LOGIN POR CLAVE ---------- */
  const onClaveSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try { await autenticarCajero(clave); }
    catch { setError('Clave incorrecta o cajero inactivo'); }
  };

  /* ---------- AGREGAR ÍTEM ---------- */
  const onSubmit = (data) => {
    if (!productoSel) return alert('Selecciona un producto');
    if (!data.cantidad || data.cantidad <= 0) return alert('Cantidad inválida');

    addItem({ producto: productoSel.label, cantidad: data.cantidad });
    setProductoSel(null);
    reset({ cantidad: '' });
  };

  /* ---------- OPCIONES PARA react‑select ---------- */
  const opcionesProducto = useMemo(
    () => productos.map(p => ({ value: p.id, label: p.nombre })), [productos]
  );

  /* filtro: comienza con… (case‑insensitive) */
  const empiezaCon = createFilter({ matchFrom: 'start', ignoreCase: true, trim: true });

  /* ---------- PANTALLA DE LOGIN ---------- */
  if (!cajero) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height:'100vh' }}>
        <Card style={{ minWidth:400, padding:30 }}>
          <Card.Body>
            <h5 className="text-center mb-4">Ingresar clave de cajero</h5>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={onClaveSubmit}>
              <Form.Group>
                <Form.Control
                  placeholder="Clave"
                  value={clave}
                  onChange={e => setClave(e.target.value)}
                />
              </Form.Group>
              <Button type="submit" variant="primary" className="w-100 mt-3">Ingresar</Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  /* ---------- PANTALLA DE CAJA ---------- */
  return (
    <Container fluid className="py-5 px-3" style={{ minHeight:'100vh', background:'#f5f8fb' }}>
      <Card className="mx-auto shadow-sm" style={{ maxWidth:1200, padding:30, borderRadius:12 }}>
        <Card.Header className="bg-white">
          <h3 className="text-center mb-0">
            Registro de Ventas – {cajero.nombre} ({cajero.bodega_nombre})
          </h3>
        </Card.Header>

        <Card.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row className="mb-4 align-items-end">
              <Col md={5}>
                <Form.Label>Producto</Form.Label>
                {opcionesProducto.length
                  ? <Select
                      options={opcionesProducto}
                      value={productoSel}
                      onChange={setProductoSel}
                      placeholder="Buscar producto…"
                      isSearchable
                      isClearable
                      filterOption={empiezaCon}   /* 👈 filtrado “empieza con” */
                    />
                  : <Alert variant="info">Cargando productos…</Alert>}
              </Col>

              <Col md={3}>
                <Form.Label>Cantidad</Form.Label>
                <Form.Control
                  type="number"
                  {...register('cantidad', { required:true, min:1 })}
                />
              </Col>

              <Col md={4} className="d-flex justify-content-between" style={{ gap:15 }}>
                <Button type="submit" variant="success"><FaPlus/> Agregar</Button>
                <Button variant="warning" onClick={clearItems}><FaBroom/> Limpiar</Button>
                <Button variant="info" disabled><FaCashRegister/> Cobrar</Button>
                <Button variant="danger" onClick={cerrarSesion}><FaSignOutAlt/> Salir</Button>
              </Col>
            </Row>
          </Form>

          <h6 className="mt-4">Productos agregados:</h6>
          <div style={{ maxHeight:200, overflowY:'auto' }}>
            <Table bordered size="sm">
              <thead><tr><th>#</th><th>Producto</th><th>Cantidad</th></tr></thead>
              <tbody>
                {items.length
                  ? items.map((it,i)=>(
                      <tr key={i}><td>{i+1}</td><td>{it.producto}</td><td>{it.cantidad}</td></tr>
                    ))
                  : <tr><td colSpan="3" className="text-center text-muted">No hay productos</td></tr>}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CajeroForm;
