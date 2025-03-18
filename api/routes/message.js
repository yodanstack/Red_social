'use strict'

const express = require('express');
const MessageControler = require('../controllers/messages');
const api = express.Router();
const md_auth = require('../middlewares/authenticated');

api.post('/message', md_auth.ensureAuth, MessageControler.saveMessage);
api.get('/myMessages/:page?', md_auth.ensureAuth, MessageControler.getReceiverMessage);
api.get('/messages/:page?', md_auth.ensureAuth, MessageControler.getEmmiterMessage);
api.get('unviewed/messages', md_auth.ensureAuth, MessageControler.getUnviewedMessage);
api.get('/set-viewed-message/', md_auth.ensureAuth, MessageControler.setViewedMessage);

module.exports = api;