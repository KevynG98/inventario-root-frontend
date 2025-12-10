import React, { useState } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { NotificationManager } from 'react-notifications';
import { useMyContext } from './Context';

const ModalCargaMasiva = () => {
  const { showImport, cerrarModalImport, importando, cargarProductosMasivo } = useMyContext();
  const [file, setFile] = useState(null);
  const [inputKey, setInputKey] = useState(Date.now());

  const handleClose = () => {
    setFile(null);
    setInputKey(Date.now());
    cerrarModalImport();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      NotificationManager.warning('Selecciona un archivo Excel con productos.', 'Aviso', 4000);
      return;
    }
    await cargarProductosMasivo(file);
    handleClose();
  };

  return (
    <Modal show={showImport} onHide={handleClose} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton className="bg-dark text-light">
          <Modal.Title>Carga masiva de productos</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-light">
          <p className="mb-2">Sube un Excel con columnas: <strong>Nombre</strong>, <strong>Precio de venta</strong> y <strong>Coste</strong>.</p>
          <Form.Group controlId="fileImport">
            <Form.Label>Archivo Excel (.xlsx o .xls)</Form.Label>
            <Form.Control
              key={inputKey}
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="bg-dark">
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="success" disabled={importando}>
            {importando ? <><Spinner animation="border" size="sm" className="me-2" />Cargando</> : 'Cargar'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ModalCargaMasiva;
