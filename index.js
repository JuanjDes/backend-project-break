/*
    Archivo principal que iniciará el servidor Express. Importa las rutas y las usa.
    También tiene que estar configurado para servir archivos estáticos y para leer el body de las peticiones de formularios.

    tema de rutas con archivos dentro de public, revisar challenges resueltos en clase (Github) -> extra -> firebase
*/

const express = require('express');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware: parse JSON y urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde la carpeta public
app.use(express.static('public'));

// Routes
app.use('/', productRoutes);


// Iniciando el servidor en el puerto especificado por el entorno o en el puerto 3000 por defecto
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});