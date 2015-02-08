require(['ws', 'grid', 'namespace'], function (ws, grid, namespace) {
	var socket = ws.connect("");

	$('#drag-btn').click(function () {
		grid.toggleMovable();

		if (grid.isMovable()) {
			$(this).html("Draggable/Resizable");
		} else {
			$(this).html("Not Draggable/Resizable");
		}
	});

	var widgets = {

	};

	/**
	 * Handles messages in the form:
	 * NetworkTable:key;isNew;type;value
	 */
	namespace.add("NetworkTable", 4, function (s, message) {
		var key = s[0],
			isNew = s[1],
			type = s[2],
			value = s[3];

		var w = widgets[key];

		// Create widget if none exists
		if (w === undefined) {
			var el = $('<li class="new"><div class="widget-container"><h4>' + key + '</h4><span class="nettable-widget"></span></div></li>');
			widgets[key] = w = grid.gridster.add_widget(el, 3, 1);
		}

		// Update the value
		w.find('.nettable-widget').html(value);

		console.log(key, isNew, type, value);
	});

	// Handle any incoming messages
	socket.addEventListener("message", function (m) {
		namespace.handle(m);
	});

	// Request a full update upon startup
	socket.addEventListener("open", function (m) {
		socket.send("FullUpdate:false");
	});
});