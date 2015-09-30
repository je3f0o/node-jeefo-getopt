/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name  : parsed_option.js
* Purpose    :
* Created at : 2015-09-30
* Updated at : 2015-09-30
* Author     : jeefo
_._._._._._._._._._._._._._._._._._._._._.*/

"use strict";

var event_dispatcher = require("./event_dispatcher");

function ParsedOption (option) {
	this.option = option;
	return this;
}
var p = ParsedOption.prototype;

p.validate_value = function () {
	var value  = this.value;
	var option = this.option;
	var has_not_single_argument, has_not_multiple_argument;

	if (! option.has_optional) {
		has_not_single_argument   = option.has_argument && ! value;
		has_not_multiple_argument = option.multi_support && (! value || value.length === 0);

		if (has_not_single_argument || has_not_multiple_argument) {
			var name = "";

			if (option.short_name) {
				name += "-" + option.short_name;
			}
			if (option.long_name) {
				if (name) {
					name += ", ";
				}
				name += "--" + option.long_name;
			}

			var message = "Option '" + name + "' is require argument.";
			event_dispatcher.emit("error.exit", message);
		}
	}
};

p.is_empty = function () {
	var option = this.option;

	// caching
	if (typeof option.is_empty === "undefined") {
		option.is_empty = true;

		["has_optional", "has_argument", "multi_support"].forEach(function (prop) {
			if (option.is_empty) {
				option.is_empty = ! option[prop];
			}
		}, this);
	}

	return option.is_empty;
};

p.set_value = function (value) {
	if (this.option.multi_support) {
		this.value = this.value || [];
		this.value.push(value);
	} else {
		this.value = value;
	}
};

p.has_args = function () {
	return ! this.is_empty();
};

module.exports = function (option) {
	return new ParsedOption(option);
};
