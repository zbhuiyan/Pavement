var Chat = require('../models/chatModel.js');
var Edit = require('../models/editModel.js');
var SVG = require('../models/svgModel.js');

var socketFunctions = {};

// Chat Methods

socketFunctions.addMessage = function(chatObj) {
	/*
		chatObj should look something like:
			board_id
			user
			message
	*/

	chatObj.timestamp = new Date();

	dbChat = new Chat(chatObj);

	dbChat.save(function(err, addedChat) {
		if(!err) {
			return addedChat; // resource created
		} else {
			return null; // Internal server error
		}
	});
};

// Edit Methods

socketFunctions.addEdit = function(boardId, data) {
	newEdit = new Edit({
		boardId:boardId,
		data:data,
		timestamp: new Date()
	});

	newEdit.save();
};

socketFunctions.removeEdit = function(editId) {
	Edit.remove({_id:editId});
};

// SVG Methods

socketFunctions.addSvg = function(boardId, data) {
	newSvg = new SVG({
		boardId:boardId,
		data:data,
		timestamp: new Date()
	});

	newSvg.save();
};

socketFunctions.removeSvg = function(svgId) {
	SVG.remove({_id:svgId});
}

module.exports = socketFunctions;