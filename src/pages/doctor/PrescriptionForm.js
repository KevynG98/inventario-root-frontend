import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useMyContext } from './Context';

const PrescriptionForm = () => {
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
    const { sendData, setData, data } = useMyContext();
    const [currentDateTime, setCurrentDateTime] = useState('');

    useEffect(() => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        const localDateTime = now.toISOString().slice(0, 16);

        setCurrentDateTime(localDateTime);
        setValue("date", localDateTime);
    }, [setValue]);

    const onSubmit = async (formData) => {
        const newData = {
            id: Date.now(), // Agrega un identificador único
            patient: formData.patient,
            date: formData.date,
            medications: formData.medications,
            dosage: formData.dosage,
            observations: formData.observations || ""
        };

        setData((prevData) => [...prevData, newData]); // Agregar nueva receta al estado

        try {
            // await sendData(newData); // Enviar la receta al backend
            reset();
        } catch (error) {
            console.error("Error al guardar la receta", error);
        }
    };


    useEffect(() => {
        console.log("Datos almacenados:", data);
    }, [data]);

    return (
        <Container fluid className="mt-3">
            <h4 className="text-center mb-3">Registrar Receta Médica</h4>
            <Form
                onSubmit={handleSubmit(onSubmit)}
                className="p-3 border rounded shadow-sm"
                style={{ maxWidth: '100%', margin: '0 auto' }}
            >
                <Row className="mb-2">
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Paciente</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nombre del paciente"
                                {...register("patient", { required: "El nombre es obligatorio" })}
                            />
                            {errors.patient && <p className="text-danger small">{errors.patient.message}</p>}
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Fecha y Hora</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                {...register("date", { required: "La fecha es obligatoria" })}
                                defaultValue={currentDateTime}
                                disabled
                                readOnly
                            />
                            {errors.date && <p className="text-danger small">{errors.date.message}</p>}
                        </Form.Group>
                    </Col>

                </Row>

                <Form.Group className="mb-2">
                    <Form.Label>Medicamentos</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={2}
                        placeholder="Ejemplo: Paracetamol 500mg"
                        {...register("medications", { required: "Debe ingresar al menos un medicamento" })}
                    />
                    {errors.medications && <p className="text-danger small">{errors.medications.message}</p>}
                </Form.Group>

                <Form.Group className="mb-2">
                    <Form.Label>Dosis</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Ejemplo: 1 tableta cada 8 horas"
                        {...register("dosage", { required: "La dosis es obligatoria" })}
                    />
                    {errors.dosage && <p className="text-danger small">{errors.dosage.message}</p>}
                </Form.Group>

                <Form.Group className="mb-2">
                    <Form.Label>Observaciones</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={1}
                        placeholder="Notas adicionales (opcional)"
                        {...register("observations")}
                    />
                </Form.Group>

                <div className="text-center">
                    <Button variant="primary" type="submit">
                        Agregar medicamento
                    </Button>
                </div>
            </Form>
        </Container>
    );
};

export default PrescriptionForm;
