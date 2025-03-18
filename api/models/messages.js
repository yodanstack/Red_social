'use strict'

const mongoose = require('mongoose');
const schema = mongoose.Schema;

const messageSchema = schema({
    text: String,
    created_at: String,
    viewed: String,
    emmiter: {type: schema.ObjectId, ref: 'User'},
    receiver: {type: schema.ObjectId, ref: 'User'}
});


module.exports = mongoose.model('message', messageSchema);

