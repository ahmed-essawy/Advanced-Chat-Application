'use strict';

var userModel = require('../database').models.user;
var IPModel = require('./ip');

var create = function (data, callback) {
	var newUser = new userModel(data);
	newUser.save(callback);
};

var findOne = function (data, callback) {
	userModel.findOne(data, callback);
}

var findAll = (data, cb) => {
	userModel.find(data, cb);
}

var findById = function (id, callback) {
	userModel.findById(id, callback);
}

var updateById = function (userId, updatedUser, callback) {
	userModel.findById(userId, (err, user) => {
		if (err) throw err;
		if (updatedUser.role) user.role = updatedUser.role;
		if (updatedUser.IP) user.IP = updatedUser.IP;
		user.save();
	});
}

var isOnline = function (userId, state) {
	userModel.findById(userId, (err, user) => {
		if (err) throw err;
		user.isOnline = state;
		user.save();
	});
}

var isBlocked = function (userId, state) {
	userModel.findById(userId, (err, user) => {
		if (err) throw err;
		console
		user.isBlocked = state;
		user.save();
	});
}

var isIPBlocked = function (userId, state) {
	userModel.findById(userId, (err, user) => {
		if (err) throw err;
		user.isIPBlocked = state;
		IPModel.blockIP(user.IP, state);
		user.save();
	});
}

var isMuted = function (userId, state) {
	userModel.findById(userId, (err, user) => {
		if (err) throw err;
		user.isMuted = state;
		user.save();
	});
}

/**
 * Find a user, and create one if doesn't exist already.
 * This method is used ONLY to find user accounts registered via Social Authentication.
 *
 */
var findOrCreate = function (data, callback) {
	findOne({ 'socialId': data.id }, function (err, user) {
		if (err) { return callback(err); }
		if (user) {
			return callback(err, user);
		} else {
			var userData = {
				username: data.displayName,
				socialId: data.id,
				picture: data.photos[0].value || null
			};

			// To avoid expired Facebook CDN URLs
			// Request user's profile picture using user id 
			// @see http://stackoverflow.com/a/34593933/6649553
			if (data.provider == "facebook" && userData.picture) {
				userData.picture = "http://graph.facebook.com/" + data.id + "/picture?type=large";
			}

			create(userData, function (err, newUser) {
				callback(err, newUser);
			});
		}
	});
}

/**
 * A middleware allows user to get access to pages ONLY if the user is already logged in.
 *
 */
var isAuthenticated = function (req, res, next) {
	if (req.isAuthenticated()) {
		next();
	} else {
		res.redirect('/');
	}
}

module.exports = {
	create,
	findOne,
	findAll,
	findById,
	updateById,
	isOnline,
	findOrCreate,
	isAuthenticated,
	isBlocked,
	isIPBlocked,
	isMuted
};
