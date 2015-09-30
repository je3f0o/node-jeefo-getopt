/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name  : error_messages.js
* Purpose    :
* Created at : 2015-09-30
* Updated at : 2015-09-30
* Author     : jeefo
_._._._._._._._._._._._._._._._._._._._._.*/

"use strict";

var event_dispatcher = require("./event_dispatcher");

function ErrorMessages (messages) {
	this.messages = {
		empty               : messages.empty               || "Empty option found at index = [INDEX]",
		duplicated_long     : messages.duplicated_long     || "Duplicated long option = '--[OPTION]', at index = [INDEX]",
		duplicated_short    : messages.duplicated_short    || "Duplicated short option = '-[OPTION]', at index = [INDEX]",
		short_option_length : messages.short_option_length || "Short option = '-[OPTION]' must be a single characters, at index = [INDEX]",
	};

	return this;
}
var p = ErrorMessages.prototype;

p.exit = function (message) {
	console.error("ERROR : " + message);
	process.exit(1);
};
p.short_option_length = function (error) {
	var message = this.messages.short_option_length.replace("[OPTION]", error.option).replace("[INDEX]", error.index);
	this.exit(message);
};
p.empty = function (index) {
	var message = this.messages.empty.replace("[INDEX]", index);
	this.exit(message);
};
p.duplicated_short = function (error) {
	var message = this.messages.duplicated_short.replace("[OPTION]", error.option).replace("[INDEX]", error.index);
	this.exit(message);
};
p.duplicated_long = function (error) {
	var message = this.messages.duplicated_long.replace("[OPTION]", error.option).replace("[INDEX]", error.index);
	this.exit(message);
};
p.bind_events = function () {
	event_dispatcher.on("error.exit"                , this.exit);
	event_dispatcher.on("error.empty"               , this.empty.bind(this));
	event_dispatcher.on("error.duplicated_long"     , this.duplicated_long.bind(this));
	event_dispatcher.on("error.duplicated_short"    , this.duplicated_short.bind(this));
	event_dispatcher.on("error.short_option_length" , this.short_option_length.bind(this));
};

module.exports = {
	Create : function (messages) {
		messages = messages || {};
		return new ErrorMessages(messages);
	}
};
