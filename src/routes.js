import React from 'react';
import $ from 'jquery';

window.jQuery = $;
window.$ = $;
global.jQuery = $;

const DashboardDefault = React.lazy(() => import('./Demo/Dashboard/Default'));

const Users = React.lazy(() => import('./pages/users/Index'));
const Roles = React.lazy(() => import('./pages/roles/Index'));
const Products = React.lazy(() => import('./pages/products/Index'));
const Doctor = React.lazy(() => import('./pages/doctor/Index'));
const Enfermero = React.lazy(() => import('./pages/enfermero/Index'));
const Inventario = React.lazy(() => import('./pages/inventario/Index'));
const Error404 = React.lazy(() => import('./pages/404/Index'));
const Construccion = React.lazy(() => import('./pages/construccion/Index'));
const Futuro = React.lazy(() => import('./pages/futuro/Index'));

/* ADMISIONES PAGINAS */
const NuevaAdmision = React.lazy(() => import('./pages/admisiones/nuevaAdmision/Index'))
const ListadoAdmisiones = React.lazy(() => import('./pages/admisiones/listadoAdmisiones/Index'))
const EstadoHabitaciones = React.lazy(() => import('./pages/admisiones/estadoHabitacion/Index'))

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
    { path: '/dashboard/default', exact: true, name: 'Default', component: userPermissions.some(item => [1, 2, 3].includes(item)) ? DashboardDefault : Error404 },
    { path: '/dashboard/users', exact: true, name: 'Users', component: userPermissions.some(item => [0, 1].includes(item)) ? Users : Error404 },
    { path: '/dashboard/roles', exact: true, name: 'Roles', component: userPermissions.some(item => [0, 1].includes(item)) ? Roles : Error404 },
    { path: '/dashboard/products', exact: true, name: 'Roles', component: userPermissions.some(item => [1, 2].includes(item)) ? Products : Error404 },
    { path: '/dashboard/doctor', exact: true, name: 'Roles', component: userPermissions.some(item => [1, 2].includes(item)) ? Doctor : Error404 },
    { path: '/dashboard/enfermero', exact: true, name: 'Roles', component: userPermissions.some(item => [1, 3].includes(item)) ? Enfermero : Error404 },
    { path: '/dashboard/inventario', exact: true, name: 'Roles', component: userPermissions.some(item => [1, 2].includes(item)) ? Inventario : Error404 },
    { path: '/dashboard/404', exact: true, name: '404', component: Error404 },
    { path: '/dashboard/construccion', exact: true, name: '404', component: Construccion },
    { path: '/dashboard/futuro', exact: true, name: '404', component: Futuro },
    // -------------------------------------------------------------------------------------------------------------------------------
    /*Admisiones*/
    { path: '/dashboard/admisiones/nueva', exact: true, name: 'Nueva Admision', component: NuevaAdmision },
    { path: '/dashboard/admisiones/listar-admision', exact: true, name: 'Listar Admision', component: ListadoAdmisiones },
    { path: '/dashboard/admisiones/estado-habitacion', exact: true, name: 'Estado Habitaciones', component: EstadoHabitaciones },
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