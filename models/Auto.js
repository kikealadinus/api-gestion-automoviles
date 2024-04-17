const mongoose = require('mongoose');

const autoSchema = new mongoose.Schema({
    marca: String,
    modelo: String,
    año: String,
    color: String,
    tipocombustible: String,
    capacidad: String,
    numeropuertas: String,
    transmision: String,
    precio: String,
    precioventa: Number,
    disponibilidad: String,
    descripcion: String,
    prioridad: Number,
})

const AutoModel = mongoose.model('Auto', autoSchema, 'autos');
module.exports = AutoModel;