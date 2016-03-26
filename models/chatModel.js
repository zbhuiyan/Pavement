var mongoose = require('mongoose');

var chatSchema = new mongoose.Schema({
	user:{type:String},
	msg:{type:String},
	boardId:{type:String},
	timestamp:{type:Date}
});

module.exports = mongoose.model('Chat', chatSchema);