import React, { useEffect, useState, useContext } from 'react';
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Nav,
  Modal,
} from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { BiSearch } from 'react-icons/bi';
import { convert_fecha_ddmmaa } from '../../../utils/formatUtils';
import { FiAlignJustify } from "react-icons/fi";
import { AppContext } from './Context';

const FormularioAdmision = () => {

  const { guardarAdmision, loading, listarHabitaciones } = useContext(AppContext);

  const { register, handleSubmit, watch, setValue, getValues } = useForm();
  const [acompanantesVisibles, setAcompanantesVisibles] = useState([]);
  const [todayDate, setTodayDate] = useState('');
  const [mostrarModalFamiliar, setMostrarModalFamiliar] = useState(false);
  const [listaFamiliares, setListaFamiliares] = useState([]);
  const [seccionActiva, setSeccionActiva] = useState('datos-seguro');

  useEffect(() => {
    const hoy = new Date();
    const fechaGT = hoy.toLocaleDateString('es-GT'); // o puedes usar 'es-419' para LATAM
    setTodayDate(fechaGT);
  }, []);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'fechaNacimiento' && value.fechaNacimiento) {
        const edad = calcularEdad(value.fechaNacimiento);
        setValue('edad', edad);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  useEffect(() => {
    if (listaFamiliares.length > 0) {
      const primero = listaFamiliares[0];
      setValue('acompananteNombre', primero.nombre);
      setValue('acompananteTelefono', primero.telefono1);
    }
  }, [listaFamiliares, setValue]);

  const calcularEdad = (fecha) => {
    const nacimiento = new Date(fecha);
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  const agregarFamiliar = (nuevoFamiliar) => {
    const actualizada = [...listaFamiliares, nuevoFamiliar];
    setListaFamiliares(actualizada);
    setValue('familiares', actualizada);
  };

  const transformarCampos = (data) => {
    const output = {
      ...data,
      // Paciente
      p_primer_nombre: data.nombre,
      p_fecha_nacimiento: data.fechaNacimiento,
      p_genero: data.genero,
      p_estado_civil: data.estadoCivil,
      p_tipo_identificacion: data.tipoIdentificacion,
      p_numero_identificacion: data.numeroIdentificacion,
      p_telefono: data.telefono1,

      // Responsable
      responsablePrimerNombre: data.resp_primerNombre,
      responsablePrimerApellido: data.resp_primerApellido,
      responsableTelefono1: data.resp_telefono1,
      responsableTelefono2: data.resp_telefono2,
      responsableEmail: data.resp_email,
      responsableEmpresa: data.resp_empresa,
      responsableOcupacion: data.resp_ocupacion,

      // Acompañante directo
      acompananteNombre: data.acompananteNombre,
      acompananteTelefono: data.acompananteTelefono,

      // Datos laborales del paciente
      empresa: data.empresa,
      direccionEmpresa: data.direccionEmpresa,
      telefonoEmpresa1: data.telefonoEmpresa1,
      telefonoEmpresa2: data.telefonoEmpresa2,
      ocupacion: data.ocupacion,

      // Datos del seguro
      aseguradora: data.aseguradora,
      listaPrecios: data.listaPrecios,
      carnet: data.carnet,
      certificado: data.certificado,
      nombreTitular: data.nombreTitular,
      coaseguro: data.coaseguro,
      valorCopago: data.valorCopago,
      valorDeducible: data.valorDeducible,

      // Garantía de pago
      tipoGarantia: data.tipoGarantia,
      numeroTcCheque: data.numeroTcCheque,
      nombreFactura: data.nombreFactura,
      direccionFactura: data.direccionFactura,
      correoFactura: data.correoFactura,
    };

    if (data.acompanantes) {
      output.familiares = data.acompanantes;
      delete output.acompanantes;
    }

    delete output.nombre;
    delete output.fechaNacimiento;
    delete output.genero;
    delete output.estadoCivil;
    delete output.tipoIdentificacion;
    delete output.numeroIdentificacion;
    delete output.telefono1;

    return output;
  };

  const onSubmit = async (data) => {
    console.log('Formulario enviado:', data);
    try {
      const datosTransformados = transformarCampos(data);
      const resultado = await guardarAdmision(datosTransformados);
      alert('Guardado con éxito');
    } catch (err) {
      alert('Error al guardar');
    }
  };

  const showPrimaryModal = (e) => {
    if (e.key === 'Tab' || e.key === 'Enter') {
      setMostrarModalFamiliar(true)
    }
  }

  return (
    <Container className="p-4 bg-light rounded shadow-sm">
      {/* Encabezado */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold text-dark">Ficha del Paciente</h4>
        <div className="d-flex align-items-center">
          <span className="mr-3 font-weight-bold">Fecha: {todayDate}</span>
          <Button variant="primary"><FiAlignJustify /><span> Listado</span></Button>
          <Button
            variant="primary"
            className="mr-2"
            disabled={loading}
            onClick={handleSubmit(onSubmit)}
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </div>

      {/* Información del Paciente */}
      <h5 className="text-primary">Información del Paciente</h5>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row className="mb-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>ID (Ficha Paciente)</Form.Label>
              <div className="input-group">
                <Form.Control type="text" {...register('idFicha')} onKeyDown={showPrimaryModal} />
                <div className="input-group-append">
                  <span className="input-group-text" style={{ cursor: 'pointer' }} onClick={() => setMostrarModalFamiliar(true)}><BiSearch /></span>
                </div>
              </div>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" {...register('nombre')} />
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group>
              <Form.Label>Fecha de nacimiento</Form.Label>
              <Form.Control type="date" {...register('fechaNacimiento')} />
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group>
              <Form.Label>Edad</Form.Label>
              <Form.Control type="text" {...register('edad')} disabled />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Dirección</Form.Label>
              <Form.Control type="text" {...register('direccion')} />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Teléfono 1</Form.Label>
              <Form.Control type="text" {...register('telefono1')} />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Teléfono 2</Form.Label>
              <Form.Control type="text" {...register('telefono2')} />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Religión</Form.Label>
              <Form.Control as="select" {...register('religion')}>
                <option>Seleccione</option>
                <option>CATOLICA</option>
                <option>EVANGELICA</option>
                <option>JUDIA</option>
                <option>MORMONA</option>
                <option>MUSULMANA</option>
                <option>NO DEFINIDO</option>
                <option>TESTIGO DE JEHOVA</option>
              </Form.Control>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Tipo Identificación</Form.Label>
              <Form.Control as="select" {...register('tipoIdentificacion')}>
                <option>Seleccione</option>
                <option>DPI</option>
                <option>PASAPORTE</option>
              </Form.Control>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Número Identificación</Form.Label>
              <Form.Control type="text" {...register('numeroIdentificacion')} />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control type="email" {...register('correo')} />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Observación</Form.Label>
              <Form.Control as="textarea" rows={2} {...register('observacion')} />
            </Form.Group>
          </Col>
        </Row>

        <h5 className="text-primary mt-4">Quien lo acompaña</h5>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" {...register('acompananteNombre')} />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Teléfono</Form.Label>
              <Form.Control type="text" {...register('acompananteTelefono')} />
            </Form.Group>
          </Col>
        </Row>

        <h5 className="text-primary mt-4">Información de la Admisión</h5>
        <Row className="mb-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Área de Admisión</Form.Label>
              <Form.Control as="select" {...register('area_admision')}>
                <option>Seleccione</option>
                <option>EMERGENCIA</option>
                <option>ENCAMAMIENTO / HOSPITAL</option>
                <option>INTENSIVO</option>
                <option>NEONATO</option>
                <option>QUIROFANO / CIRUJIA</option>
              </Form.Control>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Habitación</Form.Label>
              <Form.Control as="select" {...register('habitacion')}>
                <option>Seleccione</option>
                {listarHabitaciones.map((data, index) => (
                  <option key={index} value={data.id}>
                    {`${data.codigo} - nivel: ${data.nivel}`}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Médico Tratante</Form.Label>
              <Form.Control as="select" {...register('medicoTratante')}>
                <option>Seleccione</option>
                <option>MEDICO 1</option>
                <option>MEDICO 2</option>
                <option>MEDICO 3</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>

        <h5 className="text-primary mt-4">Datos del Seguro</h5>
        <Row className="mb-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Aseguradora</Form.Label>
              <Form.Control type="text" {...register("aseguradora")} />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Número de póliza</Form.Label>
              <Form.Control type="text" {...register("numeroPoliza")} />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Carnet</Form.Label>
              <Form.Control type="text" {...register("carnet")} />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Certificado</Form.Label>
              <Form.Control type="text" {...register("certificado")} />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Nombre del titular</Form.Label>
              <Form.Control type="text" {...register("nombreTitular")} />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>% de Coaseguro</Form.Label>
              <Form.Control type="number" step="0.01" {...register("coaseguro")} />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Valor Copago</Form.Label>
              <Form.Control type="number" step="0.01" {...register("valorCopago")} />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Valor Deducible</Form.Label>
              <Form.Control type="number" step="0.01" {...register("valorDeducible")} />
            </Form.Group>
          </Col>
        </Row>

        <h5 className="text-primary mt-4">Responsable de Cuenta</h5>
        <Row className="mb-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Primer nombre</Form.Label>
              <Form.Control type="text" {...register('resp_primerNombre')} />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Primer apellido</Form.Label>
              <Form.Control type="text" {...register('resp_primerApellido')} />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>NIT</Form.Label>
              <Form.Control type="text" {...register('resp_nit')} />
            </Form.Group>
          </Col>
        </Row>

        <h5 className="text-primary mt-4">Datos Laborales del Paciente</h5>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Empresa</Form.Label>
              <Form.Control type="text" {...register('empresa')} />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Ocupación</Form.Label>
              <Form.Control type="text" {...register('ocupacion')} />
            </Form.Group>
          </Col>
        </Row>

        <h5 className="text-primary mt-4">Datos Laborales del Acompañante</h5>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Empresa</Form.Label>
              <Form.Control type="text" {...register('acompananteEmpresa')} />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Ocupación</Form.Label>
              <Form.Control type="text" {...register('acompananteOcupacion')} />
            </Form.Group>
          </Col>
        </Row>

        <h5 className="text-primary mt-4">Datos del Seguro</h5>
        <Row className="mb-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Aseguradora</Form.Label>
              <Form.Control type="text" {...register('aseguradora')} />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Número de póliza</Form.Label>
              <Form.Control type="text" {...register('numeroPoliza')} />
            </Form.Group>
          </Col>
        </Row>





        <h5 className="text-primary mt-4">Acompañantes</h5>
        <div className="mb-3">
          {[1, 2, 3, 4].map((n) => (
            <Button
              key={n}
              variant="outline-primary"
              className="mr-2"
              onClick={() => {
                if (!acompanantesVisibles.includes(n)) {
                  setAcompanantesVisibles([...acompanantesVisibles, n]);
                }
              }}
            >
              Acompañante No. {n}
            </Button>
          ))}
        </div>

        {acompanantesVisibles.map((n) => (
          <div key={n}>
            <h6 className="text-primary">Acompañante No. {n}</h6>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control type="text" {...register(`acompanantes.${n - 1}.nombre`)} />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control type="text" {...register(`acompanantes.${n - 1}.telefono`)} />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Tipo de familiar</Form.Label>
                  <Form.Control as="select" {...register(`acompanantes.${n - 1}.tipo`)}>
                    <option value="">Seleccione</option>
                    <option value="padre">Padre</option>
                    <option value="madre">Madre</option>
                    <option value="hijo">Hijo/a</option>
                    <option value="hermano">Hermano/a</option>
                    <option value="abuelo">Abuelo/a</option>
                    <option value="tio">Tío/a</option>
                    <option value="amigo">Amigo/a</option>
                    <option value="otro">Otro</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Dirección</Form.Label>
                  <Form.Control type="text" {...register(`acompanantes.${n - 1}.direccion`)} />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Empresa</Form.Label>
                  <Form.Control type="text" {...register(`acompanantes.${n - 1}.empresa`)} />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Ocupación</Form.Label>
                  <Form.Control type="text" {...register(`acompanantes.${n - 1}.ocupacion`)} />
                </Form.Group>
              </Col>
            </Row>
          </div>
        ))}

      </Form>


    </Container >
  );
};

export default FormularioAdmision;