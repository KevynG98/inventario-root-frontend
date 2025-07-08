import React, { useContext } from 'react';
import { AppContext } from './Context';

const Form = () => {
  const { message } = useContext(AppContext);

  return <h1>Ordenar Requisicion</h1>;
};

export default Form;
