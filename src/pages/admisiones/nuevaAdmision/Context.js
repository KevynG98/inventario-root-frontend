import React, { createContext, useEffect, useState } from 'react';
import { postData, getData } from '../../../apiService'

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [state, setState] = useState(null);
    const [loading, setLoading] = useState(false);
    const [listarHabitaciones, setListarHabitaciones] = useState([])

    const getHabitaciones = async () => {
        setLoading(true);
        try {
            const response = await getData('habitaciones/');
            console.log('HABITACIONES: ', response.data);
            setListarHabitaciones(response.data)
        } catch (error) {
            console.error('Fallo al obtener habitaciones:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const guardarAdmision = async (formulario) => {
        setLoading(true);
        try {
            const datosLimpios = limpiarDatosVacios(formulario);
            console.log(datosLimpios)
            const response = await postData('admisiones/', datosLimpios);
            console.log('Admisión guardada con éxito:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error al guardar admisión:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const limpiarDatosVacios = (obj) => {
        if (Array.isArray(obj)) {
            return obj
                .map(limpiarDatosVacios)
                .filter((item) => item !== null && item !== undefined);
        }

        if (typeof obj === 'object' && obj !== null) {
            const limpio = {};
            for (const clave in obj) {
                const valor = limpiarDatosVacios(obj[clave]);

                if (
                    valor === null ||
                    valor === undefined ||
                    (typeof valor === 'string' && valor.trim() === '') ||
                    (typeof valor === 'string' && ['null', 'undefined', 'invalid date', '0000'].includes(valor.toLowerCase())) ||
                    (typeof valor === 'number' && isNaN(valor)) ||
                    (Array.isArray(valor) && valor.length === 0) ||
                    (typeof valor === 'object' && Object.keys(valor).length === 0)
                  ) {
                    continue;
                  }
                                    
                limpio[clave] = valor;
            }
            return Object.keys(limpio).length > 0 ? limpio : undefined;
        }

        return obj;
    };

    useEffect(() => {
        getHabitaciones()
    }, [])

    const values = {
        state,
        listarHabitaciones,
        setState,
        guardarAdmision,
        loading,
    };

    return (
        <AppContext.Provider value={values}>
            {children}
        </AppContext.Provider>
    );
};
