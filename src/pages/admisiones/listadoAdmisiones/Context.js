import React, { createContext, useEffect, useState } from 'react';
import { getData, putData } from '../../../apiService';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const { register, handleSubmit, setValue, getValues, watch, reset } = useForm();

    const [admisionesData, setAdmisionesData] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [modoFormulario, setModoFormulario] = useState('ver');
    const [loading, setLoading] = useState(false);
    const [seccionActiva, setSeccionActiva] = useState('datos-seguro');
    const [todayDate, setTodayDate] = useState('');
    const [seguros, setSeguros] = useState([])
    const [areaHabitacion, setAreaHabitacion] = useState([]);
    const [areaSeleccionada, setAreaSeleccionada] = useState('');
    const [doctor, setDoctor] = useState([]);
    const [listarHabitaciones, setListarHabitaciones] = useState([])
    //paginacion
    const [page, setPage] = useState(1);
    const [nullNextPage, setNullNextPage] = useState(null)
    const [nullPrevPage, setPrevNextPage] = useState(null)

    const getDoctores = async () => {
        setLoading(true);
        try {
            const response = await getData('user/doctor-users/?page_size=50');
            console.log('DOCTORES: ', response.data.results);
            setDoctor(response.data.results);
        } catch (error) {
            console.error('Fallo al obtener doctores:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const getHabitaciones = async () => {
        setLoading(true);
        try {
            const response = await getData('habitaciones/habitaciones-listar/?page_size=50');
            const areasUnicas = [
                ...new Set(response.data.results.map(habitacion => habitacion.area))
            ];
            setAreaHabitacion(areasUnicas.map(area => ({ area })));
            setListarHabitaciones(response.data.results);
            console.log('HABITACIONES: ', response.data.results);
        } catch (error) {
            console.error('Fallo al obtener habitaciones:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const getSeguros = async () => {
        setLoading(true);
        try {
            const response = await getData('inventario/seguros/?page_size=50');
            console.log('SEGUROS: ', response.data);
            setSeguros(response.data.results)
        } catch (error) {
            console.error('Fallo al obtener seguros:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const getAdmisionesResumen = async () => {
        Swal.fire({
            title: 'Cargando admisiones...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            const response = await getData(`admisiones/admisiones-resumen/?page=${page}`);
            const resultados = response.data.results;

            setAdmisionesData(resultados);
            setNullNextPage(response.data.next);
            setPrevNextPage(response.data.previous);

            Swal.close();

            if (resultados.length === 0) {
                Swal.fire({
                    icon: 'info',
                    title: 'Sin resultados',
                    text: 'No se encontraron admisiones.',
                });
            }
        } catch (error) {
            Swal.close();

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al cargar admisiones',
            });

            console.error('Error al cargar admisiones:', error);
        }
    };

    const nextPage = () => {
        setPage(prev => prev + 1);
    }

    const prevPage = () => {
        setPage(prev => prev - 1);
    }

    const cargarAdmision = async (id) => {
        try {
            const { data } = await getData(`admisiones/${id}/`);
            console.log("DATOS CRUDOS", data);

            setTodayDate(data.fecha);

            const acompanantesTransformados = (data.acompanantes || []).map(a => ({
                nombre: a.nombre,
                tipoIdentificacion: a.tipo_identificacion,
                numeroIdentificacion: a.numero_identificacion,
                fechaNacimiento: a.fecha_nacimiento,
                edad: a.edad,
                genero: a.genero,
                correo: a.correo,
                nit: a.nit,
                tipo: a.tipo,
                responsableCuenta: a.responsable_cuenta,
                direccionLaboral: a.direccion_laboral,
                telefonoEmpresa: a.telefono_empresa,
                contacto: a.contacto,
                correoContacto: a.correo_contacto,
                telefonoContacto: a.telefono_contacto,
              }));              

            reset({
                idFicha: data.id,
                primerNombre: data.paciente.primer_nombre,
                segundoNombre: data.paciente.segundo_nombre,
                primerApellido: data.paciente.primer_apellido,
                segundoApellido: data.paciente.segundo_apellido,
                apellidoCasada: data.paciente.apellido_casada,
                genero: data.paciente.genero,
                estadoCivil: data.paciente.estado_civil,
                tipo_sangre: data.paciente.tipo_sangre || '',
                fechaNacimiento: data.paciente.fecha_nacimiento,
                tipoIdentificacion: data.paciente.tipo_identificacion,
                numeroIdentificacion: data.paciente.numero_identificacion,
                direccion: data.paciente.direccion,
                telefono1: data.paciente.telefono1,
                telefono2: data.paciente.telefono2,
                correo: data.paciente.correo,
                nit: data.paciente.nit,
                observacion: data.paciente.observacion,
                religion: data.paciente.religion,
                responsableCuenta: false,

                empresa: data.datos_laborales?.empresa,
                direccionEmpresa: data.datos_laborales?.direccion,
                telefonoEmpresa1: data.datos_laborales?.telefono1,
                telefonoEmpresa2: data.datos_laborales?.telefono2,
                ocupacion: data.datos_laborales?.ocupacion,

                area: data.area_admision || '',
                habitacion: data.habitacion || '',
                medicoTratante: data.medico_tratante || '',

                aseguradora: data.datos_seguro?.aseguradora,
                listaPrecios: data.datos_seguro?.lista_precios,
                carnet: data.datos_seguro?.carnet,
                certificado: data.datos_seguro?.certificado,
                nombreTitular: data.datos_seguro?.nombre_titular,
                coaseguro: data.datos_seguro?.coaseguro,
                valorCopago: data.datos_seguro?.valor_copago,
                valorDeducible: data.datos_seguro?.valor_deducible,
                numero_poliza: data.datos_seguro?.numero_poliza, // ✅ agregado aquí

                garantiaPago: data.garantia_pago?.tipo,
                tcCheque: data.garantia_pago?.numero_tc_cheque,
                nombreFactura: data.garantia_pago?.nombre_factura,
                direccionFactura: data.garantia_pago?.direccion_factura,
                correoFactura: data.garantia_pago?.correo_factura,

                resp_primerNombre: data.responsable?.primer_nombre,
                resp_segundoNombre: data.responsable?.segundo_nombre,
                resp_primerApellido: data.responsable?.primer_apellido,
                resp_segundoApellido: data.responsable?.segundo_apellido,
                resp_tipoIdentificacion: data.responsable?.tipo_identificacion,
                resp_numeroIdentificacion: data.responsable?.numero_identificacion,
                resp_fechaNacimiento: data.responsable?.fecha_nacimiento,
                resp_genero: data.responsable?.genero,
                resp_relacionPaciente: data.responsable?.relacion_paciente,
                resp_ocupacion: data.responsable?.ocupacion,
                resp_domicilio: data.responsable?.domicilio,
                resp_empresa: data.responsable?.empresa,
                resp_direccion: data.responsable?.direccion,
                resp_telefono1: data.responsable?.telefono1,
                resp_telefono2: data.responsable?.telefono2,
                resp_contacto: data.responsable?.contacto,
                resp_email: data.responsable?.email,

                esposo_nombre: data.esposo?.nombre,
                esposo_genero: data.esposo?.genero,
                esposo_tipoIdentificacion: data.esposo?.tipo_identificacion,
                esposo_numeroIdentificacion: data.esposo?.numero_identificacion,
                esposo_fechaNacimiento: data.esposo?.fecha_nacimiento,
                esposo_telefono1: data.esposo?.telefono1,
                esposo_telefono2: data.esposo?.telefono2,
                esposo_domicilio: data.esposo?.domicilio,
                esposo_ocupacion: data.esposo?.ocupacion,
                esposo_empresa: data.esposo?.empresa,
                esposo_direccion: data.esposo?.direccion,
                esposo_email: data.esposo?.email,

                acompanantes: acompanantesTransformados,
            });
        } catch (error) {
            console.error('Error al cargar admisión:', error);
        }
    };

    const onSubmit = async (data) => {
        // Filtrar campos vacíos ("" o null)
        console.log("DATOS DEL FORMULARIO", data);

        try {
            const { status, data: response } = await putData(`admisiones/editar/${data.idFicha}/`, data);

            if (status === 200) {
                console.log('Actualizado correctamente:', response);
                setMostrarModal(false);
            } else {
                console.error('Error al actualizar:', response);
            }
        } catch (error) {
            console.error('Error de red o servidor:', error);
        }

        getAdmisionesResumen();
    };


    useEffect(() => {
        getHabitaciones()
        getSeguros()
        getDoctores()
        getAdmisionesResumen();
    }, [page]);

    const values = {
        admisionesData,
        cargarAdmision,
        mostrarModal,
        setMostrarModal,
        modoFormulario,
        setModoFormulario,
        loading,
        setLoading,
        seccionActiva,
        setSeccionActiva,
        register,
        handleSubmit,
        setValue,
        getValues,
        watch,
        onSubmit,
        nullNextPage,
        nullPrevPage,
        nextPage,
        prevPage,
        areaSeleccionada,
        setAreaSeleccionada,
        listarHabitaciones,
        setListarHabitaciones,
        seguros,
        areaHabitacion,
        doctor,
    }

    return (
        <AppContext.Provider value={values} >
            {children}
        </AppContext.Provider>
    );
};