import React, { useContext } from 'react';
import { Modal, Table, Button } from 'react-bootstrap';
import { AppContext } from './Context';

const DetalleModal = () => {
  const { showDetail, setShowDetail, selectedSalida } = useContext(AppContext);
  if (!showDetail || !selectedSalida) return null;

  const items = selectedSalida.items || [];

  return (
    <Modal show={showDetail} onHide={() => setShowDetail(false)} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Salida #{selectedSalida.id}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          <strong>Fecha:</strong>{' '}
          {selectedSalida.created_at ? new Date(selectedSalida.created_at).toLocaleString() : '-'}
        </p>
        <p><strong>Bodega:</strong> {selectedSalida.bodega ?? '-'}</p>
        <p><strong>Tipo:</strong> {selectedSalida.tipo_salida ?? '-'}</p>
        {selectedSalida.tipo_salida === 'paciente' && (
          <>
            <p><strong>Área:</strong> {selectedSalida.area || '-'}</p>
            <p><strong>Admisión:</strong> {selectedSalida.admision || '-'}</p>
          </>
        )}
        <p><strong>Observaciones:</strong> {selectedSalida.observaciones ?? '-'}</p>
        <p><strong>Creado por:</strong> {selectedSalida.usuario || '-'}</p>
        <p><strong>Aplicado por:</strong> {selectedSalida.aplicado_por || '-'}</p>

        <Table bordered size="sm" className="mt-3">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Descripción</th>
              <th className="text-end">Cantidad</th>
              <th className="text-end">Costo</th>
              <th className="text-end">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, idx) => (
              <tr key={`${it.sku ?? idx}`}>
                <td>{it.sku ?? '-'}</td>
                <td>{it.descripcion ?? '-'}</td>
                <td className="text-end">{it.cantidad ?? '-'}</td>
                <td className="text-end">{Number(it.costo ?? 0).toFixed(2)}</td>
                <td className="text-end">{Number(it.total ?? 0).toFixed(2)}</td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center">Sin items</td>
              </tr>
            )}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowDetail(false)}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DetalleModal;
