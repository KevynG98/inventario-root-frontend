import React from 'react';
import { FiArchive } from 'react-icons/fi'; // Feather Archive icon
import DEMO from './../../../../../store/constant';
import Aux from "../../../../../hoc/_Aux";

const navLogo = (props) => {
    let toggleClass = ['mobile-menu'];
    if (props.collapseMenu) {
        toggleClass = [...toggleClass, 'on'];
    }

    return (
        <Aux>
            <div className="navbar-brand header-logo" style={{ backgroundColor: '#2f3e5a' }}>
                <a className="b-brand">
                    <div className="b-bg">
                        <FiArchive size={24} color="white" />
                    </div>

                    <span className="b-title">Sistema de inventarios</span>
                </a>
            </div>
        </Aux>
    );
};

export default navLogo;
