import React, { useContext } from 'react';
import { AppContext } from './Context';

const Form = () => {
  const { message } = useContext(AppContext);

  return <h1>Salidas</h1>;
};

export default Form;
