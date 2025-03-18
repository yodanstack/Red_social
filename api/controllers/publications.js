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

function deletePublication(req, resp) {
    const publicacionId = req.params.id;

    publication.find({user: req.user.sub, '_id': publicacionId}).remove(err => {
        if(err) return resp.status(500).send({message: 'Error al borrar publicacion'});

        if(!Publication) return resp.status(404).send({
            message: 'error al borrar la publicacion'
        });
       return resp.tatus(200).send({message: 'Publicacion Eliminada'});
    });
}

    function uploadImage(req, resp) {
        const publicationId = req.params.id;

            if(req.files){
                const filePath = req.files.image.path;
                const file_split = filePath.split('\\');
                // obtiene el nombre de la imagen
                const file_name = file_split[2]; 
                // devolver la extencion de la imagen ingresada
                const ext_split = file_name.split('\.');
                //arroja unicamente la extencion de la imagen
                const file_ext = ext_split[1];
            
                if(file_ext === 'png' || file_ext === 'jpg' ||
                   file_ext === 'jpeg' || file_ext === 'gif'){

                    publication.findOne({'user': req.user.sub, '_id': publicationId}).exec((err, publication)=>{
                        if(publication){
                            //actualizar documento de usuario 
                            publication.findByIdAndUpdate(publicationId, {file: file_name},{new: true}, (err, publicationUpdate)=> {
                                if(err){
                                    return resp.status(500).send({message: 'error en la peticion'});
                                }
                               if(!publicationUpdate) return resp.status(404).send({
                                message: 'No se ha podido actualizar el usuario'
                               });
                               return resp.status(200).send({publication: publicationUpdate});
                            });
        
                        }else{
                            return removeFilesOfLoads(resp ,file_path, 'No tienes permisos para actualizar esta publicacion');
                        }
                    });

                }else{
                    return removeFilesOfLoads(resp ,file_path, 'Extension no valida');
                }

        }else{
            return resp.status(200).send({message: 'No se han subido imagenes'});
        }
    }
 
    function removeFilesOfLoads(resp ,file_path, message){
        fs.unlink(file_path, (err)=> {
            if(err) return resp.status(200).send({
                message: message
            });
        });        
    }
    
    function getImageFile(req, resp){
        const image_file = req.params.imageFile;
        const path_file =  './uploads/publications/' + image_file;

        fs.exists(path_file, (exist) => {
            if(exist) {
                resp.sendFile(path.resolve(path_file));
            }else{
                resp.status(200).send({message: 'no existe la imagen'});
            }

        })
    }


module.exports = {
    savePublication,
    getPublications,
    getPublication,
    deletePublication,
    uploadImage,
    getImageFile
}