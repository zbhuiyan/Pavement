/**
 * chat.js contains getChat which searches for all chat messages associated with the board
 */

var Chat = require('../models/chatModel.js');

var chatMethods = {};

// *** Method used by server ***
chatMethods.getChat = function(req, res) {
	var boardId = req.params.boardId;

	Chat.find({boardId:boardId}).sort({timestamp:1}).exec(function(err, messages) {
		if(!err) {
			if(messages) {
				res.json(messages);
			} else {
				res.status(404).send('could not find any messages for that board');
			}
		} else {
			res.status(500).send('could not get messages for that board');
		}
	});
};

module.exports = chatMethods;
