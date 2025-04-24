import React, { useState, useMemo } from 'react';
import {
  Table,
  Button,
  Form,
  InputGroup,
  Dropdown
} from 'react-bootstrap';
import { useMyContext } from './Context';
import { FiEdit3, FiSettings } from 'react-icons/fi';
import { BiSearch } from 'react-icons/bi';

// ⏰ Función para formatear la fecha
const formatFecha = () => {
  const hoy = new Date();
  return hoy.toLocaleDateString('es-ES');
};

export const Users = () => {
  const {
    data,
    openCreateUserModal,
    openViewUserModal
  } = useMyContext();

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filteredData = useMemo(() => {
    return data.filter(user =>
      user.username.toLowerCase().includes(search.toLowerCase()) ||
      user.first_name.toLowerCase().includes(search.toLowerCase()) ||
      (user.last_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage]);

  return (
    <div className="p-3 bg-light">
      {/* Título y Fecha */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h4 className="fw-bold text-dark mb-0">Consulta io</h4>
        <span className="fw-semibold text-dark">{formatFecha()}</span>
      </div>

      {/* Barra de control: Nuevo | Búsqueda | Exportar */}
      <div className="row align-items-center mb-3">
        <div className="col-md-3 d-flex justify-content-start">
          <Button variant="primary" onClick={openCreateUserModal}>
            Add +
          </Button>
        </div>

        <div className="col-md-6">
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Búsqueda rápida"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
            <InputGroup.Text>
              <BiSearch />
            </InputGroup.Text>
          </InputGroup>
        </div>

        <div className="col-md-3 d-flex justify-content-end">
          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
              <FiSettings style={{ marginRight: '6px' }} />
              <span>Exportar</span>
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item disabled>PDF</Dropdown.Item>
              <Dropdown.Item disabled>WORD</Dropdown.Item>
              <Dropdown.Item disabled>Excel</Dropdown.Item>
              <Dropdown.Item disabled>XML</Dropdown.Item>
              <Dropdown.Item disabled>CSV</Dropdown.Item>
              <Dropdown.Item disabled>RTF</Dropdown.Item>
              <Dropdown.Item disabled>Imprimir</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      {/* Tabla */}
      <Table striped hover responsive>
        <thead>
          <tr>
            <th style={{ width: '50px' }}></th>
            <th>Usuario</th>
            <th>Nombre</th>
            <th>E-mail</th>
            <th>Activo</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item) => (
            <tr key={item.id}>
              <td>
                <Button
                  size="sm"
                  variant="outline-primary"
                  onClick={() => openViewUserModal(item.username)}
                >
                  <FiEdit3 />
                </Button>
              </td>
              <td>{item.username}</td>
              <td>{item.first_name} {item.last_name}</td>
              <td>{item.email || ''}</td>
              <td>{item.active ? 'Sí' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Paginación */}
      <div className="d-flex justify-content-between align-items-center">
        <span>
          [ {Math.min((currentPage - 1) * pageSize + 1, filteredData.length)} a {Math.min(currentPage * pageSize, filteredData.length)} de {filteredData.length} ]
        </span>
        <div>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            «
          </Button>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="mx-1"
          >
            ‹
          </Button>
          <span className="mx-2 fw-bold">{currentPage}</span>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="mx-1"
          >
            ›
          </Button>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            »
          </Button>
        </div>
      </div>
    </div>
  );
};