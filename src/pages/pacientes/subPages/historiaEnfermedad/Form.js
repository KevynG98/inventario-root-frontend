import React, { useMemo } from 'react';
import ReactQuill from 'react-quill';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
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
    placeholder,
    soloLectura,
    loading,
    saving,
    error,
    handleContentChange,
    handleSave
  } = useHistoriaEnfermedadContext();

  const modules = useMemo(
    () => ({
      toolbar: TOOLBAR_PRESETS.COMPLETA
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
        <div className="mb-3">
          <ReactQuill
            theme="snow"
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
