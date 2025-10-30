import React, { createContext, useContext, useState, useEffect } from 'react';

const DietasContext = createContext();
export const useDietasContext = () => useContext(DietasContext);

export const DietasProvider = ({ children }) => {
  const [dietas, setDietas] = useState([]);
  const [fechaFiltro, setFechaFiltro] = useState(() => {
    const hoy = new Date();
    return hoy.toISOString().split('T')[0];
  });

  // Simulación de datos iniciales
  const datosEjemplo = [
    {
      id: 1,
      admision: 'ADM-001',
      paciente: 'Juan Pérez',
      area: 'Emergencias',
      habitacion: 'C-101',
      sintoma: 'Dolor abdominal',
      dieta: 'Blanda sin grasa',
      observaciones: 'Evitar lácteos'
    },
    {
      id: 2,
      admision: 'ADM-002',
      paciente: 'María López',
      area: 'Pediatría',
      habitacion: 'P-205',
      sintoma: 'Fiebre',
      dieta: 'Normal sin condimentos',
      observaciones: 'Sin picante'
    }
  ];

  // Simular actualización automática cada cierto tiempo
  useEffect(() => {
    const interval = setInterval(() => {
      // En un caso real, aquí harías fetch al backend (GET /dietas?fecha=yyyy-mm-dd)
      setDietas(datosEjemplo);
    }, 5000); // cada 5 segundos actualiza
    return () => clearInterval(interval);
  }, []);

  // Si cambia el día, limpiar tabla
  useEffect(() => {
    const verificarCambioDia = () => {
      const hoy = new Date().toISOString().split('T')[0];
      if (hoy !== fechaFiltro) {
        setDietas([]);
      }
    };
    const interval = setInterval(verificarCambioDia, 60000); // cada minuto
    return () => clearInterval(interval);
  }, [fechaFiltro]);

  const filtrarPorFecha = (fecha) => {
    setFechaFiltro(fecha);
    // Aquí normalmente harías fetch al backend con esa fecha
    setDietas(datosEjemplo); // simula respuesta
  };

  const value = {
    dietas,
    fechaFiltro,
    filtrarPorFecha
  };

  return (
    <DietasContext.Provider value={value}>{children}</DietasContext.Provider>
  );
};