var Board = require('../models/boardModel.js');

// wrapping up all the methods
var boardRoutes = {};

boardRoutes.addUser = function(req,res) {
	var board = req.params.board;
	var user = req.params.userId;
	Board.findOneAndUpdate({_id:BoardId}, {$push: {users: user}}, {new:true}, function (err, board) {
		if (err) {
			res.status(500).send('could not add the user to the board');
		}
		else {
			res.json(board);
		}
	})
	res.json(board.users.append(user));
};

boardRoutes.add = function(req,res) {
	dbBoardReq = req.body;
	var user = req.user._id;
	dbBoard = new Board({
		users: [user], 
		owner: user, 
		name: dbBoardReq.name, 
		isPublic: dbBoardReq.isPublic,
		tags: dbBoardReq.tags,
		timestamp: new Date()
	});

	dbBoard.save(function(err) {
		if (err) {
			return 500; // internal server error
		} else {
			return 201; // resource created
		}
	})

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

boardRoutes.getPublic = function(req,res) {
	Board.find({"isPublic": true}, function (err, publicBoards) {
		res.json(publicBoards);
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
	var board = req.params.name;
	var owner = req.params.owner;
	Board.findOneAndRemove({
		$and: [{'name':board}, {'owner':owner}]
	}).exec(function (err, done) {
		res.status(200).send(); // not sure what to do here/send here
	})
};

module.exports = boardRoutes;
