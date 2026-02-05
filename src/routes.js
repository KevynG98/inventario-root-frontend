import React from 'react';

const DashboardDefault = React.lazy(() => import('./Demo/Dashboard/Default'));
const Error404 = React.lazy(() => import('./pages/404/Index'));

/* Inventario */
const InventarioProductos = React.lazy(() => import('./pages/inventarios/gestionSku/Index'));

/* Proyectos & Cotizaciones */
const ProyectosCotizaciones = React.lazy(() => import('./pages/proyectos/cotizaciones/Index'));
const CotizacionesRechazadas = React.lazy(() => import('./pages/proyectos/cotizacionesRechazadas/Index'));  
const proyectosEditarPrecios = React.lazy(() => import('./pages/proyectos/proyectosEnCurso/Index'));  

/* ====== PERMISOS ====== */

const getEffectivePermissions = () => {
  try {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      return [];
    }
    const parsed = JSON.parse(storedUser);
    return (parsed?.roles || [])
      .map((role) => Number(role?.id ?? role))
      .filter((roleId) => !Number.isNaN(roleId));
  } catch (error) {
    console.warn('No se pudieron obtener los roles del usuario desde localStorage:', error);
    return [];
  }
};

const canAccess = (allowed) => {
  if (allowed == null) {
    return true;
  }
  const normalized = Array.isArray(allowed) ? allowed : [allowed];
  const effectivePermissions = getEffectivePermissions();
  return effectivePermissions.some((roleId) => normalized.includes(roleId));
};

const withGuard = (Component, allowed) => {
  if (allowed == null) {
    return Component;
  }

  const GuardedComponent = (props) => {
    if (!canAccess(allowed)) {
      return <Error404 {...props} />;
    }
    return <Component {...props} />;
  };

  GuardedComponent.displayName = `Guarded(${Component.displayName || Component.name || 'Component'})`;
  return GuardedComponent;
};

const INVENTARIO_GESTION = [1, 6, 7, 8, 9];

/* ====== RUTAS ====== */
const routes = [
  { path: '/dashboard/default', exact: true, name: 'Default', component: DashboardDefault },
  { path: '/dashboard/404', exact: true, name: '404', component: Error404 },
  {
    path: '/dashboard/inventario/productos',
    exact: true,
    name: 'Gestión de Productos',
    component: withGuard(InventarioProductos, INVENTARIO_GESTION),
  },
  {
    path: '/dashboard/proyectos/cotizaciones',
    exact: true,
    name: 'Cotizaciones',
    component: withGuard(ProyectosCotizaciones, INVENTARIO_GESTION),
  },
  {
    path: '/dashboard/proyectos/cotizaciones-rechazadas',
    exact: true,
    name: 'Cotizaciones Rechazadas',
    component: withGuard(CotizacionesRechazadas, INVENTARIO_GESTION), 
  },
  {
    path: '/dashboard/proyectos/proyectos',
    exact: true,
    name: 'Proyectos',
    component: withGuard(proyectosEditarPrecios, INVENTARIO_GESTION),
  },
];

export default routes;
