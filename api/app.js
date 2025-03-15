'use scrit'

const express = require('express');
const bodyParser = require ('body-parser')

const app = express();

// 

//cargar rutas
const user_routes = require('./routes/user');
// middlewares
    app.use(bodyParser.urlencoded({extended:false}));
    app.use(bodyParser.json());

// rutas
app.use('/api', user_routes);

//Exportar
module.exports = app;