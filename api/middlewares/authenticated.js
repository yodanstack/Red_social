'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');
const secret = 'clave_unica_secreta';

exports.ensureAuth = (req, resp, next) => {
    if(!req.headers.authorization){
        return resp.status(403).send({meessage: 'La peticion no tiene la cabecera de autentificaion'});
    }
    const token = req.headers.authorization.replace(/['"]+/g, '');
    
    try {
        const payload = jwt.decode(token, secret);
        if(payload.exp <= moment().unix){
            return resp.status(401).send({
                message: 'El token ha expirado'
            });
        }

    } catch (ex) {
           return resp.status(404).send({
            message: 'El token no es valido'
           }) 
    }
    req.user = payload;

    next();
}
