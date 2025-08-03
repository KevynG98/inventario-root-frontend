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
    this.parentMap = {};
    this.childMap = {};
    this.buildParentMap(props.navigation);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.navigation !== this.props.navigation) {
      this.parentMap = {};
      this.childMap = {};
      this.buildParentMap(this.props.navigation);
    }
  }

  buildParentMap = (items) => {
    items.forEach(item => {
      this.parentMap[item.id] = item.parentId || null;
      this.childMap[item.id] = item.children ? item.children.map(child => child.id) : [];
      if (item.children) {
        this.buildParentMap(item.children);
      }
    });
  };

  // Maneja la apertura y cierre de los submenús sin colapsar los padres
  toggleSubmenu = (e, key) => {
    // Evitamos que el click se propague y cierre niveles superiores
    e.preventDefault();
    e.stopPropagation();

    this.setState(prevState => {
      const activeMenus = { ...prevState.activeMenus };
      const isOpen = !activeMenus[key];
      activeMenus[key] = isOpen;

      // Si abrimos un submenú, aseguramos que todos sus ancestros estén abiertos
      if (isOpen) {
        let parentId = this.parentMap[key];
        while (parentId) {
          activeMenus[parentId] = true;
          parentId = this.parentMap[parentId];
        }
      } else {
        const closeDescendants = (id) => {
          const children = this.childMap[id] || [];
          children.forEach(childId => {
            activeMenus[childId] = false;
            closeDescendants(childId);
          });
        };
        closeDescendants(key);
      }

      return { activeMenus };
    });
  };

  renderNavItems = (items) => {
    return items.map((item) => {
      const currentKey = item.id;
      const hasChildren = item.children && item.children.length > 0;
      const isOpen = !!this.state.activeMenus[currentKey];

      const containerStyle = {
        padding: 0,
        margin: 0,
        backgroundColor: isOpen ? '#384865' : 'transparent',
        borderLeft: isOpen ? '3px solid #00BFFF' : '3px solid transparent',
        transition: 'all 0.3s ease',
        listStyle: 'none',
        boxSizing: 'border-box'
      };

      const linkStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '8px 16px',
        minHeight: '40px',
        color: '#fff',
        textDecoration: 'none',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        width: '100%'
      };

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
          fontSize: '14px'
        }}>
          {item.title}
        </span>
      );

      // Si el ítem tiene hijos, renderiza el botón para desplegar
      if (hasChildren) {
        return (
          <li key={currentKey} style={containerStyle}>
            <button
              type="button"
              onClick={(e) => this.toggleSubmenu(e, currentKey)}
              style={linkStyle}
            >
              {iconSpan}
              {textSpan}
              <FiChevronRight style={{
                fontSize: '16px',
                marginLeft: '10px',
                transition: 'transform 0.3s',
                transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)'
              }} />
            </button>
            <ul
              ref={el => (this.submenuRefs[currentKey] = el)}
              style={{
                paddingLeft: '20px',
                margin: 0,
                display: isOpen ? 'block' : 'none'
              }}
            >
              {this.renderNavItems(item.children)}
            </ul>
          </li>
        );
      }

      // Ítems sin hijos
      if (!item.url) {
        return (
          <li key={currentKey} style={{ padding: 0, margin: 0, listStyle: 'none' }}>
            <span style={linkStyle}>
              {iconSpan}
              {textSpan}
            </span>
          </li>
        );
      }

      return (
        <li key={currentKey} style={{ padding: 0, margin: 0, listStyle: 'none' }}>
          <Link
            to={item.url}
            style={linkStyle}
            onClick={() => {
              if (!item.parentId) {
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
