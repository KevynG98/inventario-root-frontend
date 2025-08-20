import React, { useContext } from 'react';
import { ContextProvider, AppContext } from './Context';
import List from './List';
import Form from './Form';

const Index = () => {
  const Inner = () => {
    const { showForm } = useContext(AppContext);
    return <>{!showForm ? <List /> : <Form />}</>;
  };
  return (
    <ContextProvider>
      <Inner />
    </ContextProvider>
  );
};

export default Index;
