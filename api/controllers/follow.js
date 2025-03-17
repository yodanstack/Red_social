'use strict'

const path = require('path');
const fs = require('fs');

const mongoosePaginate = require('mongoose-paginate-v2');

const User = require('../models/user');
const Follow = require('../models/follows');
const follows = require('../models/follows');



function saveFollow(req, resp){
    const params = req.body;
    const follow = new Follow();
    follow.user = req.user.sur
    follow.followed = params.followed;

    follow.save((err, followStored) => {
        if(err) return resp.status(500).send({
            message: 'Error al guardar el seguimiento'
        });
        if(!followStored) return resp.status(404).send({
            message: 'El seguimineto no se ha guardado'
        });

        return resp.status(200).send({followStored});
    });

} 
    function deleteFollow(req, resp){
        const userId = req.user.sur;
        const followId = req.params.id;
        
        follow.find({'user': userId, 'followed': followId}).remove(()=> {
          if(err) return resp.status(500).send({
                message: 'Error al dejar de seguir usuario'
            });
            return resp.status(200).send({
                message: 'Has dejado de seguir a este usuario'
            });
        });       
    }

    function getFollowingUser(req, resp){
        const userId = req.user.sur;
        if(req.user.id && req.params.page){
            userId = req.params.id;
        }

        const page = 1;
        if( req.params.page ) {
            page = req.params.page
        }else {
            req.params.id;
        }
        const imtemPerPAge = 4;

        follow.find({user: userId}).populate({path: 'Folowed'}).paginate(page, imtemPerPAge, (err, follows, total) => {
            if(err) return resp.status(500).send({message: 'Error en el servidor'});

            if(!follows) return resp.status(404).send({
                message: 'No hay Useraguis segidos'
            });
            return resp.satatus(200).send({
                total: total, 
                page: Math.ceil(total/imtemPerPAge), 
                follows
            });
        });
    }


    function getFollowedUsers(req, resp){
      const userId = req.user.sur;

        if(req.params.id && req.params.page){
            userId = req.params.id;
        }
        const page = 1;

        if(req.params.page){
            page = req.params.page
        }else {
            page = req.params.id
        }

        const itemsPerPage = 4;

        follow.find({followed: userId}).populate('user followed').paginate(page, imtemPerPAge, (err, follows, total) => {
            if(err) return resp.status(500).send({message: 'Error en el servidor'});

            if(!follows) return resp.status(404).send({
                message: 'No te sige nadie'
            });
            return resp.satatus(200).send({
                total: total, 
                page: Math.ceil(total/imtemPerPAge), 
                follows
            });
        });
    }

    function getMyFollows(req, resp){
        const userId = req.user.sur;
        const followed = req.params.followed;

       const find = follow.find({user: userId}).populate('user followed').exec((err, follows)=>{
            if(err) return resp.status(500).send({message: 'Error en el servidor'});

            if(!follows) return resp.status(404).send({
                message: 'No siges a nadie'
            });
        });
    }


module.exports = {
    saveFollow,
    deleteFollow,
    getFollowingUser,
    getFollowedUsers,
    getMyFollows,

}