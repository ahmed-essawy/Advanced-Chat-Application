'use strict';

var register = function (Handlebars) {
	var helpers = {
		// put all of your helpers inside this object
		ifEqual: function (a, b, z) {
			if (a === b)
				return z.fn(this);
			else
				return;
		},
		unlessEqual: function (a, b, z) {
			if (a === b)
				return;
			else
				return z.fn(this);
		},
		unlessEqualOr: function (a, b, c, z) {
			if (a === b || a === c)
				return;
			else
				return z.fn(this);
		},
		ifEqualOr: function (a, b, c, z) {
			if (a === b || a === c)
				return z.fn(this);
			else
				return;
		},
		unlessIncludes: function (a, b, c, d, z) {
			if (a === b) {
				if (d.includes(c))
					return z.fn(this);
				else
					return;
			}
			else
				return z.fn(this);
		}
	};

	if (Handlebars && typeof Handlebars.registerHelper === "function") {
		// register helpers
		for (var prop in helpers) {
			Handlebars.registerHelper(prop, helpers[prop]);
		}
	} else {
		// just return helpers object if we can't register helpers here
		return helpers;
	}

};

module.exports.register = register;
module.exports.helpers = register(null);  