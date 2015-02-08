console.log("Connecting to WebSocket at:", document.location.host);
var socket = new WebSocket("ws://" + document.location.host);

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