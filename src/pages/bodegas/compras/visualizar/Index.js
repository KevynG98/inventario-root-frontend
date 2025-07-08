import React from 'react';
import { ContextProvider } from './Context';
import Form from './Form';

const Index = () => {
  return (
    <ContextProvider>
      <Form />
    </ContextProvider>
  );
};

export default Index;
