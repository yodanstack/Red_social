'use strict' 

const path = require('path');
const fs = require('fs');
const moment = require('moment');
const mongoosepag = require('mongoose-paginate-v2');

const Publication = require('../models/publication');
const User = require('../models/user');
const Follow = require('../models/follows');
const publication = require('../models/publication');
const { response } = require('../app');


function savePublication(req, resp){
    const params = req.body;

    if(!params.text) return resp.status(200).send({message: 'Debes enviar un texto'}); 
    const publication = new publication();

    publication.text = params.text;
    publication.file = 'null';
    publication.user = req.user.sub;
    publication.created_at = moment().unix();

    publication.save((err, publicationStored) => {
        if(err) return resp.status(500).send({message: 'Error al guardar la publicacion'});

        if(!publicationStored) return resp.status(404).send({message: 'La publicaion no ha sido guardada'});

        return resp.status(200).send({publication: publicationStored}); 

    });
}

function getPublications(req, resp){
    const page = 1;
    if(req.params.page){
        page = req.params.page;
    }
    const itemsPerPAge = 4;

    Follow.find({user: req.user.sub}).populate('followed').exec((err, follows)=> {
        if(err) return resp.status(500).send({message: 'Error al devolver seguimiento'});

        const follows_clean = [];

        Follow.forEach(follow => {
            follows_clean.push(follow.follwed);
            
        });
        publication.find({user:{"$in": follows_clean} }).sort('-created_at').populate('user').paginate(page, itemsPerPAge, (err, publications, total)=> {
            if(err) return resp.status(500).send({message: 'Error al devolver publicaciones'});

            if(!publications) return resp.status(500).send({message: 'No hay publicaciones'});

            return resp.status(200).semd({
                total_items: total,
                pages: Math.ceil(total/itemsPerPAge), 
                publications,

            })

        });
    });
}

function getPublication(req, resp){
    const publicacionId = req.params.id;

    publicacionId.findById(publicacionId, (err, publication)=> {
        if(err) return resp.status(500).send({message: 'Error al devolver seguimiento'});

        if(!Publication) return resp.status(404).send({
            message: 'No existe la publicacion'
        });
       return resp.tatus(200).send({publication});
    });
}


module.exports = {
    savePublication,
    getPublications,
    getPublication
}