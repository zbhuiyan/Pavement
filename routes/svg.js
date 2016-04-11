var SVG = require('../models/svgModel.js');

var svgMethods = {};

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

svgMethods.addSvg = function(boardId, data) {
	newSvg = new SVG({
		boardId:boardId,
		data:data,
		timestamp: new Date()
	});

	newSvg.save();
};

svgMethods.removeSvg = function(svgId) {
	SVG.remove({_id:svgId});
}

module.exports = svgMethods;