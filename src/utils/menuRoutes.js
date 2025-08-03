import {
    FiHome, FiUsers, FiSettings, FiShield, FiPackage, FiBox, FiThermometer, FiUserPlus,
    FiList, FiFileText, FiEdit3, FiLogOut, FiUserCheck, FiCreditCard, FiGrid, FiTruck,
    FiClipboard, FiHeart, FiFilePlus, FiArchive, FiUser, FiCalendar, FiFileMinus,
    FiDollarSign, FiBookOpen, FiBarChart2, FiMonitor, FiDatabase,
} from 'react-icons/fi';

const staticRoutes = [
    {
        title: 'Dashboard',
        url: '/dashboard/default',
        icon: <FiHome />,
        roles: [1, 2, 3]
    },
    {
        title: 'Admisiones',
        icon: <FiUserPlus />,
        roles: [1],
        children: [
            { title: 'Nueva Admision', url: '/dashboard/admisiones/nueva/', icon: <FiUserPlus /> },
            { title: 'Listado de Admisiones', url: '/dashboard/admisiones/listar-admision', icon: <FiList />, roles: [1] },
            { title: 'Estado de cuenta', url: '/dashboard/admisiones/listar-admision-estados/', icon: <FiFileText />, roles: [1] },
            { title: 'Egreso de Pacientes', url: '/dashboard/construccion/', icon: <FiLogOut />, roles: [1] },
            { title: 'Consulta externa', url: '/dashboard/admisiones/consulta-externa/', icon: <FiUserCheck />, roles: [1] },
            { title: 'Caja', url: '/dashboard/admisiones/caja/', icon: <FiCreditCard />, roles: [1] },
            { title: 'Seguros', url: '/dashboard/admisiones/seguros/', icon: <FiShield />, roles: [1] },
            { title: 'Estado de habitaciones', url: '/dashboard/admisiones/estado-habitacion', icon: <FiGrid />, roles: [1] }
        ]
    },
    {
        title: 'Inventario',
        icon: <FiBox />,
        roles: [1, 2],
        children: [
            { title: 'Proveedores', url: '/dashboard/inventario/proveedores', icon: <FiTruck />, roles: [1, 2] },
            { title: 'Marcas', url: '/dashboard/inventario/marcas', icon: <FiPackage />, roles: [1, 2] },
            { title: 'Unidades de Medidas', url: '/dashboard/inventario/unidades-medida', icon: <FiGrid />, roles: [1, 2] },
            { title: 'Categorias', url: '/dashboard/inventario/categorias', icon: <FiClipboard />, roles: [1, 2] },
            { title: 'Bodegas', url: '/dashboard/inventario/bodegas', icon: <FiPackage />, roles: [1, 2] },
            { title: 'Gestión de SKU', url: '/dashboard/inventario/sku', icon: <FiList />, roles: [1, 2] },
            { title: 'Stock', url: '/dashboard/inventario/stock', icon: <FiList />, roles: [1, 2] },
            { title: 'Actualizacion de precio', url: '/dashboard/inventario/precios', icon: <FiEdit3 />, roles: [1, 2] },
            { title: 'Examenes', url: '/dashboard/futuro/', icon: <FiHeart />, roles: [1, 2] },
            { title: 'Historico de Movimientos', url: '/dashboard/inventario/movimientos', icon: <FiArchive />, roles: [1, 2] },
            { title: 'Consignacion', url: '/dashboard/inventario/consignacion', icon: <FiPackage />, roles: [1, 2] },
            { title: 'Controlados', url: '/dashboard/inventario/controlados', icon: <FiShield />, roles: [1, 2] }
        ]
    },
    {
        title: 'Bodegas',
        icon: <FiPackage />,
        roles: [1, 2],
        children: [
            {
                title: 'Compras',
                icon: <FiFileText />,
                roles: [1, 2],
                children: [
                    { title: 'Generar Requsicion', url: '/dashboard/bodegas/compras/generar/', icon: <FiFileText />, roles: [1, 2] },
                    { title: 'Visualizar Requisiciones', url: '/dashboard/bodegas/compras/visualizar/', icon: <FiFileText />, roles: [1, 2] },
                    { title: 'Orden de Compra', url: '/dashboard/bodegas/compras/orden/', icon: <FiFileText />, roles: [1, 2] },
                ]
            },
            { title: 'Entradas', url: '/dashboard/bodegas/entradas/', icon: <FiLogOut />, roles: [1, 2] },
            { title: 'Salidas', url: '/dashboard/bodegas/salidas/', icon: <FiFilePlus />, roles: [1, 2] },
            { title: 'Traslados', url: '/dashboard/bodegas/traslados/', icon: <FiTruck />, roles: [1, 2] }
        ]
    },
    {
        title: 'Pacientes',
        icon: <FiUsers />,
        roles: [1, 2],
        children: [
            { title: 'Enfermeria', url: '/dashboard/futuro/', icon: <FiHeart />, roles: [1, 2] },
            { title: 'Medicos Residentes', url: '/dashboard/futuro/', icon: <FiUser />, roles: [1, 2] },
            { title: 'Medicos Tratantes', url: '/dashboard/futuro/', icon: <FiUser />, roles: [1, 2] },
            { title: 'Devoluciones a Farmacia', url: '/dashboard/futuro/', icon: <FiLogOut />, roles: [1, 2] },
            { title: 'Calendario Operaciones', url: '/dashboard/futuro/', icon: <FiCalendar />, roles: [1, 2] }
        ]
    },
    {
        title: 'Examenes',
        icon: <FiMonitor />,
        roles: [1, 2],
        children: [
            { title: 'Ordenes de Laboratorio', url: '/dashboard/futuro/', icon: <FiFileText />, roles: [1, 2] },
            { title: 'Ordenes de Radiologia', url: '/dashboard/futuro/', icon: <FiFileMinus />, roles: [1, 2] },
            { title: 'Catalogo Examenes', url: '/dashboard/futuro/', icon: <FiList />, roles: [1, 2] }
        ]
    },
    {
        title: 'Mantenimiento',
        icon: <FiSettings />,
        roles: [1, 2],
        children: [
            { title: 'Admisiones', url: '/dashboard/futuro/', icon: <FiUserPlus />, roles: [1, 2] },
            { title: 'Facturacion', url: '/dashboard/futuro/', icon: <FiDollarSign />, roles: [1, 2] },
            { title: 'Habitaciones', url: '/dashboard/mantenimiento/habitaciones', icon: <FiGrid />, roles: [1, 2] },
            { title: 'Usuarios', url: '/dashboard/mantenimiento/users/', icon: <FiUsers />, roles: [1, 2] },
            { title: 'Medicos', url: '/dashboard/mantenimiento/medicos/', icon: <FiUser />, roles: [1, 2] },
            { title: 'Directorio Extensiones', url: '/dashboard/mantenimiento/extensiones', icon: <FiBookOpen />, roles: [1, 2] },
            //{ title: 'Costos Emergencias', url: '/dashboard/futuro/', icon: <FiDollarSign />, roles: [1, 2] },
            { title: 'Seguros', url: '/dashboard/mantenimiento/seguros', icon: <FiList />, roles: [1, 2] },
        ]
    },
    // {
    //     title: 'Seguros',
    //     icon: <FiSettings />,
    //     roles: [1, 2],
    //     children: [
    //         { title: 'Seguros', url: '/dashboard/inventario/seguros', icon: <FiList />, roles: [1, 2] },
    //     ]
    // },
    {
        title: 'Reportes',
        icon: <FiBarChart2 />,
        roles: [1, 2],
        children: [
            { title: 'Historial General', url: '/dashboard/reportes/historial-general', icon: <FiFileText />, roles: [1, 2] },
            { title: 'Imprimir Expediente', url: '/dashboard/futuro/', icon: <FiFileText />, roles: [1, 2] },
            { title: 'Historico de Admisiones', url: '/dashboard/futuro/', icon: <FiArchive />, roles: [1, 2] },
            { title: 'Facturacion', url: '/dashboard/futuro/', icon: <FiDollarSign />, roles: [1, 2] },
            { title: 'Usuarios', url: '/dashboard/reportes/users', icon: <FiUsers />, roles: [1, 2] },
            { title: 'Medicos', url: '/dashboard/futuro/', icon: <FiUser />, roles: [1, 2] },
            { title: 'Inventarios', url: '/dashboard/reportes/inventarios', icon: <FiDatabase />, roles: [1, 2] },
            { title: 'Caja', url: '/dashboard/futuro/', icon: <FiCreditCard />, roles: [1, 2] },
            { title: 'Honorarios Medicos', url: '/dashboard/futuro/', icon: <FiDollarSign />, roles: [1, 2] },
            { title: 'Listado de SKU Cobrados', url: '/dashboard/futuro/', icon: <FiList />, roles: [1, 2] },
            { title: 'Listado de SKU Precios', url: '/dashboard/futuro/', icon: <FiDollarSign />, roles: [1, 2] },
            { title: 'Ordenes de Compra', url: '/dashboard/futuro/', icon: <FiFilePlus />, roles: [1, 2] },
            { title: 'Consignacion', url: '/dashboard/futuro/', icon: <FiPackage />, roles: [1, 2] },
            { title: 'Controlados', url: '/dashboard/futuro/', icon: <FiShield />, roles: [1, 2] },
            { title: 'Ingresos - Egresos', url: '/dashboard/futuro/', icon: <FiDollarSign />, roles: [1, 2] },
            { title: 'Directorio Extensiones', url: '/dashboard/futuro/', icon: <FiBookOpen />, roles: [1, 2] }
        ]
    }
];

export default staticRoutes;
