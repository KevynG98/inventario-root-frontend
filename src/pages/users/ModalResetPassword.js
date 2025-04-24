import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useMyContext } from './Context';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

const ModalResetPassword = () => {
  const { showResetPassword, closeResetPasswordModal } = useMyContext();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isMismatch, setIsMismatch] = useState(false);

  useEffect(() => {
    if (confirm.length > 0) {
      setIsMismatch(password !== confirm);
    } else {
      setIsMismatch(false);
    }
  }, [password, confirm]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isMismatch) return;

    // Aquí iría la lógica del backend
    alert(`Contraseña restablecida: ${password}`);
    closeResetPasswordModal();
  };

  return (
    <Modal show={showResetPassword} onHide={closeResetPasswordModal} centered>
      <Modal.Body className="p-4">
        <h5 className="fw-bold mb-4">Restablecer contraseña</h5>
        <Form onSubmit={handleSubmit}>
          {/* Nueva contraseña */}
          <Form.Group className="mb-3 position-relative">
            <Form.Label>Nueva contraseña</Form.Label>
            <div className="d-flex align-items-center">
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa la nueva contraseña"
                isInvalid={isMismatch}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{ marginLeft: '-30px', cursor: 'pointer' }}
              >
                {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
              </span>
            </div>
          </Form.Group>

          {/* Confirmar contraseña */}
          <Form.Group className="mb-3 position-relative">
            <Form.Label>Confirmar contraseña</Form.Label>
            <div className="d-flex align-items-center">
              <Form.Control
                type={showConfirm ? 'text' : 'password'}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Confirma la contraseña"
                isInvalid={isMismatch}
              />
              <span
                onClick={() => setShowConfirm(!showConfirm)}
                style={{ marginLeft: '-30px', cursor: 'pointer' }}
              >
                {showConfirm ? <AiFillEyeInvisible /> : <AiFillEye />}
              </span>
            </div>
            {isMismatch && (
              <Form.Text className="text-danger">
                Las contraseñas no coinciden
              </Form.Text>
            )}
          </Form.Group>

          {/* Botones */}
          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={closeResetPasswordModal}>Cancelar</Button>
            <Button type="submit" variant="primary" disabled={isMismatch}>Guardar</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalResetPassword;
