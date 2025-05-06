import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { AppContext } from './Context';
import { FiEye, FiEdit, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import ModalAdmision from './ModalForm';

const ListadoAdmisiones = () => {
  const { admisionesData, cargarAdmision } = useContext(AppContext);
  const [seccionesAbiertas, setSeccionesAbiertas] = useState({});
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoFormulario, setModoFormulario] = useState('ver'); // 'ver' o 'editar'
  const [seccionActiva, setSeccionActiva] = useState('datos-seguro');

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
  } = useForm();

  const onSubmit = (data) => {
    console.log('Guardar:', data);
  };

  const handleVer = async (id) => {
    await cargarAdmision(id, setValue);
    setModoFormulario('ver');
    setMostrarModal(true);
  };

  const handleEditar = async (id) => {
    await cargarAdmision(id, setValue);
    setModoFormulario('editar');
    setMostrarModal(true);
  };

  const toggleSeccion = (area) => {
    setSeccionesAbiertas((prev) => ({
      ...prev,
      [area]: !prev[area],
    }));
  };

  const agrupadoPorArea = admisionesData.reduce((acc, admision) => {
    const area = admision.area || 'SIN ÁREA';
    if (!acc[area]) acc[area] = [];
    acc[area].push(admision);
    return acc;
  }, {});

  return (
    <>
      <div className="mt-4">
        <h5 className="mb-3">Listado de pacientes ingresados</h5>

        <div className="mb-3 w-25">
          <input
            type="text"
            placeholder="Buscar..."
            className="form-control shadow-sm"
          />
        </div>

        {Object.entries(agrupadoPorArea).map(([area, admisiones]) => {
          const areaKey = area || 'SIN ÁREA';
          const estaAbierta = seccionesAbiertas[areaKey] ?? true;

          return (
            <div key={areaKey} className="mb-4">
              <div
                className="fw-bold bg-light px-2 py-1 border rounded d-flex align-items-center"
                role="button"
                onClick={() => toggleSeccion(areaKey)}
              >
                {estaAbierta ? (
                  <>
                    <FiChevronDown className="me-2" />
                    <span>➤ Área =&gt; {areaKey.toUpperCase()}</span>
                  </>
                ) : (
                  <>
                    <FiChevronRight className="me-2" />
                    <span>➤ Área =&gt; {areaKey.toUpperCase()}</span>
                  </>
                )}
              </div>

              {estaAbierta && (
                <table className="table table-bordered table-sm mt-2">
                  <thead className="table-primary text-dark fw-semibold">
                    <tr>
                      <th>Admisión</th>
                      <th>Fecha</th>
                      <th>Paciente</th>
                      <th>Identificación</th>
                      <th>Género</th>
                      <th>Aseguradora</th>
                      <th>Área</th>
                      <th>Cama</th>
                      <th>Médico</th>
                      <th className="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admisiones.map((admision, idx) => (
                      <tr key={idx}>
                        <td>{admision.id_admision}</td>
                        <td>{admision.fecha_admision}</td>
                        <td>{admision.paciente}</td>
                        <td>{admision.identificacion}</td>
                        <td>{admision.genero}</td>
                        <td>{admision.aseguradora}</td>
                        <td>{admision.area}</td>
                        <td>{admision.habitacion}</td>
                        <td>{admision.medico_tratante || '-'}</td>
                        <td className="text-center">
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id={`tooltip-ver-${admision.id_admision}`}>Ver admisión</Tooltip>}
                          >
                            <Button className="btn btn-outline-secondary btn-sm me-1" onClick={() => handleVer(admision.id_admision)}>
                              <FiEye />
                            </Button>
                          </OverlayTrigger>

                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id={`tooltip-editar-${admision.id_admision}`}>Editar admisión</Tooltip>}
                          >
                            <Button className="btn btn-outline-secondary btn-sm" onClick={() => handleEditar(admision.id_admision)}>
                              <FiEdit />
                            </Button>
                          </OverlayTrigger>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          );
        })}
      </div>

      <ModalAdmision
        show={mostrarModal}
        onHide={() => setMostrarModal(false)}
        modo={modoFormulario}
        setValue={setValue}
        getValues={getValues}
        watch={watch}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        loading={false}
        todayDate={new Date().toISOString().slice(0, 10)} // o pasar desde contexto si ya lo tienes
        seccionActiva={seccionActiva}
        setSeccionActiva={setSeccionActiva}
        register={register}
      />
    </>
  );
};

export default ListadoAdmisiones;
