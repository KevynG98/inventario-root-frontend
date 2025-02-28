import React from 'react';
import { Modal } from 'react-bootstrap';
import { useMyContext } from './Context';
import { useForm } from 'react-hook-form';

const ModalCreate = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { show, showModal, sendData } = useMyContext();

    const onSubmit = async (data) => {
        try {
            data.price = parseFloat(data.price); // Convertir el precio a número
            await sendData(data); // Enviar datos al contexto
        } catch (error) {
            console.error("Error al enviar datos", error);
        }
    };

    return (
        <Modal show={show} onHide={showModal} centered>
            <Modal.Body>
                <div className="card-body text-center">
                    <h3 className="mb-4">Crear Producto</h3>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" placeholder="Nombre del producto" {...register("name", { required: "El nombre es obligatorio" })} />
                            {errors.name && <p className="text-danger">{errors.name.message}</p>}
                        </div>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" placeholder="Descripción" {...register("description", { required: "La descripción es obligatoria" })} />
                            {errors.description && <p className="text-danger">{errors.description.message}</p>}
                        </div>
                        <div className="input-group mb-3">
                            <input type="number" className="form-control" placeholder="Precio" step="0.01" {...register("price", { required: "El precio es obligatorio", min: { value: 0, message: "El precio no puede ser negativo" } })} />
                            {errors.price && <p className="text-danger">{errors.price.message}</p>}
                        </div>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" placeholder="Unidad (ej. kg, piezas)" {...register("unit", { required: "La unidad es obligatoria" })} />
                            {errors.unit && <p className="text-danger">{errors.unit.message}</p>}
                        </div>
                        <div className="input-group mb-3">
                            <input type="number" className="form-control" placeholder="ID de categoría" {...register("category_id", { required: "El ID de la categoría es obligatorio" })} />
                            {errors.category_id && <p className="text-danger">{errors.category_id.message}</p>}
                        </div>
                        <button type="submit" className="btn btn-primary shadow-2 mb-4">Crear Producto</button>
                    </form>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default ModalCreate;
