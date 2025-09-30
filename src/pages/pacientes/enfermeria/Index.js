import React from 'react';
import { ContextProvider } from './Context';
import HorizontalMenu from '../HorizontalMenu';

const menu = [
  { label: "Informacion del Paciente", href: "" },
  { label: "Medico Tratante"},
  { label: "Historia de la Enfermedad"},
  { label: "Signos Vitales (Emergencia)"},
  { label: "Seguimiento Ordenes Medicas"},
  { label: "Antecedentes"},
  { label: "Evolucion"},
  { label: "Control de Medicamento"},
  { label: "Notas de Enfermeria"},
  { label: "Laboratorios"},
  { label: "Imagenes"},
  { label: "Dietas"},
  { label: "Ingesta Excreta"},
  { label: "Signos Vitales (Encamamiento)"},
  { label: "Solicitud de Medicamentos"},
];

const Index = () => (
  <ContextProvider>
    <h1>Enfermeria</h1>
    <HorizontalMenu items={menu}/>
  </ContextProvider>
);

export default Index;
