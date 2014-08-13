// load the things we need
var mongoose = require('mongoose')
  , bcrypt   = require('bcrypt-nodejs')

// define the schema for our item model
var itemSchema = mongoose.Schema({

    text: String,
    owner: String,
    timestamp: Date

});

// create the model for items and expose it to our app
module.exports = mongoose.model('Item', itemSchema);
