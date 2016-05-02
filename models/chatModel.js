var mongoose = require('mongoose');

var chatSchema = new mongoose.Schema({
	user:String,
	msg:String,
	boardId:String,
	timestamp:Date
});

module.exports = mongoose.model('Chat', chatSchema);