/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name  : event_dispatcher.js
* Purpose    :
* Created at : 2015-09-30
* Updated at : 2015-09-30
* Author     : jeefo
_._._._._._._._._._._._._._._._._._._._._.*/

"use strict";

function EventDispatcher () {
	this.events = {};
}
var p = EventDispatcher.prototype;

p.on = function (event_name, event_handler) {
	this.events[event_name] = this.events[event_name] || [];
	this.events[event_name].push(event_handler);
	return this;
};

p.off = function (event_name, event_handler) {
	var events = this.events[event_name], i, len;

	if (events) {
		for (i = 0, len = events.length; i < len; ++i) {
			if (events[i] === event_handler) {
				events.splice(i, 1);
				break;
			}
		}
	}
};

p.emit = function (event_name, data) {
	var events = this.events[event_name];
	if (events) {
		events.forEach(function (event_handler) {
			event_handler(data);
		});
	}
};

var events = new EventDispatcher();

module.exports = {
	on : function (event_name, event_handler) {
		events.on(event_name, event_handler);
		return this;
	},
	off : function (event_name, event_handler) {
		events.off(event_name, event_handler);
		return this;
	},
	emit : function (event_name, data) {
		events.emit(event_name, data);
		return this;
	}
};
