import React from 'react';
import { Card, Table, Form } from 'react-bootstrap';
import { useDietasContext } from './Context';

const List = () => {
  const { dietas, fechaFiltro, filtrarPorFecha } = useDietasContext();

  return (
    <Card className="card p-3 mb-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h4>Dietas del Día</h4>
          <small className="text-muted">
            Registros agregados por enfermería — se actualizan automáticamente.
          </small>
        </div>

        <div>
          <Form.Label className="mb-0 mr-2">Filtrar por fecha:</Form.Label>
          <Form.Control
            type="date"
            value={fechaFiltro}
            onChange={(e) => filtrarPorFecha(e.target.value)}
          />
        </div>
      </div>

      <Table bordered hover size="sm" className="align-middle">
        <thead className="thead-light">
          <tr>
            <th>Admision</th>
            <th>Paciente</th>
            <th>Área</th>
            <th>Habitación</th>
            <th>Síntoma</th>
            <th>Dieta</th>
            <th>Observaciones</th>
          </tr>
        </thead>
        <tbody>
          {dietas.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center text-muted">
                No hay registros para la fecha seleccionada.
              </td>
            </tr>
          ) : (
            dietas.map((d) => (
              <tr key={d.id}>
                <td>{d.admision}</td>
                <td>{d.paciente}</td>
                <td>{d.area}</td>
                <td>{d.habitacion}</td>
                <td>{d.sintoma}</td>
                <td>{d.dieta}</td>
                <td>{d.observaciones}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Card>
  );
};

export default List;