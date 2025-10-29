import React from 'react';
import { Button, Card, Col, Row, Form, Table, Alert, Spinner } from 'react-bootstrap';
import { useSolicitudContext } from './Context';

const Formulario = () => {
  const {
    mode,
    setMode,
    catalogs,
    form,
    setForm,
    item,
    setItem,
    addItem,
    removeItem,
    saveSolicitud,
    submitting,
    catalogLoading,
    catalogError
  } = useSolicitudContext();

  const handleChange = (key) => (e) => {
    const nextValue = e?.target ? e.target.value : '';
    setForm((prev) => ({ ...prev, [key]: nextValue }));
  };

  const handleItemChange = (key) => (e) => {
    const value = e?.target ? e.target.value : '';
    setItem((prev) => ({ ...prev, [key]: value }));
  };

  const selectedSku =
    catalogs?.skus?.find?.((sku) => sku.code === item.sku) ?? null;

  React.useEffect(() => {
    if (
      mode !== 'form' ||
      !item.sku ||
      item.descripcion ||
      !selectedSku?.name
    ) {
      return;
    }
    setItem((prev) => ({
      ...prev,
      descripcion: prev.descripcion || selectedSku.name
    }));
  }, [mode, item.sku, item.descripcion, selectedSku, setItem]);

  if (mode !== 'form') return null;

  return (
    <Card className="card p-3 mb-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Nueva Solicitud de Medicamentos</h4>
        <div>
          <Button
            variant="outline-secondary"
            onClick={() => setMode('list')}
            className="mr-2"
            disabled={submitting}
          >
            Regresar
          </Button>
          <Button
            variant="primary"
            onClick={saveSolicitud}
            disabled={submitting}
          >
            {submitting ? 'Guardando…' : 'Guardar'}
          </Button>
        </div>
      </div>

      {catalogLoading ? (
        <Alert variant="info" className="d-flex align-items-center gap-2">
          <Spinner animation="border" size="sm" />
          <span>Cargando catálogos…</span>
        </Alert>
      ) : null}
      {catalogError ? (
        <Alert variant="warning">{catalogError}</Alert>
      ) : null}

      <Row className="mb-3">
        <Col md={4}>
          <Form.Label>Bodega Origen</Form.Label>
          <Form.Control
            type="text"
            value={form.bodega_origen}
            list="solicitud-bodegas"
            onChange={handleChange('bodega_origen')}
            placeholder="Ej. Bodega Central"
          />
          <datalist id="solicitud-bodegas">
            {catalogs.bodegas?.map((bodega) => (
              <option key={bodega} value={bodega} />
            ))}
          </datalist>
        </Col>

        <Col md={4}>
          <Form.Label>Bodega Destino</Form.Label>
          <Form.Control
            type="text"
            value={form.bodega_destino}
            list="solicitud-bodegas"
            onChange={handleChange('bodega_destino')}
            placeholder="Ej. Encamamiento"
          />
        </Col>

        <Col md={4}>
          <Form.Label>Comentarios</Form.Label>
          <Form.Control
            type="text"
            value={form.comentarios}
            onChange={handleChange('comentarios')}
            placeholder="Observaciones"
          />
        </Col>
      </Row>

      <Card className="card p-3">
        <Row className="align-items-end">
          <Col md={3}>
            <Form.Label>Categoría</Form.Label>
            <Form.Control
              type="text"
              value={item.categoria}
              list="solicitud-categorias"
              onChange={handleItemChange('categoria')}
              placeholder="Ej. Medicamentos"
            />
            <datalist id="solicitud-categorias">
              {catalogs.categorias?.map((categoria) => (
                <option key={categoria} value={categoria} />
              ))}
            </datalist>
          </Col>
          <Col md={3}>
            <Form.Label>Subcategoría</Form.Label>
            <Form.Control
              type="text"
              value={item.subcategoria}
              list="solicitud-subcategorias"
              onChange={handleItemChange('subcategoria')}
              placeholder="Ej. Analgésicos"
            />
            <datalist id="solicitud-subcategorias">
              {catalogs.subcategorias?.map((subcategoria) => (
                <option key={subcategoria} value={subcategoria} />
              ))}
            </datalist>
          </Col>
          <Col md={3}>
            <Form.Label>SKU</Form.Label>
            <Form.Control
              type="text"
              value={item.sku}
              list="solicitud-skus"
              onChange={handleItemChange('sku')}
              placeholder="Código SKU"
            />
            <datalist id="solicitud-skus">
              {catalogs.skus?.map((sku) => (
                <option
                  key={sku.code}
                  value={sku.code}
                  label={sku.label}
                />
              ))}
            </datalist>
          </Col>
          <Col md={2}>
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              type="text"
              value={item.descripcion}
              onChange={handleItemChange('descripcion')}
              placeholder="Nombre del producto"
            />
            {selectedSku?.name && !item.descripcion ? (
              <small className="text-muted">
                Sugerido: {selectedSku.name}
              </small>
            ) : null}
          </Col>
          <Col md={1}>
            <Form.Label>Cantidad</Form.Label>
            <Form.Control
              type="number"
              value={item.cantidad}
              min="1"
              onChange={handleItemChange('cantidad')}
            />
          </Col>
          <Col md={1}>
            <Button variant="outline-primary" onClick={addItem}>
              +
            </Button>
          </Col>
        </Row>

        {form.items.length === 0 ? (
          <Alert variant="info" className="mt-3">
            No hay SKUs agregados.
          </Alert>
        ) : (
          <Table bordered size="sm" className="mt-3">
            <thead className="thead-light">
              <tr>
                <th>Categoria</th>
                <th>Subcategoria</th>
                <th>SKU</th>
                <th>Descripción</th>
                <th>Cantidad</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {form.items.map((i, idx) => (
                <tr key={`${i.sku}-${idx}`}>
                  <td>{i.categoria || '—'}</td>
                  <td>{i.subcategoria || '—'}</td>
                  <td>{i.sku}</td>
                  <td>{i.descripcion || '—'}</td>
                  <td>{i.cantidad}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => removeItem(idx)}
                    >
                      Quitar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </Card>
  );
};

export default Formulario;
