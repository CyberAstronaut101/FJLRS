const mongoose = require('mongoose');

const laserEventSchema = mongoose.Schema({
    laserId: { type: String, required: true }
    // TODO REST OF LASER EVENT
});

module.exports = mongoose.model('LaserEvent', laserEventSchema);


