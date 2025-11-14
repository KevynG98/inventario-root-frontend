import React from 'react';

const DashboardDefault = React.lazy(() => import('./Demo/Dashboard/Default'));
const Error404 = React.lazy(() => import('./pages/404/Index'));

/* Inventario */
const InventarioProveedores = React.lazy(() => import('./pages/inventarios/proveedores/Index'));
const InventarioMarca = React.lazy(() => import('./pages/inventarios/marcas/Index'));
const InventarioUnidadesMedida = React.lazy(() => import('./pages/inventarios/unidadesMedida/Index'));
const InventarioCategorias = React.lazy(() => import('./pages/inventarios/categorias/Index'));
const InventarioMovimiento = React.lazy(() => import('./pages/inventarios/historicoMovimientos/Index'));
const InventarioBodega = React.lazy(() => import('./pages/inventarios/bodegas/Index'));
const InventarioSku = React.lazy(() => import('./pages/inventarios/gestionSku/Index'));
const InventarioStock = React.lazy(() => import('./pages/inventarios/stock/Index'));
const InventarioPrecios = React.lazy(() => import('./pages/inventarios/actualizarPrecio/Index'));
const InventarioConsignacion = React.lazy(() => import('./pages/inventarios/consignacion/Index'));
const InventarioControlados = React.lazy(() => import('./pages/inventarios/controlados/Index'));
const InventarioPrincipiosActivos = React.lazy(() => import('./pages/inventarios/principiosActivos/Index'));
const InventarioVerPrecios = React.lazy(() => import('./pages/inventarios/verPrecio/Index'));

/* Bodegas */
const InventarioComprasGenerar = React.lazy(() => import('./pages/bodegas/compras/generar/Index'));
const InventarioComprasVisualizar = React.lazy(() => import('./pages/bodegas/compras/visualizar/Index'));
const InventarioComprasOrden = React.lazy(() => import('./pages/bodegas/compras/orden/Index'));
const InventarioComprasOrdenDetalle = React.lazy(() => import('./pages/bodegas/compras/orden/Detail'));
const InventarioEntradas = React.lazy(() => import('./pages/bodegas/entradas/Index'));
const InventarioSalidas = React.lazy(() => import('./pages/bodegas/salidas/Index'));
const InventarioTraslados = React.lazy(() => import('./pages/bodegas/traslados/Index'));

/* Mantenimiento */
const Users = React.lazy(() => import('./pages/mantenimiento/users/Index'));

/* Reportes */
const HistorialGeneral = React.lazy(() => import('./pages/reportes/historialGeneral/Index'));
const UsersReporte = React.lazy(() => import('./pages/reportes/usuarios/Index'));
const InventarioReporte = React.lazy(() => import('./pages/reportes/inventarios/Index'));

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

const R = {
  ADMIN: 1,
  INVENTARIO: [1, 6, 7, 8, 9],
  BODEGAS: [1, 10, 11, 12, 13],
  MANTENIMIENTO: [1, 23, 24, 25],
};

const INVENTARIO_GESTION = [1, 8];
const INVENTARIO_CONSULTA = [1, 7, 8];
const INVENTARIO_VER_PRECIOS = [1, 6];

/* ====== RUTAS ====== */
const routes = [
  { path: '/dashboard/default', exact: true, name: 'Default', component: DashboardDefault },
  { path: '/dashboard/404', exact: true, name: '404', component: Error404 },

  // Inventario
  {
    path: '/dashboard/inventario/proveedores',
    exact: true,
    name: 'Proveedores',
    component: withGuard(InventarioProveedores, INVENTARIO_GESTION),
  },
  {
    path: '/dashboard/inventario/marcas',
    exact: true,
    name: 'Marcas',
    component: withGuard(InventarioMarca, INVENTARIO_GESTION),
  },
  {
    path: '/dashboard/inventario/unidades-medida',
    exact: true,
    name: 'Unidades de Medidas',
    component: withGuard(InventarioUnidadesMedida, INVENTARIO_GESTION),
  },
  {
    path: '/dashboard/inventario/categorias',
    exact: true,
    name: 'Categorías',
    component: withGuard(InventarioCategorias, INVENTARIO_GESTION),
  },
  {
    path: '/dashboard/inventario/movimientos',
    exact: true,
    name: 'Histórico de Movimientos',
    component: withGuard(InventarioMovimiento, INVENTARIO_CONSULTA),
  },
  {
    path: '/dashboard/inventario/bodegas',
    exact: true,
    name: 'Bodegas',
    component: withGuard(InventarioBodega, [R.ADMIN]),
  },
  {
    path: '/dashboard/inventario/sku',
    exact: true,
    name: 'Gestión de SKU',
    component: withGuard(InventarioSku, INVENTARIO_GESTION),
  },
  {
    path: '/dashboard/inventario/stock',
    exact: true,
    name: 'Stock',
    component: withGuard(InventarioStock, INVENTARIO_CONSULTA),
  },
  {
    path: '/dashboard/inventario/precios',
    exact: true,
    name: 'Actualización de Precios',
    component: withGuard(InventarioPrecios, INVENTARIO_GESTION),
  },
  {
    path: '/dashboard/inventario/consignacion',
    exact: true,
    name: 'Consignación',
    component: withGuard(InventarioConsignacion, INVENTARIO_GESTION),
  },
  {
    path: '/dashboard/inventario/controlados',
    exact: true,
    name: 'Controlados',
    component: withGuard(InventarioControlados, INVENTARIO_GESTION),
  },
  {
    path: '/dashboard/inventario/principiosActivos',
    exact: true,
    name: 'Principios Activos',
    component: withGuard(InventarioPrincipiosActivos, INVENTARIO_GESTION),
  },
  {
    path: '/dashboard/inventario/ver-precios',
    exact: true,
    name: 'Ver Precios',
    component: withGuard(InventarioVerPrecios, INVENTARIO_VER_PRECIOS),
  },

  // Bodegas
  {
    path: '/dashboard/bodegas/compras/generar',
    exact: true,
    name: 'Compras - Generar Requisición',
    component: withGuard(InventarioComprasGenerar, [1, 11]),
  },
  {
    path: '/dashboard/bodegas/compras/visualizar',
    exact: true,
    name: 'Compras - Visualizar Requisiciones',
    component: withGuard(InventarioComprasVisualizar, [1, 11, 14]),
  },
  {
    path: '/dashboard/bodegas/compras/orden',
    exact: true,
    name: 'Compras - Orden de Compra',
    component: withGuard(InventarioComprasOrden, [1, 13]),
  },
  {
    path: '/dashboard/bodegas/compras/orden/:id',
    exact: true,
    name: 'Compras - Orden de Compra Detalle',
    component: withGuard(InventarioComprasOrdenDetalle, [1, 13]),
  },
  {
    path: '/dashboard/bodegas/entradas',
    exact: true,
    name: 'Entradas',
    component: withGuard(InventarioEntradas, [1, 10, 12]),
  },
  {
    path: '/dashboard/bodegas/salidas',
    exact: true,
    name: 'Salidas',
    component: withGuard(InventarioSalidas, [1, 10, 12]),
  },
  {
    path: '/dashboard/bodegas/traslados',
    exact: true,
    name: 'Traslados',
    component: withGuard(InventarioTraslados, [1, 10, 12]),
  },

  // Mantenimiento (usuarios)
  {
    path: '/dashboard/mantenimiento/users',
    exact: true,
    name: 'Usuarios',
    component: withGuard(Users, R.MANTENIMIENTO),
  },

  // Reportes
  {
    path: '/dashboard/reportes/historial-general',
    exact: true,
    name: 'Historial General',
    component: withGuard(HistorialGeneral, [R.ADMIN]),
  },
  {
    path: '/dashboard/reportes/users',
    exact: true,
    name: 'Usuarios',
    component: withGuard(UsersReporte, [R.ADMIN]),
  },
  {
    path: '/dashboard/reportes/inventarios',
    exact: true,
    name: 'Inventarios',
    component: withGuard(InventarioReporte, [R.ADMIN]),
  },
];

export default routes;
