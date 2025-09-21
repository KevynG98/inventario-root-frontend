import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, Form, Modal, Spinner, Table } from 'react-bootstrap';
import apiClient, { getData } from '../../../../apiService';
import { NotificationManager } from 'react-notifications';

const formatDateTime = (value) => {
  if (!value) return '-';
  try {
    return new Date(value).toLocaleString('es-GT');
  } catch (e) {
    return value;
  }
};

const formatCurrency = (value) => {
  const num = Number(value || 0);
  return new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(num);
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

const NuevaCargaPreciosModal = ({ show, onHide, seguros, onSubmit, submitting }) => {
  const [seguro, setSeguro] = useState('');
  const [archivo, setArchivo] = useState(null);

  useEffect(() => {
    if (show) {
      setSeguro('');
      setArchivo(null);
    }
  }, [show]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!seguro || !archivo) {
      NotificationManager.warning('Seleccione el seguro y el archivo de Excel', 'Campos requeridos', 3000);
      return;
    }
    onSubmit({ seguro, archivo });
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Nueva Carga de Precios</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Seguro</Form.Label>
            <Form.Control as="select" value={seguro} onChange={(e) => setSeguro(e.target.value)}>
              <option value="">Seleccione un seguro</option>
              {seguros.map((s) => {
                const nombre = s?.nombre ?? s?.label ?? s?.descripcion ?? '';
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
              Utilice el formato proporcionado (columna SKU y columna de precio para el seguro seleccionado).
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

const DetallePreciosModal = ({ show, onHide, carga }) => {
  const items = carga?.items || [];
  const totalSkus = items.length;
  const deltaPromedio = useMemo(() => {
    if (!items.length) return 0;
    const total = items.reduce((acc, item) => acc + (Number(item?.precio_nuevo || 0) - Number(item?.precio_anterior || 0)), 0);
    return total / items.length;
  }, [items]);

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Detalle de Carga de Precios</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {carga ? (
          <>
            <div className="mb-3">
              <div><strong>Fecha y Hora:</strong> {formatDateTime(carga.created_at)}</div>
              <div><strong>Seguro:</strong> {carga.seguro}</div>
              <div><strong>Usuario:</strong> {carga.usuario || '—'}</div>
              <div><strong>Archivo:</strong> {carga.archivo_nombre || '—'}</div>
              <div><strong>SKUs procesados:</strong> {totalSkus}</div>
              <div><strong>Variación promedio:</strong> {formatCurrency(deltaPromedio)}</div>
            </div>
            <Table bordered hover responsive size="sm">
              <thead className="table-primary">
                <tr>
                  <th>SKU</th>
                  <th>Descripción</th>
                  <th className="text-end">Precio anterior</th>
                  <th className="text-end">Precio nuevo</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.sku}</td>
                    <td>{item.descripcion || '—'}</td>
                    <td className="text-end">{formatCurrency(item.precio_anterior)}</td>
                    <td className="text-end">{formatCurrency(item.precio_nuevo)}</td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center">Sin registros</td>
                  </tr>
                )}
              </tbody>
            </Table>
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

const CargaMasivaPrecios = () => {
  const [cargas, setCargas] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const [detalle, setDetalle] = useState(null);
  const [detalleLoading, setDetalleLoading] = useState(false);
  const [showDetalle, setShowDetalle] = useState(false);

  const [seguros, setSeguros] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadCargas = async (targetPage = 1) => {
    setLoading(true);
    try {
      const qs = new URLSearchParams({ page: String(targetPage), page_size: '20' });
      const res = await getData(`mantenimiento/carga-masiva/precios/?${qs.toString()}`);
      setCargas(res.data.results || []);
      setCount(res.data.count || 0);
      setNextUrl(res.data.next || null);
      setPrevUrl(res.data.previous || null);
    } catch (error) {
      console.error('Error obteniendo cargas de precios:', error);
      NotificationManager.error('No se pudo obtener el historial de cargas', 'Error', 3000);
    } finally {
      setLoading(false);
    }
  };

  const loadSeguros = async () => {
    try {
      const res = await getData('inventario/seguros/?page_size=200');
      const raw = res.data;
      const list = Array.isArray(raw) ? raw : raw?.results || [];
      setSeguros(list);
    } catch (error) {
      console.error('Error obteniendo seguros:', error);
    }
  };

  useEffect(() => {
    loadCargas(page);
  }, [page]);

  useEffect(() => {
    loadSeguros();
  }, []);

  const abrirDetalle = async (id) => {
    setDetalleLoading(true);
    setShowDetalle(true);
    try {
      const res = await getData(`mantenimiento/carga-masiva/precios/${id}/`);
      setDetalle(res.data);
    } catch (error) {
      console.error('Error obteniendo detalle de precios:', error);
      NotificationManager.error('No se pudo cargar el detalle', 'Error', 3000);
    } finally {
      setDetalleLoading(false);
    }
  };

  const procesarCarga = async ({ seguro, archivo }) => {
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('seguro', seguro);
      fd.append('archivo', archivo);
      await apiClient.post('mantenimiento/carga-masiva/precios/crear/', fd, {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'multipart/form-data',
        },
      });
      NotificationManager.success('Carga de precios aplicada correctamente', 'Éxito', 3000);
      setShowForm(false);
      await loadCargas(page);
    } catch (error) {
      console.error('Error procesando carga de precios:', error);
      const message = error?.response?.data?.error || 'No se pudo procesar la carga';
      NotificationManager.error(message, 'Error', 4000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="m-0">Carga Masiva de Precios</h5>
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
              <th>Seguro</th>
              <th>Usuario</th>
              <th>Archivo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cargas.map((carga) => (
              <tr key={carga.id}>
                <td>{carga.id}</td>
                <td>{formatDateTime(carga.created_at)}</td>
                <td>{carga.seguro}</td>
                <td>{carga.usuario || '—'}</td>
                <td>{carga.archivo_nombre || '—'}</td>
                <td>
                  <Button size="sm" variant="outline-primary" onClick={() => abrirDetalle(carga.id)}>
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

      <NuevaCargaPreciosModal
        show={showForm}
        onHide={() => setShowForm(false)}
        seguros={seguros}
        onSubmit={procesarCarga}
        submitting={submitting}
      />

      <DetallePreciosModal
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

export default CargaMasivaPrecios;
