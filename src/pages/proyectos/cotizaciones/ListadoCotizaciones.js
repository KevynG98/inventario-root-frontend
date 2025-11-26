import React, { useMemo, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { usePreciosContext } from './Context';

const ListadoPrecios = () => {
    const { skus, abrirModalEditarPrecios, 
        rechazarCotizacion, aprobarCotizacion, cotizaciones } = usePreciosContext();
    const [fCodigo, setFCodigo] = useState('');
    const [fNombre, setFNombre] = useState('');
    const [fBarcode, setFBarcode] = useState('');

    const filas = useMemo(() => {
        const rows = Array.isArray(skus) ? skus : [];
        const t = (s) => (String(s || '')).toLowerCase();
        const filtered = rows.filter((r) => (
            (!fCodigo || t(r.codigo_inventario).includes(t(fCodigo))) &&
            (!fNombre || t(r.nombre || r.descripcion).includes(t(fNombre))) &&
            (!fBarcode || t(r.barcode).includes(t(fBarcode)))
        ));
        return [...filtered].sort((a,b)=> String(a.codigo_inventario||'').localeCompare(String(b.codigo_inventario||'')));
    }, [skus, fCodigo, fNombre, fBarcode]);

    return (
        <div className="mt-4">
            <h5 className="mb-3">Listado de Cotizaciones</h5>
            <div className="table-responsive">
                <div className="row g-2 mb-2">
                    <div className="col-md-3"><input className="form-control" placeholder="Código" value={fCodigo} onChange={(e)=>setFCodigo(e.target.value)} /></div>
                    <div className="col-md-3"><input className="form-control" placeholder="Nombre" value={fNombre} onChange={(e)=>setFNombre(e.target.value)} /></div>
                    <div className="col-md-3"><input className="form-control" placeholder="Código de barras" value={fBarcode} onChange={(e)=>setFBarcode(e.target.value)} /></div>
                </div>
                <Table bordered hover size="sm">
                    <thead className="table-primary text-dark">
                        <tr>
                            <th>Nombre Empresa</th>
                            <th>Nombre Proyecto</th>
                            <th>Correo</th>
                            <th>Monto presupuestado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cotizaciones.map((cot, idx) => (
                            <tr key={idx}>
                                <td>{cot.nombreEmpresa}</td>
                                <td>{cot.nombreProyecto}</td>
                                <td>
                                    Q{cot.totalPresupuestado}
                                </td>
                                <td className="text-center">
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        onClick={() => abrirModalEditarPrecios(cot)}
                                    >
                                        Validar Productos de cotizacion
                                    </Button>
                                </td>              
                                <td>
                                    <Button variant='outline-danger' size='sm'
                                        onClick={() => rechazarCotizacion(cot.id)}
                                    >
                                        Rechazar
                                    </Button>

                                    <Button variant='outline-primary' size='sm'
                                        onClick={() => aprobarCotizacion(cot.id)}
                                    >
                                        Aprobar
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
