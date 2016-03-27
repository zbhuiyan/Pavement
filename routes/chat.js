var Chat = require('../models/chatModel.js');

var chatMethods = {};

// THIS IS NOT A ROUTE IT WILL BE USED BY THE SOCKET

chatMethods.addMessage = function(chatObj) {
	/*
		chatObj should look something like:
			board_id
			user
			message
	*/

	chatObj.timestamp = new Date();

	dbChat = new Chat(chatObj);

	dbChat.save(function(err) {
		if(!err) {
			return 201; // resource created
		} else {
			return 500; // Internal server error
		}
	});
};

chatMethods.getChat = function(req, res) {
	var boardId = req.params.board_id;

	Chat.find({boardId:boardId}).sort({timestamp:-1}).exec(function(err, messages) {
		if(!err) {
			if(messages) {
				res.json(message);
			} else {
				res.status(404).send('could not find any messages for that board');
			}
		} else {
			res.status(500).send('could not get messages for that board');
		}
	});
};

module.exports = chatMethods;