var mongoose = require('mongoose');

var editSchema = new mongoose.Schema({
	data:Object,
	boardId:String,
	timestamp:Date
});

module.exports = mongoose.model('Edit', editSchema);