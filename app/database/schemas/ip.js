'use strict';

var Mongoose = require('mongoose');

var IPSchema = new Mongoose.Schema({
    IP: { type: String, required: true, index: { unique: true } },
    isBlocked: { type: Boolean, default: false },
    Date: { type: Date, default: new Date() }
});

// Create a ip model
var userModel = Mongoose.model('ip', IPSchema);

module.exports = userModel;