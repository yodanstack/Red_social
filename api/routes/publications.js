'use strict'

const express = require('express');
const api = express.Router();

const PublicationControler = require('../controllers/publications');
const md_auth = require('../middlewares/authenticated');

const multyPart = require('connect-multiparty');
const md_upload = multyPart({md_uploadDir: './uploads/publications'});

api.post('./name', md_auth.ensureAuth, PublicationControler.savePublication);
api.get('/publication/:page?', md_auth.ensureAuth, PublicationControler.getPublications);
api.get('/publication/:id', md_auth.ensureAuth, PublicationControler.getPublication)
api.delete('./publication/:id', md_auth.ensureAuth, PublicationControler.deletePublication);
api.post('/upload-image-publication/:id', [md_auth.ensureAuth, md_upload], PublicationControler.uploadImage);
api.get('/get-image-pub/:imageFile' ,  md_auth.ensureAuth, PublicationControler.getImageFile);  

module.exports = api;