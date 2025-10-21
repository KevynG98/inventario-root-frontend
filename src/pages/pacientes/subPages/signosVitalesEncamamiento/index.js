import React from 'react';
import { Alert } from 'react-bootstrap';
import SignosEncamamientoForm from './Form';
import SignosEncamamientoList from './List';
import { SignosEncamamientoProvider } from './Context';

const SignosVitalesEncamamiento = ({ value }) => (
  <SignosEncamamientoProvider value={value}>
    {value?.error ? (
      <Alert variant="danger" className="mb-3">
        {value.error}
      </Alert>
    ) : null}
    <div className="d-flex flex-column gap-4">
      <SignosEncamamientoForm />
      <SignosEncamamientoList />
    </div>
  </SignosEncamamientoProvider>
);

export default SignosVitalesEncamamiento;
