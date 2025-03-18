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

module.exports = api;