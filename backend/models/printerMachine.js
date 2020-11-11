const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");


const PrinterMachine = mongoose.Schema({
    machineName: { type: String, required: true, unique: true },
    currentJobId: { type: String },
});

PrinterMachine.plugin(uniqueValidator);
module.exports = mongoose.model('PrinterMachines', PrinterMachine);