'use strict';

var ipModel = require('../database').models.ip;

var create = function (data, callback) {
	var newIP = new ipModel(data);
	newIP.save(callback);
};

var find = function (data, callback) {
	ipModel.find(data, callback);
}

var findOne = function (data, callback) {
	ipModel.findOne(data, callback);
}

var findByIP = function (IP, callback) {
	ipModel.findOne({ IP: IP }, callback);
}

var blockIP = function (IP, state, callback) {
	ipModel.findOne({ IP: IP }, (err, data) => {
		if (err) throw err;
		data.isBlocked = state;
		data.save();
	});
}

var isBlocked = function (req, res, next) {
	findOne({ IP: req.clientIp }, (err, data) => {
		if (data && data.isBlocked) res.status(403).end();
		else next();
	});
}

module.exports = {
	create,
	find,
	findOne,
	findByIP,
	blockIP,
	isBlocked
};
