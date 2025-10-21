import React from 'react';
import { Alert } from 'react-bootstrap';
import { SignosVitalesEmergenciaProvider } from './Context';
import SignosVitalesEmergenciaForm from './Form';
import SignosVitalesEmergenciaList from './List';

const SignosVitalesEmergencia = ({ value }) => {
  const error = value?.error ?? null;
  return (
    <SignosVitalesEmergenciaProvider value={value}>
      {error ? (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      ) : null}
      <div className="signos-vitales-emergencia d-flex flex-column gap-4">
        <SignosVitalesEmergenciaForm />
        <SignosVitalesEmergenciaList />
      </div>
    </SignosVitalesEmergenciaProvider>
  );
};

export default SignosVitalesEmergencia;

