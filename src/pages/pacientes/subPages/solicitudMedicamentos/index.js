import React from 'react';
import { SolicitudProvider, useSolicitudContext } from './Context';
import List from './List';
import Formulario from './Form';
import Detail from './Detail';
import ActionModal from './ActionModal';

const Inner = () => {
  const { mode } = useSolicitudContext();

  let content = <List />;
  if (mode === 'form') {
    content = <Formulario />;
  } else if (mode === 'detail') {
    content = <Detail />;
  }

  return (
    <>
      {content}
      <ActionModal />
    </>
  );
};

const SolicitudMedicamentos = ({ value }) => (
  <SolicitudProvider value={value}>
    <Inner />
  </SolicitudProvider>
);

export default SolicitudMedicamentos;
