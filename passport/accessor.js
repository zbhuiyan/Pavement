module.exports.canAccessBoard = function(req, res, next) {
	// This method should check to see if the board is public or if the user is allowed to access it

	// GET BOARD AND CHECK IF IT IS PUBLIC HERE

	// IF BOARD IS NOT PUBLIC
	if(req.user != null) {
		console.log('User is logged in');

		// check to see if req.user._id is in board ids

		return next;
	} else {
		res.redirect('/');
	}
};