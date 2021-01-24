const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");
const printerQueue = require("./printerQueue");

var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;


const PrinterFiles = mongoose.Schema({
    contentType: String,
    fileName: String,
    file: Buffer
});

PrinterFiles.plugin(uniqueValidator);
module.exports = mongoose.model('PrinterFiles', PrinterFiles);