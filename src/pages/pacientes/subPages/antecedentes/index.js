import React from 'react';
import { Alert } from 'react-bootstrap';
import { AntecedentesProvider, useAntecedentesContext } from './Context';
import AntecedentesList from './List';
import AntecedentesEditor from './Editor';

const AntecedentesContent = () => {
  const { mode } = useAntecedentesContext();

  if (mode === 'LIST') {
    return <AntecedentesList />;
  }

  return <AntecedentesEditor />;
};

const Antecedentes = ({ value }) => {
  const error = value?.error ?? null;

  return (
    <AntecedentesProvider value={value}>
      {error ? (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      ) : null}
      <AntecedentesContent />
    </AntecedentesProvider>
  );
};

export default Antecedentes;

