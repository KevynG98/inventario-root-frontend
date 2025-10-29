import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Form,
  Modal,
  Row,
  Table
} from 'react-bootstrap';
import { useSolicitudMedicamentosContext } from './Context';

const formatDateTime = (value) => {
  if (!value) return '—';
  try {
    return new Intl.DateTimeFormat('es-GT', {
      dateStyle: 'short',
      timeStyle: 'short'
    }).format(value);
  } catch {
    return '—';
  }
};

const STATUS_INFO = {
  PENDIENTE_ENVIAR: { label: 'Pendiente de Enviar', variant: 'secondary' },
  ENVIADA: { label: 'Enviada', variant: 'info' },
  PENDIENTE_RECIBIR: { label: 'Pendiente de Recibir', variant: 'warning' },
  RECIBIDA: { label: 'Recibida – Pendiente de Cargar a EC', variant: 'primary' },
  CARGADA_EC: { label: 'Cargada al Estado de Cuenta', variant: 'success' },
  ANULADA: { label: 'Anulada', variant: 'dark' }
};

const SolicitudMedicamentosForm = () => {
  const context = useSolicitudMedicamentosContext();
  if (!context) {
    throw new Error('SolicitudMedicamentosForm debe usarse dentro de su provider');
  }

  const {
    mode,
    setMode,
    selected,
    formState,
    setFormState,
    catalogs,
    subcategoriasFiltradas,
    loadSubcategorias,
    loadSkus,
    itemDraft,
    setItemDraft,
    itemsDraft,
    addItemDraft,
    removeDraftItem,
    updateDraftItem,
    saveSolicitud,
    resetDraft,
    loadingAction
  } = context;

  const show = mode === 'form';
  const handleClose = () => {
    resetDraft();
    setMode('list');
  };

  const categoriaSeleccionada = useMemo(
    () =>
      catalogs.categorias?.find(
        (cat) => String(cat.id) === String(itemDraft.categoria)
      ) || null,
    [catalogs.categorias, itemDraft.categoria]
  );

  const skuOptions = useMemo(() => catalogs.skus || [], [catalogs.skus]);

  const handleChangeForm = (key) => (event) => {
    const value = event?.target?.value ?? event;
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const handleCategoriaChange = (event) => {
    const categoriaId = event.target.value;
    const categoriaNombre =
      catalogs.categorias?.find(
        (cat) => String(cat.id) === String(categoriaId)
      )?.nombre || '';
    setItemDraft((prev) => ({ ...prev, categoria: categoriaId, subcategoria: '', sku: '' }));
    loadSubcategorias(categoriaId);
    loadSkus({ categoriaNombre, subcategoriaNombre: '' });
  };

  const handleSubcategoriaChange = (event) => {
    const subcategoria = event.target.value;
    const categoriaNombre = categoriaSeleccionada?.nombre || '';
    setItemDraft((prev) => ({ ...prev, subcategoria, sku: '' }));
    loadSkus({ categoriaNombre, subcategoriaNombre: subcategoria });
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="xl"
      backdrop="static"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {formState.id ? 'Editar Solicitud de Medicamentos' : 'Nueva Solicitud de Medicamentos'}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Card className="border-0">
          <Card.Body className="d-flex flex-column gap-3">
            <Row className="g-3">
              <Col md={6} lg={4}>
                <Form.Label>Bodega Origen</Form.Label>
                <Form.Select
                  value={formState.bodega_origen}
                  onChange={handleChangeForm('bodega_origen')}
                >
                  <option value="">Seleccione</option>
                  {(catalogs.bodegas || []).map((bodega) => (
                    <option key={`origen-${bodega.nombre}`} value={bodega.nombre}>
                      {bodega.nombre}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={6} lg={4}>
                <Form.Label>Bodega Destino</Form.Label>
                <Form.Select
                  value={formState.bodega_destino}
                  onChange={handleChangeForm('bodega_destino')}
                >
                  <option value="">Seleccione</option>
                  {(catalogs.bodegas || []).map((bodega) => (
                    <option key={`dest-${bodega.nombre}`} value={bodega.nombre}>
                      {bodega.nombre}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col lg={4}>
                <Form.Label>Comentarios</Form.Label>
                <Form.Control
                  value={formState.comentarios}
                  onChange={handleChangeForm('comentarios')}
                  placeholder="Observaciones u orden médica de referencia"
                />
              </Col>
            </Row>

            <Card className="bg-light border-0">
              <Card.Body className="d-flex flex-column gap-3">
                <Row className="g-3">
                  <Col md={6} lg={3}>
                    <Form.Label>Categoría</Form.Label>
                    <Form.Select value={itemDraft.categoria} onChange={handleCategoriaChange}>
                      <option value="">Seleccione</option>
                      {(catalogs.categorias || []).map((categoria) => (
                        <option key={categoria.id} value={categoria.id}>
                          {categoria.nombre}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col md={6} lg={3}>
                    <Form.Label>Subcategoría</Form.Label>
                    <Form.Select
                      value={itemDraft.subcategoria}
                      onChange={handleSubcategoriaChange}
                      disabled={!itemDraft.categoria}
                    >
                      <option value="">Seleccione</option>
                      {(subcategoriasFiltradas || []).map((subcategoria) => (
                        <option key={subcategoria.id} value={subcategoria.nombre}>
                          {subcategoria.nombre}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col md={6} lg={4}>
                    <Form.Label>SKU</Form.Label>
                    <Form.Select
                      value={itemDraft.sku}
                      onChange={(event) =>
                        setItemDraft((prev) => ({ ...prev, sku: event.target.value }))
                      }
                    >
                      <option value="">Seleccione</option>
                      {skuOptions.map((sku) => (
                        <option key={sku.codigo_sku} value={sku.codigo_sku}>
                          {sku.codigo_sku} — {sku.nombre}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col md={6} lg={2}>
                    <Form.Label>Cantidad</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      value={itemDraft.cantidad}
                      onChange={(event) =>
                        setItemDraft((prev) => ({
                          ...prev,
                          cantidad: Math.max(1, Number(event.target.value))
                        }))
                      }
                    />
                  </Col>
                </Row>

                <div>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={addItemDraft}
                    disabled={!itemDraft.sku}
                  >
                    Agregar a la lista
                  </Button>
                </div>

                <div className="table-responsive">
                  <Table bordered size="sm" className="align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>SKU</th>
                        <th>Descripción</th>
                        <th style={{ width: 120 }}>Cantidad</th>
                        <th>Comentario</th>
                        <th style={{ width: 80 }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {itemsDraft.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center text-muted py-3">
                            No hay SKU agregados.
                          </td>
                        </tr>
                      ) : (
                        itemsDraft.map((item, index) => (
                          <tr key={`${item.sku}-${index}`}>
                            <td>{item.sku}</td>
                            <td>{item.descripcion || '—'}</td>
                            <td>
                              <Form.Control
                                type="number"
                                min="1"
                                value={item.cantidad}
                                onChange={(event) =>
                                  updateDraftItem(
                                    index,
                                    'cantidad',
                                    Math.max(1, Number(event.target.value))
                                  )
                                }
                              />
                            </td>
                            <td>
                              <Form.Control
                                value={item.comentario_enfermeria || ''}
                                onChange={(event) =>
                                  updateDraftItem(index, 'comentario_enfermeria', event.target.value)
                                }
                              />
                            </td>
                            <td>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => removeDraftItem(index)}
                              >
                                Quitar
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Card.Body>
        </Card>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="outline-secondary" onClick={handleClose} disabled={loadingAction}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={saveSolicitud} disabled={loadingAction}>
          Guardar Solicitud
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SolicitudMedicamentosForm;