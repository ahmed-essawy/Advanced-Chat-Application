'use strict';

var config = require('../config');
var redis = require('redis').createClient;
var adapter = require('socket.io-redis');

var User = require('../models/user');

/**
 * Encapsulates all code for emitting and listening to socket events
 *
 */
var ioEvents = function (io) {

	let allUsers = [];
	let onlineUsers = [];
	let sockets = [];

	// Chatroom namespace
	io.on('connection', function (socket) {

		if (socket.request.session.passport == null) return;

		const userId = socket.request.session.passport.user;
		let userName = '';

		User.isOnline(userId, true);

		User.findById(userId, (err, user) => {
			if (err) throw err;
			socket.emit('Set User', user);
		});

		User.findAll({}, (err, users) => {
			if (err) console.log(err);

			allUsers = users.sort(function (x, y) {
				return y.isOnline - x.isOnline;
			});
			User.findById(userId, (err, user) => {
				if (err) console.log(err);
				onlineUsers.push(user);
				sockets.push({ userId: user._id, socketId: socket.id })

				io.emit('User Joined', user, true);
			})
		});


		// When a socket exits
		socket.on('disconnect', function () {
			const userId = socket.request.session.passport.user;

			// Check if user exists in the session
			if (socket.request.session.passport == null) return;

			User.isOnline(userId, false);

			onlineUsers.forEach((user) => {
				if (user._id == userId) {
					onlineUsers.splice(onlineUsers.indexOf(user), 1);
				}
			});
			sockets.forEach((sockt) => {
				if (sockt.socketId == socket.id) {
					sockets.splice(sockets.indexOf(sockt), 1);
				}
			});

			io.emit('User Left', userId);
		});

		// When a new message arrives
		socket.on('New Message', function (message) {
			const userId = socket.request.session.passport.user;
			User.findById(userId, (err, user) => {
				if (err) console.log(err);
				io.sockets.emit('Comming Message', { id: Date.now(), date: new Date().toUTCString(), message: message, sender: user });
			})
		});

		// Mention someone
		socket.on('Message Sound', function (username) {
			User.findOne({ username: username }, (err, user) => {
				if (err) console.log(err);
				var mentionedSocket = sockets.filter((soket) => soket.userId.toString() === user._id.toString());
				if (mentionedSocket.length > 0) io.sockets.connected[mentionedSocket[0].socketId].emit('Comming Sound');
			})
		});

		// Delete message
		socket.on('Delete Message', function (msgId) {
			const userId = socket.request.session.passport.user;
			User.findById(userId, (err, user) => {
				if (err) console.log(err);
				if (user.role === "Owner" || user.role === "Manager" || user.role === "Moderator")
					io.sockets.emit('Delete Message', msgId);
			});
		});

	});

}

/**
 * Initialize Socket.io
 * Uses Redis as Adapter for Socket.io
 *
 */
var init = function (app) {

	var server = require('http').Server(app);
	var io = require('socket.io')(server);

	// Force Socket.io to ONLY use "websockets"; No Long Polling.
	io.set('transports', ['websocket']);

	// Using Redis
	let port = config.redis.port;
	let host = config.redis.host;
	let password = config.redis.password;
	let pubClient = redis(port, host, { auth_pass: password });
	let subClient = redis(port, host, { auth_pass: password, return_buffers: true, });
	io.adapter(adapter({ pubClient, subClient }));

	// Allow sockets to access session data
	io.use((socket, next) => {
		require('../session')(socket.request, {}, next);
	});

	// Define all Events
	ioEvents(io);

	// The server object will be then used to list to a port number
	return server;
}

module.exports = init;