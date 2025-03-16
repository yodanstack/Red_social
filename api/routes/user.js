'use strict'

const express = require('express');
const userController = require('../controllers/user');
const md_auth = require('../middlewares/authenticated');
const multipart = require('connect-multiparty');
const md_upload = multipart({uploadDir: './uploads/users'});

const api = express.Router();

api.get('/home', userController.home);
api.get('/pruebas', md_auth.ensureAuth, userController.pruebas);
api.post('/register', userController.saveUser);
api.post('/loginUser',userController.loginUser);
api.get('/user/:id', md_auth.ensureAuth,userController.getUser);
api.get('/users/:page?', md_auth.ensureAuth, userController.getUsers);
api.put('/update-user/:id', md_auth.ensureAuth, userController.updateUser);
api.post('/upload-image-user/:id' [md_auth.ensureAuth, md_upload], userController.uploadImage);

module.exports = api;