'use scrit'

const express = require('express');
const bodyParser = require ('body-parser')

const app = express();

// 

//

// middlewares
    app.use(bodyParser.urlencoded({extended:false}));
    app.use(bodyParser.json());

// rutas
app.get('/',(req, resp) => {
    resp.status(200).send({
        message: '........'
    });
});


app.get('/pruebas',(req, resp) => {
    resp.status(200).send({
        message: 'accion de pruebas en el servidor de nodeJs'
    });
});

//Exportar
module.exports = app;