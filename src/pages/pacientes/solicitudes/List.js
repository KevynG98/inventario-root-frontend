import React from 'react';
import { Card, Table, Form, Button } from 'react-bootstrap';
import { useSolicitudesContext } from './Context';
import ModalSolicitud from './ModalSolicitud';

const List = () => {
  const { solicitudes, filtros, setFiltros, openModal } = useSolicitudesContext();

  return (
    <>
      <Card className="card p-3 mb-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h4>Solicitudes de Medicamentos</h4>
            <small className="text-muted">
              Muestra solicitudes con estatus 'Nueva' por defecto.
            </small>
          </div>

          <div className="d-flex">
            <Form.Control
              type="date"
              value={filtros.fecha}
              onChange={(e) =>
                setFiltros((p) => ({ ...p, fecha: e.target.value }))
              }
              className="mr-2"
            />
            <Form.Control
              type="text"
              placeholder="Buscar bodega..."
              value={filtros.bodega}
              onChange={(e) =>
                setFiltros((p) => ({ ...p, bodega: e.target.value }))
              }
              className="mr-2"
            />
            <Form.Control
              as="select"
              value={filtros.estatus}
              onChange={(e) =>
                setFiltros((p) => ({ ...p, estatus: e.target.value }))
              }
            >
              <option>Nueva</option>
              <option>En Proceso</option>
              <option>Pendiente de Recibir</option>
              <option>Cargado al Estado de Cuenta</option>
            </Form.Control>
          </div>
        </div>

        <Table bordered hover size="sm" className="align-middle">
          <thead className="thead-light">
            <tr>
              <th>#Solicitud</th>
              <th>Admision</th>
              <th>Paciente</th>
              <th>Área</th>
              <th>Habitación</th>
              <th>Bodega Origen</th>
              <th>Bodega Destino</th>
              <th>Estatus</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {solicitudes.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center text-muted">
                  No hay solicitudes que coincidan con el filtro.
                </td>
              </tr>
            ) : (
              solicitudes.map((s) => (
                <tr key={s.id}>
                  <td>#{s.id}</td>
                  <td>{s.admision}</td>
                  <td>{s.paciente}</td>
                  <td>{s.area}</td>
                  <td>{s.habitacion}</td>
                  <td>{s.bodega_origen}</td>
                  <td>{s.bodega_destino}</td>
                  <td>{s.estatus}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="outline-primary"
                      onClick={() => openModal('ver', s)}
                      className="mr-2 mb-1"
                    >
                      Ver
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-secondary"
                      onClick={() => openModal('editar', s)}
                      className="mb-1"
                    >
                      Editar
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Card>

      <ModalSolicitud />
    </>
  );
};

export default List;