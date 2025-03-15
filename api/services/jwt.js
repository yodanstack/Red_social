'sue strict'

const jwt = require('jwt-simple');
const moment = require('moment');
const secret = 'clave_unica_secreta';

exports.createToken = function(user){
    const payload = {
        sub: user._id,
        name: user.name,
        nick: user.nick,
        surname: user.surname,
        email: user.email,
        role: user.role,
        image: user.image,
        iat : moment().unix(),
        exp: moment().add(30,'days').unix
    };

    return jwt.encode(payload, secret);
};