const convert_fecha_hora = (fechaStr) => {
    const fecha = new Date(fechaStr);
    if (isNaN(fecha)) {
        throw new Error("El parámetro debe ser una fecha válida en formato ISO.");
    }
    return fecha.toISOString().replace("T", " ").substring(0, 19);
};

const convert_fecha = (fechaStr) => {
    const fecha = new Date(fechaStr);
    if (isNaN(fecha)) {
        throw new Error("El parámetro debe ser una fecha válida en formato ISO.");
    }
    return fecha.toISOString().substring(0, 10);
};

const convert_hora = (fechaStr) => {
    const fecha = new Date(fechaStr);
    if (isNaN(fecha)) {
        throw new Error("El parámetro debe ser una fecha válida en formato ISO.");
    }
    return fecha.toISOString().substring(11, 19);
};

export { convert_fecha_hora, convert_fecha, convert_hora };
