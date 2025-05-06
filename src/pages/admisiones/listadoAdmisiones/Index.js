import React, { useState } from 'react';
import { AppProvider } from './Context';
import { useForm } from 'react-hook-form';
import ListadoAdmisiones from './ListAdmisiones';
import ModalAdmision from './ModalForm';

const Index = () => {
  const { register, handleSubmit, setValue, getValues, watch } = useForm();

  // Estados necesarios
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoFormulario, setModoFormulario] = useState('ver'); // 'ver' o 'editar'
  const [loading, setLoading] = useState(false);
  const [todayDate, setTodayDate] = useState('');
  const [seccionActiva, setSeccionActiva] = useState('datos-seguro');

  const onSubmit = (data) => {
    console.log("Formulario enviado:", data);
    // Aquí puedes poner la lógica para actualizar admisión
  };

  return (
    <AppProvider>
      <ListadoAdmisiones
        setMostrarModal={setMostrarModal}
        setModoFormulario={setModoFormulario}
        setValue={setValue}
      />
      <ModalAdmision
        show={mostrarModal}
        onHide={() => setMostrarModal(false)}
        modo={modoFormulario}
        setValue={setValue}
        getValues={getValues}
        watch={watch}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        register={register}
        loading={loading}
        todayDate={todayDate}
        seccionActiva={seccionActiva}
        setSeccionActiva={setSeccionActiva}
      />
    </AppProvider>
  );
};

export default Index;