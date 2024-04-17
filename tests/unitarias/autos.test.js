const express = require('express');
const request = require('supertest');
const autoRutas = require('../../routes/autoRutas');
const AutoModel = require('../../models/auto');
const mongoose = require('mongoose');

const app = express();
//CONFIGURAR EXPRESS PARA JSON 
app.use(express.json());
app.use('/ruta-auto', autoRutas);

/* // describe(name, fn)
describe('Pruebas unitarias para las rutas de autos', () => {
    beforeEach(async () => {
        // conectar antes de hacer pruebas
        await mongoose.connect('mongodb://localhost:27017/automoviles');
        await AutoModel.deleteMany({});
    });
    afterAll( () => {
        // desconectar despues de hacer pruebas
        return mongoose.connection.close();
    });

    // 1. TRAER TODAS LOS AUTOS
    test('Debería devolver todos los autos al hacer un GET a /ruta-auto', async () => {
        //crear autos        
        await AutoModel.create({ 
            marca: "BMW",
            modelo: "X4",
            año: "2024",
            color: "Plomo",
            tipocombustible: "Gasolina",
            capacidad: "5 personas",
            numeropuertas: "4 puertas",
            transmision: "Caja Mecánica",
            precio: "$ 30.000",
            precioventa: 0,
            disponibilidad: "Reservado",
            descripcion: "BMW X4 ofrece un diseño más avanzado que nunca",
            prioridad: 2
        });
        await AutoModel.create({ 
            marca: "Toyota", 
            modelo: "Rush",
            año: "2024",
            color: "Blanco",
            tipocombustible: "Gasolina",
            capacidad: "Para 7 personas",
            numeropuertas: "5 puertas",
            transmision: "Caja automática",
            precio: "$ 30.000",
            precioventa: 0,
            disponibilidad: "Disponible",
            descripcion: "La fuerza y estabilidad que aporta la plataforma de motor delantero y tracción trasera, trasmiten una gran confianza",
            prioridad: 1            
        });
        const res = await request(app).get('/ruta-auto');
        //validar las respuestas
        expect(res.statusCode).toEqual(200);//passssoo
        expect(res.body).toHaveLength(2)// paso
    });

    // 2. Agregar Autos
    test('Debería agregar el nuevo dato del auto', async () => {
        const nuevoAuto = {
            marca: "Nissan", 
            modelo: "Frontier SE",
            año: "2023",
            color: "Negro",
            tipocombustible: "Diesel",
            capacidad: "Para 5 personas",
            numeropuertas: "4 puertas",
            transmision: "Caja mecánica, doble tracción",
            precio: "$ 31.990",
            precioventa: 30990,
            disponibilidad: "Vendido",
            descripcion: "Potente motor con hasta 162 caballos de fuerza y 238 Nm de torque",
            prioridad: 1
        }
        const res = await request(app)
            .post('/ruta-auto/agregar')
            .send(nuevoAuto);
            
        expect(res.statusCode).toEqual(201);//passssoo
        expect(res.body.marca).toEqual(nuevoAuto.marca);// paso
        expect(res.body.modelo).toEqual(nuevoAuto.modelo);// paso
        expect(res.body.año).toEqual(nuevoAuto.año);// paso
        expect(res.body.color).toEqual(nuevoAuto.color);// paso
        expect(res.body.tipocombustible).toEqual(nuevoAuto.tipocombustible);// paso
        expect(res.body.capacidad).toEqual(nuevoAuto.capacidad);// paso
        expect(res.body.numeropuertas).toEqual(nuevoAuto.numeropuertas);// paso
        expect(res.body.transmision).toEqual(nuevoAuto.transmision);// paso
        expect(res.body.precio).toEqual(nuevoAuto.precio);// paso
        expect(res.body.precioventa).toEqual(nuevoAuto.precioventa);// paso
        expect(res.body.disponibilidad).toEqual(nuevoAuto.disponibilidad);// paso
        expect(res.body.descripcion).toEqual(nuevoAuto.descripcion);// paso
        expect(res.body.prioridad).toEqual(nuevoAuto.prioridad);// paso
    });

    // 3. Editar auto
    test('Prueba unitaria para editar un Auto', async () => {
        await AutoModel.create({
            marca: "BMW",
            modelo: "X4",
            año: "2024",
            color: "Plomo",
            tipocombustible: "Gasolina",
            capacidad: "5 personas",
            numeropuertas: "4 puertas",
            transmision: "Caja Mecánica",
            precio: "$ 30.000",
            precioventa: 0,
            disponibilidad: "Reservado",
            descripcion: "BMW X4 ofrece un diseño más avanzado que nunca",
            prioridad: 3
        });
        await AutoModel.create({ 
            marca: "Toyota", 
            modelo: "Rush",
            año: "2024",
            color: "Blanco",
            tipocombustible: "Gasolina",
            capacidad: "Para 7 personas",
            numeropuertas: "5 puertas",
            transmision: "Caja automática",
            precio: "$ 30.000",
            precioventa: 0,
            disponibilidad: "Disponible",
            descripcion: "La fuerza y estabilidad que aporta la plataforma de motor delantero y tracción trasera, trasmiten una gran confianza",
            prioridad: 1            
        });
        await AutoModel.create({
            marca: "Nissan", 
            modelo: "Frontier SE",
            año: "2023",
            color: "Negro",
            tipocombustible: "Diesel",
            capacidad: "Para 5 personas",
            numeropuertas: "4 puertas",
            transmision: "Caja mecánica, doble tracción",
            precio: "$ 31.990",
            precioventa: 30990,
            disponibilidad: "Vendido",
            descripcion: "Potente motor con hasta 162 caballos de fuerza y 238 Nm de torque",
            prioridad: 2
        });

        const autoEncontrado2 = await AutoModel.exists({ marca: 'Toyota' });
        console.log(autoEncontrado2);
            // POSTMAN -objeto
        const autoeditado = {
            marca: "Toyota (EDITADO)", 
            modelo: "Rush (EDITADO)",
            año: "2024 (EDITADO)",
            color: "Blanco (EDITADO)",
            tipocombustible: "Gasolina (EDITADO)",
            capacidad: "Para 7 personas (EDITADO)",
            numeropuertas: "5 puertas (EDITADO)",
            transmision: "Caja automática (EDITADO)",
            precio: "$ 30.000 (EDITADO)",
            precioventa: 29000,
            disponibilidad: "Disponible (EDITADO)",
            descripcion: "EDITADO",
            prioridad: 10  
        };
        console.log("auto editado", autoeditado);

        const res = await request(app)
            .put(`/ruta-auto/editar/${autoEncontrado2._id}`)
            .send(autoeditado);
        expect(res.statusCode).toEqual(201);
        expect(res.body.marca).toEqual(autoeditado.marca);
        expect(res.body.modelo).toEqual(autoeditado.modelo);
        expect(res.body.año).toEqual(autoeditado.año);
        expect(res.body.color).toEqual(autoeditado.color);
        expect(res.body.tipocombustible).toEqual(autoeditado.tipocombustible);
        expect(res.body.capacidad).toEqual(autoeditado.capacidad);
        expect(res.body.numeropuertas).toEqual(autoeditado.numeropuertas);
        expect(res.body.transmision).toEqual(autoeditado.transmision);
        expect(res.body.precio).toEqual(autoeditado.precio);
        expect(res.body.precioventa).toEqual(autoeditado.precioventa);
        expect(res.body.disponibilidad).toEqual(autoeditado.disponibilidad);
        expect(res.body.descripcion).toEqual(autoeditado.descripcion);        
    });

    // 4. Eliminar Auto
    test('Eliminar Auto prueba unitaria', async () => {
        const autoNuevo = await AutoModel.create({
            marca: "BMW (NUEVO)",
            modelo: "X4 (NUEVO)",
            año: "2024 (NUEVO)",
            color: "Plomo (NUEVO)",
            tipocombustible: "Gasolina (NUEVO)",
            capacidad: "5 personas (NUEVO)",
            numeropuertas: "4 puertas (NUEVO)",
            transmision: "Caja Mecánica (NUEVO)",  
            precio: "$ 30.000 (NUEVO)",
            precioventa: 29000,          
            disponibilidad: "Reservado (NUEVO)",
            descripcion: "(NUEVO)",
            prioridad: 1
        });
        
        const res = await request(app)
            .delete(`/ruta-auto/eliminar/${autoNuevo._id}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({mensaje: 'Datos del auto eliminados correctamente'});
    });

    // 3. ORDENAR LOS AUTOS POR PRIORIDAD DE FORMA ASCENDENTE
    test('Devolver los autos ordenados por prioridad', async () => {
        await AutoModel.create({
            marca: "BMW",
            modelo: "X4",
            año: "2024",
            color: "Plomo",
            tipocombustible: "Gasolina",
            capacidad: "5 personas",
            numeropuertas: "4 puertas",
            transmision: "Caja Mecánica", 
            precio: "$ 30.000",
            precioventa: 29000,            
            disponibilidad: "Vendido",
            descripcion: "BMW X4 ofrece un diseño más avanzado que nunca",
            prioridad: 3
        });
        await AutoModel.create({
            marca: "Toyota", 
            modelo: "Rush",
            año: "2024",
            color: "Blanco",
            tipocombustible: "Gasolina",
            capacidad: "Para 7 personas",
            numeropuertas: "5 puertas",
            transmision: "Caja automática",  
            precio: "$ 30.000",
            precioventa: 29000,           
            disponibilidad: "Vendido",
            descripcion: "La fuerza y estabilidad que aporta la plataforma de motor delantero y tracción trasera, trasmiten una gran confianza",
            prioridad: 1   
        });
        await AutoModel.create({
            marca: "Nissan", 
            modelo: "Frontier SE",
            año: "2023",
            color: "Negro",
            tipocombustible: "Diesel",
            capacidad: "Para 5 personas",
            numeropuertas: "4 puertas",
            transmision: "Caja mecánica, doble tracción", 
            precio: "$ 29.000",
            precioventa: 29000,            
            disponibilidad: "Vendido",
            descripcion: "Potente motor con hasta 162 caballos de fuerza y 238 Nm de torque",
            prioridad: 2
        });
        const res = await request(app).get('/ruta-auto/ordenar-autos');
        expect(res.statusCode).toEqual(200);

        expect(res.body[0].prioridad).toEqual(1);
        expect(res.body[1].prioridad).toEqual(2);
        expect(res.body[2].prioridad).toEqual(3);
    });   
}); */
// describe(name, fn)
describe('Pruebas unitarias para las rutas de autos', () => {
    beforeEach(async () => {
        await mongoose.connect('mongodb://localhost:27017/automoviles');
        await AutoModel.deleteMany({});
    });
    afterAll( () => {
        return mongoose.connection.close();
    });
    // 1. TRAER TODAS LOS AUTOS POR MARCA
    test('Debería devolver los autos Marca TOYOTA al hacer un GET a /ruta-auto', async () => {
        await AutoModel.create({
            marca: 'Toyota', 
            modelo: 'Corolla', 
            año: '2021', 
            color: "blanco",
            capacidad: "Para 5 personas",
            transmision: "Caja mecánica",
            precio: "$15000",
            disponibilidad: 'Disponible', 
            prioridad: 2
        });
        await AutoModel.create({
            marca: 'Toyota', 
            modelo: 'Camry', 
            año: '2022', 
            color: "Negro",
            capacidad: "Para 4 personas",
            transmision: "Caja automática",
            precio: "$20000",
            disponibilidad: 'Vendido',
            prioridad: 1
        });
        await AutoModel.create({
            marca: 'Honda', 
            modelo: 'Civic', 
            año: '2020', 
            color: "Plateado",
            capacidad: "Para 5 personas",
            transmision: "Caja mecánica, doble tracción",
            precio: "$19000",
            disponibilidad: 'Disponible',
            prioridad:3 
        });
        // Realizamos una solicitud GET para obtener todos los autos de la marca "Toyota"
        const res = await request(app).get('/ruta-auto');
        //validar las respuestas
        expect(res.statusCode).toEqual(200);//passssoo
        expect(res.body).toHaveLength(3)// paso
    });

    // 2. ORDENAR LOS AUTOS POR PRECIO EN FORMA DESCENDENTE DE MAYOR A MENOR 
    test('Debería ordenar los autos por precio en forma descendente', async () => {
        await AutoModel.create({
            marca: 'Toyota', 
            modelo: 'Corolla', 
            año: '2021', 
            color: "blanco",
            capacidad: "Para 5 personas",
            transmision: "Caja mecánica",
            precio: "$25000",
            prioridad: 2
        });
        await AutoModel.create({
            marca: 'Honda', 
            modelo: 'Civic', 
            año: '2022', 
            color: "Plateado",
            capacidad: "Para 5 personas",
            transmision: "Caja mecánica, doble tracción",
            precio: "$30000",
            prioridad: 1
        });
        await AutoModel.create({
            marca: 'Ford', 
            modelo: 'Focus', 
            año: '2020',
            color: "Rojo",
            capacidad: "Para 5 personas",
            transmision: "Caja mecánica, doble tracción", 
            precio: "$20000",
            prioridad: 3
        });
        const res = await request(app).get('/ruta-auto/ordenar-autos-precio');
        expect(res.statusCode).toEqual(200);//passssoo
        expect(res.body[0].precio).toEqual("$30000");
        expect(res.body[1].precio).toEqual("$25000");    
        expect(res.body[2].precio).toEqual("$20000");
    });

    //3. CONSULTAR LOS AUTO ESPECIFICAMENTE POR DISPONIBILIDAD (vendido, reservado, disponible)
    test('Debería devolver los autos según la disponibilidad especificada', async () => {
        // Creamos algunos autos con diferentes estados de disponibilidad
        await AutoModel.create({
            marca: 'Toyota', 
            modelo: 'Corolla', 
            año: '2021', 
            color: "blanco",
            capacidad: "Para 5 personas",
            transmision: "Caja mecánica",
            precio: "$15000",
            disponibilidad: "Vendido",
            prioridad: 2
        });
        await AutoModel.create({
            marca: 'Honda', 
            modelo: 'Civic', 
            año: '2022', 
            color: "Plateado",
            capacidad: "Para 5 personas",
            transmision: "Caja mecánica, doble tracción",
            precio: "$19000",
            disponibilidad: "Reservado",
            prioridad: 1
        });
        await AutoModel.create({
            marca: 'Ford', 
            modelo: 'Focus', 
            año: '2020',
            color: "Rojo",
            capacidad: "Para 5 personas",
            transmision: "Caja mecánica, doble tracción", 
            precio: "$20000", 
            disponibilidad: "Disponible",
            prioridad: 3
        });        
        // Realizamos solicitudes GET para obtener autos según diferentes estados de disponibilidad
        const resVendido = await request(app).get('/ruta-auto/autos-disponibilidad/Vendido');
        const resReservado = await request(app).get('/ruta-auto/autos-disponibilidad/Reservado');
        const resDisponible = await request(app).get('/ruta-auto/autos-disponibilidad/Disponible');
        // Verificamos que las solicitudes se hayan realizado correctamente
        expect(resVendido.statusCode).toEqual(200);
        expect(resReservado.statusCode).toEqual(200);
        expect(resDisponible.statusCode).toEqual(200);
        // Verificamos que se devuelvan los autos correspondientes según el estado de disponibilidad especificado
        expect(resVendido.body.length).toEqual(1); // Solo un auto vendido
        expect(resReservado.body.length).toEqual(1); // Solo un auto reservado
        expect(resDisponible.body.length).toEqual(1); // Solo un auto disponible
    });
    
    //4. ELIMINAR TODOS LOS AUTOS CON LA DISPONIBILIDAD (RESERVADO)
    test('Debería eliminar todos los autos con una disponibilidad específica', async () => {
        // Creamos algunos autos con diferentes estados de disponibilidad
        await AutoModel.create({
            marca: 'Toyota', 
            modelo: 'Corolla', 
            año: '2021', 
            color: "blanco",
            capacidad: "Para 5 personas",
            transmision: "Caja mecánica",
            precio: "$15000",
            disponibilidad: "Vendido",
            prioridad: 2
        });
        await AutoModel.create({
            marca: 'Honda', 
            modelo: 'Civic', 
            año: '2022', 
            color: "Plateado",
            capacidad: "Para 5 personas",
            transmision: "Caja mecánica, doble tracción",
            precio: "$19000",
            disponibilidad: "Reservado",
            prioridad: 1
        });
        await AutoModel.create({
            marca: 'Ford', 
            modelo: 'Focus', 
            año: '2020', 
            color: "Rojo",
            capacidad: "Para 5 personas",
            transmision: "Caja mecánica, doble tracción", 
            precio: "$20000",
            disponibilidad: "Reservado",
            prioridad: 3
        });        
        // Realizamos una solicitud DELETE para eliminar todos los autos con disponibilidad "Reservado"
        const res = await request(app).delete('/ruta-auto/eliminar-disponibilidad/Reservado');
        // Verificamos que la solicitud se haya realizado correctamente
        expect(res.statusCode).toEqual(200);
        // Verificamos que se haya eliminado correctamente la cantidad esperada de autos
        expect(res.body.mensaje).toEqual('Todos los autos con la disponibilidad especificada han sido eliminados');
        const autos = await AutoModel.find();//buscamos la coleccion en la base de datos
        expect(autos.length).toEqual(1); // Solo debería quedar un auto en la base de datos
    });
    
    //REALIZA LA SUMA TORAL DEL PRECIOVENTA
    test('Debería calcular la suma total del precio de venta de los autos vendidos', async () => {
        // Creamos algunos autos con diferentes precios de venta y disponibilidad
        await AutoModel.create({
            marca: 'Toyota', 
            modelo: 'Corolla', 
            año: '2021', 
            color: "blanco",
            capacidad: "Para 5 personas",
            transmision: "Caja mecánica",
            precio: "$26000",
            precioventa: 25000,
            disponibilidad: "Vendido",
            prioridad: 2
        });
        await AutoModel.create({
            marca: 'Honda', 
            modelo: 'Civic', 
            año: '2022', 
            color: "Plateado",
            capacidad: "Para 5 personas",
            transmision: "Caja mecánica, doble tracción",
            precio: "$30500",
            precioventa: 30000,
            disponibilidad: "Vendido",
            prioridad: 1
        });
        await AutoModel.create({
            marca: 'Ford', 
            modelo: 'Focus', 
            año: '2020',
            color: "Rojo",
            capacidad: "Para 5 personas",
            transmision: "Caja mecánica, doble tracción", 
            precio: "$20500", 
            precioventa: 20000,
            disponibilidad: "Vendido",
            prioridad: 3
        });        
        // Realizamos una solicitud GET para calcular la suma total del precio de venta de los autos vendidos
        const res = await request(app).get('/ruta-auto/suma-precioventa');        
        // Verificamos que la solicitud se haya realizado correctamente
        expect(res.statusCode).toEqual(200);        
        // Verificamos que se haya calculado correctamente la suma total del precio de venta
        expect(res.body.totalPrecioVenta).toEqual(75000); // 25000 + 30000 + 20000
    });    

});