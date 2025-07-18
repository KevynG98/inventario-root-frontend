import React from 'react';
import { OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import { FiEye, FiEdit, FiChevronLeft, FiChevronRight, FiTrash2 } from 'react-icons/fi';
import { useCajeroContext } from './ContextCajeros';

const CajeroList = () => {
  const {
    data,
    abrirModalCrear,
    abrirModalEditar,
    abrirModalVer,
    prevPage,
    nextPage,
    nullPrevPage,
    nullNextPage,
    eliminarCajero
  } = useCajeroContext();

  return (
    <div className="mb-4">
      <h5 className="mb-3">Listado de Cajeros</h5>

      <div className="mb-3">
        <div className="row g-2">
          <div className="col-12 col-md-10">
            <input type="text" placeholder="Buscar..." className="form-control shadow-sm w-100" />
          </div>
          <div className="col-12 col-md-2">
            <Button className="w-100" onClick={abrirModalCrear}>Nuevo Cajero</Button>
          </div>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-sm mt-2">
          <thead className="table-primary text-dark fw-semibold">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Clave</th>
              <th>Bodega</th>
              <th>Activo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.map((cajero, idx) => (
              <tr key={idx}>
                <td>{cajero.id}</td>
                <td>{cajero.nombre}</td>
                <td>{cajero.clave}</td>
                <td>{cajero.bodega_nombre || '—'}</td>
                <td>{cajero.esta_activo ? 'Sí' : 'No'}</td>
                <td>
                  <OverlayTrigger overlay={<Tooltip>Ver</Tooltip>}>
                    <Button className="btn btn-outline-secondary btn-sm me-1" onClick={() => abrirModalVer(cajero)}><FiEye /></Button>
                  </OverlayTrigger>
                  <OverlayTrigger overlay={<Tooltip>Editar</Tooltip>}>
                    <Button className="btn btn-outline-secondary btn-sm me-1" onClick={() => abrirModalEditar(cajero)}><FiEdit /></Button>
                  </OverlayTrigger>
                  <OverlayTrigger overlay={<Tooltip>Eliminar</Tooltip>}>
                    <Button className="btn btn-outline-secondary btn-sm" onClick={() => eliminarCajero(cajero.id)}><FiTrash2 /></Button>
                  </OverlayTrigger>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-end mt-3">
        <Button onClick={prevPage} disabled={nullPrevPage === null} className="me-2"><FiChevronLeft /></Button>
        <Button onClick={nextPage} disabled={nullNextPage === null}><FiChevronRight /></Button>
      </div>
    </div>
  );
};

export default CajeroList;
