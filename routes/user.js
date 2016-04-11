var User = require('../models/userModel.js');

userRoutes = {};

userRoutes.currentUser = function(req, res) {
	console.log(req.user)
	// if(req.user != null) {
		res.json(req.user);
	// } else {
	// 	res.status(404).send('not currently logged in');
	// }
}

userRoutes.getUser = function(req, res) {
	var usernameRegex = req.params.username;

	User.find({username:{'$regex':usernameRegex}}).select('username').exec(function(err, users) {
		if(!err) {
			if(users) {
				res.json(users);
			} else {
				res.status(404).send('could not find any users for that username');
			}
		} else {
			res.status(500).send('database error occurred');
		}
	});
}

module.exports = userRoutes;