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
    fileId: { 
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: "Uploads.files"
    },
    materialId: {
        required: true,  // TODO once @afaubion does his part update this as foreign key ref
        type: String
    },
    createdAt: {
        default: Date.now(),
        type: Date,
    },
    submittedBy: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

PrintQueueItem.plugin(uniqueValidator);
module.exports = mongoose.model('PrintQueueItem', PrintQueueItem);