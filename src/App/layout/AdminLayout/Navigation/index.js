import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import windowSize from 'react-window-size';

import NavLogo from './NavLogo';
import NavContent from './NavContent';
import OutsideClick from './OutsideClick';
import Aux from './../../../../hoc/_Aux';
import * as actionTypes from './../../../../store/actions';

import {
  FiHome, FiUsers, FiSettings, FiShield, FiPackage, FiBox, FiThermometer, FiUserPlus,
  FiList, FiFileText, FiEdit3, FiLogOut, FiUserCheck, FiCreditCard, FiGrid, FiTruck,
  FiClipboard, FiHeart, FiFilePlus, FiArchive, FiUser, FiCalendar, FiFileMinus,
  FiDollarSign, FiBookOpen, FiBarChart2, FiMonitor, FiDatabase,
} from 'react-icons/fi';

class Navigation extends Component {
  resize = () => {
    const contentWidth = document.getElementById('root').clientWidth;
    if (this.props.layout === 'horizontal' && contentWidth < 992) {
      this.props.onChangeLayout('vertical');
    }
  };

  componentDidMount() {
    this.resize();
    window.addEventListener('resize', this.resize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  render() {
    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
    const userRoles = user?.roles.map(role => role.id) || [];

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
          { title: 'Nueva Admision', url: '/dashboard/admisiones/nueva/', icon: <FiUserPlus />, roles: [1] },
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
          { title: 'Gestion SKU', url: '/dashboard/futuro/', icon: <FiList />, roles: [1, 2] },
          { title: 'Actualizacion de precio', url: '/dashboard/futuro/', icon: <FiEdit3 />, roles: [1, 2] },
          { title: 'Examenes', url: '/dashboard/futuro/', icon: <FiHeart />, roles: [1, 2] },
          { title: 'Historico de Movimientos', url: '/dashboard/inventario/movimientos', icon: <FiArchive />, roles: [1, 2] },
          { title: 'Consignacion', url: '/dashboard/futuro/', icon: <FiPackage />, roles: [1, 2] },
          { title: 'Controlados', url: '/dashboard/futuro/', icon: <FiShield />, roles: [1, 2] }
        ]
      },
      {
        title: 'Farmacia',
        icon: <FiPackage />,
        roles: [1, 2],
        children: [
          { title: 'Solicitud de Medicamentos', url: '/dashboard/futuro/', icon: <FiFileText />, roles: [1, 2] },
          { title: 'Devoluciones de Medicamentos', url: '/dashboard/futuro/', icon: <FiLogOut />, roles: [1, 2] },
          { title: 'Solicitud  de Compra', url: '/dashboard/futuro/', icon: <FiFilePlus />, roles: [1, 2] },
          { title: 'Traslados', url: '/dashboard/futuro/', icon: <FiTruck />, roles: [1, 2] }
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
          { title: 'Usuarios', url: '/dashboard/users/', icon: <FiUsers />, roles: [1, 2] },
          { title: 'Medicos', url: '/dashboard/futuro/', icon: <FiUser />, roles: [1, 2] },
          { title: 'Directorio Extensiones', url: '/dashboard/futuro/', icon: <FiBookOpen />, roles: [1, 2] },
          { title: 'Costos Emergencias', url: '/dashboard/futuro/', icon: <FiDollarSign />, roles: [1, 2] }
        ]
      },
      {
        title: 'Reportes',
        icon: <FiBarChart2 />,
        roles: [1, 2],
        children: [
          { title: 'Historial General', url: '/dashboard/reportes/historial-general', icon: <FiFileText />, roles: [1, 2] },
          { title: 'Imprimir Expediente', url: '/dashboard/futuro/', icon: <FiFileText />, roles: [1, 2] },
          { title: 'Historico de Admisiones', url: '/dashboard/futuro/', icon: <FiArchive />, roles: [1, 2] },
          { title: 'Facturacion', url: '/dashboard/futuro/', icon: <FiDollarSign />, roles: [1, 2] },
          { title: 'Usuarios', url: '/dashboard/futuro/', icon: <FiUsers />, roles: [1, 2] },
          { title: 'Medicos', url: '/dashboard/futuro/', icon: <FiUser />, roles: [1, 2] },
          { title: 'Inventarios', url: '/dashboard/futuro/', icon: <FiDatabase />, roles: [1, 2] },
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

    const filterByRoles = (items) => {
      return items
        .filter(item => !item.roles || item.roles.some(role => userRoles.includes(role)))
        .map(item => ({
          ...item,
          children: item.children ? filterByRoles(item.children) : undefined
        }))
        .filter(item => !item.children || item.children.length > 0);
    };

    const filteredRoutes = filterByRoles(staticRoutes);

    const navContent = (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: '#2f3e5a',
        }}
      >
        <div
          style={{
            flex: 1,
            paddingBottom: '60px',
          }}
        >
          <NavLogo
            collapseMenu={this.props.collapseMenu}
            windowWidth={this.props.windowWidth}
            onToggleNavigation={this.props.onToggleNavigation}
          />
          <NavContent navigation={filteredRoutes} />
        </div>

        <div
          style={{
            marginTop: '-100px',
            padding: '10px 0',
            textAlign: 'center',
            fontSize: '12px',
            color: 'rgba(255,255,255,0.5)',
            backgroundColor: '#2f3e5a',
            borderTop: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          © 2025 Oscar de Leon
        </div>
      </div>
    );

    return (
      <Aux>
        <nav
          className="pcoded-navbar no-scrollbar"
          style={{
            height: '100vh',
            overflowY: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            backgroundColor: '#2f3e5a',
          }}
        >
          {this.props.windowWidth < 992 ? (
            <OutsideClick>{navContent}</OutsideClick>
          ) : (
            navContent
          )}
        </nav>
      </Aux>
    );
  }
}

const mapStateToProps = state => ({
  layout: state.layout,
  preLayout: state.preLayout,
  collapseMenu: state.collapseMenu,
  layoutType: state.layoutType,
  navBackColor: state.navBackColor,
  navBackImage: state.navBackImage,
  navIconColor: state.navIconColor,
  navBrandColor: state.navBrandColor,
  layout6Background: state.layout6Background,
  layout6BackSize: state.layout6BackSize,
  rtlLayout: state.rtlLayout,
  navFixedLayout: state.navFixedLayout,
  boxLayout: state.boxLayout,
  navDropdownIcon: state.navDropdownIcon,
  navListIcon: state.navListIcon,
  navActiveListColor: state.navActiveListColor,
  navListTitleColor: state.navListTitleColor,
  navListTitleHide: state.navListTitleHide,
});

const mapDispatchToProps = dispatch => ({
  onToggleNavigation: () => dispatch({ type: actionTypes.COLLAPSE_MENU }),
  onChangeLayout: layout => dispatch({ type: actionTypes.CHANGE_LAYOUT, layout }),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(windowSize(Navigation)));