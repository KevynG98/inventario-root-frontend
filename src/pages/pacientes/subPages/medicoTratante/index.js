import React from 'react';
import { Alert, Spinner } from 'react-bootstrap';
import { MedicoTratanteProvider } from './Context';
import MedicoTratanteList from './List';
import MedicoTratanteForm from './Form';

const MedicoTratante = ({ value }) => {
  const { loading, error } = value || {};
  return (
    <MedicoTratanteProvider value={value}>
      {error ? (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      ) : null}
      {loading && !error ? (
        <div className="text-center py-3">
          <Spinner animation="border" />
        </div>
      ) : null}
      <MedicoTratanteForm />
      <MedicoTratanteList />
    </MedicoTratanteProvider>
  );
};

export default MedicoTratante;
