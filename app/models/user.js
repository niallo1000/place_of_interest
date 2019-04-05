'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const bcrypt = require('bcrypt');     // ADDED

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String
});

userSchema.statics.findByEmail = function(email) {
    return this.findOne({ email : email});
};

userSchema.methods.comparePassword = async function(candidatePassword) {     // EDITED
    const isMatch = this.password === candidatePassword;
    if (!isMatch) {
        throw new Boom('Password mismatch');
    }
    return this;
};




module.exports = Mongoose.model('User', userSchema);