import React from 'react';
import { Modal } from 'react-bootstrap';
import { useComponentContext } from './context';

const ModalCarga = () => {
    const { show, modalAction } = useComponentContext();

    return (
        <div>
            <Modal
                show={show}
                onHide={modalAction}
                centered
            >
                <Modal.Body>Este es el contenido del modal.</Modal.Body>
            </Modal>
        </div>
    );
};

export default ModalCarga;
