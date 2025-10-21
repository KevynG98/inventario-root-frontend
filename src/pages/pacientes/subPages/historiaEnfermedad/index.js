import React from 'react';
import { Alert, Spinner } from 'react-bootstrap';
import { HistoriaEnfermedadProvider } from './Context';
import HistoriaEnfermedadForm from './Form';

const HistoriaEnfermedad = ({ value }) => {
  const loading = value?.loading ?? false;
  const error = value?.error ?? null;

  return (
    <HistoriaEnfermedadProvider value={value}>
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
      <HistoriaEnfermedadForm />
    </HistoriaEnfermedadProvider>
  );
};

export default HistoriaEnfermedad;
