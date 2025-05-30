import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import windowSize from 'react-window-size';

import staticRoutes from '../../../../../utils/menuRoutes';

class NavLeft extends Component {
    state = {
        mobileOpen: false
    };

    handleNavigate = (url) => {
        this.setState({ mobileOpen: false });
        this.props.history.push(url);
    };

    hasAccess = (roles) => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const userRoles = user?.roles?.map(r => r.id) || [];
        return !roles || roles.some(role => userRoles.includes(role));
    };

    renderMenuItems = () => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const userRoles = user?.roles?.map(r => r.id) || [];

        const hasAccess = (roles) => !roles || roles.some(role => userRoles.includes(role));

        const dashboardItem = staticRoutes.find(r => r.title === 'Dashboard' && !r.children && hasAccess(r.roles));
        const sections = staticRoutes.filter(r => r.children && hasAccess(r.roles));

        return (
            <>
                {dashboardItem && (
                    <div
                        key="dashboard"
                        onClick={() => this.handleNavigate(dashboardItem.url)}
                        style={{
                            padding: '8px 0',
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                            color: 'rgba(255, 255, 255, 0.85)'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.color = '#00d4ff'}
                        onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)'}
                    >
                        {dashboardItem.icon}
                        <span style={{ marginLeft: 10 }}>{dashboardItem.title}</span>
                    </div>
                )}

                {sections.map((section, idx) => (
                    <div key={idx} style={{ marginBottom: '10px' }}>
                        <div style={{
                            marginTop: 15,
                            marginBottom: 5,
                            fontSize: '14px',
                            textTransform: 'uppercase',
                            color: 'rgba(255, 255, 255, 0.5)'
                        }}>
                            {section.title}
                        </div>
                        {section.children.map((item, i) => {
                            if (!hasAccess(item.roles)) return null;
                            return (
                                <div
                                    key={i}
                                    onClick={() => this.handleNavigate(item.url)}
                                    style={{
                                        padding: '8px 0',
                                        display: 'flex',
                                        alignItems: 'center',
                                        cursor: 'pointer',
                                        color: 'rgba(255, 255, 255, 0.85)'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.color = '#00d4ff'}
                                    onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)'}
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
                        {/* Botón hamburguesa */}
                        <div style={{
                            position: 'fixed',
                            top: 15,
                            left: 15,
                            background: '#2f3e5a',
                            color: 'white',
                            padding: 10,
                            borderRadius: 5,
                            zIndex: 2000,
                            cursor: 'pointer'
                        }} onClick={() => this.setState({ mobileOpen: true })}>
                            <FiMenu size={24} />
                        </div>

                        {/* Sidebar flotante */}
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
                                    justifyContent: 'flex-start'
                                }}
                                onClick={() => this.setState({ mobileOpen: false })}
                            >
                                <div
                                    style={{
                                        width: 250,
                                        height: '100%',
                                        background: '#2f3e5a',
                                        color: 'white',
                                        padding: '1rem',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        overflowY: 'auto'
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        fontWeight: 'bold',
                                        marginBottom: '1rem'
                                    }}>
                                        <span>Menú</span>
                                        <FiX size={20} onClick={() => this.setState({ mobileOpen: false })} style={{ cursor: 'pointer' }} />
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

const mapStateToProps = state => ({
    rtlLayout: state.rtlLayout
});

export default withRouter(connect(mapStateToProps)(windowSize(NavLeft)));
