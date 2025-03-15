'use strict'

const mongoose = require('mongoose');
const schema = mongoose.Schema;

const publicationSchema = schema({
    text: String,
    file: String,
    created_at: String,
    user:{type: schema.ObjectId, ref: 'User'}
}); 


module.exports = mongoose.model('publication', publicationSchema);