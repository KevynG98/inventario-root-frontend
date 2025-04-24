import React, { createContext, useState, useContext, useEffect } from 'react';
import { getData, postData, deleteData } from '../../apiService';
import { NotificationManager } from "react-notifications";

const MyContext = createContext();

export const ContextProvider = ({ children }) => {
  const [state, setState] = useState("Valor inicial");
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [data1, setData1] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState("");
  const [getRol, setGetRol] = useState([]);
  const [isCreatingUser, setIsCreatingUser] = useState(true);
  const [isViewingUser, setIsViewingUser] = useState(false);
  const [formKey, setFormKey] = useState(Date.now());

  // Nuevo estado para modal de reset de contraseña
  const [showResetPassword, setShowResetPassword] = useState(false);
  const openResetPasswordModal = () => setShowResetPassword(true);
  const closeResetPasswordModal = () => setShowResetPassword(false);

  const showModal = () => setShow(!show);

  const openCreateUserModal = () => {
    setIsViewingUser(false);
    setIsCreatingUser(true);
    setUsername("");
    setFormKey(Date.now());
    setShow(true);
  };

  const openAssignRolModal = (username) => {
    setUsername(username);
    setIsViewingUser(false);
    setIsCreatingUser(false);
    setFormKey(Date.now());
    setShow(true);
  };

  const openViewUserModal = (username) => {
    setUsername(username);
    setIsCreatingUser(false);
    setIsViewingUser(true);
    setFormKey(Date.now());
    setShow(true);
  };

  const fetchData = async () => {
    try {
      const data = await getData('user/');
      const dataRol = await getData('rol/');
      setData(data.data);
      setGetRol(dataRol.data);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  const sendData = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await postData("user/register/", data);
      if (response?.status === 201 && response.data) {
        setData1(response.data);
        NotificationManager.success("Usuario creado", "Éxito", 3000);
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
      const response = await deleteData(`user/delete/${id}/`);
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
        NotificationManager.success("Rol asignado", "Éxito", 3000);
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

  useEffect(() => {
    fetchData();
  }, []);

  const values = {
    state,
    data,
    show,
    username,
    getRol,
    assignRol,
    setUsername,
    showModal,
    sendData,
    deleteUser,
    isCreatingUser,
    isViewingUser,
    setIsCreatingUser,
    setIsViewingUser,
    openCreateUserModal,
    openAssignRolModal,
    openViewUserModal,
    formKey,

    // nuevos
    showResetPassword,
    openResetPasswordModal,
    closeResetPasswordModal,
  };

  return (
    <MyContext.Provider value={values}>
      {children}
    </MyContext.Provider>
  );
};

export const useMyContext = () => useContext(MyContext);
