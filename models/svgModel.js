var mongoose = require('mongoose');

var svgSchema = new mongoose.Schema({
	boardId:String,
	data:String,
	timestamp:Date
});

module.exports = mongoose.model('SVG', svgSchema);