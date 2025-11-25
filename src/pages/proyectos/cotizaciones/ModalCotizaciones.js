import React from 'react';
import { Modal, Button, Table } from "react-bootstrap";
import { usePreciosContext } from './Context';

const ModalPrecios = () => {
  const {
    showModalPrecios,
    setShowModalPrecios,
    cotizacionSeleccionada,
  } = usePreciosContext();

  const handleClose = () => setShowModalPrecios(false);

  const productos = cotizacionSeleccionada?.productos_detalle || [];

  return (
    <Modal show={showModalPrecios} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <div className="d-flex flex-column">
          <Modal.Title>
            Productos de la cotización
            {cotizacionSeleccionada?.nombreProyecto
              ? ` - ${cotizacionSeleccionada.nombreProyecto}`
              : ''}
          </Modal.Title>
          {cotizacionSeleccionada?.nombreEmpresa && (
            <p className="text-muted mb-0">
              Empresa: {cotizacionSeleccionada.nombreEmpresa}
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
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p, idx) => (
                <tr key={p.idProducto ?? idx}>
                  <td>{p.nombreProducto}</td>
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
