var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    username: String,
    password: String,
    mail: {
      type: String,
      required: false //TODO: put required to true and investigate why it's not working
    },
    firstname: {
      type: String,
      default: ''
    },
    lastname: {
      type: String,
      default: ''
    }
});

User.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', User);
