// load the things we need
var mongoose = require('mongoose');

// define the schema for our item model
var itemSchema = mongoose.Schema({

    text: String,
    owner: String,
    timestamp: Date,

    uploadedFilename: String,
    originalFilename: String,
    filesize: Number,
    mimeType: String

});

// create the model for items and expose it to our app
module.exports = mongoose.model('Item', itemSchema);
