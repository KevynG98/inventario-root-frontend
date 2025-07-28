import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useMyContext } from './Context';
import { useForm } from 'react-hook-form';

const ModalCategoria = () => {
  const {
    show, showModal, enviarDatos,
    proveedorSeleccionado, modoFormulario, actualizarProveedor,
    subcategorias, setSubcategorias
  } = useMyContext();

  const { register, handleSubmit, setValue, reset } = useForm();
  const readOnly = modoFormulario === 'ver';

  useEffect(() => {
    if (modoFormulario === 'crear') {
      reset();
      setSubcategorias(['']);
    }

    if ((modoFormulario === 'editar' || modoFormulario === 'ver') && proveedorSeleccionado) {
      Object.entries(proveedorSeleccionado).forEach(([key, value]) => {
        setValue(key, value);
      });
    }
  }, [modoFormulario, proveedorSeleccionado, reset, setValue]);

  const handleAddSubcategoria = () => {
    setSubcategorias([...subcategorias, '']);
  };

  const handleRemoveSubcategoria = (index) => {
    const nuevas = subcategorias.filter((_, i) => i !== index);
    setSubcategorias(nuevas);
  };

  const handleChangeSubcategoria = (index, value) => {
    const nuevas = [...subcategorias];
    nuevas[index] = value;
    setSubcategorias(nuevas);
  };

  const onSubmit = (data) => {
    const payload = {
      ...data,
      subcategorias: subcategorias.filter((s) => s.trim() !== '')
    };

    if (modoFormulario === 'crear') {
      enviarDatos(payload);
    } else if (modoFormulario === 'editar') {
      actualizarProveedor(payload);
    }
  };

  return (
    <Modal show={show} onHide={showModal} size="sm" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title>
          {modoFormulario === 'crear' && 'Nueva categoría'}
          {modoFormulario === 'editar' && 'Editar categoría'}
          {modoFormulario === 'ver' && 'Ver categoría'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group>
            <Form.Label>Nombre *</Form.Label>
            <Form.Control as="textarea" rows={1} {...register("nombre")} disabled={readOnly} />
          </Form.Group>

          <Form.Group>
            <Form.Label>Estado</Form.Label>
            <Form.Control as="select" {...register("estado")} disabled={readOnly}>
              <option value="alta">Alta</option>
              <option value="baja">Baja</option>
            </Form.Control>
          </Form.Group>

          <hr />
          <Form.Label>Subcategorías</Form.Label>
          {subcategorias?.map((sub, index) => (
            <div key={index} className="d-flex mb-2 gap-2">
              <Form.Control
                type="text"
                value={sub}
                disabled={readOnly}
                onChange={(e) => handleChangeSubcategoria(index, e.target.value)}
              />
              {!readOnly && (
                <Button variant="danger" onClick={() => handleRemoveSubcategoria(index)}>X</Button>
              )}
            </div>
          ))}

          {!readOnly && (
            <Button variant="success" onClick={handleAddSubcategoria} className="mb-3">
              + Añadir Subcategoría
            </Button>
          )}

          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={showModal}>Cerrar</Button>
            {modoFormulario !== 'ver' && (
              <Button variant="primary" type="submit">Guardar</Button>
            )}
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalCategoria;
