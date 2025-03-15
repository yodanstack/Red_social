'use strict'

const express = require('express');
const userController = require('../controllers/user');
const md_auth = require('../middlewares/authenticated');

const api = express.Router();

api.get('/home', userController.home);
api.get('/pruebas', md_auth.ensureAuth, userController.pruebas);
api.post('/register', userController.saveUser);
api.post('/loginUser',userController.loginUser);


module.exports = api;