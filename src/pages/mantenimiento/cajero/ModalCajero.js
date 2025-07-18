import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useCajeroContext } from './ContextCajeros';
import { useForm } from 'react-hook-form';

const ModalCajero = () => {
  const {
    show, showModal, enviarDatos,
    cajeroSeleccionado, modoFormulario, actualizarCajero
  } = useCajeroContext();

  const { register, handleSubmit, setValue, reset } = useForm();
  const readOnly = modoFormulario === 'ver';

  useEffect(() => {
    if (modoFormulario === 'crear') reset();
    if ((modoFormulario === 'editar' || modoFormulario === 'ver') && cajeroSeleccionado) {
      Object.entries(cajeroSeleccionado).forEach(([key, value]) => setValue(key, value));
    }
  }, [modoFormulario, cajeroSeleccionado, reset, setValue]);

  const onSubmit = (data) => {
    if (modoFormulario === 'crear') enviarDatos(data);
    else if (modoFormulario === 'editar') actualizarCajero(data);
  };

  return (
    <Modal show={show} onHide={showModal} size="sm" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title>
          {modoFormulario === 'crear' && 'Nuevo Cajero'}
          {modoFormulario === 'editar' && 'Editar Cajero'}
          {modoFormulario === 'ver' && 'Ver Cajero'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group><Form.Label>Nombre*</Form.Label>
            <Form.Control type="text" {...register("nombre")} disabled={readOnly} />
          </Form.Group>

          <Form.Group><Form.Label>Clave*</Form.Label>
            <Form.Control type="text" {...register("clave")} disabled={readOnly} />
          </Form.Group>

          <Form.Group><Form.Label>Bodega ID*</Form.Label>
            <Form.Control type="number" {...register("bodega")} disabled={readOnly} />
          </Form.Group>

          <Form.Group>
            <Form.Label>¿Activo?</Form.Label>
            <Form.Check type="checkbox" label="Sí" {...register("esta_activo")} disabled={readOnly} />
          </Form.Group>

          <div className="d-flex justify-content-end mt-3">
            <Button variant="secondary" onClick={showModal}>Cerrar</Button>
            {modoFormulario !== 'ver' && <Button variant="primary" type="submit" className="ms-2">Guardar</Button>}
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalCajero;
