import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useForm } from 'react-hook-form';
import { useMyContext } from './Context';

const ModalMedidas = () => {
  const {
    show, showModal, enviarDatos, actualizarProveedor,
    proveedorSeleccionado, modoFormulario,
    categorias,
    marcas,
    unidadMedida,
    bodega
  } = useMyContext();

  const { register, handleSubmit, setValue, reset } = useForm();
  const readOnly = modoFormulario === 'ver';

  useEffect(() => {
    if (modoFormulario === 'crear') {
      reset(); // limpia todos los campos
    }

    if ((modoFormulario === 'editar' || modoFormulario === 'ver') && proveedorSeleccionado) {
      Object.entries(proveedorSeleccionado).forEach(([key, value]) => {
        setValue(key, value);
      });
    }
  }, [modoFormulario, proveedorSeleccionado, reset, setValue]);

  const onSubmit = (data) => {
    const cantidadAdicional = parseInt(data.cantidad_adicional || 0);

    let nuevasBodegas = [];

    // Si estamos editando, conservamos las bodegas existentes y sumamos la nueva cantidad
    if (proveedorSeleccionado?.bodegas && proveedorSeleccionado.bodegas.length > 0) {
      nuevasBodegas = proveedorSeleccionado.bodegas.map(b => {
        if (b.nombre_bodega === bodega[0]?.nombre) {
          return {
            ...b,
            cantidad: b.cantidad + cantidadAdicional
          };
        }
        return b;
      });

      // Si no encontró la bodega en la lista, la agregamos
      if (!nuevasBodegas.find(b => b.nombre_bodega === bodega[0]?.nombre)) {
        nuevasBodegas.push({
          nombre_bodega: bodega[0]?.nombre,
          cantidad: cantidadAdicional
        });
      }
    } else {
      // Si no hay bodegas aún
      nuevasBodegas = [{
        nombre_bodega: bodega[0]?.nombre,
        cantidad: cantidadAdicional
      }];
    }

    const jsonData = {
      ...proveedorSeleccionado,
      bodegas: nuevasBodegas
    };

    actualizarProveedor(jsonData);
  };

  return (
    <Modal show={show} onHide={showModal} size="lg" centered scrollable>
      <Modal.Header closeButton className="bg-light border-bottom">
        <Modal.Title className="text-uppercase" style={{ fontSize: '16px' }}>
          {modoFormulario === 'crear' && 'Nuevo SKU'}
          {modoFormulario === 'editar' && 'Editar SKU'}
          {modoFormulario === 'ver' && 'Ver SKU'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Estado *</Form.Label>
                <Form.Control as="select" {...register('estado')} disabled={readOnly}>
                  <option value="alta">Alta</option>
                  <option value="baja">Baja</option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Categoría *</Form.Label>
                <Form.Control as="select" {...register('categoria')} disabled={readOnly}>
                  <option value="">Seleccionar</option>
                  {Array.isArray(categorias) && categorias.map((data, i) => (
                    <option key={i} value={data.nombre}>{data.nombre}</option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Marca *</Form.Label>
                <Form.Control as="select" {...register('marca')} disabled={readOnly} >
                  <option value="">Seleccionar</option>
                  {Array.isArray(marcas) && marcas.map((data, i) => (
                    <option key={i} value={data.nombre}>{data.nombre}</option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Principio activo</Form.Label>
                <Form.Control {...register('principio_activo')} disabled={readOnly} />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Sub Categoría *</Form.Label>
                <Form.Control {...register('subcategoria')} disabled={readOnly} />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mt-2">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Código SKU *</Form.Label>
                <Form.Control {...register('codigo_sku')} disabled={readOnly} />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Nombre *</Form.Label>
                <Form.Control {...register('nombre')} disabled={readOnly} />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Cantidad (stock inicial)</Form.Label>
                <Form.Control type="number" {...register('cantidad')} disabled={readOnly} />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Agregar cantidad a {bodega[0]?.nombre}</Form.Label>
                <Form.Control
                  type="number"
                  {...register("cantidad_adicional")}
                  min="0"
                  placeholder="Ej: 50"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mt-2">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Unidad de Compra *</Form.Label>
                <Form.Control {...register('unidad_compra')} disabled={readOnly} />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Unidad de despacho *</Form.Label>
                <Form.Control as="select" {...register('unidad_despacho')} disabled={readOnly}>
                  <option value="">Seleccionar</option>
                  {Array.isArray(unidadMedida) && unidadMedida.map((data, i) => (
                    <option key={i} value={data.nombre}>{data.nombre}</option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Unidades x paquete *</Form.Label>
                <Form.Control type="number" min={1} {...register('unidades_por_paquete')} disabled={readOnly} />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mt-2">
            <Col>
              <Form.Group>
                <Form.Label>Descripción en el Estado de Cuenta *</Form.Label>
                <Form.Control as="textarea" rows={2} {...register('descripcion_estado_cuenta')} disabled={readOnly} />
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
