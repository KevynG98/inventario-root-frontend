import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Table } from 'react-bootstrap';
import { usePreciosContext } from './Context';

const ModalPrecios = () => {
  const {
    showModalPrecios,
    setShowModalPrecios,
    skuActivo,
    seguros,
    cargarSeguros,
    actualizarPrecio,
    crearPrecio,
    eliminarPrecio,
    sku,
    descripcionSku,
  } = usePreciosContext();

  const [precios, setPrecios] = useState([]);
  const [editando, setEditando] = useState({});
  const [valores, setValores] = useState({});

  useEffect(() => {
    if (skuActivo) {
      const map = {};
      skuActivo.precios?.forEach((p) => {
        map[p.seguro_id] = parseFloat(p.precio);
      });
      setValores(map);
    }
  }, [skuActivo]);

  useEffect(() => {
    cargarSeguros();
  }, []);

  const handleChange = (id, value) => {
    setValores((prev) => ({ ...prev, [id]: value }));
  };

  const guardar = async (seguroId) => {
    const precio = parseFloat(valores[seguroId]);
    if (isNaN(precio)) return;

    const existente = skuActivo.precios?.find((p) => p.seguro_id === seguroId);
    const seguroNombre = seguros.find((s) => s.id === seguroId)?.nombre || '';

    if (existente) {
      await actualizarPrecio({
        id: existente.id,
        precio,
        sku: skuActivo.id,
        sku_nombre: skuActivo.nombre,
        seguro_nombre: seguroNombre,
      });
    } else {
      await crearPrecio({
        sku: skuActivo.id,
        sku_nombre: skuActivo.nombre,  // asegúrate que `skuActivo.nombre` exista
        seguro_nombre: seguroNombre,
        precio,
      });
    }

    setEditando((prev) => ({ ...prev, [seguroId]: false }));
  };

  const cancelar = (id) => {
    const original = skuActivo.precios?.find((p) => p.seguro_id === id)?.precio || 0;
    setValores((prev) => ({ ...prev, [id]: original }));
    setEditando((prev) => ({ ...prev, [id]: false }));
  };

  const handleEliminar = async (seguroId) => {
    const existente = skuActivo.precios?.find((p) => p.seguro_id === seguroId);
    if (existente) {
      await eliminarPrecio(existente.id);
      setValores((prev) => ({ ...prev, [seguroId]: 0 }));
    }
  };

  const handleClose = () => setShowModalPrecios(false);

  return (
    <Modal show={showModalPrecios} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <div className="d-flex flex-column">
          <Modal.Title>Editar precios de {sku}</Modal.Title>
          <p className="text-muted mb-0">{descripcionSku}</p>
        </div>
      </Modal.Header>
      <Modal.Body>
        <Table bordered responsive size="sm">
          <thead className="table-primary">
            <tr>
              <th>Seguro</th>
              <th>Precio</th>
            </tr>
          </thead>
          <tbody>
            {seguros.map((seguro) => (
              <tr key={seguro.id}>
                <td>{seguro.nombre}</td>
                <td>
                  <Form.Control
                    type="number"
                    min="0"
                    value={valores[seguro.id] || ''}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalPrecios;
