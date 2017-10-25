'use strict';

var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');

var User = require('../models/user');

var userRoles = { Owner: ['Normal', 'VIP', 'Moderator', 'Manager'], Manager: ['Normal', 'VIP', 'Moderator'], Moderator: ['Normal', 'VIP',] };

// Home page
router.get('/', function (req, res, next) {
	// If user is already logged in, then redirect to rooms page
	let onlineList = [], usersList = [];
	User.findAll({}, (err, users) => {
		if (err) throw err;
		onlineList = users.filter(function (x) {
			return x.isOnline;
		}).sort(function (a, b) {
			if (a.username < b.username) return -1;
			if (a.username > b.username) return 1;
			return 0;
		}).sort(function (x, y) {
			var xRoleNum, yRoleNum;
			if (x.role === "Owner") xRoleNum = 0;
			else if (x.role === "Manager") xRoleNum = 1;
			else if (x.role === "Moderator") xRoleNum = 2;
			else if (x.role === "VIP") xRoleNum = 3;
			else if (x.role === "Normal") xRoleNum = 4;
			if (y.role === "Owner") yRoleNum = 0;
			else if (y.role === "Manager") yRoleNum = 1;
			else if (y.role === "Moderator") yRoleNum = 2;
			else if (y.role === "VIP") yRoleNum = 3;
			else if (y.role === "Normal") yRoleNum = 4;
			return xRoleNum - yRoleNum;
		});
		usersList = users.sort(function (a, b) {
			if (a.username < b.username) return -1;
			if (a.username > b.username) return 1;
			return 0;
		}).sort(function (x, y) {
			var xRoleNum, yRoleNum;
			if (x.role === "Owner") xRoleNum = 0;
			else if (x.role === "Manager") xRoleNum = 1;
			else if (x.role === "Moderator") xRoleNum = 2;
			else if (x.role === "VIP") xRoleNum = 3;
			else if (x.role === "Normal") xRoleNum = 4;
			if (y.role === "Owner") yRoleNum = 0;
			else if (y.role === "Manager") yRoleNum = 1;
			else if (y.role === "Moderator") yRoleNum = 2;
			else if (y.role === "VIP") yRoleNum = 3;
			else if (y.role === "Normal") yRoleNum = 4;
			return xRoleNum - yRoleNum;
		});

		if (req.user) User.updateById(req.user._id, { IP: req.clientIp });
		if (req.user && (req.user.isBlocked || req.user.isIPBlocked)) {
			// remove the req.user property and clear the login session
			req.logout();
			// destroy session data
			req.session = null;
		}
		res.render('index', { isAuthenticated: req.isAuthenticated(), user: req.user, usersList: usersList, onlineUsers: onlineList, userRolesOfOwner: userRoles.Owner, userRolesOfManager: userRoles.Manager, userRolesOfModerator: userRoles.Moderator });
		// if (req.user && !req.user.isOnline)
		// 	res.render('index', { isAuthenticated: req.isAuthenticated(), user: req.user, usersList: usersList, onlineUsers: onlineList });
		// else
		// 	res.render('index', { isAuthenticated: false, user: req.user, usersList: usersList, onlineUsers: onlineList });
	})
});

// Login
router.post('/login', passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/',
	failureFlash: true
}));

// Register via username and password
router.post('/register', function (req, res, next) {
	if (req.body.email === '' || req.body.username === '' ||
		req.body.password1 === '' || req.body.password1 !== req.body.password2) {
		req.flash('error', 'Missing credentials');
		req.flash('showRegisterForm', true);
		res.redirect('/');
	} else {
		let credentials = { 'email': req.body.email, 'username': req.body.username, 'password': req.body.password1, 'IP': req.clientIp };
		// Check if the username already exists for non-social account
		User.findOne({ $or: [{ 'email': new RegExp('^' + credentials.email + '$', 'i') }, { 'username': new RegExp('^' + credentials.username + '$', 'i') }] }, function (err, user) {
			if (err) throw err;
			if (user) {
				req.flash('error', 'Email or Username already exists.');
				req.flash('showRegisterForm', true);
				res.redirect('/');
			} else {
				User.create(credentials, function (err, newUser) {
					if (err) throw err;
					req.flash('success', 'Your account has been created. Please log in.');
					req.body.username = credentials.username;
					req.body.password = credentials.password;
					next();
				});
			}
		});
	}
}, passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/',
	failureFlash: true
}));

// Update account
router.post('/user/role', [User.isAuthenticated, function (req, res, next) {
	User.updateById(req.body.userId, { role: req.body.role });
	res.end();
}]);
router.post('/user/block', [User.isAuthenticated, function (req, res, next) {
	User.isBlocked(req.body.userId, req.body.isBlocked);
	res.end();
}]);
router.post('/user/mute', [User.isAuthenticated, function (req, res, next) {
	User.isMuted(req.body.userId, req.body.isMuted);
	res.end();
}]);

// Block IP
router.post('/blockIP', [User.isAuthenticated, function (req, res, next) {
	User.findById(req.body.userId, (err, user) => {
		User.isIPBlocked(user._id, req.body.state)
	})
	res.end();
}]);

// Mentions
router.post('/mention', [User.isAuthenticated, function (req, res, next) {
	var term = req.body.term;
	User.findAll({ username: { "$regex": term, "$options": "i" } }, (err, users) => {
		if (err) throw err;
		var onlineSortedUsers = users.filter(function (x) {
			return x.isOnline;
		}).sort(function (a, b) {
			if (a.username < b.username) return -1;
			if (a.username > b.username) return 1;
			return 0;
		}).sort(function (x, y) {
			var xRoleNum, yRoleNum;
			if (x.role === "Owner") xRoleNum = 0;
			else if (x.role === "Manager") xRoleNum = 1;
			else if (x.role === "Moderator") xRoleNum = 2;
			else if (x.role === "VIP") xRoleNum = 3;
			else if (x.role === "Normal") xRoleNum = 4;
			if (y.role === "Owner") yRoleNum = 0;
			else if (y.role === "Manager") yRoleNum = 1;
			else if (y.role === "Moderator") yRoleNum = 2;
			else if (y.role === "VIP") yRoleNum = 3;
			else if (y.role === "Normal") yRoleNum = 4;
			return xRoleNum - yRoleNum;
		});
		res.json(onlineSortedUsers).end();
	})
}]);

// Logout
router.get('/logout', function (req, res, next) {
	// remove the req.user property and clear the login session
	req.logout();
	// destroy session data
	req.session = null;
	// redirect to homepage
	res.redirect('/');
});

module.exports = router;