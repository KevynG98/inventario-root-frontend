import React, { useMemo, useState } from 'react';
import { OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import { FiEye, FiEdit, FiChevronLeft, FiChevronRight, FiTrash2, FiTruck } from 'react-icons/fi';
import { useMyContext } from './Context';

const Medidas = () => {
  const {
    data,
    abrirModalCrear,
    abrirModalEditar,
    abrirModalVer,
    prevPage,
    nextPage,
    nullPrevPage,
    nullNextPage,
    eliminarProveedor,
    abrirModalMovimiento
  } = useMyContext();

  const [fCodigo, setFCodigo] = useState('');
  const [fNombre, setFNombre] = useState('');
  const [fBarcode, setFBarcode] = useState('');

  const filtered = useMemo(() => {
    const t = (s) => (String(s || '')).toLowerCase();
    const rows = Array.isArray(data) ? data : [];
    const f = rows.filter((r) => (
      (!fCodigo || t(r.codigo_sku).includes(t(fCodigo))) &&
      (!fNombre || t(r.nombre).includes(t(fNombre))) &&
      (!fBarcode || t(r.barcode).includes(t(fBarcode)))
    ));
    return [...f].sort((a, b) => String(a.codigo_sku || '').localeCompare(String(b.codigo_sku || '')));
  }, [data, fCodigo, fNombre, fBarcode]);

  const handleVer = (prov) => abrirModalVer(prov);
  const handleEditar = (prov) => abrirModalEditar(prov);

  return (
    <div className="mb-4">
      <h5 className="mb-3">Gestión de SKU</h5>

      <div className="mb-3">
        <div className="row g-2">
          <div className="col-12 col-md-10">
            <input
              type="text"
              placeholder="Buscar..."
              className="form-control shadow-sm w-100"
            />
          </div>
          <div className="col-12 col-md-2">
            <Button className="w-100" onClick={abrirModalCrear}>
              Nuevo Producto
            </Button>
          </div>
        </div>
      </div>

      <div className="table-responsive">
        <div className="row g-2 mb-2">
          <div className="col-md-3">
            <input className="form-control" placeholder="Filtrar Código" value={fCodigo} onChange={(e)=>setFCodigo(e.target.value)} />
          </div>
          <div className="col-md-3">
            <input className="form-control" placeholder="Filtrar Nombre" value={fNombre} onChange={(e)=>setFNombre(e.target.value)} />
          </div>
          <div className="col-md-3">
            <input className="form-control" placeholder="Filtrar Código de barras" value={fBarcode} onChange={(e)=>setFBarcode(e.target.value)} />
          </div>
        </div>
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

      <div className="d-flex justify-content-end mt-3">
        <Button onClick={prevPage} disabled={nullPrevPage === null} className="me-2">
          <FiChevronLeft />
        </Button>
        <Button onClick={nextPage} disabled={nullNextPage === null}>
          <FiChevronRight />
        </Button>
      </div>
    </div>
  );
};

export default Medidas;
