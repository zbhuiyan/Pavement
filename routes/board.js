var Board = require('../models/boardModel.js');

// wrapping up all the methods
var boardRoutes = {};

boardRoutes.addUser = function(req,res) {
	var boardId = req.params.boardId;
	var user = req.params.userId;
	Board.findOneAndUpdate({_id:boardId}, {$push: {users: user}}, {new:true}, function (err, board) {
		if (!err) {
			res.json(board.users);
		}
		else {
			res.status(500).send('could not add the user to the board');
		}
	})
};

boardRoutes.removeUser = function(req, res) {
	var boardId = req.params.boardId;
	var user = req.params.userId;
	Board.findOneAndUpdate({_id:boardId}, {$pull: {users: user}}, {new:true}, function(err, board)  {
		if(!err) {
			res.json(board.users);
		} else {
			res.status(500).send('could not remove user from the board');
		}
	});
};

boardRoutes.getBoardUsers = function(req, res) {
	var boardId = req.params.boardId;

	Board.findOne({_id:boardId}).select('users').exec(function(err, board) {
		if(!err) {
			res.json(board);
		} else {
			res.status(500).send('could not get board');
		}
	});
};

boardRoutes.add = function(req,res) {
	dbBoardReq = req.body;
	var user = req.user.username;
	dbBoard = new Board({
		users: [user], 
		owner: user, 
		name: dbBoardReq.name, 
		isPublic: dbBoardReq.isPublic,
		tags: dbBoardReq.tags,
		timestamp: new Date()
	});

	dbBoard.save(function (err) {
		if (err) {
			res.status(500).send('could not add board');
		// } else {
		// 	return 201; // resource created
		// }
	}});
	res.json(dbBoard);

};

boardRoutes.getUserBoards = function(req,res) {
	var user = req.params.user;

	Board.find({owner: user}).exec(function (err,boards) {
		if (err) {
			res.status(500).send('could not get any boards for that user');
		} else {
			if (boards) {
				res.json(boards);
			} else {
				res.status(404).send('you do not appear to own any boards');
			}
		}
	});
};

boardRoutes.getAvailablePrivateBoards = function(req, res) {
	if(req.user != null) {
		Board.find({users:{'$in':[req.user.username]}}, function(err, boards) {
			if(!err) {
				if(boards) {
					res.json(boards);
				} else {
					res.status(404).send('could not find boards');
				}
			} else {
				res.status(500).send('error finding all boards');
			}
		});
	} else {
		res.status(403).send('not logged in');
	}
}

boardRoutes.getPublic = function(req,res) {
	Board.find({"isPublic": true}, function (err, publicBoards) {
		if(!err) {
			if(publicBoards) {
				res.json(publicBoards);
			} else {
				res.status(404).send('could not find any boards');
			}
		} else {
			res.status(500).send('error on finding public boards');
		}
	});


};

boardRoutes.getByTag = function(req,res) {
	var tags = req.params.tags.split;
	Board.find({"tags": {$all: tags}}, function (err, tagged) {
		res.json(tagged);
	});

};

boardRoutes.getByName = function(req,res) {
	var name = req.params.name;
	Board.find({"name": name}).exec(function (err, match) {
		if (err) {
			res.status(500).send('could not get boards by that name');
		} else {
			res.json(match);
		}
	});
};

boardRoutes.deleteBoard = function(req,res) {
	// var board = req.params.name;
	// var owner = req.params.owner;
	var board = req.params;
	Board.remove({name: board.name, owner: board.owner}, function (err) {
        if (err) res.status(500).send('Error deleting page');
    });
    res.end();

	// Board.findOneAndRemove({
	// 	$and: [{'name':board}, {'owner':owner}]
	// }).exec(function (err, done) {
	// 	// res.status(200).send(); // not sure what to do here/send here
	// 	res.end();
	// })
};

module.exports = boardRoutes;
