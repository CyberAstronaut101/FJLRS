const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");


const commentSchema = mongoose.Schema({
    createdAt: {
        default: Date.now(),
        type: Date,
    },
    submittedBy: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    text: {
        required: true,
        type: String,
    },
    jobId: {
        required: true,  
        type: mongoose.Schema.Types.ObjectId,
        ref: "PrintQueueItem"
    }
});

commentSchema.plugin(uniqueValidator);

commentSchema.method('toClient', function(name) {
    var obj = this.toObject();

    obj.id = obj._id;
    delete obj._id;

    //add user name
    obj.userName = name;
  
    return obj;
  })

module.exports = mongoose.model('Comment', commentSchema);