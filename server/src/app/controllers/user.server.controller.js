var mongoose = require('mongoose');	// mongoose for mongodb
require('../models/user.server.model');
var User = mongoose.model('User');
var jwt = require('jsonwebtoken');	// used to create, sign, and verify tokens
var config = require('../../config');

exports.findAll = function(req, res) {

	User.find({}, 'username', function(err, users){
		console.log(users);
		res.json(users);
	});
};


exports.findOne = function(req, res){

	User.findOne({
		username: req.params.username
	}, function(err, user) {
		if(err) {
			res.send(err);
		}

		res.json(user);
	});
};

exports.getCount = function(req, res) {

	console.log("Getting user count");


	User.find({}, 'username', function(err, users){
		console.log(users);

		if(err) {
			res.send(err);
		}

		res.json({count: users.length});
	});

};

// Get a count of the users associated with the specified de network
exports.getCountForNetwork = function(req, res) {
	console.log("Getting number of users for DE Network");

	User.find({denetwork: req.params.denetwork}, 'username', function(err, users){
		console.log(users);

		if(err) {
			res.send(err);
		}

		res.json({count: users.length});
	});
};

exports.validateToken = function(req, res) {
	res.json({
		success: true,
		message: "Token is valid"
	});
};

exports.authenticate = function(req, res){

	console.log("Authenticating user");
	console.log("Username is: "+req.body.username);

	User.findOne({
		username: req.body.username
	}, '+password +salt', function(err, user) {
		if (err) {
			throw err;
		}

		if(!user) {
			res.json({ success: false, message: 'Authentication failed. User not found.'});
		} else if (user) {
			// check if password matches
			if(!user.authenticate(req.body.password)) {
				res.json({ success: false, message: 'Authentication failed. Wrong password.' });
			} else {
				// if user is found and password is right
        		// create a token
        		user.password = undefined;
        		user.salt = undefined;

        		var token = jwt.sign(user, config.jwtSecret, { expiresIn: '365d' });

        		res.json({
        			success: true,
        			message: 'Authenticated Successfully',
        			token: token
        		});
			}
		}
	});
};

exports.check = function(req, res) {

	if(req.query.fieldName == 'username') {
		User.count({
			username: req.query.fieldValue
		}, function(err, count) {
			res.json({
				unique: count == 0 ? true : false
			});
		})
	} else if(req.query.fieldName == 'email') {
		User.count({
			email: req.query.fieldValue
		}, function(err, count) {
			res.json({
				unique: count == 0 ? true : false
			});
		})
	} else {
		res.status(400).send("field name not recognized");
	}
}