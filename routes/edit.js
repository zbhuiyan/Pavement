var Edit = require('../models/editModel.js');

/**
 * edit.js contains getEdits which searches for edits based on the boardId 
 */

var editMethods = {};

//*** Method used by server ***
editMethods.getEdits = function(req, res) {
	var boardId = req.params.boardId;

	Edit.find({boardId:boardId}).sort({timestamp: -1}).exec(function(err, edits) {
		if(!err) {
			res.json(edits);
		} else {
			res.status(500).send('error finding edits for that board');
		}
	});
};

module.exports = editMethods;
