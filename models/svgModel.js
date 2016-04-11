var mongoose = require('mongoose');

var svgSchema = new mongoose.Schema({
	boardId:{type:String},
	data:{type:String},
	timestamp:{type:Date}
});

module.exports = mongoose.model('SVG', svgSchema);