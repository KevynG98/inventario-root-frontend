import { FiHome, FiBox, FiPackage, FiClipboard, FiList, FiEdit3 } from 'react-icons/fi';

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
};

const ALL_NON_ADMIN = [6, 7, 8, 9];
const DASHBOARD_ROLES = [R.ADMIN, ...ALL_NON_ADMIN];

const staticRoutes = [
  {
    title: 'Dashboard',
    url: '/dashboard/default',
    icon: <FiHome />,
    roles: DASHBOARD_ROLES,
  },
  {
    title: 'Inventario',
    icon: <FiBox />,
    roles: R.INVENTARIO,
    children: [
      { title: 'Marcas', url: '/dashboard/inventario/marcas', icon: <FiPackage />, roles: [1, 6, 7, 8, 9] },
      { title: 'Categorías', url: '/dashboard/inventario/categorias', icon: <FiClipboard />, roles: [1, 6, 7, 8, 9] },
      { title: 'Productos', url: '/dashboard/inventario/productos', icon: <FiList />, roles: [1, 6, 7, 8, 9] },
    ],
  },
  {
    title: 'Proyectos',
    icon: <FiPackage />,
    roles: R.INVENTARIO,
    children: [
      { title: 'Cotizaciones', url: '/dashboard/proyectos/cotizaciones', icon: <FiList />, roles: [1, 8] },
      { title: 'Cotizaciones Rechazadas', url: '/dashboard/proyectos/cotizaciones-rechazadas', icon: <FiList />, roles: [1, 8]},
      { title: 'Proyectos', url: '/dashboard/proyectos/proyectos', icon: <FiEdit3 />, roles: [1, 8]}
    ],

  }
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
