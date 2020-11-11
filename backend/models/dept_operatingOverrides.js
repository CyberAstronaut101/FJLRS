const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");


const deptHoursOverride = mongoose.Schema({
    deptOwner: { type: mongoose.Schema.Types.ObjectId, ref: "DeptInfo" },
    overrideReason: { type: String },
    overrideStartDate: { type: Date },
    overrideEndDate: { type: Date },
    dayOfWeek: { type: Number },
    altOpenTime: { type: Date },
    altCloseTime: { type: Date },
    isOpen: { type: Boolean }
});

deptHoursOverride.plugin(uniqueValidator);

// Adding toClient to rename the _id fields to id
deptHoursOverride.method('toClient', function() {
  var obj = this.toObject();
  console.log('OperatingHours toClient method running...');

  // Rename the DeptInfo id
  obj.id = obj._id;
  delete obj._id;

  return obj;
})
module.exports = mongoose.model('DeptOverrideHours', deptHoursOverride);
