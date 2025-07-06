import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import windowSize from 'react-window-size';

import staticRoutes from '../../../../../utils/menuRoutes';
import colors from '../../../../../utils/colors';

class NavLeft extends Component {
  state = {
    mobileOpen: false,
  };

  handleNavigate = (url) => {
    this.setState({ mobileOpen: false });
    this.props.history.push(url);
  };

  renderMenuItems = () => {
    const currentPath = this.props.location.pathname;

    const dashboardItem = staticRoutes.find((r) => r.title === 'Dashboard' && !r.children);
    const sections = staticRoutes.filter((r) => r.children);

    return (
      <>
        {dashboardItem && (
          <div
            key="dashboard"
            onClick={() => this.handleNavigate(dashboardItem.url)}
            style={{
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              borderRadius: 8,
              backgroundColor:
                currentPath === dashboardItem.url ? colors.primary : 'transparent',
              color:
                currentPath === dashboardItem.url ? colors.white : 'rgba(255, 255, 255, 0.85)',
              fontWeight: currentPath === dashboardItem.url ? 'bold' : 'normal',
              marginBottom: 8,
              transition: 'all 0.3s ease',
            }}
          >
            {dashboardItem.icon}
            <span style={{ marginLeft: 10 }}>{dashboardItem.title}</span>
          </div>
        )}

        {sections.map((section, idx) => (
          <div key={idx} style={{ marginBottom: '10px' }}>
            <div
              style={{
                marginTop: 15,
                marginBottom: 5,
                fontSize: '14px',
                textTransform: 'uppercase',
                color: 'rgba(255, 255, 255, 0.5)',
              }}
            >
              {section.title}
            </div>
            {section.children.map((item, i) => {
              const isActive = currentPath === item.url;
              return (
                <div
                  key={i}
                  onClick={() => this.handleNavigate(item.url)}
                  style={{
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    borderRadius: 8,
                    backgroundColor: isActive ? colors.primary : 'transparent',
                    color: isActive ? colors.white : 'rgba(255, 255, 255, 0.85)',
                    fontWeight: isActive ? 'bold' : 'normal',
                    marginBottom: 4,
                    transition: 'all 0.3s ease',
                  }}
                >
                  {item.icon}
                  <span style={{ marginLeft: 10 }}>{item.title}</span>
                </div>
              );
            })}
          </div>
        ))}
      </>
    );
  };

  render() {
    const isMobile = this.props.windowWidth < 992;

    return (
      <>
        {isMobile && (
          <>
            <div
              style={{
                position: 'fixed',
                top: 15,
                left: 15,
                background: colors.black,
                color: colors.white,
                padding: 10,
                borderRadius: 5,
                zIndex: 2000,
                cursor: 'pointer',
              }}
              onClick={() => this.setState({ mobileOpen: true })}
            >
              <FiMenu size={24} />
            </div>

            {this.state.mobileOpen && (
              <div
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100vw',
                  height: '100vh',
                  background: 'rgba(0, 0, 0, 0.4)',
                  zIndex: 1500,
                  display: 'flex',
                  justifyContent: 'flex-start',
                }}
                onClick={() => this.setState({ mobileOpen: false })}
              >
                <div
                  style={{
                    width: 250,
                    height: '100%',
                    background: colors.black,
                    color: colors.white,
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    overflowY: 'auto',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontWeight: 'bold',
                      marginBottom: '1rem',
                    }}
                  >
                    <span>Menú</span>
                    <FiX
                      size={20}
                      onClick={() => this.setState({ mobileOpen: false })}
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                  {this.renderMenuItems()}
                </div>
              </div>
            )}
          </>
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  rtlLayout: state.rtlLayout,
});

export default withRouter(connect(mapStateToProps)(windowSize(NavLeft)));
