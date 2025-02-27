import { createContext, useState, useContext } from "react";
import { withRouter } from "react-router-dom";
import apiClient, { postData } from "../../../apiService";

const ComponentContext = createContext(null);

function ComponentProvider({ children, history }) {
    const [data1, setData1] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [show, setShow] = useState(false);
    const modalAction = () => setShow(!show);

    const sendData = async (data) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await postData("user/login/", data);

            if (response?.status === 200 && response.data) {
                // Guardar token en localStorage
                localStorage.setItem("token", response.data.token);
                console.log("Token guardado:", response.data.token);

                setData1(response.data);
                history.push("/dashboard/default");
            } else {
                setError(`Error ${response?.status || "desconocido"}`);
            }
        } catch (err) {
            setError(err.message || "Ocurrió un error inesperado");
        } finally {
            setIsLoading(false);
        }
    };


    const values = {
        data1,
        setData1,
        isLoading,
        error,
        sendData,
        modalAction,
        show
    }

    return (
        <ComponentContext.Provider value={values}>
            {children}
        </ComponentContext.Provider>
    );
}

export function useComponentContext() {
    return useContext(ComponentContext);
}

export default withRouter(ComponentProvider);
