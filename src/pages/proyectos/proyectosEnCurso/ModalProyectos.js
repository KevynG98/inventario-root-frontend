import React from 'react';
import { Modal, Button, Table } from "react-bootstrap";
import { usePreciosContext } from './Context';

const ModalPrecios = () => {
  const {
    showModalPrecios,
    setShowModalPrecios,
    proyectoSeleccionado,
  } = usePreciosContext();

  const handleClose = () => setShowModalPrecios(false);

  const productos = proyectoSeleccionado?.productos_detalle || [];

  return (
    <Modal show={showModalPrecios} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <div className="d-flex flex-column">
          <Modal.Title>
            Productos de la cotización
            {proyectoSeleccionado?.nombreProyecto
              ? ` - ${proyectoSeleccionado.nombreProyecto}`
              : ''}
          </Modal.Title>
          {proyectoSeleccionado?.nombreEmpresa && (
            <p className="text-muted mb-0">
              Empresa: {proyectoSeleccionado.nombreEmpresa}
            </p>
          )}
        </div>
      </Modal.Header>
      <Modal.Body>
        {productos.length === 0 ? (
          <p className="text-center mb-0">
            No hay productos asociados a esta cotización.
          </p>
        ) : (
          <Table bordered responsive size="sm">
            <thead className="table-primary">
              <tr>
                <th>Producto</th>
                <th>Unidades</th>
                <th>Precio Unitario</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p, idx) => (
                <tr key={p.idProducto ?? idx}>
                  <td>{p.nombreProducto}</td>
                  <td>{p.cantidad}</td>
                  <td>Q{p.subTotal/p.cantidad}</td>
                  <td>Q{p.subTotal}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
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
