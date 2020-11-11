const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");


const PrintQueueItem = mongoose.Schema({
    printerId: { type: String, required: true },            // Machine id that the job belongs to
    jobName: {type: String, required: true, unique: true },  // Individual Job Names 
    jobOwner: { type: String, required: true },              // ID of the person who created this
    timeStarted: { type: Date, required: true },            // Date of when job started
    printHours: { type: Number, required: true },
    printMinutes: { type: Number, required: true}        // Actual print length for any calculations with date
});

PrintQueueItem.plugin(uniqueValidator);
module.exports = mongoose.model('PrintQueueItems', PrintQueueItem);