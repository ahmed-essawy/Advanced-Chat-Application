'use strict';

var requestIp = require('request-ip');
var IP = require('../models/ip');

var init = function (req, res, next) {
	IP.findByIP(req.clientIp, (err, data) => {
		if (err) throw err;
		if (!data) IP.create({ IP: req.clientIp });
		IP.isBlocked(req, res, next)
	});
}

module.exports = {
	requestIp: requestIp.mw(),
	checkIP: init
};