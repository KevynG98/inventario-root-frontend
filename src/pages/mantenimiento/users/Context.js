import React, { createContext, useState, useContext, useEffect } from 'react';
import { getData, postData, deleteData, putData } from '../../../apiService';
import { NotificationManager } from "react-notifications";

const MyContext = createContext();

export const ContextProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [getRol, setGetRol] = useState([]);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
  });
  const [show, setShow] = useState(false);
  const [username, setUsername] = useState("");
  const [isCreatingUser, setIsCreatingUser] = useState(true);
  const [isViewingUser, setIsViewingUser] = useState(false);
  const [formKey, setFormKey] = useState(Date.now());
  const [showResetPassword, setShowResetPassword] = useState(false);

  const showModal = () => setShow(!show);
  const openResetPasswordModal = () => setShowResetPassword(true);
  const closeResetPasswordModal = () => setShowResetPassword(false);

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
      const responseUser = await getData('user/');
      const responseRol = await getData('rol/');

      setData(responseUser.data.results);
      setGetRol(responseRol.data);

      setPagination({
        count: responseUser.data.count,
        next: responseUser.data.next,
        previous: responseUser.data.previous,
      });
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  const fetchPage = async (url) => {
    try {
      const baseURL = 'http://127.0.0.1:8000/';
      const endpoint = url.replace(baseURL, '');
      const response = await getData(endpoint);

      setData(response.data.results);
      setPagination({
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous,
      });
    } catch (error) {
      console.error('Error al obtener página:', error);
    }
  };

  const sendData = async (data) => {
    try {
      const response = await postData("user/register/", data);
      if (response?.status === 201 && response.data) {
        NotificationManager.success("Usuario creado", "Éxito", 3000);
        fetchData();
        showModal();
      } else {
        NotificationManager.error("Algo salió mal", "Error", 5000);
      }
    } catch (err) {
      console.error('Error al crear usuario:', err);
    }
  };

  const updateUser = async (data) => {
    try {
      const response = await putData(`user/update/${data.id}/`, data);
      if (response?.status === 200 && response.data) {
        NotificationManager.success("Usuario actualizado", "Éxito", 3000);
        fetchData();
        showModal();
      } else {
        NotificationManager.error("Algo salió mal", "Error", 5000);
      }
    } catch (err) {
      console.error('Error al actualizar usuario:', err);
    }
  };

  const deleteUser = async (id) => {
    try {
      const response = await deleteData(`user/delete/${id}/`);
      if (response.status === 200) {
        NotificationManager.success("Usuario eliminado", "Éxito", 3000);
        fetchData();
      } else {
        NotificationManager.error("No se pudo eliminar", "Error", 5000);
      }
    } catch (err) {
      console.error('Error al eliminar usuario:', err);
    }
  };

  const assignRol = async (data) => {
    try {
      const response = await postData("rol/assign/", data);
      if (response?.status === 200) {
        console.log(`Rol ${data.role} asignado a ${data.username}`);
      } else {
        NotificationManager.error("Error al asignar rol", "Error", 5000);
      }
    } catch (err) {
      console.error('Error al asignar rol:', err);
      NotificationManager.error("Error al asignar rol", "Error", 5000);
    }
  };

  const searchUsers = async (query) => {
    try {
      const response = await getData(`user/search/?q=${query}`);
      setData(response.data.results);
      setPagination({
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous,
      });
    } catch (error) {
      console.error('Error al buscar usuarios:', error);
    }
  };

  const resetUserPassword = async (id, password) => {
    try {
      const response = await postData(`user/admin-reset-password/${id}/`, { password });
      if (response?.status === 200) {
        NotificationManager.success("Contraseña actualizada", "Éxito", 3000);
        fetchData();
      } else {
        NotificationManager.error("Algo salió mal al cambiar contraseña", "Error", 5000);
      }
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      NotificationManager.error("Error inesperado", "Error", 5000);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const values = {
    data,
    pagination,
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
    showResetPassword,
    openResetPasswordModal,
    closeResetPasswordModal,
    updateUser,
    fetchPage,
    searchUsers,
    resetUserPassword,
  };

  return (
    <MyContext.Provider value={values}>
      {children}
    </MyContext.Provider>
  );
};

export const useMyContext = () => useContext(MyContext);