import React, {Component} from 'react';
import {connect} from 'react-redux';

import NavLeft from "./NavLeft";
import NavRight from "./NavRight";
import Aux from "../../../../hoc/_Aux";

class NavBar extends Component {
    render() {
        let headerClass = ['navbar', 'pcoded-header', 'navbar-expand-lg', this.props.headerBackColor];
        if (this.props.headerFixedLayout) {
            headerClass = [...headerClass, 'headerpos-fixed'];
        }

        return (
            <Aux>
                <header className={headerClass.join(' ')}>
                    <div className="m-header">
                        <div className="b-brand d-flex align-items-center">
                            <div className="b-bg d-flex align-items-center justify-content-center" style={{ background: '#0f1219' }}>
                                <img src={`${process.env.PUBLIC_URL}/inventario_logo.png`} alt="Inventario General logo" style={{ width: '30px', height: '30px', objectFit: 'cover', borderRadius: '6px' }} />
                            </div>
                            <span className="b-title" style={{ marginLeft: '8px', color: '#34d399', fontWeight: 700 }}>Inventario General</span>
                        </div>
                    </div>
                    <div className="mobile-menu" id="mobile-header"><i className="feather icon-more-horizontal"/></div>
                    <div className="collapse navbar-collapse">
                        <NavLeft/>
                        <NavRight rtlLayout={this.props.rtlLayout} />
                    </div>
                </header>
            </Aux>
        );
    }
}

const mapStateToProps = state => {
    return {
        rtlLayout: state.rtlLayout,
        headerBackColor: state.headerBackColor,
        headerFixedLayout: state.headerFixedLayout
    }
};

export default connect(mapStateToProps) (NavBar);
