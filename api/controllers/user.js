'user strict'


const bcrypt = require('bcrypt-nodejs');
const mongoosePaginate = require('mongoose-paginate-v2');
const fs = require('fs');
const path = require('path');

const User = require('../models/user');
const jwt = require('../services/jwt');
const user = require('../models/user');
const follows = require('../models/follows');

//meotodos de prueba
function home(req, resp){
    resp.status(200).send({
        message: '........'
    });
};



function pruebas(req, resp) {
    resp.status(200).send({
        message: 'accion de pruebas en el servidor de nodeJs'
    });
};

//registro de usuarios
function saveUser(req, resp){
    const params = req.body;
    const user = new User();

    if(params.name && params.surname && params.nick && params.email && params.password){
        user.name = params.name;
        user.surname = params.surname;
        user.nick = params.nick;
        user.email = params.email;
        user.password = params.password;
        user.role = 'ROLE_USER'
        user.image = null;

        //comprobar y controlar usuarios duplicados
        user.find({ $or:[
           {email: user.email.toLowerCase()},
           {nick: user.nick.toLowerCase()}
        ]}).exec((err, users)=>{
            if(err) return resp.status(500).send({message:'Error en la paticion de usuarios'});

            if(users && users.length >= 1){
                return resp.status(200).send({message:'El usuario que intentas registrar el ya existe'});
            }
        }); 

        //cifrar contraseña
        bcrypt.hash(params.password, null, null, (err, hash) => {
            user.password = hash;

            user.save((err, userStored) => {
                if(err) return resp.status(500).send({
                    message:'Error al guardar el usuario'});
                if(userStored){
                    resp.status(200).send({user: userStored});
                }else{
                    resp.status(404).send({
                        message: 'No se ha registrado el usuario'
                    });
                }
            });
        });

    }else {
        resp.status(200).send({
            message: 'Envia todos los campos necesarios'
        });
    }
}

function loginUser(req, resp){
    
    const params = req.body; 
    
        const email = params.email;
        const password = params.password;
        
        user.findOne({email: emaild}, (err, user) => {
        if(err) resp.status(500).send({message: 'Error en la oeticion'});

        if(user) {
            bcrypt.compare(password, user.password, (err, check) => {
                if(check){
                    //devolver dato de usuario
                    if(params.gettoken){
                        return resp.status(200).send({
                            token: jwt.createToken(user)
                        });
                    }else {
                        
                        user.password = undefined;
                        return resp.status(500).send({user});
                    }

                }else {
                    return resp.status(404).send({message: 'El usuario no se ha podido identificar'});
                }
               
            });
            } else{
                return resp.status(404).send({message: 'El usuario no se ha podido identificar'});
            }
    });
}

//metodo para conseguir datos de un usuario 
    function getUser(req, resp) {
        const userId = req.params.id;

        user.findById(userId, (err, user)=> {
            if(err) return resp.status(500).send({message: 'error en la peticion'});

            if(!user) return resp.status(404).send({message: 'usuario no existe'});
            
             followThisUser(req.user.sub, userId).then((value)=> {
                return resp.status(200).send({user, value});
             })   

            return resp.status(200).send({user, follow});
        });
    }

    async function followThisUser(identityUserId, userId){
        const following = await follows.findOne({"user": identityUserId, "followed": userId}).exec((err, follow) => {
            if(err) return handleError(err);
            return follow;
        });  
         
        const followed = await follows.findOne({"user": userId, "followed": identityUserId}).exec((err, follow) => {
            if(err) return handleError(err);
            return follow;
        });
        return {
            following: following,
            followed: followed
        }
    }

    //devolver usuarios ingresados 
    function getUsers(req, resp){
        const identityUserId = req.user.sub;
        let page = 1;

        if(req.params.page){
            page = req.params.page;
        }
        const itemsPerPage = 5;

        User.find().sort('_id').paginate(page, itemsPerPage, (err, users, total)=> {
         
            if(err){
                return resp.status(500).send({message: 'error en la peticion'});
            }
            if(!user) {
            return resp.status(404).send({message: 'No hay usuarios para monstrar'});
            }
        
            return resp.status(200).send({
                users,
                total,
                page: math.ceil(total/itemsPerPage)
            });
        });

    }

// Edicion de datos de usuario
    function updateUser(req, resp){
        const userId = req.params.id;
        const update = req.body;
        
        //borrar password
        delete update.password;

        if(userId != req.user.sub){
            return resp.status(500).send({
                message: 'no tienes permiso para actualizar datos'
            });
        }
        User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdate)=> {
          
        });
    }

    //subir archivos de imagen / avatar de usuario
    function uploadImage(req, resp) {
        const userId = req.params.id;

        if(userId != req.user.sub){
            return removeFilesOfLoads(resp ,file_path,'No tienes permiso para actualizar los datos del usuario');
            }
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
                    //actualizar documento de usuario 
                    User.findByIdAndUpdate(userId, {image: file_name},{new: true}, (err, userUpdate)=> {
                        if(err){
                            return resp.status(500).send({message: 'error en la peticion'});
                        }
                       if(!userUpdate) return resp.status(404).send({
                        message: 'No se ha podido actualizar el usuario'
                       });
                       return resp.status(200).send({userUpdate});
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
        const path_file =  './uploads/users/' + image_file;

        fs.exists(path_file, (exist) => {
            if(exist) {
                resp.sendFile(path.resolve(path_file));
            }else{
                resp.status(200).send({message: 'no existe la imagen'});
            }

        })
    }
    

module.exports = {
    home,
    pruebas,
    saveUser,
    loginUser,
    getUser,
    getUsers,
    updateUser,
    uploadImage,
    removeFilesOfLoads,
    getImageFile
}