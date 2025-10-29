import React from 'react';
import { Button, Table, Badge, Card } from 'react-bootstrap';
import { useSolicitudContext } from './Context';

const List = () => {
  const {
    solicitudes,
    openNew,
    openEdit,
    openDetail,
    setStatus,
    openReceiveModal,
    openAnularModal
  } = useSolicitudContext();

  return (
    <Card className="card p-3 mb-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h4>Solicitudes de Medicamentos</h4>
          <small className="text-muted">
            Listado general de solicitudes realizadas por enfermería.
          </small>
        </div>
        <Button variant="primary" onClick={openNew}>
          Nueva Solicitud
        </Button>
      </div>

      <Table bordered hover size="sm" className="align-middle">
        <thead className="thead-light">
          <tr>
            <th>#</th>
            <th>Fecha Envío</th>
            <th>Fecha Recibido</th>
            <th>Fecha Carga EC</th>
            <th>Origen</th>
            <th>Destino</th>
            <th>Estatus</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {solicitudes.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center text-muted">
                No hay solicitudes registradas.
              </td>
            </tr>
          ) : (
            solicitudes.map((s) => (
              <tr key={s.id}>
                <td>#{s.id}</td>
                <td>{s.fecha_envio ? new Date(s.fecha_envio).toLocaleString() : '—'}</td>
                <td>{s.fecha_recibido ? new Date(s.fecha_recibido).toLocaleString() : '—'}</td>
                <td>{s.fecha_cargado_ec ? new Date(s.fecha_cargado_ec).toLocaleString() : '—'}</td>
                <td>{s.bodega_origen || '—'}</td>
                <td>{s.bodega_destino || '—'}</td>
                <td>
                  <Badge variant="secondary">{s.estatus}</Badge>
                </td>
                <td>
                  <div className="d-flex flex-wrap">
                    <Button
                      size="sm"
                      variant="outline-primary"
                      onClick={() => openDetail(s)}
                      className="mr-1 mb-1"
                    >
                      Ver
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-secondary"
                      onClick={() => openEdit(s)}
                      disabled={s.estatus !== 'PENDIENTE_ENVIAR'}
                      className="mr-1 mb-1"
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-success"
                      onClick={() => setStatus(s.id, 'ENVIADA')}
                      disabled={s.estatus !== 'PENDIENTE_ENVIAR'}
                      className="mr-1 mb-1"
                    >
                      Enviar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-warning"
                      onClick={() => openReceiveModal(s)}
                      disabled={s.estatus !== 'ENVIADA'}
                      className="mr-1 mb-1"
                    >
                      Recibir
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-info"
                      onClick={() => setStatus(s.id, 'CARGADA_EC')}
                      disabled={s.estatus !== 'RECIBIDA'}
                      className="mr-1 mb-1"
                    >
                      Cargar EC
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => openAnularModal(s)}
                      disabled={s.estatus === 'CARGADA_EC' || s.estatus === 'ANULADA'}
                      className="mb-1"
                    >
                      Anular
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Card>
  );
};

export default List;
