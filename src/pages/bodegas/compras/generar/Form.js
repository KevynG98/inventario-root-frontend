// Form.js
import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { AppContext } from './Context';
import { Form, Button, Row, Col, Card, Table } from 'react-bootstrap';

const FormularioRequisicion = () => {
  const { toggleModalProveedor } = useContext(AppContext);
  const { register, handleSubmit, watch } = useForm();

  const tipoRequisicion = watch('tipoRequisicion');

  const onSubmit = (data) => {
    console.log('Datos enviados:', data);
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
                <option value="Urgente">Urgente</option>
                <option value="Alta">Alta</option>
                <option value="Normal">Normal</option>
                <option value="Baja">Baja</option>
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

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Centro de Costo</Form.Label>
              <Form.Control as="select" {...register('centroCosto')}>
                <option value="">Seleccione</option>
                <option value="Centro 1">Centro 1</option>
                <option value="Centro 2">Centro 2</option>
              </Form.Control>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Área Solicitante</Form.Label>
              <Form.Control as="select" {...register('areaSolicitante')}>
                <option value="">Seleccione</option>
                <option value="Área 1">Área 1</option>
                <option value="Área 2">Área 2</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Tipo de Requisición</Form.Label>
          <Form.Control as="select" {...register('tipoRequisicion')}>
            <option value="">Seleccione</option>
            <option value="Bien">Bien</option>
            <option value="Servicio">Servicio</option>
          </Form.Control>
        </Form.Group>

        {tipoRequisicion === 'Bien' && (
          <Card className="p-3 mb-3" style={{ backgroundColor: '#f7f9fc' }}>
            <Row className="align-items-end">
              <Col md={4} className="mb-3">
                <Form.Label><strong>Proveedor</strong></Form.Label>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={toggleModalProveedor}
                  block
                >
                  Seleccionar Proveedor
                </Button>
              </Col>

              <Col md={4} className="mb-3">
                <Form.Label><strong>Categoría</strong></Form.Label>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => alert('Abrir modal de Categorías')}
                  block
                >
                  Seleccionar Categoría
                </Button>
              </Col>

              <Col md={4} className="mb-3">
                <Form.Label><strong>Subcategoría</strong></Form.Label>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => alert('Abrir modal de Subcategorías')}
                  block
                >
                  Seleccionar Subcategoría
                </Button>
              </Col>
            </Row>

            <div className="mt-2">
              <Button
                variant="info"
                onClick={() => alert('Abrir modal para seleccionar SKU')}
              >
                Seleccionar SKU
              </Button>
            </div>

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
                <tr>
                  <td colSpan="6" className="text-center text-muted">
                    No hay productos agregados
                  </td>
                </tr>
              </tbody>
            </Table>
          </Card>
        )}

        {tipoRequisicion === 'Servicio' && (
          <>
            <div className="mt-3">
              <Button
                variant="info"
                onClick={() => alert('Abrir modal para ítems de Servicio')}
              >
                Agregar ítems de Servicio
              </Button>
            </div>

            <h6 className="mt-4">Servicios agregados:</h6>

            <Table bordered size="sm" className="mt-2">
              <thead style={{ backgroundColor: '#d2e8ff' }}>
                <tr>
                  <th>Cotización</th>
                  <th>Descripción</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="5" className="text-center text-muted">
                    No hay servicios agregados
                  </td>
                </tr>
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
