const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");


const deptOperatingHours = mongoose.Schema({
    deptOwner: { type: mongoose.Schema.Types.ObjectId, ref: "DeptInfo" },
    scheduleName: { type: String, unique: true },
    buisnessHours: [
        {
          dayOfWeek: { type: Number },
          openTime: { type: Date },
          closeTime: { type: Date },
          isOpen: { type: Boolean}
        }
    ]
    // TODO need to add a lunch hours object, maybe start time and lunch length
});

deptOperatingHours.plugin(uniqueValidator);

// Adding toClient to rename the _id fields to id
deptOperatingHours.method('toClient', function() {
  var obj = this.toObject();
  console.log('OperatingHours toClient method running...');

  // Rename the DeptInfo id
  obj.id = obj._id;
  delete obj._id;

  return obj;
})
module.exports = mongoose.model('Dept_Operating_Hours', deptOperatingHours);
