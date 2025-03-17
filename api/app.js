'use scrit'

const express = require('express');
const bodyParser = require ('body-parser')

const app = express();

// 

//cargar rutas
const user_routes = require('./routes/user');
const follow_router = require('./routes/follow');
const api = require('./routes/user');
// middlewares
    app.use(bodyParser.urlencoded({extended:false}));
    app.use(bodyParser.json());

// rutas
app.use('/api', user_routes);
app.use('/api', follow_router)

//Exportar
module.exports = app;