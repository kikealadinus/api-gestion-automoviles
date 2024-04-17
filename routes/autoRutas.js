const express = require('express');
const rutas = express.Router();
const AutoModel = require('../models/auto');

//LISTAR AUTOMOVILES
rutas.get('/', async (req, res) => {
    try {
        const autos = await AutoModel.find();
        //console.log(autos);
        res.json(autos);
    } 
    catch (error) {
        console.error("Error al listar autos:", error); // Agrega un registro de error para ayudar con la depuración
        res.status(500).json({ mensaje: "Error interno del servidor" }); // Utiliza un código de estado 500 para errores internos
    }
});
//AGREGAR AUTOMOVILES
rutas.post('/agregar', async (req, res) => {
    const nuevoAuto = new AutoModel({
        marca: req.body.marca,
        modelo: req.body.modelo,
        año: req.body.año,
        color: req.body.color,
        tipocombustible: req.body.tipocombustible,
        capacidad: req.body.capacidad,
        numeropuertas: req.body.numeropuertas,
        transmision: req.body.transmision,
        precio: req.body.precio,
        precioventa: req.body.precioventa,
        disponibilidad: req.body.disponibilidad,
        descripcion: req.body.descripcion,
        prioridad: req.body.prioridad
    });
    try {
        const guardarAuto = await nuevoAuto.save();
        res.status(201).json(guardarAuto);
    } 
    catch (error) {
        res.status(404).json({mensaje: error.mensaje});
    }
});
//EDITAR AUTOMOVILES
rutas.put('/editar/:id', async (req, res) => {    
    try {
        const actualizarAuto = await AutoModel.findByIdAndUpdate(req.params.id, req.body, {new:true});
        res.status(201).json(actualizarAuto);
    } 
    catch (error) {
        res.status(404).json({mensaje: error.mensaje});
    }
});
//ELIMINAR AUTOMOVILES
rutas.delete('/eliminar/:id', async (req, res) => {    
    try {
        const eliminarAuto = await AutoModel.findByIdAndDelete(req.params.id);
        res.json({mensaje: 'Datos del auto eliminados correctamente'});
    } 
    catch (error) {
        res.status(404).json({mensaje: error.mensaje});
    }
});


/*====== CONSULTAS AVANZADAS ====== */
//1. LISTAR TODOS LOS AUTOS POR MARCA O DISPONIBILIDAD
rutas.get('/autos-marca/:marca', async (req, res) => {
    try {
        const autosPorMarca = await AutoModel.find({ marca: req.params.marca });   
        if (autosPorMarca.length === 0) {
            return res.status(404).json({ mensaje: 'No se encontraron autos de la marca especificada' });
        }     
        res.json(autosPorMarca);
    } catch (error) {
        res.status(404).json({mensaje: error.mensaje});
    }
});

//2. ORDENAR LOS AUTOS POR PRECIO DE FORMA ASCENDENTE (descendente mayor a menor)
rutas.get('/ordenar-autos-precio', async (req, res) => {
    try {
        const autosOrdenados = await AutoModel.find().sort({ precio: -1 });
        res.json(autosOrdenados);
    } 
    catch (error) {
        console.error("Error al ordenar autos por precio:", error); // Registra el error para ayudar con la depuración
        res.status(500).json({ mensaje: "Error interno del servidor" }); // Utiliza un código de estado 500 para errores internos
    }
});
/* rutas.get('/ordenar-autos', async (req, res) =>{
    try {
        const autosOrdenados = await AutoModel.find().sort({prioridad: 1});
        res.json(autosOrdenados);
    }
    catch(error){
        res.status(404).json({mensaje: error.message});
    }
}); */

//3. CONSULTAR LOS AUTO ESPECIFICAMENTE POR DISPONIBILIDAD (vendido, reservado, disponible)
rutas.get('/autos-disponibilidad/:estado', async (req, res) => {
    // Lista de valores válidos para la disponibilidad
    const validarDisponibilidad = ["Vendido", "Reservado", "Disponible"];
    try {
        const estado = req.params.estado;        
        // Verificamos si el valor de disponibilidad ingresado es válido
        if (!validarDisponibilidad.includes(estado)) {
            return res.status(400).json({ mensaje: 'El estado de disponibilidad ingresado no es válido' });
        }
        // Consultar los autos por la disponibilidad especificada
        const autosPorDisponibilidad = await AutoModel.find({ disponibilidad: estado });

        // Verificar si se encontraron autos con la disponibilidad especificada
        if (autosPorDisponibilidad.length === 0) {
            return res.status(404).json({ mensaje: 'No se encontraron autos con la disponibilidad especificada' });
        }
        // Enviar la lista de autos encontrados
        res.json(autosPorDisponibilidad);
    } 
    catch (error) {
        console.error("Error al listar autos por disponibilidad:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
});

//4. ELIMINAR TODOS LOS AUTOS CON LA DISPONIBILIDAD (RESERVADO)
rutas.delete('/eliminar-disponibilidad/:estado', async (req, res) => {
    try {        
        const resultado = await AutoModel.deleteMany({ disponibilidad: req.params.estado });
        if (resultado.deletedCount === 0) {
            return res.status(404).json({ mensaje: 'No se encontraron autos con la disponibilidad especificada' });
        }
        res.json({ mensaje: 'Todos los autos con la disponibilidad especificada han sido eliminados' });    
    } 
    catch (error) {
        console.error("Error al eliminar autos por disponibilidad:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
});

//Realizar la suma total del PRECIOVENTA
rutas.get('/suma-precioventa', async (req, res) => {
    try {
        const sumaPrecioVenta = await AutoModel.aggregate([ // Utiliza el método aggregate de Mongoose para realizar operaciones de agregación en la colección
            { $match: { disponibilidad: "Vendido" } }, // Fase de agregación: Filtra los documentos cuya disponibilidad sea "Vendido"
            { $group: { _id: null, total: { $sum: "$precioventa" } } } // Fase de agregación: Agrupa los documentos y calcula la suma del campo "precioventa"
        ]);
        if (sumaPrecioVenta.length === 0) { // Verifica si no se encontraron documentos que coincidan con la disponibilidad "Vendido"
            return res.status(404).json({ mensaje: 'No se encontraron autos vendidos' }); // Devuelve un mensaje de error si no se encontraron autos vendidos
        }
        res.json({ totalPrecioVenta: sumaPrecioVenta[0].total }); // Devuelve la suma total del precio de venta de los autos vendidos en formato JSON
    } 
    catch (error) { // Manejo de errores en caso de que ocurra alguna excepción durante la ejecución
        console.error("Error al calcular la suma del precio de venta de los autos vendidos:", error); // Registra el error en la consola
        res.status(500).json({ mensaje: "Error interno del servidor" }); // Devuelve un mensaje de error interno del servidor si ocurre una excepción
    }
});

module.exports = rutas;