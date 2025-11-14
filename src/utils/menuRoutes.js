import {
  FiHome,
  FiBox,
  FiTruck,
  FiPackage,
  FiGrid,
  FiList,
  FiClipboard,
  FiArchive,
  FiEdit3,
  FiShield,
  FiSettings,
  FiUsers,
  FiBarChart2,
  FiFileText,
  FiDatabase,
  FiLogOut,
  FiFilePlus,
} from 'react-icons/fi';

/**
 * Role IDs relevantes
 * 1  admin
 * 6-9 inventario
 * 10-13 bodegas
 * 23-25 mantenimiento
 */

const R = {
  ADMIN: 1,
  INVENTARIO: [1, 6, 7, 8, 9],
  BODEGAS: [1, 10, 11, 12, 13, 14],
  MANTENIMIENTO: [1, 23, 24, 25],
};

const ALL_NON_ADMIN = [6, 7, 8, 9, 10, 11, 12, 13, 14, 23, 24, 25];
const DASHBOARD_ROLES = [R.ADMIN, ...ALL_NON_ADMIN];

const staticRoutes = [
  {
    title: 'Dashboard',
    url: '/dashboard/default',
    icon: <FiHome />,
    roles: DASHBOARD_ROLES,
  },

  // Inventario
  {
    title: 'Inventario',
    icon: <FiBox />,
    roles: R.INVENTARIO,
    children: [
      { title: 'Proveedores', url: '/dashboard/inventario/proveedores', icon: <FiTruck />, roles: [1, 8] },
      { title: 'Marcas', url: '/dashboard/inventario/marcas', icon: <FiPackage />, roles: [1, 8] },
      { title: 'Unidades de Medidas', url: '/dashboard/inventario/unidades-medida', icon: <FiGrid />, roles: [1, 8] },
      { title: 'Principios Activos', url: '/dashboard/inventario/principiosActivos', icon: <FiList />, roles: [1, 8] },
      { title: 'Categorías', url: '/dashboard/inventario/categorias', icon: <FiClipboard />, roles: [1, 8] },
      { title: 'Bodegas', url: '/dashboard/inventario/bodegas', icon: <FiPackage />, roles: [1] },
      { title: 'Gestión de SKU', url: '/dashboard/inventario/sku', icon: <FiList />, roles: [1, 8] },
      { title: 'Stock', url: '/dashboard/inventario/stock', icon: <FiList />, roles: [1, 7, 8] },
      { title: 'Histórico de Movimientos', url: '/dashboard/inventario/movimientos', icon: <FiArchive />, roles: [1, 7, 8] },
      { title: 'Actualización de Precios', url: '/dashboard/inventario/precios', icon: <FiEdit3 />, roles: [1, 9] },
      { title: 'Consignación', url: '/dashboard/inventario/consignacion', icon: <FiPackage />, roles: [1, 8] },
      { title: 'Controlados', url: '/dashboard/inventario/controlados', icon: <FiShield />, roles: [1, 8] },
      { title: 'Ver Precios', url: '/dashboard/inventario/ver-precios', icon: <FiPackage />, roles: [1, 6] },
    ],
  },

  // Bodegas
  {
    title: 'Bodegas',
    icon: <FiPackage />,
    roles: R.BODEGAS,
    children: [
      {
        title: 'Compras',
        icon: <FiFileText />,
        children: [
          { title: 'Generar Requisición', url: '/dashboard/bodegas/compras/generar', icon: <FiFileText />, roles: [1, 11] },
          { title: 'Visualizar Requisiciones', url: '/dashboard/bodegas/compras/visualizar', icon: <FiFileText />, roles: [1, 11, 14] },
          { title: 'Orden de Compra', url: '/dashboard/bodegas/compras/orden', icon: <FiFileText />, roles: [1, 13] },
        ],
      },
      { title: 'Entradas', url: '/dashboard/bodegas/entradas', icon: <FiLogOut />, roles: [1, 10, 12] },
      { title: 'Salidas', url: '/dashboard/bodegas/salidas', icon: <FiFilePlus />, roles: [1, 10, 12] },
      { title: 'Traslados', url: '/dashboard/bodegas/traslados', icon: <FiTruck />, roles: [1, 10, 12] },
    ],
  },

  // Mantenimiento (Usuarios)
  {
    title: 'Mantenimiento',
    icon: <FiSettings />,
    roles: R.MANTENIMIENTO,
    children: [
      { title: 'Usuarios', url: '/dashboard/mantenimiento/users', icon: <FiUsers />, roles: R.MANTENIMIENTO },
    ],
  },

  // Reportes
  {
    title: 'Reportes',
    icon: <FiBarChart2 />,
    roles: [R.ADMIN],
    children: [
      { title: 'Historial General', url: '/dashboard/reportes/historial-general', icon: <FiFileText />, roles: [R.ADMIN] },
      { title: 'Usuarios', url: '/dashboard/reportes/users', icon: <FiUsers />, roles: [R.ADMIN] },
      { title: 'Inventarios', url: '/dashboard/reportes/inventarios', icon: <FiDatabase />, roles: [R.ADMIN] },
    ],
  },
];

let menuIdCounter = 0;

const addIds = (items, parentId = null) =>
  items.map((item) => {
    const id = `menu-${menuIdCounter++}`;
    const newItem = { ...item, id, roles: item.roles ?? [] };
    if (parentId) newItem.parentId = parentId;
    if (item.children) newItem.children = addIds(item.children, id);
    return newItem;
  });

const routesWithIds = addIds(staticRoutes);

export default routesWithIds;
