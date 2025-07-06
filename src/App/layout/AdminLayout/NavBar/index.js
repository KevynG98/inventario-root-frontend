import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FiArchive } from 'react-icons/fi';
import NavLeft from './NavLeft';
import NavRight from './NavRight';
import Aux from '../../../../hoc/_Aux';
import * as actionTypes from '../../../../store/actions';
import colors from '../../../../utils/colors';

class NavBar extends Component {
  render() {
    let headerClass = ['navbar', 'pcoded-header', 'navbar-expand-lg', this.props.headerBackColor];
    if (this.props.headerFixedLayout) {
      headerClass.push('headerpos-fixed');
    }

    return (
      <Aux>
        <header className={headerClass.join(' ')}>
          <div className="m-header" style={{ backgroundColor: colors.black }}>
            <a className="b-brand d-flex align-items-center" href="#!" style={{ textDecoration: 'none' }}>
              <div
                className="b-bg"
                style={{
                  backgroundColor: colors.primary,
                  borderRadius: '10px',
                  width: '35px',
                  height: '35px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '10px',
                }}
              >
                <FiArchive size={20} color="white" />
              </div>
              <span
                className="b-title"
                style={{
                  color: colors.white,
                  fontWeight: 'bold',
                  fontSize: '16px',
                }}
              >
                Sistema de inventarios
              </span>
            </a>
          </div>

          <a className="mobile-menu" id="mobile-header">
            <i className="feather icon-more-horizontal" />
          </a>

          <div className="collapse navbar-collapse">
            <NavLeft />
            <NavRight rtlLayout={this.props.rtlLayout} />
          </div>
        </header>
      </Aux>
    );
  }
}

const mapStateToProps = state => ({
  rtlLayout: state.rtlLayout,
  headerBackColor: state.headerBackColor,
  headerFixedLayout: state.headerFixedLayout,
  collapseMenu: state.collapseMenu
});

const mapDispatchToProps = dispatch => ({
  onToggleNavigation: () => dispatch({ type: actionTypes.COLLAPSE_MENU }),
});

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
