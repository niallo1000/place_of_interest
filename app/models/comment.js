'use strict';

const Mongoose = require('mongoose');
const User = require('../models/user');


const Schema = Mongoose.Schema;


const commentSchema = new Schema({
    text: String,
    author: {
            type: Schema.Types.ObjectId,
            ref: "User"
    }
});


module.exports = Mongoose.model('Comment', commentSchema);