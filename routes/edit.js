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

// THESE METHODS ARE BEING USED BY THE SERVER

editMethods.addEdit = function(boardId, data) {
	newEdit = new Edit({
		boardId:boardId,
		data:data,
		timestamp: new Date()
	});

	newEdit.save();
};

editMethods.removeEdit = function(editId) {
	Edit.remove({_id:editId});
};

module.exports = editMethods;