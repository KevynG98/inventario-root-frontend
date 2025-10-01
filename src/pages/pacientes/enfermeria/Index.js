import React from 'react';
import { ContextProvider, useMyContext } from './Context';
import HorizontalMenu from '../HorizontalMenu';
import NursingPatientForm from './Form';
const NursingPage = () => {
  const {
    menuItems,
    activeMenuKey,
    iframeSrc,
    patient,
    handleMenuSelect,
    handlePatientFormSubmit
  } = useMyContext();

  return (
    <>
      <NursingPatientForm patient={patient} onSave={handlePatientFormSubmit} />
      <HorizontalMenu
        items={menuItems}
        activeKey={activeMenuKey}
        onSelect={handleMenuSelect}
      />
      <iframe
        src={iframeSrc || 'about:blank'}
        title="Enfermeria"
        style={{ width: '100%', height: '400px', border: 'none' }}
      />
    </>
  );
};

const Index = () => (
  <ContextProvider>
    <NursingPage />
  </ContextProvider>
);

export default Index;
