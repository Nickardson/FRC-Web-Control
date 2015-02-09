/**
 * A widget is used to render a NetworkTable value.
 * It handles all interaction of the html element.
 *
 * A widget is bound to a certain class name
 */
define([], function () {
	var widget = {};

	widget.registered = {};

	widget.add = function (names, opt) {
		if (typeof names == "string") {
			names = [names];
		}

		for (var i = 0; i < names.length; i++) {
			widget.registered[names[i]] = opt;
		}
	};

	widget.get = function (name) {
		return widget.registered[name];
	};

	return widget;
});