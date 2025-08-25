import React from 'react';
import $ from 'jquery';

window.jQuery = $;
window.$ = $;
global.jQuery = $;

const DashboardDefault = React.lazy(() => import('./Demo/Dashboard/Default'));

const Roles = React.lazy(() => import('./pages/roles/Index'));
const Products = React.lazy(() => import('./pages/products/Index'));
const Doctor = React.lazy(() => import('./pages/doctor/Index'));
const Enfermero = React.lazy(() => import('./pages/enfermero/Index'));
const Error404 = React.lazy(() => import('./pages/404/Index'));
const Construccion = React.lazy(() => import('./pages/construccion/Index'));
const Futuro = React.lazy(() => import('./pages/futuro/Index'));

/* ADMISIONES PAGINAS */
const NuevaAdmision = React.lazy(() => import('./pages/admisiones/nuevaAdmision/Index'));
const ListadoAdmisiones = React.lazy(() => import('./pages/admisiones/listadoAdmisiones/Index'));
const EstadoCuenta = React.lazy(() => import('./pages/admisiones/estadoCuentas/Index'));
const EstadoHabitaciones = React.lazy(() => import('./pages/admisiones/estadoHabitacion/Index'));
const ConsultaExterna = React.lazy(() => import('./pages/admisiones/consultaExterna/Index'));
const AdmisionCaja = React.lazy(() => import('./pages/admisiones/caja/Index'));
const AdmisionSeguro = React.lazy(() => import('./pages/admisiones/seguros/Index'));

/* Inventarios */
const InventarioProveedores = React.lazy(() => import('./pages/inventarios/proveedores/Index'));
const inventarioMarca = React.lazy(() => import('./pages/inventarios/marcas/Index'));
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
const MantenimientoHabitacion = React.lazy(() => import('./pages/mantenimiento/estadoHabitacion/Index'));
const Users = React.lazy(() => import('./pages/mantenimiento/users/Index'));
const UsersDoctores = React.lazy(() => import('./pages/mantenimiento/doctor/Index'));
const InventarioSeguros = React.lazy(() => import('./pages/mantenimiento/seguros/Index'));
const DirectorioExtensiones = React.lazy(() => import('./pages/mantenimiento/directorioExtensiones/Index'));
const centroCostos = React.lazy(() => import('./pages/mantenimiento/centroCostos/Index'));
const departamentos = React.lazy(() => import('./pages/mantenimiento/departamentos/Index')); 
const cuentasContables = React.lazy(() => import('./pages/mantenimiento/cuentasContables/Index'));

/* Reportes */
const HIstorialGeneral = React.lazy(() => import('./pages/reportes/historialGeneral/Index'));
const UsersReporte = React.lazy(() => import('./pages/reportes/usuarios/Index'));
const InventarioReporte = React.lazy(() => import('./pages/reportes/inventarios/Index'));

const UIBasicButton = React.lazy(() => import('./Demo/UIElements/Basic/Button'));
const UIBasicBadges = React.lazy(() => import('./Demo/UIElements/Basic/Badges'));
const UIBasicBreadcrumbPagination = React.lazy(() => import('./Demo/UIElements/Basic/BreadcrumbPagination'));

const UIBasicCollapse = React.lazy(() => import('./Demo/UIElements/Basic/Collapse'));
const UIBasicTabsPills = React.lazy(() => import('./Demo/UIElements/Basic/TabsPills'));
const UIBasicBasicTypography = React.lazy(() => import('./Demo/UIElements/Basic/Typography'));

const FormsElements = React.lazy(() => import('./Demo/Forms/FormsElements'));

const BootstrapTable = React.lazy(() => import('./Demo/Tables/BootstrapTable'));

const Nvd3Chart = React.lazy(() => import('./Demo/Charts/Nvd3Chart/index'));

const GoogleMap = React.lazy(() => import('./Demo/Maps/GoogleMap/index'));

const OtherSamplePage = React.lazy(() => import('./Demo/Other/SamplePage'));
const OtherDocs = React.lazy(() => import('./Demo/Other/Docs'));

/* ====== PERMISOS ====== */
const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
const userPermissions = user?.roles?.map((role) => role.id) || [];
console.log('PERMISIONS: ', userPermissions); // Ej: [1]

/**
 * Mapa de roles por módulo (IDs según tu hoja/screenshot)
 * 1  admin
 * Admisiones: 2,3,4,5
 * Inventario: 6,7,8,9
 * Bodegas: 10,11,12,13
 * Pacientes: 14,15,16,17,18,19
 * Examenes: 20,21,22
 * Mantenimiento: 23,24,25
 * 26 doctor
 */
const R = {
  ADMIN: 1,
  ADMISIONES: [1, 2, 3, 4, 5],
  INVENTARIO: [1, 6, 7, 8, 9],
  BODEGAS: [1, 10, 11, 12, 13],
  PACIENTES: [1, 14, 15, 16, 17, 18, 19],
  EXAMENES: [1, 20, 21, 22],
  MANTENIMIENTO: [1, 23, 24, 25],
  DOCTOR: [26],
};
const ALL = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26];

const allow = (allowed) => userPermissions.some((r) => allowed.includes(r));

/* ====== RUTAS ====== */
const routes = [
  // Acceso abierto (dashboard / soporte / placeholders)
  { path: '/dashboard/default', exact: true, name: 'Default', component: DashboardDefault },
  // { path: '/dashboard/users', exact: true, name: 'Users', component: userPermissions.some(item => [0, 1].includes(item)) ? Users : Error404 },
  // { path: '/dashboard/roles', exact: true, name: 'Roles', component: userPermissions.some(item => [0, 1].includes(item)) ? Roles : Error404 },
  // { path: '/dashboard/products', exact: true, name: 'Roles', component: userPermissions.some(item => [1, 2].includes(item)) ? Products : Error404 },
  // { path: '/dashboard/doctor', exact: true, name: 'Roles', component: userPermissions.some(item => [1, 2].includes(item)) ? Doctor : Error404 },
  // { path: '/dashboard/enfermero', exact: true, name: 'Roles', component: userPermissions.some(item => [1, 3].includes(item)) ? Enfermero : Error404 },
  { path: '/dashboard/404', exact: true, name: '404', component: Error404 },
  { path: '/dashboard/construccion', exact: true, name: '404', component: Construccion },
  { path: '/dashboard/futuro', exact: true, name: '404', component: Futuro },

  // -------------------------------------------------------------------------------------------------------------------------------
  /* Admisiones */
  {
    path: '/dashboard/admisiones/nueva',
    exact: true,
    name: 'Nueva Admision',
    component: allow(R.ADMISIONES) ? NuevaAdmision : Error404,
  },
  {
    path: '/dashboard/admisiones/listar-admision',
    exact: true,
    name: 'Listar Admision',
    component: allow(R.ADMISIONES) ? ListadoAdmisiones : Error404,
  },
  {
    path: '/dashboard/admisiones/listar-admision-estados',
    exact: true,
    name: 'Listar Admision',
    component: allow(R.ADMISIONES) ? EstadoCuenta : Error404,
  },
  {
    path: '/dashboard/admisiones/consulta-externa',
    exact: true,
    name: 'Consulta Externa',
    component: allow(R.ADMISIONES) ? ConsultaExterna : Error404,
  },
  {
    path: '/dashboard/admisiones/caja',
    exact: true,
    name: 'Caja',
    component: allow(R.ADMISIONES) ? AdmisionCaja : Error404,
  },
  {
    path: '/dashboard/admisiones/estado-habitacion',
    exact: true,
    name: 'Estado Habitaciones',
    component: allow(R.ADMISIONES) ? EstadoHabitaciones : Error404,
  },
  {
    path: '/dashboard/admisiones/seguros',
    exact: true,
    name: 'Seguros',
    component: allow(R.ADMISIONES) ? AdmisionSeguro : Error404,
  },

  /* Inventario */
  {
    path: '/dashboard/inventario/proveedores',
    exact: true,
    name: 'Inventario Proveedores',
    component: allow(R.INVENTARIO) ? InventarioProveedores : Error404,
  },
  {
    path: '/dashboard/inventario/marcas',
    exact: true,
    name: 'Inventario Marcas',
    component: allow(R.INVENTARIO) ? inventarioMarca : Error404,
  },
  {
    path: '/dashboard/inventario/unidades-medida',
    exact: true,
    name: 'Inventario Unidades de Medida',
    component: allow(R.INVENTARIO) ? InventarioUnidadesMedida : Error404,
  },
  {
    path: '/dashboard/inventario/categorias',
    exact: true,
    name: 'Inventario Categorias',
    component: allow(R.INVENTARIO) ? InventarioCategorias : Error404,
  },
  {
    path: '/dashboard/inventario/movimientos',
    exact: true,
    name: 'Inventario Movimientos',
    component: allow(R.INVENTARIO) ? InventarioMovimiento : Error404,
  },
  {
    path: '/dashboard/inventario/bodegas',
    exact: true,
    name: 'Inventario Bodega',
    component: allow(R.INVENTARIO) ? InventarioBodega : Error404,
  },
  {
    path: '/dashboard/inventario/sku',
    exact: true,
    name: 'Gestión SKU',
    component: allow(R.INVENTARIO) ? InventarioSku : Error404,
  },
  {
    path: '/dashboard/inventario/stock',
    exact: true,
    name: 'Stock',
    component: allow(R.INVENTARIO) ? InventarioStock : Error404,
  },
  {
    path: '/dashboard/inventario/precios',
    exact: true,
    name: 'Precios',
    component: allow(R.INVENTARIO) ? InventarioPrecios : Error404,
  },
  {
    path: '/dashboard/inventario/consignacion',
    exact: true,
    name: 'Consignación',
    component: allow(R.INVENTARIO) ? InventarioConsignacion : Error404,
  },
  {
    path: '/dashboard/inventario/controlados',
    exact: true,
    name: 'Controlados',
    component: allow(R.INVENTARIO) ? InventarioControlados : Error404,
  },
  {
    path: '/dashboard/inventario/principiosActivos',
    exact: true,
    name: 'Principios Activos',
    component: allow(R.INVENTARIO) ? InventarioPrincipiosActivos : Error404,
  },
  {
    path: '/dashboard/inventario/ver-precios',
    exact: true,
    name: 'Principios Activos',
    component: allow(R.INVENTARIO) ? InventarioVerPrecios : Error404,
  },
  /* Bodegas */
  {
    path: '/dashboard/bodegas/compras/generar',
    exact: true,
    name: 'Compras - Generar Requisición',
    component: allow(R.BODEGAS) ? InventarioComprasGenerar : Error404,
  },
  {
    path: '/dashboard/bodegas/compras/visualizar',
    exact: true,
    name: 'Compras - Visualizar Requisiciones',
    component: allow(R.BODEGAS) ? InventarioComprasVisualizar : Error404,
  },
  {
    path: '/dashboard/bodegas/compras/orden',
    exact: true,
    name: 'Compras - Orden de Compra',
    component: allow(R.BODEGAS) ? InventarioComprasOrden : Error404,
  },
  {
    path: '/dashboard/bodegas/compras/orden/:id',
    exact: true,
    name: 'Compras - Orden de Compra Detalle',
    component: allow(R.BODEGAS) ? InventarioComprasOrdenDetalle : Error404,
  },
  {
    path: '/dashboard/bodegas/entradas',
    exact: true,
    name: 'Entradas',
    component: allow(R.BODEGAS) ? InventarioEntradas : Error404,
  },
  {
    path: '/dashboard/bodegas/salidas',
    exact: true,
    name: 'Salidas',
    component: allow(R.BODEGAS) ? InventarioSalidas : Error404,
  },
  {
    path: '/dashboard/bodegas/traslados',
    exact: true,
    name: 'Traslados',
    component: allow(R.BODEGAS) ? InventarioTraslados : Error404,
  },

  /* Mantenimiento */
  {
    path: '/dashboard/mantenimiento/habitaciones',
    exact: true,
    name: 'Estado de Habitaciones',
    component: allow(R.MANTENIMIENTO) ? MantenimientoHabitacion : Error404,
  },
  {
    path: '/dashboard/mantenimiento/seguros',
    exact: true,
    name: 'Seguros',
    component: allow(R.MANTENIMIENTO) ? InventarioSeguros : Error404,
  },
  {
    path: '/dashboard/mantenimiento/users',
    exact: true,
    name: 'Users',
    component: allow(R.MANTENIMIENTO) ? Users : Error404,
  },
  {
    path: '/dashboard/mantenimiento/medicos',
    exact: true,
    name: 'Médicos',
    component: allow(R.MANTENIMIENTO) ? UsersDoctores : Error404,
  },
  {
    path: '/dashboard/mantenimiento/extensiones',
    exact: true,
    name: 'Directorio Extensiones',
    component: allow(R.MANTENIMIENTO) ? DirectorioExtensiones : Error404,
  },
  {
    path: '/dashboard/mantenimiento/centroCostos',
    exact: true,
    name: 'Directorio Extensiones',
    component: allow(R.MANTENIMIENTO) ? centroCostos : Error404,
  },
  {
    path: '/dashboard/mantenimiento/departamentos',
    exact: true,
    name: 'Directorio Extensiones',
    component: allow(R.MANTENIMIENTO) ? departamentos : Error404,
  },
  {
    path: '/dashboard/mantenimiento/cuentasContables',
    exact: true,
    name: 'Directorio Extensiones',
    component: allow(R.MANTENIMIENTO) ? cuentasContables : Error404,
  },

  /* Reportes (abierto a todos los roles del sistema) */
  {
    path: '/dashboard/reportes/historial-general',
    exact: true,
    name: 'Historial General',
    component: allow(ALL) ? HIstorialGeneral : Error404,
  },
  {
    path: '/dashboard/reportes/users',
    exact: true,
    name: 'Usuarios',
    component: allow(ALL) ? UsersReporte : Error404,
  },
  {
    path: '/dashboard/reportes/inventarios',
    exact: true,
    name: 'Inventarios',
    component: allow(ALL) ? InventarioReporte : Error404,
  },

  // -------------------------------------------------------------------------------------------------------------------------------
  { path: '/basic/button', exact: true, name: 'Basic Button', component: UIBasicButton },
  { path: '/basic/badges', exact: true, name: 'Basic Badges', component: UIBasicBadges },
  { path: '/basic/breadcrumb-paging', exact: true, name: 'Basic Breadcrumb Pagination', component: UIBasicBreadcrumbPagination },
  { path: '/basic/collapse', exact: true, name: 'Basic Collapse', component: UIBasicCollapse },
  { path: '/basic/tabs-pills', exact: true, name: 'Basic Tabs & Pills', component: UIBasicTabsPills },
  { path: '/basic/typography', exact: true, name: 'Basic Typography', component: UIBasicBasicTypography },
  { path: '/forms/form-basic', exact: true, name: 'Forms Elements', component: FormsElements },
  { path: '/tables/bootstrap', exact: true, name: 'Bootstrap Table', component: BootstrapTable },
  { path: '/charts/nvd3', exact: true, name: 'Nvd3 Chart', component: Nvd3Chart },
  { path: '/maps/google-map', exact: true, name: 'Google Map', component: GoogleMap },
  { path: '/sample-page', exact: true, name: 'Sample Page', component: OtherSamplePage },
  { path: '/docs', exact: true, name: 'Documentation', component: OtherDocs },
];

export default routes;
