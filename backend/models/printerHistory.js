const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");
const printerQueue = require("./printerQueue");

var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;


const PrinterHistory = mongoose.Schema({
    machineName: { type: String, required: true },
    machineId: { type: String, required: true},
    printQueueItem: { type: ObjectId, ref: "PrinterQueue" },
    printFinishedTime: { type: Date, required: true}
});

PrinterHistory.plugin(uniqueValidator);
module.exports = mongoose.model('PrinterHistory', PrinterHistory);