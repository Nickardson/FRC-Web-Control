define([], function () {
	var ws = {};

	/**
	 * Connects to a websocket on the page's server.
	 * @param  {String} suburl (Optional) The path on the server to create the websocket at.
	 * @return {WebSocket} The connected websocket
	 */
	ws.connect = function (suburl) {
		suburl = suburl || "";
		console.log("Connecting to WebSocket at:", document.location.host + suburl);
		var socket = new WebSocket("ws://" + document.location.host + suburl);

		// When the connection is open, send some data to the server
		socket.onopen = function (event) {
			socket.send("WebSocket has been connected!");

			console.log("Connected to server.");

			// Ping because NanoHTTPD doesn't keepalive.
			setInterval(function () {
				if (socket.readyState == WebSocket.OPEN) {
					socket.send("");
				}
			}, 5000);
		};

		socket.onmessage = function (e) {

		};

		socket.onclose = function (e) {
			console.log('WebSocket Close:',  e);
		};

		socket.onerror = function (error) {
			console.log('WebSocket Error:',  error);
		};

		return socket;
	};

	return ws;
});