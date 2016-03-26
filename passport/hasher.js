var crypto = require('crypto');
var cryptoSecret = 'ajdflkajdfadfsdf';

module.exports = function(password) {
	return crypto.createHmac('sha256', cryptoSecret).update(password).digest('hex');
}