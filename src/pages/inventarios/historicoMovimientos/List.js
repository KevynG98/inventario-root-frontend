import React from 'react';
import { OverlayTrigger, Tooltip, Button, Badge } from 'react-bootstrap';
import { FiEye, FiEdit, FiChevronLeft, FiChevronRight, FiTrash2 } from 'react-icons/fi';
import { useMyContext } from './Context';

const Marcas = () => {
  const {
    data,
    prevPage,
    nextPage,
    nullPrevPage,
    nullNextPage,
    abrirModalEditar,
    abrirModalVer,
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

      <div className="d-flex align-items-end gap-3 mb-3">
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

        {/* <div>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => {
              setFechaInicio('');
              setPage(1)
            }}
          >
            Limpiar fecha
          </button>
        </div> */}
      </div>

      <table className="table table-bordered table-sm mt-2">
        <thead className="table-primary text-dark fw-semibold">
          <tr>
            <th className="text-center">ID</th>
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
                <td className="text-center">{idx + 1}</td>
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

      <div className="d-flex justify-content-end">
        <Button onClick={prevPage} disabled={nullPrevPage === null}><FiChevronLeft /></Button>
        <Button onClick={nextPage} disabled={nullNextPage === null}><FiChevronRight /></Button>
      </div>
    </div>
  );
};

export default Marcas;