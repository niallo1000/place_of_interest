'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const adminSchema = new Schema({
    adminEmail: String,
    adminPassword: String
});

adminSchema.statics.findByEmail = function(adminEmail) {
    return this.findOne({ adminEmail : adminEmail});
};

adminSchema.methods.comparePassword = function(adminPassword) {
    const isMatch = this.adminPassword === adminPassword;
    if (!isMatch) {
        throw new Boom('Password mismatch');
    }
    return this;
};




module.exports = Mongoose.model('Admin', adminSchema);