import React from 'react';
import { Modal, Button, Table, Form, Row, Col } from 'react-bootstrap';
import { useSolicitudesContext } from './Context';

const ModalSolicitud = () => {
  const {
    modal,
    closeModal,
    handleChangeDetalle,
    guardarEdicion,
    enviarSolicitud
  } = useSolicitudesContext();

  if (!modal.show || !modal.data) return null;

  return (
    <Modal show={modal.show} onHide={closeModal} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {modal.mode === 'ver' ? 'Detalle de Solicitud' : 'Editar Solicitud'}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Row>
          <Col md={6}>
            <p><strong>Admision:</strong> {modal.data.admision}</p>
            <p><strong>Paciente:</strong> {modal.data.paciente}</p>
            <p><strong>Área:</strong> {modal.data.area}</p>
          </Col>
          <Col md={6}>
            <p><strong>Bodega Origen:</strong> {modal.data.bodega_origen}</p>
            <p><strong>Bodega Destino:</strong> {modal.data.bodega_destino}</p>
            <p><strong>Estatus:</strong> {modal.data.estatus}</p>
          </Col>
        </Row>

        <h6>Detalle de SKUs</h6>
        <Table bordered size="sm">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Descripción</th>
              <th>Cant. Solicitada</th>
              <th>Cant. Enviada</th>
              <th>Comentario</th>
            </tr>
          </thead>
          <tbody>
            {modal.data.detalle.map((d, i) => (
              <tr key={i}>
                <td>{d.sku}</td>
                <td>{d.descripcion}</td>
                <td>{d.cantidad}</td>
                <td>
                  {modal.mode === 'editar' ? (
                    <Form.Control
                      type="number"
                      value={d.enviada}
                      onChange={(e) =>
                        handleChangeDetalle(i, 'enviada', e.target.value)
                      }
                    />
                  ) : (
                    d.enviada || '—'
                  )}
                </td>
                <td>
                  {modal.mode === 'editar' ? (
                    <Form.Control
                      type="text"
                      value={d.comentario}
                      onChange={(e) =>
                        handleChangeDetalle(i, 'comentario', e.target.value)
                      }
                    />
                  ) : (
                    d.comentario || '—'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>

      <Modal.Footer>
        {modal.mode === 'editar' ? (
          <>
            <Button variant="secondary" onClick={guardarEdicion}>
              Guardar
            </Button>
            <Button variant="primary" onClick={enviarSolicitud}>
              Enviar
            </Button>
          </>
        ) : (
          <Button variant="outline-secondary" onClick={closeModal}>
            Cerrar
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ModalSolicitud;