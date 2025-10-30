import React from 'react';
import { Button, Table, Badge, Card } from 'react-bootstrap';
import { useOperacionesContext } from './Context';

const List = () => {
  const { operaciones, openNew, openEdit, openDetail, updateStatus } =
    useOperacionesContext();

  const visibles = operaciones.filter((op) =>
    ['Programado', 'En Proceso', 'En Recuperación'].includes(op.estatus)
  );

  return (
    <Card className="card p-3 mb-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h4>Calendario de Operaciones</h4>
          <small className="text-muted">
            Listado de operaciones programadas y en proceso.
          </small>
        </div>
        <Button variant="primary" onClick={openNew}>
          Nueva Operación
        </Button>
      </div>

      <Table bordered hover size="sm" className="align-middle">
        <thead className="thead-light">
          <tr>
            <th>Fecha</th>
            <th>Día</th>
            <th>Hora</th>
            <th>Paciente</th>
            <th>Edad</th>
            <th>Especialidad</th>
            <th>Procedimiento</th>
            <th>Estatus</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {visibles.length === 0 ? (
            <tr>
              <td colSpan={9} className="text-center text-muted">
                No hay operaciones registradas.
              </td>
            </tr>
          ) : (
            visibles.map((op) => (
              <tr key={op.id}>
                <td>{op.fecha}</td>
                <td>{op.dia}</td>
                <td>{op.hora}</td>
                <td>{op.paciente}</td>
                <td>{op.edad}</td>
                <td>{op.especialidad}</td>
                <td>{op.procedimiento}</td>
                <td>
                  <Badge variant="secondary">{op.estatus}</Badge>
                </td>
                <td className="d-flex flex-wrap">
                  <Button
                    size="sm"
                    variant="outline-primary"
                    onClick={() => openDetail(op)}
                    className="mr-1 mb-1"
                  >
                    Ver
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    onClick={() => openEdit(op)}
                    className="mr-1 mb-1"
                  >
                    Editar
                  </Button>
                  {op.estatus === 'Programado' && (
                    <Button
                      size="sm"
                      variant="outline-success"
                      onClick={() => updateStatus(op.id, 'En Proceso')}
                      className="mb-1"
                    >
                      Iniciar
                    </Button>
                  )}
                  {op.estatus === 'En Proceso' && (
                    <>
                      <Button
                        size="sm"
                        variant="outline-info"
                        onClick={() => updateStatus(op.id, 'En Recuperación')}
                        className="mr-1 mb-1"
                      >
                        Recuperación
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => updateStatus(op.id, 'Cancelada')}
                        className="mb-1"
                      >
                        Cancelar
                      </Button>
                    </>
                  )}
                  {op.estatus === 'En Recuperación' && (
                    <Button
                      size="sm"
                      variant="outline-warning"
                      onClick={() => updateStatus(op.id, 'Finalizado')}
                    >
                      Traslado
                    </Button>
                  )}
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