import React from 'react';
import { OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import { FiEye, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useMyContext } from './Context';

const Marcas = () => {
  const {
    data,
    abrirModalVer,
    prevPage,
    nextPage,
    nullPrevPage,
    nullNextPage,
    bodega
  } = useMyContext();

  const handleVer = (prov) => abrirModalVer(prov);

  return (
    <div className="mb-4">
      <h5 className="mb-3">Inventario</h5>
      <table className="table table-bordered table-sm mt-2">
        <thead className="table-primary text-dark fw-semibold">
          <tr>
            <th className="text-center">ID</th>
            <th className="text-center">Nombre</th>
            <th className="text-center">Código SKU</th>
            {bodega.map((b, idx) => (
              <th key={idx} className="text-center">{b.nombre}</th>
            ))}
            <th className="text-center">Total</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((sku, idx) => {
            const total = sku.bodegas?.reduce((sum, b) => sum + (b.cantidad || 0), 0);

            return (
              <tr key={idx}>
                <td className="text-center">{sku.id}</td>
                <td>{sku.nombre}</td>
                <td>{sku.codigo_sku}</td>
                {bodega.map((b, i) => {
                  const stock = sku.bodegas?.find(x => x.nombre_bodega === b.nombre);
                  const cantidad = stock ? stock.cantidad : 0;

                  let backgroundColor = '#d4edda'; // verde pastel
                  let textColor = '#155724';

                  if (cantidad <= 25) {
                    backgroundColor = '#f8d7da'; // rojo pastel
                    textColor = '#721c24';
                  } else if (cantidad <= 100) {
                    backgroundColor = '#fff3cd'; // amarillo pastel
                    textColor = '#856404';
                  }

                  return (
                    <td
                      key={i}
                      className="text-center fw-bold"
                      style={{ backgroundColor, color: textColor }}
                    >
                      {cantidad}
                    </td>
                  );
                })}
                <td
                  className="text-center fw-bold"
                  style={{
                    backgroundColor:
                      total <= 25
                        ? '#f8d7da' // rojo pastel
                        : total <= 100
                          ? '#fff3cd' // amarillo pastel
                          : '#d4edda', // verde pastel
                    color:
                      total <= 25
                        ? '#721c24'
                        : total <= 100
                          ? '#856404'
                          : '#155724',
                  }}
                >
                  {total}
                </td>
                <td className="text-center">
                  <OverlayTrigger overlay={<Tooltip>Ver SKU</Tooltip>}>
                    <Button
                      className="btn btn-outline-secondary btn-sm me-1"
                      onClick={() => handleVer(sku)}
                    >
                      <FiEye />
                    </Button>
                  </OverlayTrigger>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="d-flex justify-content-end">
        <Button onClick={prevPage} disabled={nullPrevPage === null}><FiChevronLeft /></Button>
        <Button onClick={nextPage} disabled={nullNextPage === null}><FiChevronRight /></Button>
      </div>
    </div>
  );
};

export default Marcas;
