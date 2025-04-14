import React from 'react';
import { Table, Button } from 'react-bootstrap';
import { useMyContext } from './Context';
import UcFirst from '../../App/components/UcFirst';
import { FcCancel, FcCheckmark } from "react-icons/fc";
import { BsEye } from "react-icons/bs";
import { convert_fecha_hora } from '../../utils/formatUtils';

export const Users = () => {
  const {
    data,
    deleteUser,
    openAssignRolModal,
    openCreateUserModal,
    openViewUserModal
  } = useMyContext();

  return (
    <div>
      <h1>Usuarios</h1>
      <Button variant="primary" onClick={openCreateUserModal} className="mb-3">
        <UcFirst text="Add +" />
      </Button>
      <div>
        <Table striped responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Email</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Last Login</th>
              <th>Rol</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <th scope="row">{item.id}</th>
                <td>{item.username}</td>
                <td>{item.email}</td>
                <td>{item.first_name}</td>
                <td>{item.last_name}</td>
                <td>{convert_fecha_hora(item.last_login)}</td>
                <td>{item.rol[0]?.rol || 'Sin rol'}</td>
                <td>
                  <div className="d-flex gap-2">
                    <Button
                      variant="outline-info"
                      onClick={() => openViewUserModal(item.username)}
                    >
                      <BsEye />
                    </Button>
                    <Button
                      variant="outline-success"
                      onClick={() => openAssignRolModal(item.username)}
                    >
                      <FcCheckmark />
                    </Button>
                    <Button
                      variant="outline-danger"
                      onClick={() => deleteUser(item.id)}
                    >
                      <FcCancel />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};
