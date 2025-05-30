import React from 'react';
import { OverlayTrigger, Tooltip, Button, Badge } from 'react-bootstrap';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useMyContext } from './Context';

const Marcas = () => {
  const {
    data,
    prevPage,
    nextPage,
    nullPrevPage,
    nullNextPage,
    setFechaInicio,
    setFechaFin,
    cargarDatos,
    fechaFin,
    fechaInicio,
    setPage
  } = useMyContext();

  return (
    <div className="mb-4">
      <h5 className="mb-3">Historial de movimientos</h5>

      <div className="d-flex flex-column flex-md-row align-items-md-end gap-3 mb-3">
        <div>
          <label>Desde:</label>
          <input
            type="date"
            className="form-control"
            value={fechaInicio}
            onChange={(e) => {
              setFechaInicio(e.target.value);
              cargarDatos();
            }}
          />
        </div>

        <div>
          <label>Hasta:</label>
          <input
            type="date"
            className="form-control"
            value={fechaFin}
            onChange={(e) => {
              setFechaFin(e.target.value);
              cargarDatos();
            }}
          />
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-sm mt-2 mb-0">
          <thead className="table-primary text-dark fw-semibold">
            <tr>
              <th className="text-center">Fecha</th>
              <th className="text-center">Usuario</th>
              <th className="text-center">Método</th>
              <th className="text-center">Descripción</th>
              <th className="text-center">Estado</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => {
              const metodoColor = {
                POST: 'badge-success',
                PUT: 'badge-warning text-dark',
                DELETE: 'badge-danger'
              }[item.metodo] || 'badge-secondary';

              return (
                <tr key={idx}>
                  <td>{new Date(item.fecha).toLocaleString()}</td>
                  <td>{item.usuario || 'Anónimo'}</td>
                  <td className="text-center">
                    <span className={`badge ${metodoColor}`}>
                      {{
                        POST: 'Crear',
                        PUT: 'Editar',
                        DELETE: 'Eliminar'
                      }[item.metodo] || item.metodo}
                    </span>
                  </td>
                  <td>{item.descripcion || '-'}</td>
                  <td className="text-center">
                    <span className={`badge ${item.exito ? 'badge-success' : 'badge-danger'}`}>
                      {item.exito ? 'Éxito' : 'Error'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-end mt-2">
        <Button onClick={prevPage} disabled={nullPrevPage === null}><FiChevronLeft /></Button>
        <Button onClick={nextPage} disabled={nullNextPage === null}><FiChevronRight /></Button>
      </div>
    </div>
  );
};

export default Marcas;
