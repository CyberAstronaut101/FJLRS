const mongoose = require('mongoose');


/*
    ? Handleing Dates??

    The server side will store the JS date objects,
    and I am going to just have the api call for all the 
    news articles format the Date object like
    hh:mm dd/mm/YY

*/


const newsSchema = mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    postedDate: { type: Date },
    updatedDate: { type: Date }
});

module.exports = mongoose.model('News', newsSchema);

// Runs to change the ._id to .id
newsSchema.method('toClient', function() {
    var obj = this.toObject();
    console.log('NewsSchema toClient method running...');
    obj.id = obj._id;
    delete obj._id;
    return obj;
})
