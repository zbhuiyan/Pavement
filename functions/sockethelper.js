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

socketFunctions.getEdits = function(boardId, callback) {
	Edit.find({boardId:boardId}).sort({timestamp:1}).exec(function(err, edits) {
		if(!err) {
			callback(edits);
		} else {
			callback([])
		}
	});
};

socketFunctions.addEdit = function(boardId, data) {
	newEdit = new Edit({
		boardId:boardId,
		data:data,
		timestamp: new Date()
	});

	newEdit.save();
};

socketFunctions.removeEdit = function(editId) {
	Edit.remove({_id:editId}, function(err, nRemoved) {
		if(err) {
			console.log('error');
		}
	});
};

// SVG Methods

socketFunctions.getSvg = function(boardId, callback) {
	SVG.find({boardId:boardId}).sort({timestamp: -1}).exec(function(err, svg) {
		if(!err) {
			if(svg) {
				callback(svg[0]);
			} else {
				callback({});
			}
		} else {
			callback({});
		}
	});
};

socketFunctions.addSvg = function(boardId, data, callback) {
	newSvg = new SVG({
		boardId:boardId,
		data:data,
		timestamp: new Date()
	});

	newSvg.save(function(err) {
		if(!err) {
			callback();
		}
	});
};

socketFunctions.removeSvg = function(svgId) {
	SVG.remove({_id:svgId}, function(err, nRemoved) {
		if(!err) {
			console.log('SVG replaced');
		} else {
			console.log('SVG not replaced');
		}
	});
}

module.exports = socketFunctions;