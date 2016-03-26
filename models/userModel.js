var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	username:{type:String},
	password:{type:String}
});

module.exports = mongoose.model('User', userSchema);