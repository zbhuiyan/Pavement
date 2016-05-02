var SVG = require('../models/svgModel.js');

var svgMethods = {};

//*** Method used by server ***
svgMethods.getSvg = function(req, res) {
	var boardId = req.params.boardId;

	SVG.find({boardId:boardId}).sort({timestamp: -1}).exec(function(err, svgs) {
		if(!err) {
			if(svgs) {
				res.json(svgs[0]);
			} else {
				res.status(404).send('no svg is saved');
			}
		} else {
			res.status(500).send('you done goofed');
		}
	});
};

module.exports = svgMethods;