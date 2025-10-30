import React from 'react';
import { Button, Card, Table } from 'react-bootstrap';
import { useOperacionesContext } from './Context';

const Detail = () => {
  const { mode, selected, setMode } = useOperacionesContext();
  if (mode !== 'detail' || !selected) return null;

  return (
    <Card className="card p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Detalle de Operación #{selected.id}</h4>
        <Button variant="outline-secondary" onClick={() => setMode('list')}>
          Regresar
        </Button>
      </div>

      <p>
        <strong>Paciente:</strong> {selected.paciente} ({selected.edad} años)
        <br />
        <strong>Fecha:</strong> {selected.fecha} — {selected.hora} ({selected.dia})
        <br />
        <strong>Especialidad:</strong> {selected.especialidad}
        <br />
        <strong>Procedimiento:</strong> {selected.procedimiento}
        <br />
        <strong>Estatus:</strong> {selected.estatus}
      </p>

      <h6>Historial de acciones</h6>
      <Table bordered size="sm">
        <thead className="thead-light">
          <tr>
            <th>Acción</th>
            <th>Fecha y hora</th>
          </tr>
        </thead>
        <tbody>
          {selected.historial.length === 0 ? (
            <tr>
              <td colSpan="2" className="text-center text-muted">
                Sin historial registrado
              </td>
            </tr>
          ) : (
            selected.historial.map((h, idx) => (
              <tr key={idx}>
                <td>{h.accion}</td>
                <td>{h.fecha}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Card>
  );
};

export default Detail;