import React, { useMemo, useState } from 'react';
import { OverlayTrigger, Tooltip, Button, Spinner, ButtonGroup, Badge } from 'react-bootstrap';
import { FiEye, FiEdit, FiChevronLeft, FiChevronRight, FiTrash2, FiTruck, FiUpload } from 'react-icons/fi';
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
    abrirModalImport,
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
          toL(r.codigo_inventario).includes(q) ||
          toL(r.codigo_barras).includes(q)
        ));
    return [...f].sort((a, b) => String(a.codigo_inventario || '').localeCompare(String(b.codigo_inventario || '')));
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
            <th>Imagen</th>
            <th>Interno</th>
            <th>Código</th>
            <th>Nombre</th>
            <th>Marca</th>
            <th>Precio compra</th>
            <th>Precio stock</th>
            <th>Medida</th>
            <th>Categoría</th>
            <th>Sub Categoría</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((sku, idx) => {
            console.log("Rendering SKU:", sku.id, "Image:", sku.imagen);
                        return (
                          <tr key={idx} className="align-middle">
                            <td className="text-center">
                              {sku.imagen ? (
                                <img 
                                  src={sku.imagen} 
                                  alt={sku.nombre} 
                                  style={{ width: '40px', height: '40px', objectFit: 'cover' }} 
                                  className="rounded"
                                />
                              ) : (
                                <div 
                                  className="bg-light d-flex align-items-center justify-content-center rounded mx-auto" 
                                  style={{ width: '40px', height: '40px' }}
                                >
                                  <i className="feather icon-image text-muted" style={{ fontSize: '20px' }}></i>
                                </div>
                              )}
                            </td>
                            <td>{sku.id}</td>
                            <td>{sku.codigo_inventario}</td>
                            <td>{sku.nombre}</td>
                            <td>{sku.marca}</td>
                            <td>{Number(sku.precio_compre || 0).toFixed(2)}</td>
                            <td>{Number(sku.precio_stock || 0).toFixed(2)}</td>
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
                        );
                      })}        </tbody>
      </table>
    </div>
  );

  const renderCards = () => (
    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mt-2">
      {filtered.map((sku, idx) => (
        <div className="col" key={idx}>
          <div className="card h-100 shadow-sm border-0">
            <div 
              style={{ 
                height: '180px', 
                backgroundColor: '#f8f9fa', 
                overflow: 'hidden',
                position: 'relative' 
              }}
              className="d-flex align-items-center justify-content-center"
            >
              {sku.imagen ? (
                <img 
                  src={sku.imagen} 
                  alt={sku.nombre} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div className="text-center text-muted">
                  <i className="feather icon-image" style={{ fontSize: '48px' }}></i>
                  <p className="mb-0 small">Sin imagen</p>
                </div>
              )}
              <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                <Badge bg={sku.estado === 'alta' ? 'success' : 'secondary'}>
                  {sku.estado === 'alta' ? 'Disponible' : 'No Disponible'}
                </Badge>
              </div>
            </div>
            <div className="card-body">
              <div className="mb-2">
                <p className="text-muted small mb-0">Código: {sku.codigo_inventario}</p>
                <h5 className="card-title text-truncate mb-0" title={sku.nombre}>{sku.nombre}</h5>
              </div>
              <div className="row g-0 mb-2 border-bottom pb-2">
                <div className="col-6 small">
                  <span className="text-muted d-block">Marca</span>
                  <strong>{sku.marca || 'Sin marca'}</strong>
                </div>
                <div className="col-6 small">
                  <span className="text-muted d-block">Categoría</span>
                  <strong>{sku.categoria || '-'}</strong>
                </div>
              </div>
              <div className="row g-2">
                <div className="col-6">
                  <span className="text-muted small d-block">Precio Compra</span>
                  <span className="fw-bold text-primary">Q {Number(sku.precio_compre || 0).toFixed(2)}</span>
                </div>
                <div className="col-6">
                  <span className="text-muted small d-block">Precio Stock</span>
                  <span className="fw-bold text-success">Q {Number(sku.precio_stock || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="card-footer bg-white border-top-0 d-flex justify-content-between align-items-center">
                <small className="text-muted">{sku.unidad_despacho}</small>
                <div>{renderActionButtons(sku)}</div>
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
          <div className="col-12 col-md-5">
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
          <div className="col-6 col-md-2">
            <Button className="w-100" variant="outline-dark" onClick={abrirModalImport}>
              <FiUpload className="me-1" /> Carga masiva
            </Button>
          </div>
          <div className="col-6 col-md-1 d-md-flex justify-content-end">
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
