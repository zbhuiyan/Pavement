var Board = require('../models/boardModel.js');

module.exports.canAccessBoard = function(req, res, next) {
	// This method should check to see if the board is public or if the user is allowed to access it
	var boardId = req.params.boardId;

	if(req.user != null) {
		// GET BOARD AND CHECK IF IT IS PUBLIC HERE
		Board.findOne({_id:boardId}, function(err, board) {
			if(!err) {
				if(board != null) {
					if(board.isPublic) {
						return next();
					} else {
						// IF BOARD IS NOT PUBLIC;

						// check to see if req.user._id is in board ids
						if(board.users.indexOf(req.user._id) > -1) {
							return next();
						} else {
							res.redirect('/');
						}
					}
				} else {
					// Somehow the board doesn't exist?
					res.redirect('/');
				}
			} else {
				console.log(err);
				res.redirect('/');
			}
		});
	} else {
		res.redirect('/');
	}
};

module.exports.isLoggedIn = function(req, res, next) {
	if(req.user != null) {
		return next();
	} else {
		res.redirect('/');
	}
};