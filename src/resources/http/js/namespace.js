/**
 * Namespace handles string messages.
 *
 * {@link namespace.handle} Accepts strings such as:
 * Namespace:Data
 * Namespace:Comma;Separated;Values
 *
 * It then calls the handler added by {@link namespace.add} with:
 * (comma separated values, full text, namespace)
 */
define([], function () {
	/**
	 * Splits a string into at most {count} different values.
	 * Any values that would have been split past the last one will instead be part of the last one.
	 * @example
	 * splitMax("A:B:C", ":", 2) // == ["A", "B:C"]
	 * splitMax("A:B:C:D:E", ":", 3) // == ["A", "B", "C:D:E"]
	 * @param  {String} str   The string to split
	 * @param  {String} sep   The separator
	 * @param  {Number} count The maximum number of strings to return
	 * @return {Array[String]}       An array of the split strings.
	 */
	function splitMax(str, sep, count) {
		var ls = str.split(sep);

		for (var i = count; i < ls.length; i++) {
			ls[count - 1] += sep + ls[i];
		}

		return ls.splice(0, count);
	}

	var namespace = {};
	var preferredArgs = {};

	namespace.add = function (name, count, handle) {
		preferredArgs[name] = count;
		namespace[name] = handle;
	};

	namespace.handle = function (msg) {
		var ind = msg.data.indexOf(":");
		var ns = msg.data.substring(0, ind);
		var data = msg.data.substring(ind + 1);

		var s = splitMax(data, ";", preferredArgs[ns]);
		namespace[ns](s, msg, ns);
	};

	return namespace;
});