import React from 'react';
import { IngestaExcretaProvider } from './Context';
import IngestaExcretaList from './List';
import IngestaExcretaForm from './Form';

const IngestaExcreta = ({ value }) => (
  <IngestaExcretaProvider value={value}>
    <div className="d-flex flex-column gap-4">
      <IngestaExcretaList />
      <IngestaExcretaForm />
    </div>
  </IngestaExcretaProvider>
);

export default IngestaExcreta;
