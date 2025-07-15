import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Form,
  Button,
  Card,
} from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const FormularioAdmision = () => {
  const defaultCaja = localStorage.getItem('defaultCaja') || '';
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: { caja: defaultCaja }
  });
  const [showPassword, setShowPassword] = useState(false);
  const [filtroCaja, setFiltroCaja] = useState('');

  const cajas = [
    { value: 'admisiones', label: 'Caja Admisiones' },
    { value: 'farmacia', label: 'Caja Farmacia' },
    { value: 'consulta', label: 'Caja Consulta Externa' }
  ];

  const cajasFiltradas = cajas.filter(caja =>
    caja.label.toLowerCase().includes(filtroCaja.toLowerCase())
  );

  const selectedCaja = watch('caja');

  useEffect(() => {
    if (selectedCaja) {
      localStorage.setItem('defaultCaja', selectedCaja);
    }
  }, [selectedCaja]);

  const onSubmit = (data) => {
    console.log('Ingresando a la caja:', data);
  };

  return (
    <div className="d-flex justify-content-center align-items-start py-5 px-3 bg-light" style={{ minHeight: '100vh' }}>
      <Card className="w-100 shadow-sm p-4" style={{ maxWidth: '800px' }}>
        <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
          <h5 className="text-primary m-0">Ingresar a la Caja</h5>
          <Button variant="outline-secondary" size="sm">Cerrar Caja</Button>
        </div>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label># Caja *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Filtrar cajas"
                  value={filtroCaja}
                  onChange={(e) => setFiltroCaja(e.target.value)}
                  className="mb-2"
                />
                <Form.Control
                  as="select"
                  {...register('caja')}
                  defaultValue={defaultCaja}
                >
                  <option value="">Seleccione</option>
                  {cajasFiltradas.map((caja) => (
                    <option key={caja.value} value={caja.value}>
                      {caja.label}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label># Cajero *</Form.Label>
                <Form.Control as="select" {...register('cajero')}>
                  <option value="">Seleccione</option>
                  <option value="andrea">Andrea Arenas Flores</option>
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Clave *</Form.Label>
                <div className="input-group">
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    {...register('clave')}
                  />
                  <span
                    className="input-group-text bg-white border-start-0"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ cursor: 'pointer' }}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </span>
                </div>
              </Form.Group>
            </Col>
          </Row>

          <div className="text-muted small mb-3">* Campos obligatorios</div>

          <div className="d-flex justify-content-center">
            <Button type="submit" variant="primary">
              Ingresar a la Caja
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default FormularioAdmision;
