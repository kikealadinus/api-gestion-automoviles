const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Usuario = require('./models/Usuario');

require('dotenv').config();

//IMPORTAR RUTAS
const authRutas = require("./routes/authRutas");
const autosRutas = require('./routes/autoRutas');

//CONFIGURACIONES
const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGO_URL;

//CONFIURAR EXPRESS PARA JSON
app.use(express.json());

// CONEXIION A MONGODB
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log("conexion exitosa con MONGODB");
        app.listen(PORT, () => { console.log(`Servidor funcionando en el puerto: ${PORT}`) });
    })

    .catch((error) => console.log("Error de conexion con MONGODB", error));

const autenticar = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ mensaje: "No existe el token de autenticacion" }); // Agrega "return" aquí
        }
        const decodificar = jwt.verify(token, "clave_secreta_servidor");
        req.usuario = await Usuario.findById(decodificar.userId);
        next();
    } catch (error) {
        console.error("Error de autenticación:", error); // Agrega un registro de error para ayudar con la depuración
        return res.status(500).json({ mensaje: "Error interno del servidor" }); // Utiliza un código de estado 500 para errores internos
    }
};

/* const autenticar = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        //console.log(token);
        if (!token) {
        res.status(401).json({ mensaje: "No existe el token de autenticacion" });
        }
        const decodificar = jwt.verify(token, "clave_secreta_servidor");
        req.usuario = await Usuario.findById(decodificar.userId);
        next();
    } catch (error) {
        res.status(404).json({ mensaje: error.message });
    }
}; */

app.use('/auth', authRutas);
app.use('/ruta-auto', autenticar, autosRutas);
/* app.use('/ruta-auto', autosRutas); */