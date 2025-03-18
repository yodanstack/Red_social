'use strict'

const moment = require('moment');
const mongoosePagination = require('mongoose-paginate-v2');
const user = require('../models/user');
const follow = require('../models/follows');
const Message = require('../models/messages');
const messages = require('../models/messages');


function saveMessage(req, resp) {
    const params = req.body;

    if(!params.text || !params.receiver){
        return resp.status(200).send({message: 'Envia los datos'});
    }
    const message = new Message();
    message.emmiter = req.user.sub;
    message.receiver = req.params.receiver;
    message.text = params.text;
    message.created_at = moment.unix();
    message.viewed = false;
    
    message.save((err, messageStored) => {
      if(err) return resp.status(500).send({message: 'error en la peticion'});

      if(!messageStored) return resp.status(500).send({message: 'error al enviar el mensaje'});

      return resp.status(200).send({message: messageStored});
    });
}

function getReceiverMessage(req, resp){
    const userId = req.user.sub;
    const page = 1;

    if(req.params.page){
        page = req.params.page;
    }
    const itemsPerPage = 4;

    Message.find({receiver: userId}).populate('emmiter', 'name surname _id image nick').paginate(page, itemsPerPage, (err, messages, total) => {
        if(err) return resp.status(500).send({message: 'error en la peticion'});

        if(!messages) return resp.status(404).send({message: 'No hay mensajes'});

        return resp.status(200).send({
            total: total,
            page: Math.ceil(total/itemsPerPage),
            messages
        });
    });
}


function getEmmiterMessage(req, resp){
    const userId = req.user.sub;
    const page = 1;

    if(req.params.page){
        page = req.params.page;
    }
    const itemsPerPage = 4;

    Message.find({emmiter: userId}).populate('emmiter receiver', 'name surname _id image nick').paginate(page, itemsPerPage, (err, messages, total) => {
        if(err) return resp.status(500).send({message: 'error en la peticion'});

        if(!messages) return resp.status(404).send({message: 'No hay mensajes'});

        return resp.status(200).send({
            total: total,
            page: Math.ceil(total/itemsPerPage),
            messages
        });
    });
}

function getUnviewedMessage(req, resp) {
    const userId = req.user.sub;

    Message.count({receiver: userId, viewed:'false'}).exec((err, count) => {
        if(err) return resp.status(500).send({message: 'error en la peticion'});
        
        return resp.status(200).send({
            'unviewed':count
        });
    });
}

function setViewedMessage(req, resp) {
    const userId = req.user.sub;

    Message.update({receiver: userId, viewed: false}, {viewed: 'true'}, {"multi":true}, (err, messageUpdate) => {
        if(err) return resp.status(500).send({message: 'error en la peticion'});
        
        return resp.status(200).send({messages: messageUpdate});
    });
}

module.exports = {
    saveMessage,
    getReceiverMessage,
    getEmmiterMessage,
    getUnviewedMessage,
    setViewedMessage
};