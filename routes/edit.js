/**
 * edit.js contains getEdits which searches for edits based on the boardId 
 */
var Edit = require('../editModel.js');

var editMethods = {};

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
