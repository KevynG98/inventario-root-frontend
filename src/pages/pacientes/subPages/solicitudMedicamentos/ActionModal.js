import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Button, Form, Table, Alert } from 'react-bootstrap';
import { useSolicitudContext } from './Context';

const ensurePositiveNumber = (value) => {
  const parsed = Number(value ?? 0);
  if (Number.isNaN(parsed) || parsed < 0) {
    return 0;
  }
  return parsed;
};

const ActionModal = () => {
  const {
    pendingAction,
    closeActionModal,
    confirmReceive,
    confirmAnular,
    confirmDevolver,
    catalogs
  } = useSolicitudContext();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formState, setFormState] = useState(null);

  useEffect(() => {
    setError(null);
    if (!pendingAction) {
      setFormState(null);
      return;
    }
    if (pendingAction.type === 'receive') {
      setFormState(
        (pendingAction.items || []).map((item) => ({
          id: item.id,
          sku: item.sku,
          descripcion: item.descripcion,
          cantidad_enviada: item.cantidad_enviada ?? 0,
          cantidad_recibida: item.cantidad_recibida ?? item.cantidad_enviada ?? 0,
          recibido: item.recibido !== false
        }))
      );
      return;
    }
    if (pendingAction.type === 'anular') {
      setFormState({
        departamento: '',
        entregamos_a: '',
        observaciones: ''
      });
      return;
    }
    if (pendingAction.type === 'devolver') {
      setFormState({
        cantidad: pendingAction.item?.restante ?? 1,
        departamento: '',
        entregamos_a: '',
        comentario: ''
      });
    }
  }, [pendingAction]);

  const modalTitle = useMemo(() => {
    if (!pendingAction) {
      return '';
    }
    switch (pendingAction.type) {
      case 'receive':
        return `Recibir Solicitud #${pendingAction.solicitudId}`;
      case 'anular':
        return `Anular Solicitud #${pendingAction.solicitudId}`;
      case 'devolver':
        return `Devolver SKU ${pendingAction.item?.sku}`;
      default:
        return '';
    }
  }, [pendingAction]);

  if (!pendingAction) {
    return null;
  }

  const handleReceiveChange = (index, key) => (event) => {
    const target = event?.target;
    const value =
      key === 'recibido'
        ? Boolean(target ? target.checked : false)
        : target
        ? target.value
        : '';
    setFormState((prev) =>
      prev.map((item, idx) =>
        idx === index
          ? {
              ...item,
              [key]:
                key === 'cantidad_recibida'
                  ? Number(value)
                  : key === 'recibido'
                  ? Boolean(value)
                  : value
            }
          : item
      )
    );
  };

  const handleAnularChange = (key) => (event) => {
    const target = event?.target;
    const value = target ? target.value : '';
    setFormState((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleDevolverChange = (key) => (event) => {
    const target = event?.target;
    const value = target ? target.value : '';
    setFormState((prev) => ({
      ...prev,
      [key]: key === 'cantidad' ? Number(value) : value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!pendingAction) {
      return;
    }
    setError(null);
    setSaving(true);
    try {
      if (pendingAction.type === 'receive') {
        if (!Array.isArray(formState) || !formState.length) {
          setError('Selecciona al menos un ítem a recibir.');
          setSaving(false);
          return;
        }
        const prepared = formState.map((item) => ({
          id: item.id,
          cantidad_recibida: ensurePositiveNumber(item.cantidad_recibida),
          recibido: item.recibido !== false
        }));
        if (prepared.some((item) => item.cantidad_recibida <= 0)) {
          setError('La cantidad recibida debe ser mayor a cero.');
          setSaving(false);
          return;
        }
        await confirmReceive(prepared);
      } else if (pendingAction.type === 'anular') {
        const requiresTraslado = pendingAction.solicitud?.estatus === 'RECIBIDA';
        if (
          requiresTraslado &&
          (!formState?.departamento?.trim() || !formState?.entregamos_a?.trim())
        ) {
          setError(
            'Debes especificar el departamento y la persona a la que se devuelve el material.'
          );
          setSaving(false);
          return;
        }
        await confirmAnular({
          departamento: formState.departamento || undefined,
          entregamos_a: formState.entregamos_a || undefined,
          observaciones: formState.observaciones || undefined
        });
      } else if (pendingAction.type === 'devolver') {
        const cantidad = ensurePositiveNumber(formState.cantidad);
        if (!cantidad) {
          setError('Ingresa una cantidad válida a devolver.');
          setSaving(false);
          return;
        }
        if (cantidad > (pendingAction.item?.restante ?? 0)) {
          setError('La cantidad excede las unidades restantes por devolver.');
          setSaving(false);
          return;
        }
        await confirmDevolver({
          cantidad,
          departamento: formState.departamento || undefined,
          entregamos_a: formState.entregamos_a || undefined,
          comentario: formState.comentario || undefined
        });
      }
      setSaving(false);
    } catch (err) {
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.detail ||
        err?.message ||
        'Ocurrió un error al procesar la acción.';
      setError(
        typeof message === 'string'
          ? message
          : 'Ocurrió un error al procesar la acción.'
      );
      setSaving(false);
    }
  };

  const renderBody = () => {
    if (pendingAction.type === 'receive') {
      if (!Array.isArray(formState)) {
        return (
          <div className="text-center py-3">
            <Alert variant="info" className="mb-0">
              Preparando listado de ítems…
            </Alert>
          </div>
        );
      }
      return (
        <>
          <p className="text-muted">
            Verifica las cantidades recibidas por cada SKU antes de confirmar.
          </p>
          {error ? <Alert variant="danger">{error}</Alert> : null}
          <Table bordered size="sm" className="mb-3">
            <thead className="thead-light">
              <tr>
                <th>SKU</th>
                <th>Descripción</th>
                <th>Enviada</th>
                <th>Recibida</th>
                <th>Recibido</th>
              </tr>
            </thead>
            <tbody>
              {formState.map((item, idx) => (
                <tr key={item.id ?? idx}>
                  <td>{item.sku || '—'}</td>
                  <td>{item.descripcion || '—'}</td>
                  <td>{item.cantidad_enviada}</td>
                  <td style={{ width: 140 }}>
                    <Form.Control
                      type="number"
                      min="0"
                      value={item.cantidad_recibida}
                      onChange={handleReceiveChange(idx, 'cantidad_recibida')}
                    />
                  </td>
                  <td className="text-center">
                    <Form.Check
                      type="checkbox"
                      checked={item.recibido}
                      onChange={handleReceiveChange(idx, 'recibido')}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      );
    }

    if (pendingAction.type === 'anular') {
      if (!formState) {
        return null;
      }
      const usuariosOptions = catalogs.usuarios || [];
      return (
        <Form className="d-flex flex-column gap-3">
          <p className="text-muted mb-0">
            Completa la información para registrar la anulación de esta solicitud.
          </p>
          {error ? <Alert variant="danger">{error}</Alert> : null}
          <Form.Group controlId="anular-departamento">
            <Form.Label>Departamento que recibe</Form.Label>
            <Form.Control
              type="text"
              value={formState.departamento}
              list="solicitud-departamentos"
              onChange={handleAnularChange('departamento')}
              placeholder="Departamento o área"
            />
            <datalist id="solicitud-departamentos">
              {catalogs.departamentos?.map((departamento) => (
                <option key={departamento} value={departamento} />
              ))}
            </datalist>
          </Form.Group>
          <Form.Group controlId="anular-entregamos-a">
            <Form.Label>Entregamos a</Form.Label>
            <Form.Control
              type="text"
              value={formState.entregamos_a}
              list="solicitud-usuarios"
              onChange={handleAnularChange('entregamos_a')}
              placeholder="Usuario que recibe"
            />
            <datalist id="solicitud-usuarios">
              {usuariosOptions.map((user) => (
                <option key={user.id ?? user.username} value={user.username}>
                  {user.label}
                </option>
              ))}
            </datalist>
          </Form.Group>
          <Form.Group controlId="anular-observaciones">
            <Form.Label>Observaciones</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={formState.observaciones}
              onChange={handleAnularChange('observaciones')}
              placeholder="Motivo o comentarios adicionales"
            />
          </Form.Group>
        </Form>
      );
    }

    if (pendingAction.type === 'devolver') {
      if (!formState) {
        return null;
      }
      const usuariosOptions = catalogs.usuarios || [];
      const restante = pendingAction.item?.restante ?? 0;
      return (
        <Form className="d-flex flex-column gap-3">
          {error ? <Alert variant="danger">{error}</Alert> : null}
          <div className="text-muted">
            Disponible para devolver: <strong>{restante}</strong> unidades.
          </div>
          <Form.Group controlId="devolver-cantidad">
            <Form.Label>Cantidad a devolver</Form.Label>
            <Form.Control
              type="number"
              min="1"
              max={restante}
              value={formState.cantidad}
              onChange={handleDevolverChange('cantidad')}
            />
          </Form.Group>
          <Form.Group controlId="devolver-departamento">
            <Form.Label>Departamento que recibe</Form.Label>
            <Form.Control
              type="text"
              value={formState.departamento}
              list="solicitud-departamentos-devolver"
              onChange={handleDevolverChange('departamento')}
              placeholder="Departamento o área"
            />
            <datalist id="solicitud-departamentos-devolver">
              {catalogs.departamentos?.map((departamento) => (
                <option key={departamento} value={departamento} />
              ))}
            </datalist>
          </Form.Group>
          <Form.Group controlId="devolver-usuario">
            <Form.Label>Entregamos a</Form.Label>
            <Form.Control
              type="text"
              value={formState.entregamos_a}
              list="solicitud-usuarios-devolver"
              onChange={handleDevolverChange('entregamos_a')}
              placeholder="Usuario que recibe"
            />
            <datalist id="solicitud-usuarios-devolver">
              {usuariosOptions.map((user) => (
                <option key={user.id ?? user.username} value={user.username}>
                  {user.label}
                </option>
              ))}
            </datalist>
          </Form.Group>
          <Form.Group controlId="devolver-comentario">
            <Form.Label>Comentario</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={formState.comentario}
              onChange={handleDevolverChange('comentario')}
              placeholder="Notas adicionales (opcional)"
            />
          </Form.Group>
        </Form>
      );
    }

    return null;
  };

  return (
    <Modal
      show
      onHide={saving ? undefined : closeActionModal}
      size="lg"
      centered
    >
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton={!saving}>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{renderBody()}</Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={closeActionModal}
            disabled={saving}
          >
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? 'Procesando…' : 'Confirmar'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ActionModal;
