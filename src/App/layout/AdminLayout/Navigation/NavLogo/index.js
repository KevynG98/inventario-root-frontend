import React from 'react';
import Aux from "../../../../../hoc/_Aux";

const navLogo = () => {
    const logoSrc = `${process.env.PUBLIC_URL}/inventario_logo.png`;
    return (
        <Aux>
            <div className="navbar-brand header-logo" style={{ background: '#0f1219' }}>
                <div className="b-brand d-flex align-items-center">
                    <div className="b-bg d-flex align-items-center justify-content-center" style={{ background: '#0f1219' }}>
                        <img src={logoSrc} alt="Inventario General logo" style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '6px' }} />
                    </div>
                    <span className="b-title" style={{ marginLeft: '8px', color: '#34d399', fontWeight: 700 }}>Inventario General</span>
                </div>
            </div>
        </Aux>
    );
};

export default navLogo;
