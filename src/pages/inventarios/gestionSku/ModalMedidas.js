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

  const [imagen, setImagen] = React.useState(null);
  const [preview, setPreview] = React.useState(null);
  const [imagenEliminada, setImagenEliminada] = React.useState(false);

  const readOnly = modoFormulario === 'ver';

  // Reset / Prefill
  useEffect(() => {
    if (modoFormulario === 'crear') {
      reset({
        codigo_inventario: '',
        nombre: '',
        detalles: '',
        precio_compre: '',
        precio_stock: '',
      });
      setImagen(null);
      setPreview(null);
      setImagenEliminada(false);
    }

    if ((modoFormulario === 'editar' || modoFormulario === 'ver') && proveedorSeleccionado) {
      reset({
        codigo_inventario: proveedorSeleccionado.codigo_inventario || '',
        nombre: proveedorSeleccionado.nombre || '',
        detalles: proveedorSeleccionado.detalles || '',
        precio_compre: proveedorSeleccionado.precio_compre || '',
        precio_stock: proveedorSeleccionado.precio_stock || '',
      });
      if (proveedorSeleccionado.imagen) {
        setPreview(proveedorSeleccionado.imagen);
      } else {
        setPreview(null);
      }
      setImagen(null);
      setImagenEliminada(false);
    }
  }, [modoFormulario, proveedorSeleccionado, reset, setValue]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagen(file);
      setPreview(URL.createObjectURL(file));
      setImagenEliminada(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (!readOnly) {
        const file = e.dataTransfer.files[0];
        if (file) {
            setImagen(file);
            setPreview(URL.createObjectURL(file));
            setImagenEliminada(false);
        }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleRemoveImage = () => {
      setImagen(null);
      setPreview(null);
      setImagenEliminada(true);
  };

  const onSubmit = (data) => {
    const payload = { ...data };
    
    // Si hay una nueva imagen seleccionada
    if (imagen) {
      payload.imagen = imagen;
    } 
    // Si NO hay nueva imagen, pero se eliminó explícitamente la anterior
    else if (imagenEliminada) {
      payload.imagen = null; // null indicará al backend (o al context) que debe limpiar el campo
    }

    if (modoFormulario === 'crear') {
      enviarDatos(payload);
    } else {
      const jsonData = {
        ...proveedorSeleccionado,
        ...payload,
      };
      
      // Aseguramos que la propiedad imagen vaya correctamente configurada en el objeto final
      if (imagen) {
          jsonData.imagen = imagen;
      } else if (imagenEliminada) {
          jsonData.imagen = null;
      }
      
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
             <Col md={12} className="mb-3">
                <Form.Label className="text-light">Imagen del Producto</Form.Label>
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className={`d-flex flex-column align-items-center justify-content-center border rounded p-3 ${readOnly ? '' : 'cursor-pointer'}`}
                    style={{ 
                        borderStyle: 'dashed', 
                        borderColor: '#6c757d', 
                        backgroundColor: '#2c3034', 
                        minHeight: '150px' 
                    }}
                >
                    {preview ? (
                        <div className="text-center">
                            <img 
                                src={preview} 
                                alt="Vista previa" 
                                style={{ maxHeight: '150px', maxWidth: '100%', objectFit: 'contain' }} 
                                className="mb-2 rounded"
                            />
                            {!readOnly && (
                                <div className="mt-2">
                                    <Button variant="outline-danger" size="sm" onClick={handleRemoveImage}>
                                        Quitar imagen
                                    </Button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center text-secondary">
                            <i className="feather icon-image fs-1 mb-2"></i>
                            <p className="mb-1">Arrastra y suelta una imagen aquí</p>
                            <p className="small">o</p>
                            {!readOnly && (
                                <>
                                    <label htmlFor="imageUpload" className="btn btn-outline-primary btn-sm">
                                        Seleccionar archivo
                                    </label>
                                    <input 
                                        id="imageUpload" 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={handleImageChange} 
                                        style={{ display: 'none' }} 
                                    />
                                </>
                            )}
                        </div>
                    )}
                </div>
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
                <Form.Label className="text-light">Coste (Precio compra) *</Form.Label>
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
            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-light">Precio de Venta *</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  min="0"
                  className={inputClasses}
                  {...register('precio_stock', { required: true, min: 0 })}
                  readOnly={readOnly}
                />
                {errors.precio_stock && <small className="text-danger">Ingresa un precio de venta válido</small>}
              </Form.Group>
            </Col>
          </Row>

          <Row className="mt-2">
            <Col md={12}>
              <Form.Group>
                <Form.Label className="text-light">Detalles</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  className={inputClasses}
                  {...register('detalles')}
                  readOnly={readOnly}
                />
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
