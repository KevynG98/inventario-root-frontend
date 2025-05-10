import React, { useContext } from 'react';
import { AppContext } from './Context';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FiEye, FiEdit } from 'react-icons/fi';

const ListadoAdmisiones = () => {
  const {
    admisionesData,
    cargarAdmision,
    setMostrarModal,
    setModoFormulario,
    setValue,
  } = useContext(AppContext);

  const handleVer = async (id) => {
    await cargarAdmision(id);
    setModoFormulario('ver');
    setMostrarModal(true);
  };

  const handleEditar = async (id) => {
    await cargarAdmision(id);
    setModoFormulario('editar');
    setMostrarModal(true);
  };

  return (
    <div className="mt-4">
      <h5 className="mb-3">Listado de Ordenes de Consulta Externa</h5>
      <div className="mb-3">
        <div className="d-flex justify-content-between align-items-center">
          <div style={{ width: '250px' }}>
            <input
              type="text"
              placeholder="Buscar..."
              className="form-control shadow-sm"
            />
          </div>
          <Button
            onClick={() => {
              setModoFormulario('crear');
              setMostrarModal(true);
            }}
          >
            Nuevo
          </Button>
        </div>
      </div>
      <table className="table table-bordered table-sm">
        <thead className="table-primary text-dark fw-semibold">
          <tr>
            <th>Solicitud</th>
            <th>Fecha</th>
            <th>Creado</th>
            <th>Paciente</th>
            <th>Edad</th>
            <th>Genero</th>
            <th>Área</th>
            <th>Identificacion</th>
            <th>Cita</th>
            <th>Observaciones</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {admisionesData.map((admision, idx) => (
            <tr key={idx}>
              <td>{admision.id_admision}</td>
              <td>{admision.fecha_admision}</td>
              <td>{admision.paciente}</td>
              <td>{admision.identificacion}</td>
              <td>{admision.genero}</td>
              <td>{admision.aseguradora}</td>
              <td>{admision.area}</td>
              <td>{admision.habitacion}</td>
              <td>{admision.medico_tratante || 'Sin Cita'}</td>
              <td></td>
              <td className="text-center">
                <OverlayTrigger overlay={<Tooltip>Editar admisión</Tooltip>}>
                  <Button className="btn btn-outline-secondary btn-sm" onClick={() => handleEditar(admision.id_admision)}>
                    <FiEdit />
                  </Button>
                </OverlayTrigger>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListadoAdmisiones;