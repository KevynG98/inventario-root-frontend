import React, { useMemo, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { usePreciosContext } from './Context';

const ListadoPrecios = () => {
    const { skus, abrirModalEditarPrecios, seguros, 
        precios, proyectos, actualizarEstatusProyecto } = usePreciosContext();
    const [fCodigo, setFCodigo] = useState('');
    const [fNombre, setFNombre] = useState('');
    const [fBarcode, setFBarcode] = useState('');

    // Mapeo de estatus numérico a texto legible
    const getEstadoProyectoTexto = (estatusProyecto) => {
        const map = {
            0: 'Presupuestado desde landingPage',
            1: 'Presupuestado desde portal administrativo',
            2: 'Proyecto/Presupuesto rechazado',
            3: 'Proyecto aceptado',
            4: 'Proyecto en proceso',
            5: 'Proyecto detenido',
            6: 'Proyecto finalizado',
            7: 'Proyecto cancelado',
        };
        return map[estatusProyecto] || 'Estado desconocido';
    };

    // Estilos por estado (borde fuerte, fondo claro, esquinas redondeadas)
    const getEstadoProyectoStyles = (estatusProyecto) => {
        const baseColors = {
            0: '#0d6efd', // azul
            1: '#0b7285', // cian oscuro
            2: '#dc3545', // rojo
            3: '#198754', // verde
            4: '#6f42c1', // morado
            5: '#fd7e14', // naranja
            6: '#20c997', // verde agua
            7: '#6c757d', // gris
        };

        const color = baseColors[estatusProyecto] || '#6c757d';

        // color de fondo un poco más claro que el borde
        const background = `${color}20`; // usa transparencia

        return {
            display: 'inline-block',
            padding: '0.15rem 0.6rem',
            borderRadius: '999px',
            border: `1px solid ${color}`,
            backgroundColor: background,
            color,
            fontSize: '0.75rem',
            fontWeight: 600,
            whiteSpace: 'nowrap',
        };
    };

    const handleUpdateProyect = (estatusProyecto, id)  => {
        actualizarEstatusProyecto(id, estatusProyecto)
    }

    // Helper para renderizar acciones según estatusProyecto
    const renderAccionesProyecto = (estatusProyecto, id) => {
        if (estatusProyecto === 3) {
            // ACEPTADO -> Iniciar | finalizar | Cancelar
            return (
                <>
                    <Button onClick={() => handleUpdateProyect(4, id)} style={{minWidth: "5rem"}} variant="outline-success" size="sm" className="me-1">
                        Iniciar
                    </Button>
                    <Button onClick={() => handleUpdateProyect(6, id)} style={{minWidth: "5rem"}} variant="outline-primary" size="sm" className="me-1">
                        Finalizar
                    </Button>
                    <Button onClick={() => handleUpdateProyect(7, id)} style={{minWidth: "5rem"}} variant="outline-danger" size="sm">
                        Cancelar
                    </Button>
                </>
            );
        }

        if (estatusProyecto === 4) {
            // EN_PROCESO -> Detener | finalizar | Cancelar
            return (
                <>
                    <Button onClick={() => handleUpdateProyect(5, id)} style={{minWidth: "5rem"}} variant="outline-warning" size="sm" className="me-1">
                        Detener
                    </Button>
                    <Button onClick={() => handleUpdateProyect(6, id)} style={{minWidth: "5rem"}} variant="outline-primary" size="sm" className="me-1">
                        Finalizar
                    </Button>
                    <Button onClick={() => handleUpdateProyect(7, id)} style={{minWidth: "5rem"}} variant="outline-danger" size="sm">
                        Cancelar
                    </Button>
                </>
            );
        }

        if (estatusProyecto === 5) {
            // DETENIDO -> Re iniciar
            return (
                <Button onClick={() => handleUpdateProyect(3, id)} style={{minWidth: "5rem"}} variant="outline-success" size="sm">
                    Re iniciar
                </Button>
            );
        }

        if (estatusProyecto === 6) {
            // FINALIZADO -> solo texto
            return (
                <span style={{minWidth: "5rem"}} className="text-success fw-semibold">
                    Proyecto finalizado
                </span>
            );
        }

        if (estatusProyecto === 7) {
            // CANCELADO -> solo texto
            return (
                <span style={{minWidth: "5rem"}} className="text-danger fw-semibold">
                    Proyecto cancelado
                </span>
            );
        }

        // Otros estados: sin acciones definidas explícitamente
        return null;
    };

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
            <h5 className="mb-3">Listado de Proyectos</h5>
            <div className="table-responsive">
                <div className="row g-2 mb-2">
                    <div className="col-md-3"><input className="form-control" placeholder="Código" value={fCodigo} onChange={(e)=>setFCodigo(e.target.value)} /></div>
                    <div className="col-md-3"><input className="form-control" placeholder="Nombre" value={fNombre} onChange={(e)=>setFNombre(e.target.value)} /></div>
                    <div className="col-md-3"><input className="form-control" placeholder="Código de barras" value={fBarcode} onChange={(e)=>setFBarcode(e.target.value)} /></div>
                </div>
                <Table
                    bordered
                    hover
                    size="sm"
                    className="mb-0 w-auto"
                    style={{ tableLayout: 'auto' }}
                >
                    <thead className="table-primary text-dark">
                        <tr>
                            <th>Nombre Empresa</th>
                            <th>Correo Empresa</th>
                            <th style={{minWidth: "10rem"}}>Estado proyecto</th>
                            <th>Artículos presupuestados</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {proyectos.map((pryc, idx) => (
                            <tr key={idx}>
                                <td>{pryc.nombreEmpresa}</td>
                                <td>{pryc.emailEmpresa}</td>
                                <td className="text-center">
                                    <span style={getEstadoProyectoStyles(pryc.estatusProyecto)}>
                                        {getEstadoProyectoTexto(pryc.estatusProyecto)}
                                    </span>
                                </td>
                                <td className="text-center">
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        onClick={() => abrirModalEditarPrecios(pryc)}
                                    >
                                        Productos de proyecto
                                    </Button>
                                </td>
                                <td className="text-center">
                                    {renderAccionesProyecto(pryc.estatusProyecto, pryc.id)}
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
