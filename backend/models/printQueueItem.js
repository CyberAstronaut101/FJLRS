const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");
// const printerQueue = require("./printerQueue");

var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;



const PrintQueueItem = mongoose.Schema({
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

PrintQueueItem.plugin(uniqueValidator);
module.exports = mongoose.model('PrintQueueItem', PrintQueueItem);