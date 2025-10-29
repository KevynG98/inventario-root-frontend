import React, { useMemo, useState } from 'react';
import { Badge, Button, Card, ListGroup, Modal, Form } from 'react-bootstrap';
import { useIngestaExcretaContext } from './Context';

const numberFormatter = new Intl.NumberFormat('es-GT', {
  maximumFractionDigits: 2,
  minimumFractionDigits: 0
});

const formatNumber = (value) => numberFormatter.format(value ?? 0);

const formatDateTime = (iso) => {
  if (!iso) {
    return '—';
  }
  try {
    return new Intl.DateTimeFormat('es-GT', {
      dateStyle: 'short',
      timeStyle: 'short'
    }).format(new Date(iso));
  } catch (error) {
    return '—';
  }
};

const todayDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const IngestaExcretaList = () => {
  const {
    tables,
    activeDate,
    helpers,
    actions: { selectDate, createTable }
  } = useIngestaExcretaContext();

  const [showModal, setShowModal] = useState(false);
  const [newDate, setNewDate] = useState(() => todayDate());

  const orderedTables = useMemo(() => tables, [tables]);

  const handleOpenModal = () => {
    setNewDate(todayDate());
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCreateTable = async (event) => {
    event.preventDefault();
    try {
      const result = await createTable(newDate);
      if (!result?.success) {
        if (result?.reason === 'invalid-date') {
          window.alert('Selecciona una fecha válida para crear el registro.');
        } else if (result?.reason === 'duplicate') {
          window.alert(
            'Ya existe un registro de ingesta y excreta para esa fecha.'
          );
        } else {
          window.alert(
            'No se pudo crear el registro. Intenta nuevamente más tarde.'
          );
        }
        return;
      }
      setShowModal(false);
    } catch (error) {
      console.error('Error creando registro de ingesta/excreta', error);
      window.alert('No se pudo crear el registro. Intenta nuevamente.');
    }
  };

  return (
    <>
      <Card className="mb-3">
        <Card.Body>
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2 mb-3">
            <div>
              <Card.Title as="h5" className="mb-0">
                Registros por fecha
              </Card.Title>
              <Card.Text className="text-muted mb-0">
                Selecciona una fecha para visualizar y editar la tabla
                correspondiente.
              </Card.Text>
            </div>
            <Button onClick={handleOpenModal}>Agregar fecha</Button>
          </div>
          {orderedTables.length === 0 ? (
            <div className="text-muted fst-italic">
              Aún no se han creado registros de ingesta y excreta. Usa el botón
              “Agregar fecha” para iniciar uno nuevo.
            </div>
          ) : (
            <ListGroup>
              {orderedTables.map((table) => {
                const summary = helpers.computeSummariesForTable(table);
                return (
                  <ListGroup.Item
                    key={table.date}
                    action
                    active={table.date === activeDate}
                    onClick={() => selectDate(table.date)}
                    className="d-flex flex-column gap-2"
                  >
                    <div className="d-flex flex-column flex-lg-row justify-content-between gap-2">
                      <div>
                        <div className="fw-semibold">
                          {helpers.formatDateFriendly(table.date)}
                        </div>
                        <div className="text-muted small">
                          Último guardado:{' '}
                          {table.lastSavedAt
                            ? formatDateTime(table.lastSavedAt)
                            : 'Sin guardar'}
                        </div>
                      </div>
                      {summary ? (
                        <div className="d-flex flex-wrap gap-2 justify-content-end text-end">
                          <Badge bg="success">
                            Ingesta: {formatNumber(summary.totals24h.totalIngesta)}
                          </Badge>
                          <Badge bg="primary">
                            Excreta: {formatNumber(summary.totals24h.totalExcreta)}
                          </Badge>
                          <Badge
                            bg={
                              summary.totals24h.balance >= 0
                                ? 'info'
                                : 'danger'
                            }
                          >
                            Balance: {formatNumber(summary.totals24h.balance)}
                          </Badge>
                        </div>
                      ) : null}
                    </div>
                    {table.dirty ? (
                      <div className="text-warning small fw-semibold">
                        Cambios pendientes de guardar
                      </div>
                    ) : null}
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          )}
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Agregar registro diario</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateTable}>
          <Modal.Body>
            <Form.Group controlId="ingesta-excreta-date">
              <Form.Label>Fecha</Form.Label>
              <Form.Control
                type="date"
                value={newDate}
                onChange={(event) => setNewDate(event.target.value)}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button type="submit">Crear</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default IngestaExcretaList;
