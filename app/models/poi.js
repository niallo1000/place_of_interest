'use strict';

const Mongoose = require('mongoose');
const User = require('../models/user');
const Comment = require('../models/comment');

const Schema = Mongoose.Schema;


const poiSchema = new Schema({
    name: String,
    description: String,
    image: String,
    catagory: String,
    location: String,
    addedBy: {
            type: Schema.Types.ObjectId,
            ref: "User"
    },
    comment: {
            type: Schema.Types.ObjectId,
            ref: "Comment"
    }
});


poiSchema.statics.findByEmail = function(id) {
    return this.findOne({ id : id});
};

poiSchema.statics.findByName = function(name) {
    return this.findOne({ name : name});
};

module.exports = Mongoose.model('Poi', poiSchema);