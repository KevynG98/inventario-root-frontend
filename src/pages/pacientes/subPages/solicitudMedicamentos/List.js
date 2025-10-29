import React, { useMemo } from 'react';
import { Badge, Button, Card, Table } from 'react-bootstrap';
import { useSolicitudMedicamentosContext } from './Context';

const statusMap = {
  PENDIENTE_ENVIAR: { label: 'Pendiente de Enviar', variant: 'secondary' },
  ENVIADA: { label: 'Enviada', variant: 'info' },
  PENDIENTE_RECIBIR: { label: 'Pendiente de Recibir', variant: 'warning' },
  RECIBIDA: { label: 'Recibida – Pendiente de Cargar a EC', variant: 'primary' },
  CARGADA_EC: { label: 'Cargada al Estado de Cuenta', variant: 'success' },
  ANULADA: { label: 'Anulada', variant: 'dark' }
};

const formatDateTime = (date) => {
  if (!date) {
    return '—';
  }
  try {
    return new Intl.DateTimeFormat('es-GT', {
      dateStyle: 'short',
      timeStyle: 'short'
    }).format(date);
  } catch (error) {
    return '—';
  }
};

const SolicitudMedicamentosList = () => {
  const {
    mode,
    solicitudes,
    openCreate,
    openEdit,
    openDetail,
    loadingAction
  } = useSolicitudMedicamentosContext();

  const sortedSolicitudes = useMemo(
    () => [...solicitudes].sort((a, b) => (b.id ?? 0) - (a.id ?? 0)),
    [solicitudes]
  );

  return (
    <Card className="p-3">
      <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3 mb-3">
        <div>
          <h4 className="mb-1">Solicitudes de Medicamentos</h4>
          <div className="text-muted">
            Gestiona y da seguimiento a las solicitudes entre bodegas para este paciente.
          </div>
        </div>
        <Button onClick={openCreate} disabled={loadingAction}>
          Nueva Solicitud
        </Button>
      </div>

      <div className="table-responsive">
        <Table bordered hover size="sm" className="align-middle">
          <thead className="table-light">
            <tr>
              <th># Solicitud</th>
              <th>Fecha/Hora Envío</th>
              <th>Fecha/Hora Recibido</th>
              <th>Fecha/Hora Carga EC</th>
              <th>Origen</th>
              <th>Destino</th>
              <th>Estatus</th>
              <th style={{ width: 160 }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sortedSolicitudes.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center text-muted py-4">
                  No existen solicitudes registradas.
                </td>
              </tr>
            ) : (
              sortedSolicitudes.map((solicitud) => {
                const statusInfo = statusMap[solicitud.estatus] || {
                  label: solicitud.estatus,
                  variant: 'secondary'
                };
                const puedeEditar =
                  solicitud.estatus === 'PENDIENTE_ENVIAR' && mode !== 'form';

                return (
                  <tr key={solicitud.id}>
                    <td>#{solicitud.id}</td>
                    <td>{formatDateTime(solicitud.fecha_envio)}</td>
                    <td>{formatDateTime(solicitud.fecha_recibido)}</td>
                    <td>{formatDateTime(solicitud.fecha_cargado_ec)}</td>
                    <td>{solicitud.bodega_origen || '—'}</td>
                    <td>{solicitud.bodega_destino || '—'}</td>
                    <td>
                      <Badge bg={statusInfo.variant}>{statusInfo.label}</Badge>
                    </td>
                    <td className="d-flex gap-2">
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() => openDetail(solicitud)}
                        disabled={mode === 'form' && solicitud.id === null}
                      >
                        Ver
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-secondary"
                        onClick={() => openEdit(solicitud)}
                        disabled={!puedeEditar || loadingAction}
                      >
                        Editar
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>
      </div>
    </Card>
  );
};

export default SolicitudMedicamentosList;
