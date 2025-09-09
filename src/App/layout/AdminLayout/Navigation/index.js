import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import windowSize from 'react-window-size';

import NavLogo from './NavLogo';
import NavContent from './NavContent';
import OutsideClick from './OutsideClick';
import Aux from './../../../../hoc/_Aux';
import * as actionTypes from './../../../../store/actions';
import staticRoutes from '../../../../utils/menuRoutes';

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

    // ✅ Normalizamos roles
    const rawRoles = (user?.roles || []).map(role => String(role.id ?? role));
    // ✅ En perfiles de Inventario (6,7,8) sin admin, aplicamos exclusividad por perfil
    let normalizedRoles = new Set(rawRoles);
    if (!normalizedRoles.has('1')) {
      if (normalizedRoles.has('6')) normalizedRoles = new Set(['6']);
      else if (normalizedRoles.has('7')) normalizedRoles = new Set(['7']);
      else if (normalizedRoles.has('8')) normalizedRoles = new Set(['8']);
    }
    const userRoles = normalizedRoles;

    // ✅ Filtro corregido
    const filterByRoles = (items) => {
      if (!Array.isArray(items)) return [];
      return items
        .filter(item => !item.roles || item.roles.some(role => userRoles.has(String(role))))
        .map(item => ({
          ...item,
          children: item.children ? filterByRoles(item.children) : undefined
        }))
        .filter(item => !item.children || item.children.length > 0);
    };

    // Whitelist por perfil de inventario para endurecer el menú
    const whitelist = new Set([
      '/dashboard/default',
    ]);
    if (!userRoles.has('1')) {
      if (userRoles.has('6')) {
        ['/dashboard/inventario/ver-precios'].forEach(u => whitelist.add(u));
      } else if (userRoles.has('7')) {
        ['/dashboard/inventario/stock', '/dashboard/inventario/movimientos'].forEach(u => whitelist.add(u));
      } else if (userRoles.has('8')) {
        [
          '/dashboard/inventario/proveedores',
          '/dashboard/inventario/marcas',
          '/dashboard/inventario/unidades-medida',
          '/dashboard/inventario/principiosActivos',
          '/dashboard/inventario/categorias',
          '/dashboard/inventario/sku',
          '/dashboard/inventario/stock',
          '/dashboard/inventario/movimientos',
          '/dashboard/inventario/consignacion',
          '/dashboard/inventario/controlados',
          '/dashboard/inventario/ver-precios',
        ].forEach(u => whitelist.add(u));
      } else if (userRoles.has('9')) {
        [
          '/dashboard/inventario/precios',
          '/dashboard/futuro',
        ].forEach(u => whitelist.add(u));
      }
    }

    const enforceWhitelist = (items) => {
      // Si es admin, no aplicamos whitelist
      if (userRoles.has('1')) return items;

      const apply = (list) => (list || [])
        .map(item => {
          const children = item.children ? apply(item.children) : undefined;
          const hasChildren = children && children.length > 0;
          const keepByUrl = item.url ? whitelist.has(item.url) : false;
          if (hasChildren || keepByUrl) return { ...item, children };
          return null;
        })
        .filter(Boolean);
      return apply(items);
    };

    const filteredRoutes = enforceWhitelist(filterByRoles(staticRoutes));

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
            width: '260px',
            overflowY: 'auto',
            overflowX: 'hidden',
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
