import React, { useMemo, useState } from 'react';
import { Button, OverlayTrigger, Tooltip, Table } from 'react-bootstrap';
import { FiEye, FiEdit, FiTrash2 } from 'react-icons/fi';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useMyContext } from './Context';

export const Products = () => {
  const {
    data,
    deleteProduct,
    openCreateProductModal,
    openEditProductModal,
    openViewProductModal,
    nextPageUrl,
    prevPageUrl,
    fetchPage
  } = useMyContext();

  const [search, setSearch] = useState('');

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return data;
    return data.filter((product) => {
      const name = (product.name || product.nombre || '').toLowerCase();
      const category = (product.category?.name || product.category?.nombre || '').toLowerCase();
      return name.includes(term) || category.includes(term);
    });
  }, [data, search]);

  return (
    <div className="mb-4">
      <h5 className="mb-3">Productos</h5>

      <div className="mb-3">
        <div className="row g-2">
          <div className="col-12 col-md-10">
            <input
              type="text"
              placeholder="Buscar por nombre o categoría..."
              className="form-control shadow-sm w-100"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="col-12 col-md-2">
            <Button className="w-100" onClick={openCreateProductModal}>
              Nuevo Producto
            </Button>
          </div>
        </div>
      </div>

      <Table striped responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Unidad</th>
            <th>Cantidad</th>
            <th>Categoría</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.id}>
              <th scope="row">{product.id}</th>
              <td>{product.name || product.nombre}</td>
              <td>Q{product.price}</td>
              <td>{product.unit || product.unidad}</td>
              <td>{product.quantity}</td>
              <td>{product.category?.name || product.category?.nombre || 'Sin categoría'}</td>
              <td>
                <div className="d-flex gap-2">
                  <OverlayTrigger overlay={<Tooltip>Ver Producto</Tooltip>}>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => openViewProductModal(product)}
                    >
                      <FiEye />
                    </Button>
                  </OverlayTrigger>
                  <OverlayTrigger overlay={<Tooltip>Editar Producto</Tooltip>}>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => openEditProductModal(product)}
                    >
                      <FiEdit />
                    </Button>
                  </OverlayTrigger>
                  <OverlayTrigger overlay={<Tooltip>Eliminar Producto</Tooltip>}>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => deleteProduct(product.id)}
                    >
                      <FiTrash2 />
                    </Button>
                  </OverlayTrigger>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="d-flex justify-content-end mt-3 gap-2">
        <Button
          variant="outline-secondary"
          disabled={!prevPageUrl}
          onClick={() => fetchPage(prevPageUrl)}
        >
          <FiChevronLeft />
        </Button>
        <Button
          variant="outline-secondary"
          disabled={!nextPageUrl}
          onClick={() => fetchPage(nextPageUrl)}
        >
          <FiChevronRight />
        </Button>
      </div>
    </div>
  );
};
