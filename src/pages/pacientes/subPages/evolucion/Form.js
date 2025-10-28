import React from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { useEvolucionContext } from './Context';

const EvolucionForm = () => {
  const {
    mode,
    activeNote,
    editorState,
    setResumen,
    setContenido,
    saveNote,
    saving,
    returnToList,
    startEdit
  } = useEvolucionContext();

  if (mode === 'LIST') {
    return null;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await saveNote();
    if (result?.success) {
      return;
    }
    switch (result?.reason) {
      case 'EMPTY':
        window.alert('Ingresa el contenido completo de la evolución.');
        break;
      case 'PERMISSION':
        window.alert('No tienes permisos para guardar esta evolución.');
        break;
      case 'UNAVAILABLE':
        window.alert('Por ahora no es posible guardar evoluciones. Intenta más tarde.');
        break;
      default:
        break;
    }
  };

  if (mode === 'VIEW' && activeNote) {
    const colegiadoLabel = activeNote.medicoColegiado
      ? ` · Colegiado ${activeNote.medicoColegiado}`
      : '';

    return (
      <Card className="shadow-sm border-0 mb-4">
        <Card.Header className="bg-white border-0 d-flex justify-content-between align-items-start flex-wrap gap-2">
          <div>
            <h4 className="mb-1">Detalle de evolución</h4>
            <small className="text-muted">
              Registrada {activeNote.creadoEnLabel} · {activeNote.medicoNombre}
              {colegiadoLabel}
            </small>
          </div>
          <div className="d-flex gap-2">
            {activeNote.canEdit ? (
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => startEdit(activeNote.id)}
              >
                Editar
              </Button>
            ) : null}
            <Button variant="outline-secondary" size="sm" onClick={returnToList}>
              Cerrar
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          {activeNote.resumen ? (
            <p className="fw-semibold">{activeNote.resumen}</p>
          ) : null}
          <div
            className="border rounded p-3 bg-light-subtle"
            style={{ whiteSpace: 'pre-line', textAlign: 'justify' }}
          >
            {activeNote.contenido || '—'}
          </div>
        </Card.Body>
      </Card>
    );
  }

  const headerSubtitle =
    mode === 'EDIT' && activeNote
      ? `Registrada ${activeNote.creadoEnLabel} por ${activeNote.medicoNombre}`
      : 'Completa la información para registrar la evolución.';

  return (
    <Card className="shadow-sm border-0 mb-4">
      <Card.Header className="bg-white border-0 d-flex justify-content-between align-items-start flex-wrap gap-2">
        <div>
          <h4 className="mb-0">
            {mode === 'EDIT' ? 'Editar evolución' : 'Nueva evolución'}
          </h4>
          <small className="text-muted">{headerSubtitle}</small>
        </div>
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={returnToList}
          disabled={saving}
        >
          Cancelar
        </Button>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          <Form.Group controlId="evolucion-resumen">
            <Form.Label>Resumen (opcional)</Form.Label>
            <Form.Control
              type="text"
              value={editorState.resumen}
              onChange={(event) => setResumen(event.target.value)}
              placeholder="Resumen breve que ayude a identificar la nota"
              disabled={saving}
              maxLength={200}
            />
            <Form.Text className="text-muted">
              Se mostrará como descripción general en el listado.
            </Form.Text>
          </Form.Group>
          <Form.Group controlId="evolucion-contenido">
            <Form.Label>Contenido de la evolución</Form.Label>
            <Form.Control
              as="textarea"
              rows={8}
              value={editorState.contenido}
              onChange={(event) => setContenido(event.target.value)}
              placeholder="Describe la evolución clínica, hallazgos, diagnóstico y plan."
              disabled={saving}
              required
            />
          </Form.Group>
          <div className="d-flex justify-content-end gap-2">
            <Button
              type="button"
              variant="outline-secondary"
              onClick={returnToList}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? 'Guardando…' : 'Guardar evolución'}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default EvolucionForm;
