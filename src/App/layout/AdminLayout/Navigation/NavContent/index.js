import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';
import windowSize from 'react-window-size';

import Aux from "../../../../../hoc/_Aux";
import * as actionTypes from "../../../../../store/actions";

class NavContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollWidth: 0,
      prevDisable: true,
      nextDisable: false,
      activeMenu: null
    };
    this.submenuRefs = {};
  }

  scrollPrevHandler = () => {
    const wrapperWidth = document.getElementById('sidenav-wrapper').clientWidth;
    let scrollWidth = this.state.scrollWidth - wrapperWidth;
    this.setState({
      scrollWidth: scrollWidth < 0 ? 0 : scrollWidth,
      prevDisable: scrollWidth <= 0,
      nextDisable: false
    });
  };

  scrollNextHandler = () => {
    const wrapperWidth = document.getElementById('sidenav-wrapper').clientWidth;
    const contentWidth = document.getElementById('sidenav-horizontal').clientWidth;
    let scrollWidth = this.state.scrollWidth + (wrapperWidth - 80);
    const maxScroll = contentWidth - wrapperWidth + 80;

    this.setState({
      scrollWidth: scrollWidth > maxScroll ? maxScroll : scrollWidth,
      prevDisable: false,
      nextDisable: scrollWidth >= maxScroll
    });
  };

  toggleSubmenu = (index) => {
    this.setState(prevState => ({
      activeMenu: prevState.activeMenu === index ? null : index
    }));
  };

  renderNavItems = (items, parentIndex = '') => {
    return items.map((item, index) => {
      const currentIndex = `${parentIndex}${index}`;
      const hasChildren = item.children && item.children.length > 0;
      const isOpen = this.state.activeMenu === currentIndex;
      const isChild = parentIndex !== '';

      if (hasChildren) {
        return (
          <li key={index} className={`nav-item pcoded-hasmenu ${isOpen ? 'pcoded-trigger' : ''}`}>
            <a href="#!" className="nav-link" onClick={() => this.toggleSubmenu(currentIndex)}>
              <span className="pcoded-micon">{item.icon}</span>
              <span className="pcoded-mtext">{item.title}</span>
            </a>
            <ul
              className="pcoded-submenu"
              ref={el => this.submenuRefs[currentIndex] = el}
              style={{
                maxHeight: isOpen
                  ? this.submenuRefs[currentIndex]?.scrollHeight + "px"
                  : "0px",
                overflow: 'hidden',
                transition: 'max-height 0.75s cubic-bezier(0.25, 1, 0.5, 1)'
              }}
            >
              {this.renderNavItems(item.children, `${currentIndex}-`)}
            </ul>
          </li>
        );
      }

      return (
        <li key={index} className="nav-item">
          <Link
            to={item.url}
            className="nav-link"
            onClick={() => {
              if (!isChild) this.setState({ activeMenu: null });
            }}
            style={{ paddingLeft: isChild ? '1.5rem' : undefined }}
          >
            <span className="pcoded-micon">{item.icon}</span>
            <span className="pcoded-mtext">{item.title}</span>
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
        style={horizontal ? { marginLeft: `-${this.state.scrollWidth}px` } : {}}
      >
        {navItems}
      </ul>
    );

    return (
      <Aux>
        {horizontal ? (
          <div className="navbar-content sidenav-horizontal" id="layout-sidenav">
            <a
              href="#!"
              className={`sidenav-horizontal-prev ${this.state.prevDisable ? 'disabled' : ''}`}
              onClick={this.scrollPrevHandler}
            >
              <span />
            </a>
            <div id="sidenav-wrapper" className="sidenav-horizontal-wrapper">{navList}</div>
            <a
              href="#!"
              className={`sidenav-horizontal-next ${this.state.nextDisable ? 'disabled' : ''}`}
              onClick={this.scrollNextHandler}
            >
              <span />
            </a>
          </div>
        ) : (
          <div className="navbar-content datta-scroll">
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
