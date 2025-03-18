'use scrit'

const express = require('express');
const bodyParser = require ('body-parser');

const app = express();

// 

//cargar rutas
const user_routes = require('./routes/user');
const follow_router = require('./routes/follow');
const publication_routes = require('./routes/publications');
const message_routes = require('./routes/message');

//cors configurar cabeceras http
app.use((req, resp, next) => {
    resp.header('Access-Control-Allow-Origin', '*');
    resp.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    resp.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    resp.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    
    next();
});

// middlewares
    app.use(bodyParser.urlencoded({extended:false}));
    app.use(bodyParser.json());

// rutas
app.use('/api', user_routes);
app.use('/api', follow_router);
app.use('/api', publication_routes);
app.use('/api', message_routes);


//Exportar
module.exports = app;