const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");


const deptInfoSchema = mongoose.Schema({
  deptName: {type: String, required: true, unique: true },
  currentOperatingSchedule: { type: mongoose.Schema.Types.ObjectId },
  operatingHoursSchedules: [
    {
      scheduleName: { type: String, unique: true},
      buisnessHours: [
          {
            dayOfWeek: { type: Number },
            openTime: { type: Date },
            closeTime: { type: Date },
            isOpen: { type: Boolean}
          }
      ]
    }
  ],
  operatingHoursOverrides: [
    {
      overrideReason: { type: String },
      overrideStartDate: { type: Date },
      overrideEndDate: { type: Date },
      dayOfWeek: { type: Number },
      altOpenTime: { type: Date },
      altCloseTime: { type: Date },
      isOpen: { type: Boolean }
    }
  ]
});

deptInfoSchema.plugin(uniqueValidator);

// Adding toClient to rename the _id fields to id
deptInfoSchema.method('toClient', function() {
  var obj = this.toObject();
  console.log('DeptInfo toClient method running...');
  // console.log('Before: ');
  // console.log(obj);
  // Rename the Fields

  // Rename the DeptInfo id
  obj.id = obj._id;
  delete obj._id;

  // Change the ._id to .id
  obj.operatingHoursSchedules = obj.operatingHoursSchedules.map(elem => {
    elem.id = elem._id;
    delete elem._id;
    return elem;
  })

  // Change the ._id to .id
  obj.operatingHoursOverrides = obj.operatingHoursOverrides.map(elem => {
    elem.id = elem._id;
    delete elem._id;
    return elem;
  })

  // // Rename all the buisnessHoursOverride Entries
  // obj.buisnessHoursOverrides = obj.buisnessHoursOverrides.map(elem => {
  //   elem.id = elem._id;
  //   delete elem._id;
  //   return elem;
  // })

  // console.log('After: ');
  // console.log(obj);
  return obj;


})
module.exports = mongoose.model('DeptInfo', deptInfoSchema);





// const deptInfoSchema = mongoose.Schema({
//   deptName: {type: String, required: true, unique: true },
//   currentOperatingSchedule: { type: mongoose.Schema.Types.ObjectId },
//   operatingHoursSchedules: [
//     {
//       scheduleName: { type: String, unique: true},
//       buisnessHours: [
//           {
//             dayOfWeek: { type: Number },
//             openTime: { type: Date },
//             closeTime: { type: Date },
//             isOpen: { type: Boolean}
//           }
//       ]
//     }
//   ],
//   operatingHoursOverrides: [
//     {
//       overrideReason: { type: String },
//       overrideStartDate: { type: Date },
//       overrideEndDate: { type: Date },
//       dayOfWeek: { type: Number },
//       altOpenTime: { type: Date },
//       altCloseTime: { type: Date },
//       isOpen: { type: Boolean }
//     }
//   ]
// });