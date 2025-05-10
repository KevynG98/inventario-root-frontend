import React, { createContext, useState } from 'react';
import { postData } from '../../../apiService'

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [state, setState] = useState(null);
    const [loading, setLoading] = useState(false);

    //Poner toda la logica aqui

    const values = {
        state,
        setState,
        loading,
    };

    return (
        <AppContext.Provider value={values}>
            {children}
        </AppContext.Provider>
    );
};
