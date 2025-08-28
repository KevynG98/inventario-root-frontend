// List.js
import React, { useContext, useState } from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FiEye, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { AppContext } from './Context';

const List = () => {
  const { abrirModal, requisiciones } = useContext(AppContext);
  const [busqueda, setBusqueda] = useState('');

  const filteredData = requisiciones.filter((r) => {
    const texto = busqueda.toLowerCase();
    return (
      (r.descripcion || '').toLowerCase().includes(texto) ||
      (r.tipo_requisicion || '').toLowerCase().includes(texto) ||
      (r.estado || '').toLowerCase().includes(texto) ||
      (r.usuario || '').toLowerCase().includes(texto) ||
      (r.centro_costo || '').toLowerCase().includes(texto) ||
      (r.area_solicitante || '').toLowerCase().includes(texto)
    );
  });

  return (
    <div className="mb-4">
      <h5 className="mb-3">Listado de Requisiciones</h5>

      <div className="mb-3">
        <div className="row g-2">
          <div className="col-12 col-md-10">
            <input
              type="text"
              placeholder="Buscar..."
              className="form-control shadow-sm w-100"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <div className="col-12 col-md-2">
            <Button className="w-100" onClick={() => setBusqueda('')}>
              Limpiar
            </Button>
          </div>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-sm mt-2">
          <thead className="table-primary text-dark fw-semibold">
            <tr>
              <th className="text-center">No. Requisicion</th>
              <th className="text-center">Fecha</th>
              <th className="text-center">Usuario</th>
              <th className="text-center">Centro de Costo</th>
              <th className="text-center">Departamento</th>
              <th className="text-center">Bodega</th>
              <th className="text-center">Descripcion</th>
              <th className="text-center">Tipo de Requisicion</th>
              <th className="text-center">Prioridad</th>
              <th className="text-center">Estatus</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center text-muted">No se encontraron resultados</td>
              </tr>
            ) : (
              filteredData.map((req, idx) => (
                <tr key={idx}>
                  <td className="text-center">{req.id}</td>
                  <td className="text-center">{req.fecha}</td>
                  <td className="text-center">{req.usuario || '-'}</td>
                  <td className="text-center">{req.centro_costo || '-'}</td>
                  <td className="text-center">{req.area_solicitante || '-'}</td>
                  <td className="text-center">{req.bodega_nombre || req.bodega}</td>
                  <td className="text-center">{req.descripcion}</td>
                  <td className="text-center">{req.tipo_requisicion}</td>
                  <td>{req.prioridad}</td>
                  <td className="text-center">{req.estado}</td>
                  <td className="text-center">
                    <OverlayTrigger overlay={<Tooltip>Ver Detalle</Tooltip>}>
                      <Button className="btn btn-outline-secondary btn-sm" onClick={() => abrirModal(req)}>
                        <FiEye />
                      </Button>
                    </OverlayTrigger>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-end mt-3">
        <Button className="me-2" disabled>
          <FiChevronLeft />
        </Button>
        <Button disabled>
          <FiChevronRight />
        </Button>
      </div>
    </div>
  );
};

export default List;
