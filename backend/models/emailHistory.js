const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");


const emailAlertHistorySchema = mongoose.Schema({
    from: { type: String, required: true},
    to: { type: String, required: true},
    subject: { type: String, required: true },
    html: { type: String, required: true },
    sendDate: { type: String },
    rc: { type: String, required: true}
});

emailAlertHistorySchema.plugin(uniqueValidator);
module.exports = mongoose.model('EmailAlertHistory', emailAlertHistorySchema);
