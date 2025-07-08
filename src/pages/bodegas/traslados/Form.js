import React, { useContext } from 'react';
import { AppContext } from './Context';

const Form = () => {
  const { message } = useContext(AppContext);

  return <h1>Traslados</h1>;
};

export default Form;
