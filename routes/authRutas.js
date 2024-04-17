const express = require('express');
const rutas = express.Router();
const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// registrar usuarios 
rutas.post('/registro', async (req, res) =>{
    try {
        const {nombreusuario, correo, contrasena} = req.body;
        const usuario = new Usuario ({nombreusuario, correo, contrasena});
        await usuario.save();
        res.status(201).json({mensaje: 'Usuario registrado exitosamente'});
    }
    catch(error){
        res.status(404).json({mensaje: error.message});
    }
});

// iniciar sesion
rutas.post('/login', async (req, res) =>{
    try {
        const {correo, contrasena} = req.body;
        const usuario = await Usuario.findOne({ correo });
        //encontrar al usuario
        if (!usuario){
            res.status(401).json({mensaje: 'Usuario no encotrado. Credencial incorrecto'});
        }
        //Comparar contrasena 
        const validarContrasena = await usuario.comparePassword(contrasena);
        if (!validarContrasena){
            res.status(401).json({mensaje: 'Credencial incorrecto. Vuelva a intentarlo'});
        }
        const token = jwt.sign( { userId: usuario._id }, 'clave_secreta_servidor',{expiresIn: '1h'});
        res.json(token);
    }
    catch(error){
        res.status(404).json({mensaje: error.message});
    }
});

// Array para almacenar tokens revocados
const tokenBlacklist = [];

// Función para agregar un token a la lista negra
function addToBlacklist(token) {
    tokenBlacklist.push(token);
}

// cerrar sesion
rutas.post('/logout', async (req, res) => {
    try {
        // Paso 1: Invalidar el token actual del usuario
        const token = req.headers.authorization.split(' ')[1]; // Obtener el token del encabezado Authorization
        addToBlacklist(token); // Agregar el token a la lista negra

        // Paso 2: Responder con un mensaje de éxito
        res.status(200).json({ mensaje: "Sesión cerrada exitosamente" });
    } 
    catch (error) {
        res.status(500).json({ mensaje: "Error al cerrar sesión", error: error.message });
    }
});

// Middleware para verificar si el token está en la lista negra
function checkBlacklist(req, res, next) {
    const token = req.headers.authorization.split(' ')[1]; // Obtener el token del encabezado Authorization
    if (tokenBlacklist.includes(token)) {
        return res.status(401).json({ mensaje: "El token no es válido" });
    }
    next(); // Continuar con la solicitud si el token no está en la lista negra
}

// Middleware de autenticación protegida
function protectedRoute(req, res, next) {
    // Verificar si el token es válido
    jwt.verify(token, 'clave_secreta_servidor', (err, decoded) => {
        if (err) {
            return res.status(401).json({ mensaje: "Token no válido" });
        }
        req.userId = decoded.userId; // Agregar el ID de usuario decodificado al objeto de solicitud
        next(); // Continuar con la solicitud si el token es válido
    });
}

module.exports = { rutas, checkBlacklist, protectedRoute };
module.exports = rutas;