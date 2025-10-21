import React from 'react';
import { Button, Card, Table } from 'react-bootstrap';
import { useMedicoTratanteContext } from './Context';

const MedicoTratanteList = () => {
  const {
    title,
    columns,
    items,
    loading,
    startEditing,
    onRemove
  } = useMedicoTratanteContext();

  return (
    <Card className="shadow-sm border-0">
      <Card.Header className="bg-white border-0">
        <h4 className="mb-0">{title}</h4>
        {/* <small className="text-muted">
          Pendiente de definir campos y fuente de datos.
        </small> */}
      </Card.Header>
      <Card.Body className="p-0">
        <Table responsive hover className="mb-0">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
              <th className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + 1} className="text-center py-4">
                  Cargando médicos tratantes...
                </td>
              </tr>
            ) : items.length > 0 ? (
              items.map((item) => (
                <tr key={item.id}>
                  {columns.map((col) => (
                    <td key={col.key}>{item[col.key] ?? '—'}</td>
                  ))}
                  <td className="text-end">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => startEditing(item)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => onRemove?.(item.id)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="text-center py-4">
                  Sin registros por el momento.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default MedicoTratanteList;
