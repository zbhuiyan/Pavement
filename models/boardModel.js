var mongoose = require('mongoose');

var boardSchema = new mongoose.Schema({
	users:{type:[]},
	name:{type:String},
	isPublic:{type:Boolean},
	tags:{type:[]},
	owner:{type:String},
	timestamp:{type:Date}
});

module.exports = mongoose.model('Board', boardSchema);