'use strict'

const mongoose = require('mongoose');
const schema = mongoose.Schema;

const messageSchema = schema({
    text: String,
    created_at: String,
    emitter: {type: schema.ObjectId, ref: 'User'},
    reciver: {type: schema.ObjectId, ref: 'User'}
});


module.exports = mongoose.model('message', messageSchema);

