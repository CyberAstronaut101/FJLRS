const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// TODO maybe move the printerHistory and laserHistory, woodshopHistory to own schemas

var userSchema = mongoose.Schema({
        firstname: String,
        lastname: String,
        studentID: String,
        phone: String,
        email: { type: String, require: true, unique: true},
        password: String,
        userLevel: String,
        woodshopHistory: [
            {
                checkInDate: Date,
                checkOutDate: Date
            }
        ],
        laserHistory: [
            {
                machineID: String,
                apptStartDate: Date,
                apptEndDate: Date,
                checkInDate: Date,
                checkOutDate: Date,
                created_at: Date
            }
        ],
        printerHistory: [
            {
                submitDate: Date,
                price: Number
            }
        ],
        laserLab01: Boolean,
        laserLab02: Boolean,
        woodShop01: Boolean,
        woodShop02: Boolean,
        woodShop03: Boolean,
        plotters: Boolean,
        projectors: Boolean

});

userSchema.plugin(uniqueValidator);

userSchema.method('toClient', function() {
    var obj = this.toObject();
    console.log('UserSchema toClient method running...');
    // console.log('Before: ');
    // console.log(obj);
    // Rename the Fields
  
    // Rename the DeptInfo id
    obj.id = obj._id;
    delete obj._id;
    // Remove the password hash
    delete obj.password;

    // Return the sanatized Object
    return obj;
  })
module.exports = mongoose.model("User", userSchema);