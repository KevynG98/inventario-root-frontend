import React from 'react';
import { Table, Button } from 'react-bootstrap';
import { usePreciosContext } from './Context';

const ListadoPrecios = () => {
    const { skus, abrirModalEditarPrecios, seguros, precios } = usePreciosContext();

    return (
        <div className="mt-4">
            <h5 className="mb-3">Listado de SKUs</h5>
            <div className="table-responsive">
                <Table bordered hover size="sm">
                    <thead className="table-primary text-dark">
                        <tr>
                            <th>Nombre</th>
                            <th>Código SKU</th>
                            {seguros.map((s) => (
                                <th key={s.id}>{s.nombre}</th>
                            ))}
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {skus.map((sku, idx) => (
                            <tr key={idx}>
                                <td>{sku.nombre}</td>
                                <td>{sku.codigo_sku}</td>
                                {seguros.map((s) => {
                                    const precio = precios.find(p => p.sku === sku.id && p.seguro_id === s.id);
                                    return (
                                        <td key={s.id} className="text-center">
                                            {precio ? `Q${precio.precio.toFixed(2)}` : '—'}
                                        </td>
                                    );
                                })}
                                <td className="text-center">
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        onClick={() => abrirModalEditarPrecios(sku)}
                                    >
                                        Editar precios
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </Table>
            </div>
        </div>
    );
};

export default ListadoPrecios;
