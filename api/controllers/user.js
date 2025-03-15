'user strict'


const bcrypt = require('bcrypt-nodejs');

const User = require('../models/user');

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
    user.findOne({email: email, password: password}, (err, user) => {
        if(err) resp.status(500).send({message: 'Error en la oeticion'});

        if(user) {
            bcrypt.compare(password, user.password, (err, check) => {
                if(check){
                    //devolver dato de usuario
                }else {
                    return resp.status(404).send({message: 'El usuario no se ha podido identificar'});
                }
               
            });
            } else{
                return resp.status(404).send({message: 'El usuario no se ha podido identificar'});
            }
    });
}
    
module.exports = {
    home,
    pruebas,
    saveUser
}