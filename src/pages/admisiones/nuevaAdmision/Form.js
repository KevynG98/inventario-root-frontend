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

  const { guardarAdmision, loading } = useContext(AppContext);

  const { register, handleSubmit, watch, setValue, getValues } = useForm();
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

  const onSubmit = async (data) => {
    console.log('Formulario enviado:', data);
    try {
      data.familiares = listaFamiliares; // si estás usando familiares
      const resultado = await guardarAdmision(data);
      alert('Formulario guardado correctamente');
    } catch (error) {
      alert('Error al guardar el formulario');
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
        <h4 className="fw-bold text-dark">Ficha de Admisión</h4>
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
                <option>HABITACION 1</option>
                <option>HABITACION 2</option>
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

        <Nav variant="tabs" activeKey={seccionActiva} onSelect={(selectedKey) => setSeccionActiva(selectedKey)}>
          <Nav.Item><Nav.Link eventKey="datos-seguro">Datos del Seguro</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="garantia">Garantía de Pago</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="laborales">Datos Laborales</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="responsable">Responsable</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="esposo">Esposo(a)</Nav.Link></Nav.Item>
          {/* <Nav.Item><Nav.Link eventKey="cuenta">Estado de Cuenta</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="documentos">Documentos</Nav.Link></Nav.Item> */}
        </Nav>

        <div className="mt-3">
          {seccionActiva === 'datos-seguro' && (
            <>
              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Aseguradora *</Form.Label>
                    <Form.Control as="select" {...register('aseguradora')}>
                      <option value="">Seleccione</option>
                      <option value="aseg1">Aseguradora 1</option>
                      <option value="aseg2">Aseguradora 2</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Lista de precios *</Form.Label>
                    <Form.Control as="select" {...register('listaPrecios')}>
                      <option value="">Seleccione</option>
                      <option value="lista1">Lista 1</option>
                      <option value="lista2">Lista 2</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Carnet</Form.Label>
                    <Form.Control type="text" {...register('carnet')} />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Certificado</Form.Label>
                    <Form.Control type="text" {...register('certificado')} />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Nombre del titular</Form.Label>
                    <Form.Control type="text" {...register('nombreTitular')} />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>% de CoAseguro</Form.Label>
                    <Form.Control type="number" step="0.01" {...register('coaseguro')} />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Valor Copago</Form.Label>
                    <Form.Control type="number" step="0.01" {...register('valorCopago')} />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Valor Deducible</Form.Label>
                    <Form.Control type="number" step="0.0001" {...register('valorDeducible')} />
                  </Form.Group>
                </Col>
              </Row>
            </>
          )}

          {seccionActiva === 'garantia' && (
            <>
              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Garantía de Pago *</Form.Label>
                    <Form.Control as="select" {...register('garantiaPago')}>
                      <option value="">Seleccione ...</option>
                      <option value="garantia1">Garantía 1</option>
                      <option value="garantia2">Garantía 2</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label># de TC / Cheque</Form.Label>
                    <Form.Control type="text" {...register('tcCheque')} />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>NIT</Form.Label>
                    <Form.Control type="text" {...register('nit')} />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Nombre factura</Form.Label>
                    <Form.Control type="text" {...register('nombreFactura')} />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Dirección factura</Form.Label>
                    <Form.Control type="text" {...register('direccionFactura')} />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Correo Factura</Form.Label>
                    <Form.Control type="email" {...register('correoFactura')} />
                  </Form.Group>
                </Col>
              </Row>
            </>
          )}

          {seccionActiva === 'laborales' && (
            <>
              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Empresa</Form.Label>
                    <Form.Control type="text" {...register('empresa')} />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Dirección</Form.Label>
                    <Form.Control type="text" {...register('direccionEmpresa')} />
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group>
                    <Form.Label>Teléfono 1</Form.Label>
                    <Form.Control type="text" {...register('telefonoEmpresa1')} />
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group>
                    <Form.Label>Teléfono 2</Form.Label>
                    <Form.Control type="text" {...register('telefonoEmpresa2')} />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Ocupación</Form.Label>
                    <Form.Control type="text" {...register('ocupacion')} />
                  </Form.Group>
                </Col>
              </Row>
            </>
          )}

          {seccionActiva === 'responsable' && (
            <>
              <Row className="mb-3">
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Primer nombre</Form.Label>
                    <Form.Control type="text" {...register('resp_primerNombre')} />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Segundo nombre</Form.Label>
                    <Form.Control type="text" {...register('resp_segundoNombre')} />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Primer apellido</Form.Label>
                    <Form.Control type="text" {...register('resp_primerApellido')} />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Segundo apellido</Form.Label>
                    <Form.Control type="text" {...register('resp_segundoApellido')} />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Tipo identificación</Form.Label>
                    <Form.Control as="select" {...register('resp_tipoIdentificacion')}>
                      <option value="">Seleccione</option>
                      <option value="dpi">DPI</option>
                      <option value="pasaporte">Pasaporte</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Número de identificación</Form.Label>
                    <Form.Control type="text" {...register('resp_numeroIdentificacion')} />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Fecha de nacimiento</Form.Label>
                    <Form.Control type="date" {...register('resp_fechaNacimiento')} />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Edad</Form.Label>
                    <Form.Control type="number" {...register('resp_edad')} />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Género</Form.Label>
                    <Form.Control as="select" {...register('resp_genero')}>
                      <option value="">Seleccione</option>
                      <option value="masculino">Masculino</option>
                      <option value="femenino">Femenino</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Relación con el paciente</Form.Label>
                    <Form.Control as="select" {...register('resp_relacionPaciente')}>
                      <option value="">Seleccione</option>
                      <option value="padre">Padre</option>
                      <option value="madre">Madre</option>
                      <option value="conyuge">Cónyuge</option>
                      <option value="otro">Otro</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Ocupación</Form.Label>
                    <Form.Control type="text" {...register('resp_ocupacion')} />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Domicilio</Form.Label>
                    <Form.Control type="text" {...register('resp_domicilio')} />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Empresa</Form.Label>
                    <Form.Control type="text" {...register('resp_empresa')} />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Dirección</Form.Label>
                    <Form.Control type="text" {...register('resp_direccion')} />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Teléfono 1</Form.Label>
                    <Form.Control type="text" {...register('resp_telefono1')} />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Teléfono 2</Form.Label>
                    <Form.Control type="text" {...register('resp_telefono2')} />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Contacto</Form.Label>
                    <Form.Control type="text" {...register('resp_contacto')} />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Correo electrónico</Form.Label>
                    <Form.Control type="email" {...register('resp_email')} />
                  </Form.Group>
                </Col>
              </Row>
            </>
          )}

          {seccionActiva === 'esposo' && (
            <>
              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control type="text" {...register('esposo_nombre')} />
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group>
                    <Form.Label>Género</Form.Label>
                    <Form.Control as="select" {...register('esposo_genero')}>
                      <option value="">Seleccione</option>
                      <option value="masculino">Masculino</option>
                      <option value="femenino">Femenino</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Tipo de identificación</Form.Label>
                    <Form.Control as="select" {...register('esposo_tipoIdentificacion')}>
                      <option value="">Seleccione</option>
                      <option value="dpi">DPI</option>
                      <option value="pasaporte">Pasaporte</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Número de identificación</Form.Label>
                    <Form.Control type="text" {...register('esposo_numeroIdentificacion')} />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Fecha de nacimiento</Form.Label>
                    <Form.Control type="date" {...register('esposo_fechaNacimiento')} />
                  </Form.Group>
                </Col>
                <Col md={1}>
                  <Form.Group>
                    <Form.Label>Edad</Form.Label>
                    <Form.Control type="number" {...register('esposo_edad')} />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Teléfono 1</Form.Label>
                    <Form.Control type="text" {...register('esposo_telefono1')} />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Teléfono 2</Form.Label>
                    <Form.Control type="text" {...register('esposo_telefono2')} />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Domicilio</Form.Label>
                    <Form.Control type="text" {...register('esposo_domicilio')} />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Ocupación</Form.Label>
                    <Form.Control type="text" {...register('esposo_ocupacion')} />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Empresa</Form.Label>
                    <Form.Control type="text" {...register('esposo_empresa')} />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Dirección</Form.Label>
                    <Form.Control type="text" {...register('esposo_direccion')} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Correo electrónico</Form.Label>
                    <Form.Control type="email" {...register('esposo_email')} />
                  </Form.Group>
                </Col>
              </Row>
            </>
          )}

          {/* {seccionActiva === 'cuenta' && <h1>Estado de Cuenta</h1>}
          {seccionActiva === 'documentos' && <h1>Documentos</h1>} */}
        </div>

      </Form>

      {/* Modal de familiar */}
      <Modal show={mostrarModalFamiliar} onHide={() => setMostrarModalFamiliar(false)} centered size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Ficha del Paciente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={(e) => {
              e.preventDefault();

              // 1. Obtener los datos del familiar antes de limpiar
              const datosFamiliar = {
                nombre: getValues('f_nombre'),
                fecha_nacimiento: getValues('f_fecha_nacimiento'),
                edad: getValues('f_fecha_nacimiento') ? calcularEdad(getValues('f_fecha_nacimiento')) : '',
                tipo_identificacion: getValues('f_tipo_identificacion'),
                numero_identificacion: getValues('f_numero_identificacion'),
                direccion: getValues('f_direccion'),
                correo: getValues('f_correo'),
                telefono1: getValues('f_telefono1'),
                telefono2: getValues('f_telefono2'),
                empresa: getValues('f_empresa'),
                ocupacion: getValues('f_ocupacion'),
              };              

              const nuevoFamiliar = {
                ...datosFamiliar,
              };

              console.log(nuevoFamiliar)

              // 2. Agregar a la lista
              agregarFamiliar(nuevoFamiliar);

              // 3. Limpiar los campos del familiar
              const camposFamiliar = [
                'f_nombre', 'f_direccion', 'f_correo', 'f_telefono1', 'f_telefono2',
                'f_empresa', 'f_direccion_empresa', 'f_ocupacion'
              ];
              camposFamiliar.forEach((campo) => setValue(campo, ''));

              // 4. Copiar datos del paciente (prefijo p_) al formulario principal
              const camposPaciente = [
                { origen: 'p_primer_nombre', destino: 'nombre' },
                { origen: 'p_direccion', destino: 'direccion' },
                { origen: 'p_correo', destino: 'correo' },
                { origen: 'p_telefono', destino: 'telefono1' },
                { origen: 'p_fecha_nacimiento', destino: 'fechaNacimiento' },
                { origen: 'p_tipo_identificacion', destino: 'tipoIdentificacion' },
                { origen: 'p_numero_identificacion', destino: 'numeroIdentificacion' },
              ];

              camposPaciente.forEach(({ origen, destino }) => {
                const valor = getValues(origen);
                setValue(destino, valor);
              });

              // 5. Calcular edad y colocarla
              if (getValues('p_fecha_nacimiento')) {
                setValue('edad', calcularEdad(getValues('p_fecha_nacimiento')));
              }
            }}

          >

            {/* Campos del paciente */}
            < Row className="mb-3" >
              <Col md={3}><Form.Label>Primer nombre</Form.Label><Form.Control {...register('p_primer_nombre')} /></Col>
              <Col md={3}><Form.Label>Segundo nombre</Form.Label><Form.Control {...register('p_segundo_nombre')} /></Col>
              <Col md={3}><Form.Label>Primer Apellido</Form.Label><Form.Control {...register('p_primer_apellido')} /></Col>
              <Col md={3}><Form.Label>Segundo Apellido</Form.Label><Form.Control {...register('p_segundo_apellido')} /></Col>
            </Row>
            <Row className="mb-3">
              <Col md={2}><Form.Label>Género</Form.Label><Form.Control as="select" {...register('p_genero')}>
                <option value="">Seleccione</option><option>Masculino</option><option>Femenino</option></Form.Control></Col>
              <Col md={2}><Form.Label>Estado Civil</Form.Label><Form.Control as="select" {...register('p_estado_civil')}>
                <option value="">Seleccione</option><option>Soltero</option><option>Casado</option><option>Divorciado</option><option>Viudo</option>
              </Form.Control></Col>
              <Col md={3}><Form.Label>Apellido de casada</Form.Label><Form.Control {...register('p_apellido_casada')} /></Col>
              <Col md={2}><Form.Label>Teléfono</Form.Label><Form.Control {...register('p_telefono')} /></Col>
            </Row>
            <Row className="mb-3">
              <Col md={3}><Form.Label>Fecha Nacimiento</Form.Label><Form.Control type="date" {...register('p_fecha_nacimiento')} /></Col>
              <Col md={1}><Form.Label>Edad</Form.Label><Form.Control value={watch('p_fecha_nacimiento') ? calcularEdad(watch('p_fecha_nacimiento')) : ''} disabled /></Col>
              <Col md={3}><Form.Label>Tipo de Identificación</Form.Label><Form.Control as="select" {...register('p_tipo_identificacion')}>
                <option value="">Seleccione</option><option>DPI</option><option>PASAPORTE</option></Form.Control></Col>
              <Col md={5}><Form.Label>Número de Identificación</Form.Label><Form.Control {...register('p_numero_identificacion')} /></Col>
            </Row>

            {/* Campos del familiar */}
            <hr />
            <h6 className="mt-3">Datos del Familiar</h6>

            <Row className="mb-3">
              <Col md={4}>
                <Form.Label>Nombre</Form.Label>
                <Form.Control {...register('f_nombre')} />
              </Col>
              <Col md={4}>
                <Form.Label>Fecha Nacimiento</Form.Label>
                <Form.Control type="date" {...register('f_fecha_nacimiento')} />
              </Col>
              <Col md={2}>
                <Form.Label>Edad</Form.Label>
                <Form.Control type="number" disabled value={watch('f_fecha_nacimiento') ? calcularEdad(watch('f_fecha_nacimiento')) : ''} />
              </Col>
              <Col md={2}>
                <Form.Label>Tipo identificación</Form.Label>
                <Form.Control as="select" {...register('f_tipo_identificacion')}>
                  <option value="">Seleccione</option>
                  <option>DPI</option>
                  <option>PASAPORTE</option>
                </Form.Control>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={4}>
                <Form.Label>Número de Identificación</Form.Label>
                <Form.Control {...register('f_numero_identificacion')} />
              </Col>
              <Col md={4}>
                <Form.Label>Dirección</Form.Label>
                <Form.Control {...register('f_direccion')} />
              </Col>
              <Col md={4}>
                <Form.Label>Correo electrónico</Form.Label>
                <Form.Control type="email" {...register('f_correo')} />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={3}>
                <Form.Label>Teléfono 1</Form.Label>
                <Form.Control {...register('f_telefono1')} />
              </Col>
              <Col md={3}>
                <Form.Label>Teléfono 2</Form.Label>
                <Form.Control {...register('f_telefono2')} />
              </Col>
              <Col md={3}>
                <Form.Label>Empresa en donde labora</Form.Label>
                <Form.Control {...register('f_empresa')} />
              </Col>
              <Col md={3}>
                <Form.Label>Ocupación</Form.Label>
                <Form.Control {...register('f_ocupacion')} />
              </Col>
            </Row>
            <div className="d-flex justify-content-end">
              <Button variant="secondary" onClick={() => setMostrarModalFamiliar(false)} className="me-2">Cancelar</Button>
              <Button type="submit" variant="primary">Agregar</Button>
              <Button variant="success" className="ms-2" onClick={() => setMostrarModalFamiliar(false)}>Guardar</Button>
            </div>
          </Form>

          {/* Tabla de familiares */}
          {listaFamiliares.length > 0 && (
            <div className="mt-4">
              <h6>Familiares agregados: {listaFamiliares.length}</h6>
              <table className="table table-bordered table-sm">
                <thead className="table-light">
                  <tr>
                    <th>Nombre</th><th>Identificación</th><th>Edad</th><th>Teléfono</th>
                  </tr>
                </thead>
                <tbody>
                  {listaFamiliares.map((f, idx) => (
                    <tr key={idx}>
                      <td>{f.nombre}</td>
                      <td>{f.numero_identificacion}</td>
                      <td>{f.edad}</td>
                      <td>{f.telefono}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Modal.Body>
      </Modal >
    </Container >
  );
};

export default FormularioAdmision;