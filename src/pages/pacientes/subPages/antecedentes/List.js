import React from 'react';
import { Badge, Button, Card, Table } from 'react-bootstrap';
import { useAntecedentesContext } from './Context';

const AntecedentesList = () => {
  const {
    title,
    records,
    loading,
    error,
    activeRecordId,
    startCreate,
    startEdit,
    startViewOnly,
    handleDelete
  } = useAntecedentesContext();

  return (
    <Card className="shadow-sm border-0">
      <Card.Header className="bg-white border-0 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <div>
          <h4 className="mb-1">{title} - Listado General</h4>
          <small className="text-muted">
            Consulta los antecedentes clínicos registrados.
          </small>
        </div>
        <Button onClick={startCreate}>Nuevo antecedente</Button>
      </Card.Header>
      <Card.Body className="p-0">
        {error ? (
          <div className="p-4 text-center text-danger">{error}</div>
        ) : null}
        {loading && records.length === 0 ? (
          <div className="p-4 text-center text-muted">
            Cargando antecedentes clínicos...
          </div>
        ) : null}
        {records.length === 0 && !loading ? (
          <div className="p-4 text-center text-muted">
            Aún no hay antecedentes registrados.
          </div>
        ) : null}
        {records.length > 0 ? (
          <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead>
                <tr>
                  <th style={{ minWidth: '180px' }}>Fecha</th>
                  <th style={{ minWidth: '220px' }}>Registrado por</th>
                  <th style={{ minWidth: '120px' }}>Tipo</th>
                  <th>Descripción</th>
                  <th style={{ minWidth: '180px' }} className="text-end">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr
                    key={record.id}
                    className={
                      String(activeRecordId) === String(record.id)
                        ? 'table-primary'
                        : undefined
                    }
                  >
                    <td>{record.registradoEnLabel}</td>
                    <td>
                      <div className="d-flex flex-column">
                        <span>{record.registrado_por}</span>
                        {record.actualizadoEnLabel ? (
                          <small className="text-muted">
                            Actualizado {record.actualizadoEnLabel}
                          </small>
                        ) : null}
                      </div>
                    </td>
                    <td>
                      <Badge bg="light" text="dark">
                        {record.tipoLabel}
                      </Badge>
                    </td>
                    <td>
                      <div
                        className="antecedente-preview"
                        dangerouslySetInnerHTML={{ __html: record.descripcion }}
                      />
                    </td>
                    <td className="text-end">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => startViewOnly(record.id)}
                      >
                        Ver
                      </Button>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="ms-2"
                        onClick={() => startEdit(record.id)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="ms-2"
                        onClick={() => {
                          if (
                            typeof handleDelete === 'function' &&
                            window.confirm('¿Eliminar este antecedente?')
                          ) {
                            handleDelete(record.id);
                          }
                        }}
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        ) : null}
      </Card.Body>
    </Card>
  );
};

export default AntecedentesList;
