const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");

var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

const PrinterFiles = mongoose.Schema({
    description: {
        required: true,
        type: String,
    },
    filename: {
        required: true,
        type: String,
    },
    fileId: {
        required: true,
        type: String,
    },
    createdAt: {
        default: Date.now(),
        type: Date,
    },
});

PrinterFiles.plugin(uniqueValidator);
module.exports = mongoose.model('PrinterFiles', PrinterFiles);