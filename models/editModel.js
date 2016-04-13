var mongoose = require('mongoose');

var editSchema = new mongoose.Schema({
	data:{type:Object},
	boardId:{type:String},
	timestamp:{type:Date}
});

module.exports = mongoose.model('Edit', editSchema);