const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");


const printerSchema = mongoose.Schema({
    name: { type: String, required: true, unique: true},
    type: { type: String, required: true, unique: false}
});

printerSchema.plugin(uniqueValidator);

printerSchema.method('toClient', function() {
    var obj = this.toObject();
    console.log('Renaming UID of db entry...');
    // console.log('Before: ');
    // console.log(obj);
    // Rename the Fields
  
    // Rename the DeptInfo id
    obj.id = obj._id;
    delete obj._id;
  
    return obj;
  })

module.exports = mongoose.model('Printer', printerSchema);