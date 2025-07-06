import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';
import windowSize from 'react-window-size';

import { FiChevronRight } from 'react-icons/fi';

import Aux from "../../../../../hoc/_Aux";
import * as actionTypes from "../../../../../store/actions";

class NavContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeMenus: {}
    };
    this.submenuRefs = {};
  }

  toggleSubmenu = (key) => {
    this.setState(prevState => ({
      activeMenus: {
        ...prevState.activeMenus,
        [key]: !prevState.activeMenus[key]
      }
    }));
  };

  renderNavItems = (items, parentKey = '') => {
    return items.map((item, index) => {
      const currentKey = `${parentKey}${index}`;
      const hasChildren = item.children && item.children.length > 0;
      const isOpen = !!this.state.activeMenus[currentKey];

      const containerStyle = {
        padding: 0,
        margin: 0,
        backgroundColor: isOpen ? '#384865' : 'transparent',
        borderLeft: isOpen ? '3px solid #00BFFF' : '3px solid transparent',
        transition: 'all 0.3s ease',
        listStyle: 'none',
        // Aseguramos que el borde izquierdo no genere overflow
        boxSizing: 'border-box'
      };

      const linkStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',     // alineamos todo al inicio
        padding: '8px 16px',
        minHeight: '40px',
        color: '#fff',
        textDecoration: 'none'
      };

      // Elementos del ítem: icono + texto + (opcional) flecha
      const iconSpan = (
        <span style={{
          fontSize: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '24px',
          height: '24px'
        }}>
          {item.icon}
        </span>
      );

      const textSpan = (
        <span style={{
          fontSize: '14px',
          // whiteSpace eliminado para permitir wrapping si es necesario
          // whiteSpace: 'nowrap'
        }}>
          {item.title}
        </span>
      );

      // Si el ítem tiene hijos, renderizar un <a> con flecha desplegable
      if (hasChildren) {
        return (
          <li key={currentKey} style={containerStyle}>
            <a
              href="#!"
              onClick={() => this.toggleSubmenu(currentKey)}
              style={linkStyle}
            >
              {/* Icono + Texto del ítem */}
              {iconSpan}
              {textSpan}
              {/* Flecha desplegable */}
              <FiChevronRight style={{
                fontSize: '16px',
                marginLeft: '10px',               // separa la flecha del texto
                transition: 'transform 0.3s',
                transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)'
              }} />
            </a>
            {/* Submenú desplegable */}
            <ul
              ref={el => (this.submenuRefs[currentKey] = el)}
              style={{
                paddingLeft: '20px',
                margin: 0,
                maxHeight: isOpen
                  ? `${this.submenuRefs[currentKey]?.scrollHeight || 0}px`
                  : '0px',
                opacity: isOpen ? 1 : 0,
                overflow: 'hidden',
                transform: isOpen ? 'translateY(0)' : 'translateY(-5px)',
                transition: 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)'
              }}
            >
              {this.renderNavItems(item.children, `${currentKey}-`)}
            </ul>
          </li>
        );
      }

      // Ítems sin hijos (enlaces simples)
      return (
        <li key={currentKey} style={{ padding: 0, margin: 0, listStyle: 'none' }}>
          <Link
            to={item.url}
            style={linkStyle}
            onClick={() => {
              if (!parentKey) {
                // Colapsar todos los menús abiertos al navegar a una página
                this.setState({ activeMenus: {} });
              }
            }}
          >
            {iconSpan}
            {textSpan}
          </Link>
        </li>
      );
    });
  };

  render() {
    const navItems = this.renderNavItems(this.props.navigation);
    const horizontal = this.props.layout === 'horizontal';

    const navList = (
      <ul
        className={`nav pcoded-inner-navbar ${horizontal ? 'sidenav-inner' : ''}`}
        id={horizontal ? 'sidenav-horizontal' : ''}
        onMouseLeave={this.props.onNavContentLeave}
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          backgroundColor: '#2e3b55',
          color: '#fff'
        }}
      >
        {navItems}
      </ul>
    );

    return (
      <Aux>
        {horizontal ? (
          <div className="navbar-content sidenav-horizontal" id="layout-sidenav">
            <div id="sidenav-wrapper" className="sidenav-horizontal-wrapper">{navList}</div>
          </div>
        ) : (
          <div className="navbar-content datta-scroll" style={{ height: '100vh', backgroundColor: '#2e3b55' }}>
            <PerfectScrollbar>{navList}</PerfectScrollbar>
          </div>
        )}
      </Aux>
    );
  }
}

const mapStateToProps = state => ({
  layout: state.layout,
  collapseMenu: state.collapseMenu,
});

const mapDispatchToProps = dispatch => ({
  onNavContentLeave: () => dispatch({ type: actionTypes.NAV_CONTENT_LEAVE }),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(windowSize(NavContent)));
