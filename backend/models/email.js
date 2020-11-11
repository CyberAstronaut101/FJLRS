const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");


const emailAccountSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true},
    password: { type: String },
    type: { type: String, required: true }
});

emailAccountSchema.plugin(uniqueValidator);
module.exports = mongoose.model('EmailAccount', emailAccountSchema);
