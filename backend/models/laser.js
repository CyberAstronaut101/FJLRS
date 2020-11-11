const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");


const laserSchema = mongoose.Schema({
    laserName: {type: String, required: true, unique: true },
    laserSize: { type: String, require: true},
    inUse: Boolean
});

laserSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Laser', laserSchema);