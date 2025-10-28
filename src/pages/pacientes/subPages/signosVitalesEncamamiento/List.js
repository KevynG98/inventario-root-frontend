import React, { useMemo, useState } from 'react';
import { Badge, Button, Card, Form, Modal, Table } from 'react-bootstrap';
import { useSignosEncamamientoContext } from './Context';

const parseRowStartHour = (label) => {
  if (!label || typeof label !== 'string') {
    return 0;
  }
  const [start] = label.split('-');
  if (!start) {
    return 0;
  }
  const normalized = start === '24' ? '00' : start;
  const parsed = parseInt(normalized, 10);
  if (Number.isNaN(parsed)) {
    return 0;
  }
  return parsed % 24;
};

const isAfterMidnightRow = (label) => parseRowStartHour(label) < 7;

const formatDateForInput = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const addDaysToDateString = (value, days = 1) => {
  const base =
    typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
      ? new Date(`${value}T00:00`)
      : new Date();
  if (Number.isNaN(base.getTime())) {
    return formatDateForInput(new Date());
  }
  const result = new Date(base);
  result.setDate(result.getDate() + days);
  return formatDateForInput(result);
};

const SignosEncamamientoList = () => {
  const {
    registros,
    timelineRows,
    fields,
    loading,
    error,
    deleteRecord,
    formatDate,
    saveCellMeasurement
  } = useSignosEncamamientoContext();

  const columnHeaders = useMemo(
    () =>
      fields.map((field) => ({
        id: field.id,
        label: field.tableHeader?.[0] ?? field.label,
        subLabel:
          Array.isArray(field.tableHeader) && field.tableHeader.length > 1
            ? field.tableHeader.slice(1).join(' ')
            : null,
        fieldLabel: field.label
      })),
    [fields]
  );

  const [editingCell, setEditingCell] = useState(null);
  const [savingCell, setSavingCell] = useState(false);

  const todayDateString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const toDateInputValue = (iso) => {
    if (!iso) {
      return todayDateString();
    }
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) {
      return todayDateString();
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const defaultTimeForLabel = (label) => {
    const hour = parseRowStartHour(label);
    return `${String(hour).padStart(2, '0')}:00`;
  };

  const toTimeInputValue = (iso, fallbackLabel) => {
    if (!iso) {
      return defaultTimeForLabel(fallbackLabel);
    }
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) {
      return defaultTimeForLabel(fallbackLabel);
    }
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleCellSelect = (rowLabel, column, registro) => {
    if (!column || savingCell) {
      return;
    }
    const timestamp = registro?.tomadoEn ?? null;
    const defaultDate = toDateInputValue(timestamp);
    const defaultTime = toTimeInputValue(timestamp, rowLabel);
    const isNewEntry = !registro;
    const afterMidnight = isAfterMidnightRow(rowLabel);
    const resolvedDate =
      isNewEntry && afterMidnight
        ? addDaysToDateString(defaultDate, 1)
        : defaultDate;

    setEditingCell({
      rowLabel,
      column,
      registro,
      autoAdjustedDate: isNewEntry && afterMidnight,
      initialDate: resolvedDate,
      form: {
        date: resolvedDate,
        time: defaultTime,
        value:
          registro?.valores && registro.valores[column.id] !== undefined
            ? registro.valores[column.id]
            : '',
        comment: registro?.comentarios ?? ''
      }
    });
  };

  const handleModalChange = (key) => (event) => {
    const { value } = event.target;
    setEditingCell((prev) =>
      prev
        ? {
            ...prev,
            form: {
              ...prev.form,
              [key]: value
            },
            dateManuallyEdited:
              key === 'date' ? true : prev.dateManuallyEdited ?? false
          }
        : prev
    );
  };

  const closeModal = () => {
    if (savingCell) {
      return;
    }
    setEditingCell(null);
  };

  const handleModalSubmit = async (event) => {
    event.preventDefault();
    if (!editingCell) {
      return;
    }
    const { value, date, time, comment } = editingCell.form;
    if (
      value === undefined ||
      value === null ||
      (typeof value === 'string' && value.trim() === '')
    ) {
      window.alert('Ingresa el valor del signo vital.');
      return;
    }
    if (!date) {
      window.alert('Selecciona la fecha del registro.');
      return;
    }
    setSavingCell(true);
    try {
      const response = await saveCellMeasurement({
        rowLabel: editingCell.rowLabel,
        fieldId: editingCell.column.id,
        value,
        comment,
        date,
        time,
        registroId: editingCell.registro?.id ?? null,
        existingValues: editingCell.registro?.valores ?? {}
      });
      if (response?.success) {
        setEditingCell(null);
      }
    } catch (error) {
      console.error('No se pudo guardar el signo seleccionado', error);
      window.alert('No se pudo guardar el registro. Inténtalo de nuevo.');
    } finally {
      setSavingCell(false);
    }
  };

  return (
    <Card className="shadow-sm border-0">
      <Card.Header className="bg-white border-0">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <h4 className="mb-0">Tabla de signos vitales</h4>
          <Badge bg="secondary" pill>
            {registros.length} {registros.length === 1 ? 'registro' : 'registros'}
          </Badge>
        </div>
      </Card.Header>
      <Card.Body className="p-0">
        {error ? (
          <div className="p-4 text-center text-danger">{error}</div>
        ) : null}
        {loading && registros.length === 0 ? (
          <div className="p-4 text-center text-muted">
            Cargando signos vitales…
          </div>
        ) : null}
        {!loading && registros.length === 0 ? (
          <div className="px-4 py-2 text-muted small">
            No hay registros guardados. Selecciona una celda para capturar los
            signos del día.
          </div>
        ) : null}
        <div
          className="table-responsive"
          style={{
            maxHeight: '70vh',
            overflowX: 'scroll',
            overflowY: 'auto'
          }}
        >
          <Table bordered size="sm" className="mb-0 text-center align-middle">
            <thead className="table-light">
              <tr>
                <th rowSpan={2} style={{ minWidth: 100 }}>
                  Hora
                </th>
                {columnHeaders.map((column) => (
                  <th
                    key={column.id}
                    colSpan={column.subLabel ? 1 : 1}
                    rowSpan={column.subLabel ? 1 : 2}
                  >
                    {column.label}
                  </th>
                ))}
                <th rowSpan={2} style={{ minWidth: 160 }}>
                  Comentarios
                </th>
                <th rowSpan={2} style={{ minWidth: 160 }}>
                  Registrado por
                </th>
                <th rowSpan={2} style={{ minWidth: 140 }}>
                  Fecha y hora
                </th>
                <th rowSpan={2} style={{ minWidth: 120 }}>
                  Acciones
                </th>
              </tr>
              <tr>
                {columnHeaders.map((column) =>
                  column.subLabel ? (
                    <th key={`${column.id}-sub`} className="fw-normal">
                      {column.subLabel}
                    </th>
                  ) : null
                )}
              </tr>
            </thead>
            <tbody>
              {timelineRows.map(({ label, registro }) => (
                <tr key={label}>
                  <td className="fw-semibold">{label}</td>
                  {columnHeaders.map((column) => (
                    <td
                      key={`${label}-${column.id}`}
                      role="button"
                      onClick={() => handleCellSelect(label, column, registro)}
                      style={{ cursor: 'pointer' }}
                      className={
                        editingCell &&
                        editingCell.rowLabel === label &&
                        editingCell.column.id === column.id
                          ? 'table-primary'
                          : ''
                      }
                      title="Dar clic para registrar este signo"
                    >
                      {registro?.valores[column.id] ?? ''}
                    </td>
                  ))}
                  <td className="text-start">
                    {registro?.comentarios ?? ''}
                  </td>
                  <td>{registro?.tomadoPor ?? ''}</td>
                  <td>{registro?.tomadoEn ? formatDate(registro.tomadoEn) : ''}</td>
                  <td className="text-end">
                    {registro ? (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => {
                          if (
                            typeof deleteRecord === 'function' &&
                            window.confirm('¿Eliminar este registro?')
                          ) {
                            deleteRecord(registro.id);
                          }
                        }}
                      >
                        Eliminar
                      </Button>
                    ) : (
                      ''
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        <Modal show={Boolean(editingCell)} onHide={closeModal} centered>
          <Form onSubmit={handleModalSubmit}>
            <Modal.Header closeButton>
              <Modal.Title>
                Registrar {editingCell?.column?.fieldLabel ?? 'signo'} ·{' '}
                {editingCell?.rowLabel}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="mb-3">
                <strong>Fila seleccionada:</strong> {editingCell?.rowLabel}
                <br />
                <strong>Signo:</strong>{' '}
                {editingCell?.column?.label ??
                  editingCell?.column?.fieldLabel ??
                  ''}
              </div>
              <Form.Group controlId="signos-encam-cell-date" className="mb-3">
                <Form.Label>Fecha</Form.Label>
                <Form.Control
                  type="date"
                  value={editingCell?.form?.date ?? todayDateString()}
                  onChange={handleModalChange('date')}
                  required
                />
              </Form.Group>
              <Form.Group controlId="signos-encam-cell-time" className="mb-3">
                <Form.Label>Hora</Form.Label>
                <Form.Control
                  type="time"
                  value={
                    editingCell?.form?.time ??
                    defaultTimeForLabel(editingCell?.rowLabel)
                  }
                  onChange={handleModalChange('time')}
                />
              </Form.Group>
              <Form.Group controlId="signos-encam-cell-value" className="mb-3">
                <Form.Label>Valor</Form.Label>
                <Form.Control
                  type="text"
                  value={editingCell?.form?.value ?? ''}
                  onChange={handleModalChange('value')}
                  autoFocus
                />
              </Form.Group>
              <Form.Group controlId="signos-encam-cell-comment">
                <Form.Label>Comentarios</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder="Comentario general (opcional)"
                  value={editingCell?.form?.comment ?? ''}
                  onChange={handleModalChange('comment')}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="outline-secondary"
                type="button"
                onClick={closeModal}
                disabled={savingCell}
              >
                Cancelar
              </Button>
              <Button type="submit" variant="primary" disabled={savingCell}>
                {savingCell ? 'Guardando…' : 'Guardar registro'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Card.Body>
    </Card>
  );
};

export default SignosEncamamientoList;
