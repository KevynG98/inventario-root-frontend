import React from 'react';
import { Button, Card, Table, Badge } from 'react-bootstrap';
import { useSolicitudContext } from './Context';

const Detail = () => {
  const { mode, selected, setMode, openDevolverModal } = useSolicitudContext();

  if (mode !== 'detail' || !selected) return null;

  const canDevolver =
    selected.estatus === 'RECIBIDA' || selected.estatus === 'CARGADA_EC';

  return (
    <Card className="card p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Detalle de Solicitud #{selected.id}</h4>
        <Button variant="outline-secondary" onClick={() => setMode('list')}>
          Regresar
        </Button>
      </div>

      <p>
        <strong>Origen:</strong> {selected.bodega_origen} <br />
        <strong>Destino:</strong> {selected.bodega_destino} <br />
        <strong>Comentarios:</strong> {selected.comentarios || '—'} <br />
        <strong>Creada:</strong>{' '}
        {selected.fecha_creacion
          ? new Date(selected.fecha_creacion).toLocaleString()
          : '—'}{' '}
        <br />
        <strong>Enviada:</strong>{' '}
        {selected.fecha_envio
          ? new Date(selected.fecha_envio).toLocaleString()
          : '—'}{' '}
        <br />
        <strong>Recibida:</strong>{' '}
        {selected.fecha_recibido
          ? new Date(selected.fecha_recibido).toLocaleString()
          : '—'}{' '}
        <br />
        <strong>Estatus:</strong>{' '}
        <Badge variant="secondary">{selected.estatus}</Badge>
      </p>

      <Table bordered size="sm">
        <thead className="thead-light">
          <tr>
            <th>SKU</th>
            <th>Descripción</th>
            <th>Solicitada</th>
            <th>Enviada</th>
            <th>Recibida</th>
            <th>Devuelta</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {selected.items.map((i, idx) => (
            <tr key={idx}>
              <td>{i.sku}</td>
              <td>{i.descripcion || '—'}</td>
              <td>{i.cantidad_pedida ?? i.cantidad ?? '—'}</td>
              <td>{i.cantidad_enviada ?? '—'}</td>
              <td>{i.cantidad_recibida ?? '—'}</td>
              <td>{i.cantidad_devuelta ?? 0}</td>
              <td className="text-end">
                {canDevolver && !i.devuelto ? (
                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => openDevolverModal(selected, i)}
                  >
                    Devolver
                  </Button>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
};

export default Detail;
