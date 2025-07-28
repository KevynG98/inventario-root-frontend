// Form.js
import React, { useContext } from 'react';
import { Table, Spinner } from 'react-bootstrap';
import { AppContext } from './Context';

const FormularioOrdenCompra = () => {
  const { soloAprobadas } = useContext(AppContext);

  return (
    <div className="container mt-4">
      <h4 className="mb-3">Listado de Requisiciones Aprobadas</h4>

      {!soloAprobadas ? (
        <Spinner animation="border" variant="primary" />
      ) : soloAprobadas.length === 0 ? (
        <p className="text-muted">No hay requisiciones aprobadas.</p>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover size="sm">
            <thead className="table-primary">
              <tr>
                <th className="text-center">ID</th>
                <th>Descripción</th>
                <th>Centro Costo</th>
                <th>Área Solicitante</th>
                <th>Tipo</th>
                <th>Prioridad</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {soloAprobadas.map((req) => (
                <tr key={req.id}>
                  <td className="text-center">{req.id}</td>
                  <td>{req.descripcion}</td>
                  <td>{req.centro_costo}</td>
                  <td>{req.area_solicitante}</td>
                  <td>{req.tipo_requisicion}</td>
                  <td>{req.prioridad}</td>
                  <td>{req.estado}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default FormularioOrdenCompra;
