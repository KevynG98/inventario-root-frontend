import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, Form, Modal, Spinner, Table } from 'react-bootstrap';
import apiClient, { getData } from '../../../../apiService';
import { NotificationManager } from 'react-notifications';

const formatDate = (value) => {
  if (!value) return '-';
  try {
    return new Date(value).toLocaleString('es-GT');
  } catch (e) {
    return value;
  }
};

const formatNumber = (value) => {
  const num = typeof value === 'number' ? value : Number(value || 0);
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num);
};

const getUsername = () => {
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.username || null;
  } catch (e) {
    return null;
  }
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const username = getUsername();
  return {
    ...(token && { Authorization: `Token ${token}` }),
    ...(username && { 'X-User': username }),
  };
};

const NuevaCargaModal = ({ show, onHide, bodegas, onSubmit, submitting }) => {
  const [bodega, setBodega] = useState('');
  const [archivo, setArchivo] = useState(null);

  useEffect(() => {
    if (show) {
      setBodega('');
      setArchivo(null);
    }
  }, [show]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bodega || !archivo) {
      NotificationManager.warning('Seleccione la bodega y el archivo de Excel', 'Campos requeridos', 3000);
      return;
    }
    onSubmit({ bodega, archivo });
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Nueva Carga de Existencias</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Bodega</Form.Label>
            <Form.Control as="select" value={bodega} onChange={(e) => setBodega(e.target.value)}>
              <option value="">Seleccione una bodega</option>
              {bodegas.map((b) => {
                const nombre = b?.nombre ?? b?.label ?? b?.descripcion ?? '';
                if (!nombre) return null;
                return (
                  <option key={nombre} value={nombre}>
                    {nombre}
                  </option>
                );
              })}
            </Form.Control>
          </Form.Group>

          <Form.Group>
            <Form.Label>Archivo (.xlsx)</Form.Label>
            <Form.Control
              type="file"
              accept=".xlsx"
              onChange={(e) => setArchivo(e.target.files?.[0] || null)}
            />
            <Form.Text className="text-muted">
              Utilice el formato compartido por el equipo. Debe contener columnas SKU y Cantidad.
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={submitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? 'Procesando…' : 'Aplicar'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

const DetalleModal = ({ show, onHide, carga }) => {
  const items = carga?.items || [];
  const totalCantidad = useMemo(() => items.reduce((sum, it) => sum + Number(it?.cantidad_cargada || 0), 0), [items]);

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Detalle de Carga</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {carga ? (
          <>
            <div className="mb-3">
              <div><strong>Fecha y Hora:</strong> {formatDate(carga.created_at)}</div>
              <div><strong>Bodega:</strong> {carga.bodega}</div>
              <div><strong>Usuario:</strong> {carga.usuario || '—'}</div>
              <div><strong>Archivo:</strong> {carga.archivo_nombre || '—'}</div>
            </div>
            <Table bordered hover responsive size="sm">
              <thead className="table-primary">
                <tr>
                  <th>SKU</th>
                  <th>Descripción</th>
                  <th className="text-end">Cantidad</th>
                  <th className="text-end">Existencia previa</th>
                  <th className="text-end">Existencia final</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.sku}</td>
                    <td>{item.descripcion || '—'}</td>
                    <td className="text-end">{formatNumber(item.cantidad_cargada)}</td>
                    <td className="text-end">{formatNumber(item.cantidad_anterior)}</td>
                    <td className="text-end">{formatNumber(item.cantidad_resultante)}</td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center">Sin registros</td>
                  </tr>
                )}
              </tbody>
            </Table>
            <div className="text-end">
              <strong>Total cargado:</strong> {formatNumber(totalCantidad)}
            </div>
          </>
        ) : (
          <div className="text-center">Cargando…</div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const CargaMasivaExistencias = () => {
  const [cargas, setCargas] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const [detalle, setDetalle] = useState(null);
  const [showDetalle, setShowDetalle] = useState(false);
  const [detalleLoading, setDetalleLoading] = useState(false);

  const [bodegas, setBodegas] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadCargas = async (targetPage = 1) => {
    setLoading(true);
    try {
      const qs = new URLSearchParams({ page: String(targetPage), page_size: '20' });
      const res = await getData(`mantenimiento/carga-masiva/existencias/?${qs.toString()}`);
      setCargas(res.data.results || []);
      setCount(res.data.count || 0);
      setNextUrl(res.data.next || null);
      setPrevUrl(res.data.previous || null);
    } catch (error) {
      console.error('Error cargando cargas masivas:', error);
      NotificationManager.error('No se pudo obtener el historial de cargas', 'Error', 3000);
    } finally {
      setLoading(false);
    }
  };

  const loadBodegas = async () => {
    try {
      const res = await getData('inventario/bodegas/?page_size=200');
      setBodegas(res.data.results || []);
    } catch (error) {
      console.error('Error obteniendo bodegas:', error);
    }
  };

  useEffect(() => {
    loadCargas(page);
  }, [page]);

  useEffect(() => {
    loadBodegas();
  }, []);

  const abrirDetalle = async (id) => {
    setDetalleLoading(true);
    setShowDetalle(true);
    try {
      const res = await getData(`mantenimiento/carga-masiva/existencias/${id}/`);
      setDetalle(res.data);
    } catch (error) {
      console.error('Error obteniendo detalle de carga:', error);
      NotificationManager.error('No se pudo cargar el detalle', 'Error', 3000);
    } finally {
      setDetalleLoading(false);
    }
  };

  const procesarCarga = async ({ bodega, archivo }) => {
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('bodega', bodega);
      fd.append('archivo', archivo);
      await apiClient.post('mantenimiento/carga-masiva/existencias/crear/', fd, {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'multipart/form-data',
        },
      });
      NotificationManager.success('Carga de existencias aplicada correctamente', 'Éxito', 3000);
      setShowForm(false);
      await loadCargas(page);
    } catch (error) {
      console.error('Error procesando carga masiva:', error);
      const message = error?.response?.data?.error || 'No se pudo procesar la carga';
      NotificationManager.error(message, 'Error', 4000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="m-0">Carga Masiva de Existencias</h5>
        <Button onClick={() => setShowForm(true)}>Nueva Carga</Button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <Table bordered hover responsive size="sm">
          <thead className="table-primary">
            <tr>
              <th>#</th>
              <th>Fecha y Hora</th>
              <th>Bodega</th>
              <th>Usuario</th>
              <th>Archivo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cargas.map((carga) => (
              <tr key={carga.id}>
                <td>{carga.id}</td>
                <td>{formatDate(carga.created_at)}</td>
                <td>{carga.bodega}</td>
                <td>{carga.usuario || '—'}</td>
                <td>{carga.archivo_nombre || '—'}</td>
                <td>
                  <Button
                    size="sm"
                    variant="outline-primary"
                    onClick={() => abrirDetalle(carga.id)}
                  >
                    Ver
                  </Button>
                </td>
              </tr>
            ))}
            {cargas.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center">Sin registros</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      <div className="d-flex justify-content-between align-items-center mt-2">
        <div>Total registros: {count}</div>
        <div className="d-flex gap-2">
          <Button size="sm" disabled={!prevUrl || page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
            Anterior
          </Button>
          <Button size="sm" disabled={!nextUrl} onClick={() => setPage((p) => p + 1)}>
            Siguiente
          </Button>
        </div>
      </div>

      <NuevaCargaModal
        show={showForm}
        onHide={() => setShowForm(false)}
        bodegas={bodegas}
        onSubmit={procesarCarga}
        submitting={submitting}
      />

      <DetalleModal
        show={showDetalle}
        onHide={() => {
          setShowDetalle(false);
          setDetalle(null);
        }}
        carga={detalleLoading ? null : detalle}
      />
    </Card>
  );
};

export default CargaMasivaExistencias;
