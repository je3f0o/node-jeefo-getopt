/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name  : getopt.js
* Purpose    :
* Created at : 2015-09-29
* Updated at : 2015-09-30
* Author     : jeefo
_._._._._._._._._._._._._._._._._._._._._.*/

"use strict";

var events        = require("./event_dispatcher"),
	parsed_option = require("./parsed_option");

require("./error_messages").Create().bind_events();

var REGEX_LONG_OPTION         = /^\-\-[a-z][a-z\-]+$/;
var REGEX_SHORT_OPTION        = /^\-[a-zA-Z]+$/;
var REGEX_CAPTURE_LONG_OPTION = /^([a-z][a-z\-]+)/;

function Options (options) {
	this.options      = {};
	this.long_names   = [];
	this.short_names  = [];
	this.user_argv    = [];
	this.user_options = {};

	options.forEach(function (option, index) {
		var short_name = option[0] || "",
			definition = option[1] || "",
			comment    = option[2] || "",
			arg_options, matches;

		short_name = short_name.trim();
		definition = definition.trim();

		if (short_name.length > 1) {
			events.emit("error.short_option_length", {
				option : short_name, index : index
			});	
		}
		if (this.short_names.indexOf(short_name) >= 0) {
			events.emit("error.duplicated_short", {
				option : short_name, index : index
			});	
		}
		this.short_names.push(short_name);

		option = {
			comment    : comment.trim(),
			definition : definition,
			short_name : short_name
		};

		matches          = definition.match(REGEX_CAPTURE_LONG_OPTION);
		option.long_name = matches ? matches[1] : "";

		if (this.long_names.indexOf(option.long_name) >= 0) {
			events.emit("error.duplicated_long", {
				option : option.long_name, index : index
			});	
		}
		this.long_names.push(option.long_name);

		if (option.long_name === "" && option.short_name === "") {
			events.emit("error.empty", index);
		}

		arg_options         = definition.substr(option.long_name.length);
		option.has_optional = /^\[.+\]$/.test(arg_options);

		option.has_argument  = arg_options.indexOf("=") !== -1;
		option.multi_support = arg_options.indexOf("+") !== -1;

		var parsed_option_cache = parsed_option(option);
		if (option.short_name) {
			this.options[option.short_name] = parsed_option_cache;
		}
		if (option.long_name) {
			this.options[option.long_name] = parsed_option_cache;
		}
	}, this);

	return this;
}
var p = Options.prototype;

p.get_parsed_option = function (argument) {
	var name, chain, parsed_option;

	if (argument.indexOf("--") === 0) { // long option
		name = argument.substr(2);
		if (this.long_names.indexOf(name) >= 0) {
			parsed_option = this.options[name];
		}
	} else { // single options chain. eg : iptables -nvL
		chain = argument.substr(1).split("");
		name  = chain.pop();

		chain.forEach(function (short_name) {
			if (this.short_names.indexOf(short_name) < 0) {
				events.emit("error.exit", "'" + short_name + "' option is not found.");
			}

			var option = this.options[short_name];

			if (option.is_empty()) {
				this.user_options[short_name] = true;
				if (option.long_name) {
					this.user_options[option.long_name] = true;
				}
			} else {
				events.emit("error.exit", "Option '" + short_name + "' is not chainable.");
			}
		}, this);

		if (this.short_names.indexOf(name) >= 0) {
			parsed_option = this.options[name];
		}
	}

	return parsed_option;
};

p.set_user_option = function (parsed_option) {
	var long_name  = parsed_option.option.long_name,
		short_name = parsed_option.option.short_name;

	if (parsed_option.value) {
		if (long_name) {
			this.user_options[long_name] = parsed_option.value;
		}
		if (short_name) {
			this.user_options[short_name] = parsed_option.value;
		}
	}
};

p.parse = function (args) {
	var last_parsed_option;

	args.forEach(function (arg) {
		var parsed_option;

		if (REGEX_LONG_OPTION.test(arg) || REGEX_SHORT_OPTION.test(arg)) {
			parsed_option = this.get_parsed_option(arg);
		}

		if (parsed_option) {
			if (last_parsed_option) {
				last_parsed_option.validate_value();
				this.set_user_option(last_parsed_option);
			}

			if (parsed_option.has_args()) {
				last_parsed_option = parsed_option;
			} else {
				parsed_option.value = true;
				this.set_user_option(parsed_option);

				last_parsed_option = null;
			}
		} else if (last_parsed_option) {
			last_parsed_option.set_value(arg)
			this.set_user_option(last_parsed_option);

			if (! last_parsed_option.multi_support) {
				last_parsed_option = null;
			}
		} else {
			this.user_argv.push(arg);
		}
	}, this);

	if (last_parsed_option && last_parsed_option.has_args()) {
		last_parsed_option.validate_value();
		this.set_user_option(last_parsed_option);
	}

	return {
		argv    : this.user_argv,
		options : this.user_options
	};
};

p.parse_system = function () {
	return this.parse(process.argv.slice(2));
};

module.exports = function (options) {
	return new Options(options);
};
