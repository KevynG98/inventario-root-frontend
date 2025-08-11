import {
  FiHome, FiUsers, FiSettings, FiShield, FiPackage, FiBox, FiUserPlus,
  FiList, FiFileText, FiEdit3, FiLogOut, FiUserCheck, FiCreditCard, FiGrid, FiTruck,
  FiClipboard, FiHeart, FiFilePlus, FiArchive, FiUser, FiCalendar, FiFileMinus,
  FiDollarSign, FiBookOpen, FiBarChart2, FiMonitor, FiDatabase,
} from 'react-icons/fi';

/**
 * Role IDs (from your sheet/screenshot)
 * 1  admin
 * ----- Admisiones
 * 2  admisiones - estandar
 * 3  admisiones - auxiliar
 * 4  admisiones - operador
 * 5  admisiones - coordinador
 * ----- Inventario
 * 6  inventario - estandar
 * 7  inventario - auxiliar
 * 8  inventario - operador
 * 9  inventario - coordinador
 * ----- Bodegas
 * 10 bodegas - estandar
 * 11 bodegas - auxiliar
 * 12 bodegas - operador
 * 13 bodegas - coordinador
 * ----- Pacientes
 * 14 pacientes - estandar
 * 15 pacientes - enfermeria
 * 16 pacientes - residente
 * 17 pacientes - tratante
 * 18 pacientes - especialista
 * 19 pacientes - coordinador
 * ----- Examenes
 * 20 examenes - estandar
 * 21 examenes - tecnico
 * 22 examenes - coordinador
 * ----- Mantenimiento
 * 23 mantenimiento - estandar
 * 24 mantenimiento - operador
 * 25 mantenimiento - coordinador
 * ----- Otros
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

// If you want the dashboard visible for absolutely everyone, include 26 too:
const ALL_NON_ADMIN = [
  2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26
];
const DASHBOARD_ROLES = [R.ADMIN, ...ALL_NON_ADMIN];

const staticRoutes = [
  {
    title: 'Dashboard',
    url: '/dashboard/default',
    icon: <FiHome />,
    roles: DASHBOARD_ROLES,
  },

  // ADMISIONS
  {
    title: 'Admisiones',
    icon: <FiUserPlus />,
    roles: R.ADMISIONES,
    children: [
      { title: 'Nueva Admision', url: '/dashboard/admisiones/nueva', icon: <FiUserPlus /> },
      { title: 'Listado de Admisiones', url: '/dashboard/admisiones/listar-admision', icon: <FiList /> },
      { title: 'Estado de cuenta', url: '/dashboard/admisiones/listar-admision-estados', icon: <FiFileText /> },
      { title: 'Egreso de Pacientes', url: '/dashboard/construccion', icon: <FiLogOut /> },
      { title: 'Consulta externa', url: '/dashboard/admisiones/consulta-externa', icon: <FiUserCheck /> },
      { title: 'Caja', url: '/dashboard/admisiones/caja', icon: <FiCreditCard /> },
      { title: 'Seguros', url: '/dashboard/admisiones/seguros', icon: <FiShield /> },
      { title: 'Estado de habitaciones', url: '/dashboard/admisiones/estado-habitacion', icon: <FiGrid /> },
    ].map(item => ({ ...item, roles: R.ADMISIONES })),
  },

  // INVENTORY
  {
    title: 'Inventario',
    icon: <FiBox />,
    roles: R.INVENTARIO,
    children: [
      { title: 'Proveedores', url: '/dashboard/inventario/proveedores', icon: <FiTruck /> },
      { title: 'Marcas', url: '/dashboard/inventario/marcas', icon: <FiPackage /> },
      { title: 'Unidades de Medidas', url: '/dashboard/inventario/unidades-medida', icon: <FiGrid /> },
      { title: 'Principios Activos', url: '/dashboard/inventario/principiosActivos', icon: <FiList /> },
      { title: 'Categorias', url: '/dashboard/inventario/categorias', icon: <FiClipboard /> },
      { title: 'Bodegas', url: '/dashboard/inventario/bodegas', icon: <FiPackage /> },
      { title: 'Gestión de SKU', url: '/dashboard/inventario/sku', icon: <FiList /> },
      { title: 'Stock', url: '/dashboard/inventario/stock', icon: <FiList /> },
      { title: 'Actualizacion de precio', url: '/dashboard/inventario/precios', icon: <FiEdit3 /> },
      { title: 'Examenes', url: '/dashboard/futuro', icon: <FiHeart /> },
      { title: 'Historico de Movimientos', url: '/dashboard/inventario/movimientos', icon: <FiArchive /> },
      { title: 'Consignacion', url: '/dashboard/inventario/consignacion', icon: <FiPackage /> },
      { title: 'Controlados', url: '/dashboard/inventario/controlados', icon: <FiShield /> },
    ].map(item => ({ ...item, roles: R.INVENTARIO })),
  },

  // WAREHOUSES
  {
    title: 'Bodegas',
    icon: <FiPackage />,
    roles: R.BODEGAS,
    children: [
      {
        title: 'Compras',
        icon: <FiFileText />,
        children: [
          { title: 'Generar Requsicion', url: '/dashboard/bodegas/compras/generar', icon: <FiFileText /> },
          { title: 'Visualizar Requisiciones', url: '/dashboard/bodegas/compras/visualizar', icon: <FiFileText /> },
          { title: 'Orden de Compra', url: '/dashboard/bodegas/compras/orden', icon: <FiFileText /> },
        ].map(item => ({ ...item, roles: R.BODEGAS })),
      },
      { title: 'Entradas', url: '/dashboard/bodegas/entradas', icon: <FiLogOut /> },
      { title: 'Salidas', url: '/dashboard/bodegas/salidas', icon: <FiFilePlus /> },
      { title: 'Traslados', url: '/dashboard/bodegas/traslados', icon: <FiTruck /> },
    ].map(item => ({ ...item, roles: R.BODEGAS })),
  },

  // PATIENTS
  {
    title: 'Pacientes',
    icon: <FiUsers />,
    roles: R.PACIENTES,
    children: [
      { title: 'Enfermeria', url: '/dashboard/futuro', icon: <FiHeart /> },
      { title: 'Medicos Residentes', url: '/dashboard/futuro', icon: <FiUser /> },
      { title: 'Medicos Tratantes', url: '/dashboard/futuro', icon: <FiUser /> },
      { title: 'Devoluciones a Farmacia', url: '/dashboard/futuro', icon: <FiLogOut /> },
      { title: 'Calendario Operaciones', url: '/dashboard/futuro', icon: <FiCalendar /> },
    ].map(item => ({ ...item, roles: R.PACIENTES })),
  },

  // TESTS/EXAMS
  {
    title: 'Examenes',
    icon: <FiMonitor />,
    roles: R.EXAMENES,
    children: [
      { title: 'Ordenes de Laboratorio', url: '/dashboard/futuro', icon: <FiFileText /> },
      { title: 'Ordenes de Radiologia', url: '/dashboard/futuro', icon: <FiFileMinus /> },
      { title: 'Catalogo Examenes', url: '/dashboard/futuro', icon: <FiList /> },
    ].map(item => ({ ...item, roles: R.EXAMENES })),
  },

  // MAINTENANCE
  {
    title: 'Mantenimiento',
    icon: <FiSettings />,
    roles: R.MANTENIMIENTO,
    children: [
      { title: 'Admisiones', url: '/dashboard/futuro', icon: <FiUserPlus /> },
      { title: 'Facturacion', url: '/dashboard/futuro', icon: <FiDollarSign /> },
      { title: 'Habitaciones', url: '/dashboard/mantenimiento/habitaciones', icon: <FiGrid /> },
      { title: 'Usuarios', url: '/dashboard/mantenimiento/users', icon: <FiUsers /> },
      { title: 'Medicos', url: '/dashboard/mantenimiento/medicos', icon: <FiUser /> },
      { title: 'Directorio Extensiones', url: '/dashboard/mantenimiento/extensiones', icon: <FiBookOpen /> },
      { title: 'Seguros', url: '/dashboard/mantenimiento/seguros', icon: <FiList /> },
    ].map(item => ({ ...item, roles: R.MANTENIMIENTO })),
  },

  // REPORTS – by default open to all module roles (and doctor).
  {
    title: 'Reportes',
    icon: <FiBarChart2 />,
    roles: [R.ADMIN, ...ALL_NON_ADMIN],
    children: [
      { title: 'Historial General', url: '/dashboard/reportes/historial-general', icon: <FiFileText /> },
      { title: 'Imprimir Expediente', url: '/dashboard/futuro', icon: <FiFileText /> },
      { title: 'Historico de Admisiones', url: '/dashboard/futuro', icon: <FiArchive /> },
      { title: 'Facturacion', url: '/dashboard/futuro', icon: <FiDollarSign /> },
      { title: 'Usuarios', url: '/dashboard/reportes/users', icon: <FiUsers /> },
      { title: 'Medicos', url: '/dashboard/futuro', icon: <FiUser /> },
      { title: 'Inventarios', url: '/dashboard/reportes/inventarios', icon: <FiDatabase /> },
      { title: 'Caja', url: '/dashboard/futuro', icon: <FiCreditCard /> },
      { title: 'Honorarios Medicos', url: '/dashboard/futuro', icon: <FiDollarSign /> },
      { title: 'Listado de SKU Cobrados', url: '/dashboard/futuro', icon: <FiList /> },
      { title: 'Listado de SKU Precios', url: '/dashboard/futuro', icon: <FiDollarSign /> },
      { title: 'Ordenes de Compra', url: '/dashboard/futuro', icon: <FiFilePlus /> },
      { title: 'Consignacion', url: '/dashboard/futuro', icon: <FiPackage /> },
      { title: 'Controlados', url: '/dashboard/futuro', icon: <FiShield /> },
      { title: 'Ingresos - Egresos', url: '/dashboard/futuro', icon: <FiDollarSign /> },
      { title: 'Directorio Extensiones', url: '/dashboard/futuro', icon: <FiBookOpen /> },
    ].map(item => ({ ...item, roles: [R.ADMIN, ...ALL_NON_ADMIN] })),
  },
];

let menuIdCounter = 0;

const addIds = (items, parentId = null) =>
  items.map(item => {
    const id = `menu-${menuIdCounter++}`;
    const newItem = { ...item, id, roles: item.roles ?? [] };
    if (parentId) newItem.parentId = parentId;
    if (item.children) newItem.children = addIds(item.children, id);
    return newItem;
  });

const routesWithIds = addIds(staticRoutes);

export default routesWithIds;
