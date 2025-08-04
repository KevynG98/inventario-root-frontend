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
const NuevaAdmision = React.lazy(() => import('./pages/admisiones/nuevaAdmision/Index'))
const ListadoAdmisiones = React.lazy(() => import('./pages/admisiones/listadoAdmisiones/Index'))
const EstadoCuenta = React.lazy(() => import('./pages/admisiones/estadoCuentas/Index'))
const EstadoHabitaciones = React.lazy(() => import('./pages/admisiones/estadoHabitacion/Index'))
const ConsultaExterna = React.lazy(() => import('./pages/admisiones/consultaExterna/Index'))
const AdmisionCaja = React.lazy(() => import('./pages/admisiones/caja/Index'))
const AdmisionSeguro = React.lazy(() => import('./pages/admisiones/seguros/Index'))
/* Inventarios */
const InventarioProveedores = React.lazy(() => import('./pages/inventarios/proveedores/Index'))
const inventarioMarca = React.lazy(() => import('./pages/inventarios/marcas/Index'))
const InventarioUnidadesMedida = React.lazy(() => import('./pages/inventarios/unidadesMedida/Index'))
const InventarioCategorias = React.lazy(() => import('./pages/inventarios/categorias/Index'))
const InventarioMovimiento = React.lazy(() => import('./pages/inventarios/historicoMovimientos/Index'))
const InventarioBodega = React.lazy(() => import('./pages/inventarios/bodegas/Index'))
const InventarioSku = React.lazy(() => import('./pages/inventarios/gestionSku/Index'))
const InventarioStock = React.lazy(() => import('./pages/inventarios/stock/Index'))
const InventarioPrecios = React.lazy(() => import('./pages/inventarios/actualizarPrecio/Index'))
const InventarioConsignacion = React.lazy(() => import('./pages/inventarios/consignacion/Index'));
const InventarioControlados = React.lazy(() => import('./pages/inventarios/controlados/Index'));
const InventarioPrincipiosActivos = React.lazy(() => import('./pages/inventarios/principiosActivos/Index'));
/* Bodegas */
const InventarioComprasGenerar = React.lazy(() => import('./pages/bodegas/compras/generar/Index'));
const InventarioComprasVisualizar = React.lazy(() => import('./pages/bodegas/compras/visualizar/Index'));
const InventarioComprasOrden = React.lazy(() => import('./pages/bodegas/compras/orden/Index'));
const InventarioEntradas = React.lazy(() => import('./pages/bodegas/entradas/Index'));
const InventarioSalidas = React.lazy(() => import('./pages/bodegas/salidas/Index'));
const InventarioTraslados = React.lazy(() => import('./pages/bodegas/traslados/Index'));
/* Mantenimiento */
const MantenimientoHabitacion = React.lazy(() => import('./pages/mantenimiento/estadoHabitacion/Index'))
const Users = React.lazy(() => import('./pages/mantenimiento/users/Index'));
const UsersDoctores = React.lazy(() => import('./pages/mantenimiento/doctor/Index'));
const InventarioSeguros = React.lazy(() => import('./pages/mantenimiento/seguros/Index'));
const DirectorioExtensiones = React.lazy(() => import('./pages/mantenimiento/directorioExtensiones/Index'));

/* Reportes */
const HIstorialGeneral = React.lazy(() => import('./pages/reportes/historialGeneral/Index'))
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

const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

const userPermissions = user?.roles?.map(role => role.id) || [];

console.log("PERMISIONS: ", userPermissions); // Ejemplo: [1]

const routes = [
    { path: '/dashboard/default', exact: true, name: 'Default', component: DashboardDefault},
    //{ path: '/dashboard/users', exact: true, name: 'Users', component: userPermissions.some(item => [0, 1].includes(item)) ? Users : Error404 },
    { path: '/dashboard/roles', exact: true, name: 'Roles', component: userPermissions.some(item => [0, 1].includes(item)) ? Roles : Error404 },
    { path: '/dashboard/products', exact: true, name: 'Roles', component: userPermissions.some(item => [1, 2].includes(item)) ? Products : Error404 },
    { path: '/dashboard/doctor', exact: true, name: 'Roles', component: userPermissions.some(item => [1, 2].includes(item)) ? Doctor : Error404 },
    { path: '/dashboard/enfermero', exact: true, name: 'Roles', component: userPermissions.some(item => [1, 3].includes(item)) ? Enfermero : Error404 },
    { path: '/dashboard/404', exact: true, name: '404', component: Error404 },
    { path: '/dashboard/construccion', exact: true, name: '404', component: Construccion },
    { path: '/dashboard/futuro', exact: true, name: '404', component: Futuro },
    // -------------------------------------------------------------------------------------------------------------------------------
    /*Admisiones*/
    { path: '/dashboard/admisiones/nueva', exact: true, name: 'Nueva Admision', component: NuevaAdmision },
    { path: '/dashboard/admisiones/listar-admision', exact: true, name: 'Listar Admision', component: ListadoAdmisiones },
    { path: '/dashboard/admisiones/listar-admision-estados', exact: true, name: 'Listar Admision', component: EstadoCuenta },
    { path: '/dashboard/admisiones/consulta-externa', exact: true, name: 'Consulta Externa', component: ConsultaExterna },
    { path: '/dashboard/admisiones/caja', exact: true, name: 'Caja', component: AdmisionCaja },
    { path: '/dashboard/admisiones/estado-habitacion', exact: true, name: 'Estado Habitaciones', component: EstadoHabitaciones },
    { path: '/dashboard/admisiones/seguros', exact: true, name: 'Estado Habitaciones', component: AdmisionSeguro },
    /*Inventario*/
    { path: '/dashboard/inventario/proveedores', exact: true, name: 'Inventario Proveedores', component: InventarioProveedores },
    { path: '/dashboard/inventario/marcas', exact: true, name: 'Inventario Marcas', component: inventarioMarca },
    { path: '/dashboard/inventario/unidades-medida', exact: true, name: 'Inventario Marcas', component: InventarioUnidadesMedida },
    { path: '/dashboard/inventario/categorias', exact: true, name: 'Inventario Marcas', component: InventarioCategorias },
    { path: '/dashboard/inventario/movimientos', exact: true, name: 'Inventario Movimientos', component: InventarioMovimiento },
    { path: '/dashboard/inventario/bodegas', exact: true, name: 'Inventario Bodega', component: InventarioBodega },
    { path: '/dashboard/inventario/sku', exact: true, name: 'Inventario Bodega', component: InventarioSku },
    { path: '/dashboard/inventario/stock', exact: true, name: 'Inventario Bodega', component: InventarioStock },
    { path: '/dashboard/inventario/precios', exact: true, name: 'Precios', component: InventarioPrecios },
    { path: '/dashboard/inventario/consignacion', exact: true, name: 'Precios', component: InventarioConsignacion },
    { path: '/dashboard/inventario/controlados', exact: true, name: 'Precios', component: InventarioControlados },
    { path: '/dashboard/inventario/principiosActivos', exact: true, name: 'Precios', component: InventarioPrincipiosActivos },
    /*Bodegas*/
    { path: '/dashboard/bodegas/compras/generar', exact: true, name: 'Precios', component: InventarioComprasGenerar },
    { path: '/dashboard/bodegas/compras/visualizar', exact: true, name: 'Precios', component: InventarioComprasVisualizar },
    { path: '/dashboard/bodegas/compras/orden', exact: true, name: 'Precios', component: InventarioComprasOrden },
    { path: '/dashboard/bodegas/entradas', exact: true, name: 'Precios', component: InventarioEntradas },
    { path: '/dashboard/bodegas/salidas', exact: true, name: 'Precios', component: InventarioSalidas },
    { path: '/dashboard/bodegas/traslados', exact: true, name: 'Precios', component: InventarioTraslados },
    /*Mantenimiento*/
    { path: '/dashboard/mantenimiento/habitaciones', exact: true, name: 'Inventario Marcas', component: MantenimientoHabitacion },
    { path: '/dashboard/mantenimiento/seguros', exact: true, name: 'Seguros', component: InventarioSeguros },
    { path: '/dashboard/mantenimiento/users', exact: true, name: 'Users', component: userPermissions.some(item => [0, 1].includes(item)) ? Users : Error404 },
    { path: '/dashboard/mantenimiento/medicos', exact: true, name: 'Seguros', component: UsersDoctores },
    { path: '/dashboard/mantenimiento/extensiones', exact: true, name: 'Seguros', component: DirectorioExtensiones },
    /*Reportes*/
    { path: '/dashboard/reportes/historial-general', exact: true, name: 'Inventario Marcas', component: HIstorialGeneral },
    { path: '/dashboard/reportes/users', exact: true, name: 'Inventario Marcas', component: UsersReporte },
    { path: '/dashboard/reportes/inventarios', exact: true, name: 'Inventario Marcas', component: InventarioReporte },
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