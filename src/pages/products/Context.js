import React, { createContext, useState, useContext, useEffect } from 'react';
import { getData, postData, deleteData } from '../../apiService';
import { NotificationManager } from "react-notifications";

const MyContext = createContext();

export const ContextProvider = ({ children }) => {
  const [state, setState] = useState("Valor inicial");
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [showRol, setShowRol] = useState(false);
  const [data1, setData1] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState("");
  const [categories, setCategories] = useState([]);

  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [prevPageUrl, setPrevPageUrl] = useState(null);

  const showModal = () => setShow(!show);
  const showModalRol = () => setShowRol(!showRol);

  const fetchData = async () => {
    try {
      const data = await getData('products/');
      const dataCategory = await getData('category/');
      setData(data.data.results);
      setNextPageUrl(data.data.next);
      setPrevPageUrl(data.data.previous);
      setCategories(dataCategory.data);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  const fetchPage = async (url) => {
    if (!url) return;
    try {
      const res = await getData(url.replace('http://localhost:8000/', '')); // ajustar si es necesario
      setData(res.data.results);
      setNextPageUrl(res.data.next);
      setPrevPageUrl(res.data.previous);
    } catch (error) {
      console.error('Error al cambiar de página:', error);
    }
  };

  const sendData = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await postData("products/create/", data);
      if (response?.status === 201 && response.data) {
        setData1(response.data);
        NotificationManager.success("Mensaje", "Título", 3000);
        fetchData();
        showModal();
      } else {
        setError(`Error ${response?.status || "desconocido"}`);
        NotificationManager.error("Algo salió mal", "Error", 5000);
      }
    } catch (err) {
      setError(err.message || "Ocurrió un error inesperado");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await deleteData(`products/delete/${id}/`);
      if (response.status === 200) {
        NotificationManager.success("Usuario eliminado", "Éxito", 3000);
        fetchData();
      } else {
        setError(`Error ${response.status || "desconocido"}`);
        NotificationManager.error("No se pudo eliminar", "Error", 5000);
      }
    } catch (err) {
      setError(err.message || "Ocurrió un error inesperado");
    } finally {
      setIsLoading(false);
    }
  };

  const assignRol = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await postData("rol/assign/", data);
      if (response?.status === 200 && response.data) {
        setData1(response.data);
        NotificationManager.success("Mensaje", "Título", 3000);
        fetchData();
        showModalRol();
      } else {
        setError(`Error ${response?.status || "desconocido"}`);
        NotificationManager.error("Algo salió mal", "Error", 5000);
      }
    } catch (err) {
      setError(err.message || "Ocurrió un error inesperado");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const values = {
    state,
    data,
    show,
    showRol,
    username,
    categories,
    isLoading,
    error,
    nextPageUrl,
    prevPageUrl,
    assignRol,
    setCategories,
    setUsername,
    showModalRol,
    setState,
    showModal,
    sendData,
    deleteUser,
    fetchPage,
  };

  return (
    <MyContext.Provider value={values}>
      {children}
    </MyContext.Provider>
  );
};

export const useMyContext = () => useContext(MyContext);