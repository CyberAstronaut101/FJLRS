const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");


const deptWoodShopSchema = mongoose.Schema({
    buisnessHours: [
      {
        dayOfWeek: { type: Number, required: true },
        openTime: { type: Date, required: true },
        closeTime: { type: Date, required: true },
        isOpen: { type: Boolean, required: true}
      }
    ],
    buisnessHoursOverrides: [
      {
        overrideReason: { type: String, required: true, unique: true },
        overrideStartDate: { type: Date, required: true },
        overrideEndDate: { type: Date, required: true },
        dayOfWeek: { type: Number, required: true },
        altOpenTime: { type: Date },
        altCloseTime: { type: Date },
        isOpen: { type: Boolean, required: true }
      }
    ]
    // TODO add saved weekly schedules that can be switched via dropdown menu

});

deptWoodShopSchema.plugin(uniqueValidator);

// Adding toClient to rename the _id fields to id
deptWoodShopSchema.method('toClient', function() {
  var obj = this.toObject();
  console.log('DeptInfo toClient method running...');
  // console.log('Before: ');
  // console.log(obj);
  // Rename the Fields

  // Rename the DeptInfo id
  obj.id = obj._id;
  delete obj._id;

  // Rename all the buisnessHours Entries
  obj.buisnessHours = obj.buisnessHours.map(elem => {
    elem.id = elem._id;
    delete elem._id;
    return elem;
  })

  // Rename all the buisnessHoursOverride Entries
  obj.buisnessHoursOverrides = obj.buisnessHoursOverrides.map(elem => {
    elem.id = elem._id;
    delete elem._id;
    return elem;
  })

  // console.log('After: ');
  // console.log(obj);
  return obj;


})
module.exports = mongoose.model('Dept_Woodshop', deptWoodShopSchema);
