var users = require('../controllers/user.server.controller');
var authorization = require('../controllers/authorization.server.controller');
module.exports = function(app) {

	// Authenticate a user
	app.post('/api/v1/users/authenticate', users.authenticate);

	// Get total user count
	app.get('/api/v1/users/getcount', authorization.requiresLogin, users.getCount);

	// Get user count for specific Distric Energy Network
	app.get('/api/v1/users/getcount/:denetwork', authorization.requiresLogin, users.getCountForNetwork);

	// Validate the token
	app.get('/api/v1/users/validatetoken', authorization.requiresLogin, users.validateToken);

	// Find one user and get user data
	app.get('/api/v1/users/:username', authorization.requiresLogin, users.findOne);

	// Check if username or email exists
	app.get('/api/v1/check', authorization.requiresLogin, users.check);

	
};