import React, { useMemo, useState } from 'react';
import { OverlayTrigger, Tooltip, Button, Spinner, ButtonGroup, Badge } from 'react-bootstrap';
import { FiEye, FiEdit, FiChevronLeft, FiChevronRight, FiTrash2, FiTruck } from 'react-icons/fi';
import { useMyContext } from './Context';

const Medidas = () => {
  const {
    data,
    skusFiltrados,
    buscando,
    searchNext,
    searchPrev,
    abrirModalCrear,
    abrirModalEditar,
    abrirModalVer,
    prevPage,
    nextPage,
    nullPrevPage,
    nullNextPage,
    eliminarProveedor,
    abrirModalMovimiento,
    role,
    buscarSkusGlobal,
    limpiarFiltroSkus,
    buscarSkusNextPage,
    buscarSkusPrevPage,
  } = useMyContext();

  const [term, setTerm] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'

  const filtered = useMemo(() => {
    const toL = (s) => String(s || '').toLowerCase();
    const q = toL(term);
    const base = skusFiltrados ?? data;
    const rows = Array.isArray(base) ? base : [];
    const f = !q
      ? rows
      : rows.filter((r) => (
          toL(r.nombre).includes(q) ||
          toL(r.codigo_sku).includes(q) ||
          toL(r.codigo_barras).includes(q)
        ));
    return [...f].sort((a, b) => String(a.codigo_sku || '').localeCompare(String(b.codigo_sku || '')));
  }, [data, skusFiltrados, term]);

  const handleBuscar = async (e) => {
    e?.preventDefault?.();
    await buscarSkusGlobal(term);
  };

  const handleLimpiar = () => {
    setTerm('');
    limpiarFiltroSkus();
  };

  const handleVer = (prov) => abrirModalVer(prov);
  const handleEditar = (prov) => abrirModalEditar(prov);

  const renderActionButtons = (sku) => (
    <>
      <OverlayTrigger overlay={<Tooltip>Ver</Tooltip>}>
        <Button className="btn btn-outline-secondary btn-sm me-1" onClick={() => handleVer(sku)}>
          <FiEye />
        </Button>
      </OverlayTrigger>
      <OverlayTrigger overlay={<Tooltip>Editar</Tooltip>}>
        <Button className="btn btn-outline-secondary btn-sm me-1" onClick={() => handleEditar(sku)}>
          <FiEdit />
        </Button>
      </OverlayTrigger>
    </>
  );

  const renderTable = () => (
    <div className="table-responsive">
      <table className="table table-bordered table-sm mt-2">
        <thead className="table-primary text-dark fw-semibold text-center">
          <tr>
            <th>Interno</th>
            <th>Código</th>
            <th>Nombre</th>
            <th>Marca</th>
            <th>Medida</th>
            <th>Categoría</th>
            <th>Sub Categoría</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((sku, idx) => (
            <tr key={idx}>
              <td>{sku.id}</td>
              <td>{sku.codigo_sku}</td>
              <td>{sku.nombre}</td>
              <td>{sku.marca}</td>
              <td>{sku.unidad_despacho}</td>
              <td>{sku.categoria}</td>
              <td>{sku.subcategoria}</td>
              <td>{sku.estado === 'alta' ? 'Disponible' : 'No Disponible'}</td>
              <td className="text-center">
                {renderActionButtons(sku)}
                {/* <OverlayTrigger overlay={<Tooltip>Eliminar</Tooltip>}>
                  <Button className="btn btn-outline-secondary btn-sm me-1" onClick={() => eliminarProveedor(sku.id)}>
                    <FiTrash2 />
                  </Button>
                </OverlayTrigger>
                <OverlayTrigger overlay={<Tooltip>Movimiento</Tooltip>}>
                  <Button className="btn btn-outline-secondary btn-sm" onClick={() => abrirModalMovimiento(sku)}>
                    <FiTruck />
                  </Button>
                </OverlayTrigger> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderCards = () => (
    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3 mt-2">
      {filtered.map((sku, idx) => (
        <div className="col" key={idx}>
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <p className="text-muted mb-1">Código</p>
                  <h6 className="mb-0">{sku.codigo_sku}</h6>
                </div>
                <Badge bg={sku.estado === 'alta' ? 'success' : 'secondary'}>
                  {sku.estado === 'alta' ? 'Disponible' : 'No Disponible'}
                </Badge>
              </div>
              <h5 className="card-title mb-1">{sku.nombre}</h5>
              <p className="mb-2">
                <span className="text-muted">Marca:</span> {sku.marca || 'Sin marca'}
              </p>
              <p className="mb-2">
                <span className="text-muted">Categoría:</span> {sku.categoria || '-'}
              </p>
              <p className="mb-2">
                <span className="text-muted">Sub Categoría:</span> {sku.subcategoria || '-'}
              </p>
              <p className="mb-3">
                <span className="text-muted">Medida:</span> {sku.unidad_despacho || '-'}
              </p>
            </div>
            <div className="card-footer bg-light d-flex justify-content-end">
              {renderActionButtons(sku)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="mb-4">
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-3">
        <h5 className="mb-2 mb-md-0">Gestión de Productos</h5>
        <ButtonGroup aria-label="Cambiar vista">
          <Button
            variant={viewMode === 'table' ? 'primary' : 'outline-primary'}
            onClick={() => setViewMode('table')}
            size="sm"
          >
            Lista
          </Button>
          <Button
            variant={viewMode === 'cards' ? 'primary' : 'outline-primary'}
            onClick={() => setViewMode('cards')}
            size="sm"
          >
            Cards
          </Button>
        </ButtonGroup>
      </div>

      <div className="mb-3">
        <div className="row g-2">
          <div className="col-12 col-md-6">
            <form onSubmit={handleBuscar}>
              <input
                type="text"
                className="form-control shadow-sm w-100"
                placeholder="Buscar por nombre, código del producto o código de barras..."
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') handleLimpiar();
                }}
              />
            </form>
          </div>
          <div className="col-6 col-md-2">
            <Button className="w-100" onClick={handleBuscar} disabled={buscando}>
              {buscando ? (<><Spinner animation="border" size="sm" className="me-2" />Buscando</>) : 'Buscar'}
            </Button>
          </div>
          <div className="col-6 col-md-2">
            <Button variant="outline-secondary" className="w-100" onClick={handleLimpiar}>
              Limpiar
            </Button>
          </div>
          <div className="col-12 col-md-2">
            <Button className="w-100" onClick={abrirModalCrear}>
              Nuevo Producto
            </Button>
          </div>
        </div>
      </div>

      {viewMode === 'table' ? renderTable() : renderCards()}

      <div className="d-flex justify-content-end mt-3">
        <Button
          onClick={skusFiltrados !== null ? buscarSkusPrevPage : prevPage}
          disabled={skusFiltrados !== null ? (searchPrev === null) : (nullPrevPage === null)}
          className="me-2"
        >
          <FiChevronLeft />
        </Button>
        <Button
          onClick={skusFiltrados !== null ? buscarSkusNextPage : nextPage}
          disabled={skusFiltrados !== null ? (searchNext === null) : (nullNextPage === null)}
        >
          <FiChevronRight />
        </Button>
      </div>
    </div>
  );
};

export default Medidas;
