var Board = require('../models/boardModel.js');

module.exports.canAccessBoard = function(req, res, next) {
	// This method should check to see if the board is public or if the user is allowed to access it
	var boardId = req.params.boardId;

	// GET BOARD AND CHECK IF IT IS PUBLIC HERE
	Board.findOne({_id:boardId}, function(err, board) {
		if(!err) {
			if(board) {
				if(board.isPublic) {
					return next(req, res);
				} else {
					// IF BOARD IS NOT PUBLIC
					if(req.user != null) {
						console.log('User is logged in');

						// check to see if req.user._id is in board ids
						if(board.users.indexOf(req.user._id) > -1) {
							return next(req, res);
						} else {
							res.redirect('/');
						}
					}
				}
			} else {
				// Somehow the board doesn't exist?
				res.redirect('/');
			}
		} else {
			res.redirect('/');
		}
	});
};