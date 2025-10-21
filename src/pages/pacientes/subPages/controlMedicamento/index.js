import React from 'react';
import { Alert } from 'react-bootstrap';
import { ControlMedicamentoProvider, useControlMedicamentoContext } from './Context';
import ControlMedicamentoForm from './Form';
import ControlMedicamentoList from './List';

const ControlMedicamentoContent = () => {
  const { error } = useControlMedicamentoContext();
  return (
    <>
      {error ? (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      ) : null}
      <ControlMedicamentoForm />
      <ControlMedicamentoList />
    </>
  );
};

const ControlMedicamento = ({ value }) => (
  <ControlMedicamentoProvider value={value}>
    <ControlMedicamentoContent />
  </ControlMedicamentoProvider>
);

export default ControlMedicamento;
