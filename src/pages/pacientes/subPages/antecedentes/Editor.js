import React, { useMemo, useState } from 'react';
import { Alert, Button, Card, Col, Form, Row } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import { useAntecedentesContext } from './Context';
import 'quill/dist/quill.snow.css';

const AntecedentesEditor = () => {
  const {
    mode,
    activeRecord,
    editorState,
    setDescripcion,
    setTipo,
    setEsActivo,
    returnToList,
    saveRecord,
    saving
  } = useAntecedentesContext();
  const [feedback, setFeedback] = useState(null);

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ size: ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ color: [] }, { background: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['blockquote', 'code-block'],
        ['link'],
        ['clean']
      ]
    }),
    []
  );

  const formats = useMemo(
    () => [
      'size',
      'bold',
      'italic',
      'underline',
      'strike',
      'color',
      'background',
      'list',
      'bullet',
      'blockquote',
      'code-block',
      'link'
    ],
    []
  );

  const isReadOnly = mode === 'VIEW';

  const handleSave = async () => {
    const response = await saveRecord();
    if (!response?.success) {
      setFeedback({
        type: 'danger',
        message: 'Debes ingresar una descripción para guardar el antecedente.'
      });
    } else {
      setFeedback({
        type: 'success',
        message: 'Antecedente guardado correctamente.'
      });
    }
  };

  const headerTitle =
    mode === 'EDIT'
      ? 'Editar antecedente'
      : mode === 'CREATE'
      ? 'Nuevo antecedente'
      : 'Detalle de antecedente';

  return (
    <Card className="shadow-sm border-0">
      <Card.Header className="bg-white border-0">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <h4 className="mb-0">{headerTitle}</h4>
          <div className="text-end small">
            {activeRecord ? (
              <>
                <div>
                  <strong>Registrado por:</strong> {activeRecord.registrado_por}
                </div>
                <div className="text-muted">
                  Registrado el {activeRecord.registradoEnLabel}
                </div>
                {activeRecord.actualizadoEnLabel ? (
                  <div className="text-muted">
                    Últ. actualización {activeRecord.actualizadoEnLabel}
                  </div>
                ) : null}
              </>
            ) : null}
          </div>
        </div>
      </Card.Header>
      <Card.Body>
        {feedback ? (
          <Alert
            variant={feedback.type}
            onClose={() => setFeedback(null)}
            dismissible
          >
            {feedback.message}
          </Alert>
        ) : null}
        {isReadOnly ? (
          <Alert variant="info">
            Vista en modo lectura. Puedes consultar el antecedente sin
            modificarlo.
          </Alert>
        ) : (
          <Alert variant="light" className="border">
            Completa la información necesaria y guarda los antecedentes del
            paciente.
          </Alert>
        )}

        {!isReadOnly ? (
          <Row className="mb-3 g-3">
            <Col md={6}>
              <Form.Group controlId="antecedente-tipo">
                <Form.Label>Tipo de antecedente</Form.Label>
                <Form.Control
                  as="select"
                  value={editorState.tipo}
                  onChange={(event) => setTipo(event.target.value)}
                >
                  <option value="PERSONALES">Personales</option>
                  <option value="FAMILIARES">Familiares</option>
                  <option value="QUIRURGICOS">Quirúrgicos</option>
                  <option value="FARMACOLOGICOS">Farmacológicos</option>
                  <option value="ALERGIAS">Alergias</option>
                  <option value="OTROS">Otros</option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={6} className="d-flex align-items-end">
              <Form.Check
                type="switch"
                id="antecedente-activo"
                label="Antecedente activo"
                checked={editorState.es_activo}
                onChange={(event) => setEsActivo(event.target.checked)}
              />
            </Col>
          </Row>
        ) : (
          <div className="mb-3">
            <strong>Tipo:</strong>{' '}
            <span className="badge bg-light text-dark">
              {activeRecord?.tipoLabel}
            </span>
          </div>
        )}

        <div className="mx-auto" style={{ maxWidth: '820px' }}>
          <ReactQuill
            theme="snow"
            value={editorState.descripcion}
            onChange={setDescripcion}
            modules={modules}
            formats={formats}
            readOnly={isReadOnly}
            placeholder="Escribe los antecedentes del paciente..."
            style={{ minHeight: '360px' }}
          />
        </div>
      </Card.Body>
      <Card.Footer className="bg-white d-flex justify-content-end gap-2">
        <Button variant="outline-secondary" onClick={returnToList}>
          Volver
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={isReadOnly}>
          {saving ? 'Guardando…' : 'Guardar'}
        </Button>
      </Card.Footer>
    </Card>
  );
};

export default AntecedentesEditor;
