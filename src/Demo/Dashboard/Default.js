import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FiBox, FiPackage, FiClipboard, FiTag, FiTrendingUp } from 'react-icons/fi';
import Aux from '../../hoc/_Aux';

const quickActions = [
  {
    title: 'Productos',
    description: 'Gestiona SKUs, códigos y existencias.',
    icon: <FiBox size={22} />,
    link: '/dashboard/inventario/productos'
  },
  {
    title: 'Categorías',
    description: 'Ordena el catálogo por familias y subcategorías.',
    icon: <FiClipboard size={22} />,
    link: '/dashboard/inventario/categorias'
  },
  {
    title: 'Marcas',
    description: 'Administra marcas y proveedores asociados.',
    icon: <FiTag size={22} />,
    link: '/dashboard/inventario/marcas'
  },
  {
    title: 'Precios',
    description: 'Actualiza precios y descuentos vigentes.',
    icon: <FiTrendingUp size={22} />,
    link: '/dashboard/inventario/precios'
  }
];

const quickStats = [
  { label: 'Productos activos', value: '—', hint: 'Conecta este KPI a tu endpoint de inventario.' },
  { label: 'Categorías', value: '—', hint: 'Resume la estructura del catálogo.' },
  { label: 'Marcas registradas', value: '—', hint: 'Número de marcas disponibles.' },
  { label: 'Actualizaciones de precio', value: '—', hint: 'Últimos ajustes realizados.' }
];

const Dashboard = () => {
  return (
    <Aux>
      <Container fluid className="py-4" style={{ minHeight: '100vh', background: '#f5f7fb' }}>
        <style>
          {`
            .fade-in {
              opacity: 0;
              transform: translateY(10px);
              animation: fadeInUp 0.8s ease forwards;
            }

            @keyframes fadeInUp {
              to { opacity: 1; transform: translateY(0); }
            }
          `}
        </style>

        <Row className="mb-4 fade-in">
          <Col>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
              <div>
                <h4 className="mb-2" style={{ fontWeight: 700, color: '#111827' }}>Bienvenido a Inventario General</h4>
                <p className="mb-0 text-muted">Atajos rápidos para las secciones más usadas.</p>
              </div>
            </div>
          </Col>
        </Row>

        <Row className="g-3">
          {quickStats.map((stat, idx) => (
            <Col key={`stat-${idx}`} xs={12} md={6} xl={3}>
              <Card className="h-100 shadow-sm fade-in" style={{ animationDelay: `${idx * 60}ms` }}>
                <Card.Body>
                  <p className="text-muted mb-2" style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</p>
                  <h3 className="mb-1" style={{ fontWeight: 800, color: '#111827' }}>{stat.value}</h3>
                  <small className="text-muted">{stat.hint}</small>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <Row className="g-3 mt-1">
          {quickActions.map((action, idx) => (
            <Col key={idx} xs={12} md={6} xl={3}>
              <Card className="h-100 shadow-sm fade-in" style={{ animationDelay: `${idx * 80}ms` }}>
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex align-items-center mb-3">
                    <div
                      className="d-inline-flex align-items-center justify-content-center rounded-circle"
                      style={{ width: 44, height: 44, backgroundColor: '#ecfdf3', color: '#16a34a' }}
                    >
                      {action.icon}
                    </div>
                    <div className="ms-3">
                      <h6 className="mb-0" style={{ fontWeight: 700 }}>{action.title}</h6>
                    </div>
                  </div>
                  <p className="text-muted" style={{ flex: 1 }}>{action.description}</p>
                  <Button href={action.link} variant="outline-success" className="mt-2">
                    Ir a {action.title}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </Aux>
  );
};

export default Dashboard;
