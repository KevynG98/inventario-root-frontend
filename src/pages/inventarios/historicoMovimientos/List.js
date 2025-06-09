import React from 'react';
import { Button } from 'react-bootstrap';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useMyContext } from './Context';

const Marcas = () => {
  const {
    data,
    prevPage,
    nextPage,
    nullPrevPage,
    nullNextPage,
    setFechaInicio,
    setFechaFin,
    cargarDatos,
    fechaFin,
    fechaInicio,
    skuFiltro,
    setSkuFiltro,
    setPage,
    skuList,
  } = useMyContext();

  return (
    <div className="mb-4">
      <h5 className="mb-3">Historial de movimientos</h5>

      <div className="d-flex flex-column flex-md-row align-items-md-end gap-3 mb-3">
        <div>
          <label>SKU:</label>
          <select
            className="form-control"
            value={skuFiltro}
            onChange={(e) => {
              setSkuFiltro(e.target.value);
              setPage(1);
            }}
          >
            <option value="">-- Selecciona un SKU --</option>
            {skuList.map((sku) => (
              <option key={sku.codigo_sku} value={sku.codigo_sku}>
                {/* {sku.codigo_sku} - {sku.nombre} */}
                {sku.codigo_sku}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Desde:</label>
          <input
            type="date"
            className="form-control"
            value={fechaInicio}
            onChange={(e) => {
              setFechaInicio(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div>
          <label>Hasta:</label>
          <input
            type="date"
            className="form-control"
            value={fechaFin}
            onChange={(e) => {
              setFechaFin(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-sm mt-2 mb-0">
          <thead className="table-primary text-dark fw-semibold">
            <tr>
              <th className="text-center">Fecha</th>
              <th className="text-center">SKU</th>
              <th className="text-center">Inventario Inicial</th>
              <th className="text-center">Orden de Compra</th>
              <th className="text-center">Requisición</th>
              <th className="text-center">Solicitud Med</th>
              <th className="text-center">Devolución</th>
              <th className="text-center">Traslado</th>
              <th className="text-center">Salida</th>
              <th className="text-center">Inventario Final</th>
              <th className="text-center">Observaciones</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="11" className="text-center">Sin resultados</td>
              </tr>
            ) : (
              data.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.fecha}</td>
                  <td>{item.sku_codigo || '-'}</td>
                  <td className="text-center">{item.inventario_inicial}</td>
                  <td className="text-center">{item.orden_compra}</td>
                  <td className="text-center">{item.requisicion}</td>
                  <td className="text-center">{item.solicitud_med}</td>
                  <td className="text-center">{item.devolucion}</td>
                  <td className="text-center">{item.traslado}</td>
                  <td className="text-center">{item.salida}</td>
                  <td className="text-center">{item.inventario_final}</td>
                  <td>{item.observaciones?.split('\n').map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-end mt-2 gap-2">
        <Button onClick={prevPage} disabled={nullPrevPage === null}><FiChevronLeft /></Button>
        <Button onClick={nextPage} disabled={nullNextPage === null}><FiChevronRight /></Button>
      </div>
    </div>
  );
};

export default Marcas;
