const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");


const materialSchema = mongoose.Schema({
    materialName: {type: String, required: true, unique: true },
    materialPrice: { type: Number, require: true},
    materialType: { type: String, require: true},
});

materialSchema.plugin(uniqueValidator);

materialSchema.method('toClient', function() {
    var obj = this.toObject();
    // console.log('Renaming UID of db entry...');
    // console.log('Before: ');
    // console.log(obj);
    // Rename the Fields
  
    // Rename the DeptInfo id
    obj.id = obj._id;
    delete obj._id;
  
    return obj;
  })

module.exports = mongoose.model('Material', materialSchema);