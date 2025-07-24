// Form.js
import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AppContext } from './Context';
import { Form, Button, Row, Col, Card, Table } from 'react-bootstrap';

const FormularioRequisicion = () => {
  const { crearRequisicion } = useContext(AppContext);
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    reset,
  } = useForm();

  const tipoRequisicion = watch('tipo_requisicion');

  const [productos, setProductos] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [descripcionServicio, setDescripcionServicio] = useState('');
  const [cantidadServicio, setCantidadServicio] = useState('');
  const [precioServicio, setPrecioServicio] = useState('');

  const handleAgregarProducto = () => {
    const values = getValues();

    const sku = values.SKU;
    const cantidad = values.cantidadSku;
    const precio = values.precioSku;

    // Datos temporales si aún no conectas descripción y unidad
    const descripcion = 'Descripción genérica';
    const unidad = 'Unidad';

    if (!sku || !cantidad || !precio) {
      alert('Todos los campos del producto son obligatorios');
      return;
    }

    const nuevo = {
      id: Date.now(),
      sku,
      descripcion,
      unidad,
      cantidad: parseFloat(cantidad),
      precio: parseFloat(precio),
      total: parseFloat(cantidad) * parseFloat(precio),
    };

    setProductos((prev) => [...prev, nuevo]);
  };

  const handleAgregarServicio = () => {
    if (!descripcionServicio || !cantidadServicio || !precioServicio) {
      alert('Todos los campos del servicio son obligatorios');
      return;
    }

    const nuevo = {
      id: Date.now(),
      descripcion: descripcionServicio,
      cantidad: parseFloat(cantidadServicio),
      precio: parseFloat(precioServicio),
      total: parseFloat(cantidadServicio) * parseFloat(precioServicio),
    };

    setServicios([...servicios, nuevo]);
    setDescripcionServicio('');
    setCantidadServicio('');
    setPrecioServicio('');
  };

  const onSubmit = (data) => {
    crearRequisicion(data, productos, servicios);
    reset();
    setProductos([]);
    setServicios([]);
  };

  return (
    <Card className="p-4 my-3">
      <h4 className="mb-4">Generar Requisición</h4>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Bodega</Form.Label>
              <Form.Control as="select" {...register('bodega')}>
                <option value="">Seleccione</option>
                <option value="Bodega 1">Bodega 1</option>
                <option value="Bodega 2">Bodega 2</option>
              </Form.Control>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Prioridad</Form.Label>
              <Form.Control as="select" {...register('prioridad')}>
                <option value="">Seleccione</option>
                <option value="urgente">Urgente</option>
                <option value="alta">Alta</option>
                <option value="normal">Normal</option>
                <option value="baja">Baja</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Motivo de la solicitud"
            {...register('descripcion')}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Tipo de Requisición</Form.Label>
          <Form.Control as="select" {...register('tipo_requisicion')}>
            <option value="">Seleccione</option>
            <option value="bien">Bien</option>
            <option value="servicio">Servicio</option>
          </Form.Control>
        </Form.Group>

        {tipoRequisicion === 'bien' && (
          <>
            <Card className="p-3 mb-3" style={{ backgroundColor: '#f7f9fc' }}>
              <Row className="align-items-end">
                <Col md={3} className="mb-3">
                  <Form.Group>
                    <Form.Label><strong>Proveedor</strong></Form.Label>
                    <Form.Control as="select" size="sm" {...register('proveedor')}>
                      <option value="">Selecciona un proveedor</option>
                      <option value="1">Proveedor A</option>
                      <option value="2">Proveedor B</option>
                      <option value="3">Proveedor C</option>
                    </Form.Control>
                  </Form.Group>
                </Col>

                <Col md={3} className="mb-3">
                  <Form.Group>
                    <Form.Label><strong>Categoría</strong></Form.Label>
                    <Form.Control as="select" size="sm" {...register('categoria')}>
                      <option value="">Selecciona una categoría</option>
                      <option value="1">Categoría A</option>
                      <option value="2">Categoría B</option>
                      <option value="3">Categoría C</option>
                    </Form.Control>
                  </Form.Group>
                </Col>

                <Col md={3} className="mb-3">
                  <Form.Group>
                    <Form.Label><strong>Subcategoría</strong></Form.Label>
                    <Form.Control as="select" size="sm" {...register('subcategoria')}>
                      <option value="">Selecciona una subcategoría</option>
                      <option value="1">Subcategoría A</option>
                      <option value="2">Subcategoría B</option>
                      <option value="3">Subcategoría C</option>
                    </Form.Control>
                  </Form.Group>
                </Col>

                <Col md={3} className="mb-3">
                  <Form.Group>
                    <Form.Label><strong>Seleccionar SKU</strong></Form.Label>
                    <Form.Control as="select" size="sm" {...register('SKU')}>
                      <option value="">Selecciona un SKU</option>
                      <option value="1">SKU A</option>
                      <option value="2">SKU B</option>
                      <option value="3">SKU C</option>
                    </Form.Control>
                  </Form.Group>
                </Col>

                <Col md={3} className="mb-3">
                  <Form.Group>
                    <Form.Label><strong>Cantidad</strong></Form.Label>
                    <Form.Control
                      type="number"
                      size="sm"
                      min="1"
                      {...register('cantidadSku')}
                    />
                  </Form.Group>
                </Col>

                <Col md={3} className="mb-3">
                  <Form.Group>
                    <Form.Label><strong>Precio</strong></Form.Label>
                    <Form.Control
                      type="number"
                      size="sm"
                      step="0.01"
                      min="0"
                      {...register('precioSku')}
                    />
                  </Form.Group>
                </Col>

                <Col md={1} className="mb-3 d-flex align-items-end">
                  <Button type="button" variant="success" onClick={handleAgregarProducto}>
                    Agregar
                  </Button>
                </Col>
              </Row>
            </Card>

            <h6 className="mt-4">Productos agregados:</h6>

            <Table bordered size="sm" className="mt-2">
              <thead style={{ backgroundColor: '#d2e8ff' }}>
                <tr>
                  <th>Código / SKU</th>
                  <th>Descripción</th>
                  <th>Unidad de Medida</th>
                  <th>Cantidad Solicitada</th>
                  <th>Precio</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {productos.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center text-muted">
                      No hay productos agregados
                    </td>
                  </tr>
                ) : (
                  productos.map((item) => (
                    <tr key={item.id}>
                      <td>{item.sku}</td>
                      <td>{item.descripcion}</td>
                      <td>{item.unidad}</td>
                      <td>{item.cantidad}</td>
                      <td>{item.precio.toFixed(2)}</td>
                      <td>{item.total.toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </>
        )}

        {tipoRequisicion === 'servicio' && (
          <>
            <Card className="p-3 mt-3" style={{ backgroundColor: '#f7f9fc' }}>
              <Row>
                <Col md={4} className="mb-3">
                  <Form.Group>
                    <Form.Label><strong>Descripción</strong></Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ej: Reparación de aire"
                      value={descripcionServicio}
                      onChange={(e) => setDescripcionServicio(e.target.value)}
                    />
                  </Form.Group>
                </Col>

                <Col md={4} className="mb-3">
                  <Form.Group>
                    <Form.Label><strong>Cantidad</strong></Form.Label>
                    <Form.Control
                      type="number"
                      step="1"
                      min="1"
                      value={cantidadServicio}
                      onChange={(e) => setCantidadServicio(e.target.value)}
                    />
                  </Form.Group>
                </Col>

                <Col md={2} className="mb-3">
                  <Form.Group>
                    <Form.Label><strong>Precio</strong></Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      min="0"
                      value={precioServicio}
                      onChange={(e) => setPrecioServicio(e.target.value)}
                    />
                  </Form.Group>
                </Col>

                <Col md={2} className="mb-3 d-flex align-items-end">
                  <Button variant="success" onClick={handleAgregarServicio}>
                    Agregar Servicio
                  </Button>
                </Col>
              </Row>
            </Card>

            <h6 className="mt-4">Servicios agregados:</h6>

            <Table bordered size="sm" className="mt-2">
              <thead style={{ backgroundColor: '#d2e8ff' }}>
                <tr>
                  <th>Descripción</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {servicios.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center text-muted">
                      No hay servicios agregados
                    </td>
                  </tr>
                ) : (
                  servicios.map((item) => (
                    <tr key={item.id}>
                      <td>{item.descripcion}</td>
                      <td>{item.cantidad}</td>
                      <td>{item.precio.toFixed(2)}</td>
                      <td>{item.total.toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </>
        )}

        <div className="mt-4">
          <Button variant="primary" type="submit">
            Guardar Requisición
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default FormularioRequisicion;
