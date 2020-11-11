const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");


const registeredUserSchema = mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true},
    phoneNumber: { type: String, required: true, unique: true},
    uarkEmail: { type: String, required: true, unique: true},
    trainedOn: { type: String } // this will just be a comma delimited list that contains like lasers,3dprinter,plotter,projector, etc for the types of help sources that are going to be needed
});

registeredUserSchema.plugin(uniqueValidator);
module.exports = mongoose.model('RegisteredUser', registeredUserSchema);