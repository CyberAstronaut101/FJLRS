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
        type: mongoose.Schema.Types.ObjectId,
        ref: "Material"
    },
    createdAt: {
        default: Date.now(),
        type: Date,
    },
    submittedBy: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    printStatus: {
        type: String            // Default 'Submitted' -> 'Assigned' || 'Need Info' -> 'Printing' -> 'Completed'
    },
    assignedPrinter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Printer"
    }
});

PrintQueueItem.plugin(uniqueValidator);

PrintQueueItem.method('toClientNoName', function() {
    var obj = this.toObject();

    obj.id = obj._id;
    delete obj._id;

    return obj;
})

PrintQueueItem.method('toClient', function(name) {
    var obj = this.toObject();
    // console.log('Before: ');
    // console.log(obj);
    // Rename the Fields
  
    // Rename the DeptInfo id
    obj.id = obj._id;
    delete obj._id;

    //add user name
    obj.userName = name;
  
    return obj;
  })




  
module.exports = mongoose.model('PrintQueueItem', PrintQueueItem);