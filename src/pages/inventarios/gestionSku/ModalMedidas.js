import React, { useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useForm } from 'react-hook-form';
import { useMyContext } from './Context';

const ModalMedidas = () => {
  const inputClasses = 'bg-dark text-light border-secondary';
  const {
    show,
    showModal,
    enviarDatos,
    actualizarProveedor,
    proveedorSeleccionado,
    modoFormulario,
    categorias,
    marcas,
  } = useMyContext();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm();

  const readOnly = modoFormulario === 'ver';

  // Reset / Prefill
  useEffect(() => {
    if (modoFormulario === 'crear') {
      reset({
        codigo_inventario: '',
        nombre: '',
        estado: 'alta',
        categoria: '',
        marca: '',
        barcode: '',
        precio_compre: '',
        precio_stock: '',
      });
    }

    if ((modoFormulario === 'editar' || modoFormulario === 'ver') && proveedorSeleccionado) {
      Object.entries(proveedorSeleccionado).forEach(([key, value]) => {
        setValue(key, value);
      });
    }
  }, [modoFormulario, proveedorSeleccionado, reset, setValue]);

  const onSubmit = (data) => {
    const payload = { ...data };

    if (modoFormulario === 'crear') {
      enviarDatos(payload);
    } else {
      const jsonData = {
        ...proveedorSeleccionado,
        ...payload,
      };
      actualizarProveedor(jsonData);
    }
  };

  return (
    <Modal show={show} onHide={showModal} size="lg" centered scrollable>
      <Modal.Header closeButton closeVariant="white" className="bg-dark text-light border-0">
        <Modal.Title className="text-uppercase" style={{ fontSize: '16px' }}>
          {modoFormulario === 'crear' && 'Nuevo Producto'}
          {modoFormulario === 'editar' && 'Editar Producto'}
          {modoFormulario === 'ver' && 'Ver Producto'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark text-light">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="text-light">Estado *</Form.Label>
                <Form.Control
                  as="select"
                  className={inputClasses}
                  {...register('estado', { required: true })}
                  readOnly={readOnly}
                  disabled={readOnly}
                >
                  <option value="alta">Disponible</option>
                  <option value="baja">No Disponible</option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="text-light">Categoría *</Form.Label>
                <Form.Control
                  as="select"
                  className={inputClasses}
                  {...register('categoria', { required: true })}
                  readOnly={readOnly}
                  disabled={readOnly}
                >
                  <option value="">Seleccionar</option>
                  {categorias?.map((data, i) => (
                    <option key={i} value={data.nombre}>{data.nombre}</option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="text-light">Marca *</Form.Label>
                <Form.Control
                  as="select"
                  className={inputClasses}
                  {...register('marca', { required: true })}
                  readOnly={readOnly}
                  disabled={readOnly}
                >
                  <option value="">Seleccionar</option>
                  {marcas?.map((data, i) => (
                    <option key={i} value={data.nombre}>{data.nombre}</option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mt-2">
            <Col md={4}>
              <Form.Group>
                <Form.Label className="text-light">Código del Producto *</Form.Label>
                <Form.Control
                  className={inputClasses}
                  {...register('codigo_inventario', { required: true })}
                  readOnly={readOnly}
                />
                {errors.codigo_inventario && <small className="text-danger">El código del producto es obligatorio</small>}
              </Form.Group>
            </Col>
            <Col md={8}>
              <Form.Group>
                <Form.Label className="text-light">Nombre *</Form.Label>
                <Form.Control
                  className={inputClasses}
                  {...register('nombre', { required: true })}
                  readOnly={readOnly}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mt-2">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-light">Código de Barras</Form.Label>
                <Form.Control
                  className={inputClasses}
                  {...register('barcode')}
                  readOnly={readOnly}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label className="text-light">Precio de compra *</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  min="0"
                  className={inputClasses}
                  {...register('precio_compre', { required: true, min: 0 })}
                  readOnly={readOnly}
                />
                {errors.precio_compre && <small className="text-danger">Ingresa un precio de compra válido</small>}
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label className="text-light">Precio en stock *</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  min="0"
                  className={inputClasses}
                  {...register('precio_stock', { required: true, min: 0 })}
                  readOnly={readOnly}
                />
                {errors.precio_stock && <small className="text-danger">Ingresa un precio de stock válido</small>}
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-end mt-4">
            <Button variant="secondary" onClick={showModal} className="me-2">
              Cancelar
            </Button>
            {modoFormulario !== 'ver' && (
              <Button type="submit" variant="primary">Guardar</Button>
            )}
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalMedidas;
