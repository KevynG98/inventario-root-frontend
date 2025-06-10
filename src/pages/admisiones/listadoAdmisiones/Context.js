import React, { createContext, useEffect, useState } from 'react';
import { getData, putData } from '../../../apiService';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const { register, handleSubmit, setValue, getValues, watch } = useForm();

    const [admisionesData, setAdmisionesData] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [modoFormulario, setModoFormulario] = useState('ver');
    const [loading, setLoading] = useState(false);
    const [seccionActiva, setSeccionActiva] = useState('datos-seguro');
    const [todayDate, setTodayDate] = useState('');
    //paginacion
    const [page, setPage] = useState(1);
    const [nullNextPage, setNullNextPage] = useState(null)
    const [nullPrevPage, setPrevNextPage] = useState(null)

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
            console.log("DATOS CRUDOS", data)
            setTodayDate(data.fecha);

            // ID
            setValue('idFicha', data.id);

            // PACIENTE
            setValue('nombre', data.paciente.primer_nombre);
            setValue('primerNombre', data.paciente.primer_nombre);
            setValue('segundoNombre', data.paciente.segundo_nombre);
            setValue('primerApellido', data.paciente.primer_apellido);
            setValue('segundoApellido', data.paciente.segundo_apellido);
            setValue('apellidoCasada', data.paciente.apellido_casada);
            setValue('genero', data.paciente.genero);
            setValue('estadoCivil', data.paciente.estado_civil);
            setValue('tipoSangre', data.paciente.tipo_sangre || ''); // No está en el JSON, dejar vacío si no hay
            setValue('fechaNacimiento', data.paciente.fecha_nacimiento);
            setValue('edad', data.paciente.edad);
            setValue('tipoIdentificacion', data.paciente.tipo_identificacion);
            setValue('numeroIdentificacion', data.paciente.numero_identificacion);
            setValue('direccion', data.paciente.direccion);
            setValue('telefono1', data.paciente.telefono1);
            setValue('telefono2', data.paciente.telefono2);
            setValue('correo', data.paciente.correo);
            setValue('nit', data.paciente.nit);
            setValue('observacion', data.paciente.observacion);
            setValue('religion', data.paciente.religion);

            // Checkbox responsable de cuenta (si tienes lógica, usa data.responsableCuenta o similar)
            setValue('responsableCuenta', false);

            // ACOMPANANTE
            setValue('acompananteNombre', data.acompanante?.nombre);
            setValue('acompananteTelefono', data.acompanante?.telefono);

            // ADMISION
            setValue('area_admision', data.area_admision);
            setValue('habitacion', data.habitacion);
            setValue('medicoTratante', data.medico_tratante);

            // DATOS SEGURO
            setValue('aseguradora', data.datos_seguro?.aseguradora);
            setValue('listaPrecios', data.datos_seguro?.lista_precios);
            setValue('carnet', data.datos_seguro?.carnet);
            setValue('certificado', data.datos_seguro?.certificado);
            setValue('nombreTitular', data.datos_seguro?.nombre_titular);
            setValue('coaseguro', data.datos_seguro?.coaseguro);
            setValue('valorCopago', data.datos_seguro?.valor_copago);
            setValue('valorDeducible', data.datos_seguro?.valor_deducible);

            // GARANTÍA
            setValue('garantiaPago', data.garantia_pago?.tipo);
            setValue('tcCheque', data.garantia_pago?.numero_tc_cheque);
            setValue('nit', data.garantia_pago?.nit);
            setValue('nombreFactura', data.garantia_pago?.nombre_factura);
            setValue('direccionFactura', data.garantia_pago?.direccion_factura);
            setValue('correoFactura', data.garantia_pago?.correo_factura);

            // DATOS LABORALES
            setValue('empresa', data.datos_laborales?.empresa);
            setValue('direccionEmpresa', data.datos_laborales?.direccion);
            setValue('telefonoEmpresa1', data.datos_laborales?.telefono1);
            setValue('telefonoEmpresa2', data.datos_laborales?.telefono2);
            setValue('ocupacion', data.datos_laborales?.ocupacion);

            // RESPONSABLE
            setValue('resp_primerNombre', data.responsable?.primer_nombre);
            setValue('resp_segundoNombre', data.responsable?.segundo_nombre);
            setValue('resp_primerApellido', data.responsable?.primer_apellido);
            setValue('resp_segundoApellido', data.responsable?.segundo_apellido);
            setValue('resp_tipoIdentificacion', data.responsable?.tipo_identificacion);
            setValue('resp_numeroIdentificacion', data.responsable?.numero_identificacion);
            setValue('resp_fechaNacimiento', data.responsable?.fecha_nacimiento);
            setValue('resp_edad', data.responsable?.edad);
            setValue('resp_genero', data.responsable?.genero);
            setValue('resp_relacionPaciente', data.responsable?.relacion_paciente);
            setValue('resp_ocupacion', data.responsable?.ocupacion);
            setValue('resp_domicilio', data.responsable?.domicilio);
            setValue('resp_empresa', data.responsable?.empresa);
            setValue('resp_direccion', data.responsable?.direccion);
            setValue('resp_telefono1', data.responsable?.telefono1);
            setValue('resp_telefono2', data.responsable?.telefono2);
            setValue('resp_contacto', data.responsable?.contacto);
            setValue('resp_email', data.responsable?.email);

            // ESPOSO
            setValue('esposo_nombre', data.esposo?.nombre);
            setValue('esposo_genero', data.esposo?.genero);
            setValue('esposo_tipoIdentificacion', data.esposo?.tipo_identificacion);
            setValue('esposo_numeroIdentificacion', data.esposo?.numero_identificacion);
            setValue('esposo_fechaNacimiento', data.esposo?.fecha_nacimiento);
            setValue('esposo_edad', data.esposo?.edad);
            setValue('esposo_telefono1', data.esposo?.telefono1);
            setValue('esposo_telefono2', data.esposo?.telefono2);
            setValue('esposo_domicilio', data.esposo?.domicilio);
            setValue('esposo_ocupacion', data.esposo?.ocupacion);
            setValue('esposo_empresa', data.esposo?.empresa);
            setValue('esposo_direccion', data.esposo?.direccion);
            setValue('esposo_email', data.esposo?.email);

        } catch (error) {
            console.error('Error al cargar admisión:', error);
        }
    };

    const onSubmit = async (data) => {
        console.log("DATOS", data)
        try {
            const { status, data: response } = await putData(`admisiones/editar/${data.idFicha}/`, data);

            if (status === 200) {
                console.log('Actualizado correctamente:', response);
                setMostrarModal(!mostrarModal)
                // cerrar modal, recargar tabla, etc.
            } else {
                console.error('Error al actualizar:', response);
            }
        } catch (error) {
            console.error('Error de red o servidor:', error);
        }
        getAdmisionesResumen()
    };

    useEffect(() => {
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
        prevPage
    }

    return (
        <AppContext.Provider value={values} >
            {children}
        </AppContext.Provider>
    );
};