import React, { useMemo } from 'react';
import ReactQuill from 'react-quill';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useHistoriaEnfermedadContext } from './Context';
import 'quill/dist/quill.snow.css';

const TOOLBAR_PRESETS = {
  COMPLETA: [
    [{ size: ['small', false, 'large', 'huge'] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ align: [] }],
    ['blockquote', 'code-block'],
    ['link'],
    ['clean']
  ],
  BASICA: [
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link']
  ],
  MINIMA: [['bold', 'italic'], ['clean']]
};

const HistoriaEnfermedadForm = () => {
  const {
    title,
    content,
    tema,
    toolbar,
    placeholder,
    autoguardado,
    soloLectura,
    loading,
    saving,
    error,
    handleContentChange,
    handleConfigChange,
    handleSave
  } = useHistoriaEnfermedadContext();

  const modules = useMemo(
    () => ({
      toolbar: TOOLBAR_PRESETS[toolbar] ?? TOOLBAR_PRESETS.COMPLETA
    }),
    [toolbar]
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
      'align',
      'blockquote',
      'code-block',
      'link'
    ],
    []
  );

  const handleSaveClick = async () => {
    await handleSave?.();
  };

  return (
    <Card className="shadow-sm border-0 mb-4">
      <Card.Header className="bg-white border-0">
        <h4 className="mb-0">{title}</h4>
      </Card.Header>
      <Card.Body>
        {error ? (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        ) : null}
        <Row className="g-3 mb-3">
          <Col md={4}>
            <Form.Group controlId="historia-tema">
              <Form.Label>Tema del editor</Form.Label>
              <Form.Control
                as="select"
                value={tema}
                onChange={(event) =>
                  handleConfigChange('tema', event.target.value)
                }
              >
                <option value="SNOW">Snow</option>
                <option value="BUBBLE">Bubble</option>
              </Form.Control>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="historia-toolbar">
              <Form.Label>Barra de herramientas</Form.Label>
              <Form.Control
                as="select"
                value={toolbar}
                onChange={(event) =>
                  handleConfigChange('toolbar', event.target.value)
                }
              >
                <option value="COMPLETA">Completa</option>
                <option value="BASICA">Básica</option>
                <option value="MINIMA">Mínima</option>
              </Form.Control>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="historia-placeholder">
              <Form.Label>Placeholder</Form.Label>
              <Form.Control
                type="text"
                value={placeholder ?? ''}
                onChange={(event) =>
                  handleConfigChange('placeholder', event.target.value)
                }
                placeholder="Texto guía para el editor"
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Check
              type="switch"
              id="historia-autoguardado"
              label="Autoguardado"
              checked={autoguardado}
              onChange={(event) =>
                handleConfigChange('autoguardado', event.target.checked)
              }
            />
          </Col>
          <Col md={3}>
            <Form.Check
              type="switch"
              id="historia-solo-lectura"
              label="Solo lectura"
              checked={soloLectura}
              onChange={(event) =>
                handleConfigChange('soloLectura', event.target.checked)
              }
            />
          </Col>
        </Row>
        <div className="mb-3">
          <ReactQuill
            theme={tema.toLowerCase()}
            value={content || ''}
            onChange={handleContentChange}
            modules={modules}
            formats={formats}
            placeholder={
              placeholder ||
              'Describe los antecedentes, diagnósticos y evolución del paciente...'
            }
            readOnly={soloLectura}
          />
        </div>
        <div className="d-flex justify-content-end gap-2">
          <Button
            variant="primary"
            onClick={handleSaveClick}
            disabled={loading || saving}
          >
            {saving ? 'Guardando…' : 'Guardar cambios'}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default HistoriaEnfermedadForm;
