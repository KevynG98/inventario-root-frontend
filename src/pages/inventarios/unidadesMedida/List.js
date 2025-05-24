import React from 'react';
import { OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import { FiEye, FiEdit, FiChevronLeft, FiChevronRight, FiTrash2 } from 'react-icons/fi';
import { useMyContext } from './Context';

const Medidas = () => {
  const {
    data,
    abrirModalCrear,
    abrirModalEditar,
    abrirModalVer,
    prevPage,
    nextPage,
    nullPrevPage,
    nullNextPage,
    eliminarProveedor
  } = useMyContext();

  const handleVer = (prov) => abrirModalVer(prov);
  const handleEditar = (prov) => abrirModalEditar(prov);

  return (
    <div className="mb-4">
      <h5 className="mb-3">Unidades de Medida</h5>
      <Button onClick={abrirModalCrear}>Nueva Medida</Button>
      <table className="table table-bordered table-sm mt-2">
        <thead className="table-primary text-dark fw-semibold">
          <tr>
            <th className="text-center">ID</th>
            <th className="text-center">Siglas</th>
            <th className="text-center">Nombre</th>
            <th className="text-center">Estado</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((prov, idx) => (
            <tr key={idx}>
              <td>{prov.id}</td>
              <td>{prov.siglas}</td>
              <td>{prov.nombre}</td>
              <td>{prov.estado === 'alta' ? 'Alta' : 'Baja'}</td>
              <td className="text-center">
                <OverlayTrigger overlay={<Tooltip>Ver medida</Tooltip>}>
                  <Button className="btn btn-outline-secondary btn-sm me-1" onClick={() => handleVer(prov)}>
                    <FiEye />
                  </Button>
                </OverlayTrigger>
                <OverlayTrigger overlay={<Tooltip>Editar medida</Tooltip>}>
                  <Button className="btn btn-outline-secondary btn-sm" onClick={() => handleEditar(prov)}>
                    <FiEdit />
                  </Button>
                </OverlayTrigger>
                <OverlayTrigger overlay={<Tooltip>Eliminar medida</Tooltip>}>
                  <Button className="btn btn-outline-secondary btn-sm" onClick={() => eliminarProveedor(prov.id)}>
                    <FiTrash2 />
                  </Button>
                </OverlayTrigger>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="d-flex justify-content-end">
        <Button onClick={prevPage} disabled={nullPrevPage === null}><FiChevronLeft /></Button>
        <Button onClick={nextPage} disabled={nullNextPage === null}><FiChevronRight /></Button>
      </div>
    </div>
  );
};

export default Medidas;