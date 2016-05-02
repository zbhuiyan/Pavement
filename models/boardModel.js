var mongoose = require('mongoose');

var boardSchema = new mongoose.Schema({
	users: [],
	name: String,
	isPublic: Boolean,
	owner: String,
	timestamp: Date
});

module.exports = mongoose.model('Board', boardSchema);