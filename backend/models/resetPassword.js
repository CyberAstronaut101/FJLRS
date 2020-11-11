const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");


/*
    the uid has to be unique because each user should only have one ResetPassword token active 
    at any moment in time
*/

const resetPasswordSchema = mongoose.Schema({
    uid: { type: String, required: true, unique: true},
});

resetPasswordSchema.plugin(uniqueValidator);
module.exports = mongoose.model('ResetPassword', resetPasswordSchema);