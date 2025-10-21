import React, { useMemo } from 'react';
import { Badge, Button, Card, Table } from 'react-bootstrap';
import { useSignosEncamamientoContext } from './Context';

const SignosEncamamientoList = () => {
  const {
    registros,
    fields,
    loading,
    error,
    deleteRecord,
    formatDate
  } = useSignosEncamamientoContext();

  const headers = useMemo(
    () => [
      { key: 'timestamp', label: 'Fecha y hora', minWidth: 160 },
      { key: 'registrado', label: 'Registrado por', minWidth: 160 },
      ...fields.map((field) => ({
        key: field.id,
        label: field.label,
        minWidth: 120
      })),
      { key: 'comentarios', label: 'Comentarios', minWidth: 160 }
    ],
    [fields]
  );

  return (
    <Card className="shadow-sm border-0">
      <Card.Header className="bg-white border-0">
        <h4 className="mb-0">Registros anteriores</h4>
      </Card.Header>
      <Card.Body className="p-0">
        {error ? (
          <div className="p-4 text-center text-danger">{error}</div>
        ) : null}
        {loading && registros.length === 0 ? (
          <div className="p-4 text-center text-muted">
            Cargando signos vitales…
          </div>
        ) : null}
        {registros.length === 0 && !loading ? (
          <div className="p-4 text-center text-muted">
            Sin registros guardados hasta el momento.
          </div>
        ) : null}
        {registros.length > 0 ? (
          <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead>
                <tr>
                  {headers.map((header) => (
                    <th key={header.key} style={{ minWidth: header.minWidth }}>
                      {header.label}
                    </th>
                  ))}
                  <th className="text-end" style={{ minWidth: 120 }}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {registros.map((registro) => (
                  <tr key={registro.id}>
                    <td>{formatDate(registro.tomadoEn)}</td>
                    <td>
                      <div className="d-flex flex-column">
                        <span>{registro.tomadoPor}</span>
                      </div>
                    </td>
                    {fields.map((field) => (
                      <td key={`${registro.id}-${field.id}`}>
                        {registro.valores[field.id] ?? '—'}
                      </td>
                    ))}
                    <td>
                      {registro.comentarios ? (
                        <Badge bg="light" text="dark">
                          {registro.comentarios}
                        </Badge>
                      ) : '—'}
                    </td>
                    <td className="text-end">
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => {
                          if (
                            typeof deleteRecord === 'function' &&
                            window.confirm('¿Eliminar este registro?')
                          ) {
                            deleteRecord(registro.id);
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

export default SignosEncamamientoList;
