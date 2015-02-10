var tree;
require(['ws', 'namespace', 'widget'], function (ws, namespace, widget) {
	var socket = ws.connect("");

	widget.add('java.lang.Double', {
		init: function (base) {
			var e = $('<input type="text" class="widget-double"/>')
				.css({
					'width': '90%'
				})
				.appendTo(base);

			e.change(function () {
				socket.send('Change:' + base.data('key') + ';' + e.val());
			});
		},

		update: function (element, value) {
			var e = element.find('.widget-double');
			e.val(value);
		}
	});

	widget.add('java.lang.Boolean', {
		init: function (base) {
			var e = $('<button class="widget-boolean">???</button>')
				.css({
					'width': '100%',
					'font-family': 'monospace',
					'font-size': '16px'
				})
				.appendTo(base);

			e.click(function () {
				var value = base.data('value');
				
				var newval = (value == 'true') ? 'false' : 'true';

				socket.send('Change:' + base.data('key') + ';' + newval);
				console.log("Changing", base.data('key') + ' with ' + value);
			});
		},

		update: function (element, value) {
			var check = (value == 'true');
			var e = element.find('.widget-boolean');
			e.css('background-color', check ? 'green' : 'red').html(check ? 'True' : 'False');
		}
	});
	
	widget.add('Boolean', {
		init: function (base, settings) {
			var e = $('<span class="widget-boolean">???</span>')
				.css({
					'width': '100%',
					'font-family': 'monospace',
					'font-size': '16px',
					'color': 'white'
				})
				.appendTo(base);
		},

		update: function (element, value) {
			var check = (value == 'true');
			var e = element.find('.widget-boolean');
			e.css('background-color', check ? 'green' : 'red').html(check ? 'True' : 'False');
		}
	});

	var draggable = false;
	$('#drag-btn').click(function () {
		draggable = !draggable;
		
		if (draggable) {
			$(".widget").draggable('enable');
			$("#widgets").removeClass("nomove");
		} else {
			$(".widget").draggable('disable');
			$("#widgets").addClass("nomove");
		}
		
		$(this).html(draggable ? "Dragging is On" : "Dragging is Off");
		$(this).css("background-color", draggable ? "green" : "");
	});
	
	$('#remove-all-widgets-btn').click(function () {
		$('#widgets').empty();
		createdWidgets = {};
	});

	var createdWidgets = {};
	var createdTableRows = {};

	tree = $("#datatree").fancytree({
		source: [],
		extensions: ['captioned'],
		childcounter: {
			deep: true,
			hideZeros: false,
			hideExpanded: false
		},
		checkbox: true
	});

	tree = tree.fancytree('getTree').getRootNode();

	function getTreeNode(node, title) {
		var c = node.getChildren();

		if (c) {
			for (var i = 0; i < c.length; i++) {
				if (c[i].title == title) {
					return c[i];
				}
			}
		}

		return false;
	}

	function getKeyTree(key, value) {
		var levels = key.substring(1).split("/");
		var l = tree;

		for (var i = 0; i < levels.length; i++) {
			var el = getTreeNode(l, levels[i]);

			if (el) {
				l = el;
			} else {
				l = l.addChildren({
					title: levels[i],
					expanded: true,
					folder: i != levels.length - 1,
					caption: value
				});

				tree.sortChildren(null, true);
			}
		}

		return l;
	}

	getKeyTree('/SmartDashboard/Subsystems/DriveTrain/x');
	getKeyTree('/SmartDashboard/Subsystems/DriveTrain/y');

	/**
	 * Handles messages in the form:
	 * NetworkTable:key;isNew;type;value
	 */
	namespace.add("NetworkTable", 4, function (s, message) {
		var key = s[0],
			isNew = s[1],
			type = s[2],
			// removes null characters
			value = s[3].replace(/\0*$/g, '');

		var w = createdWidgets[key];
		var wid = widget.get(type);

		getKeyTree(key, value);

		// Create widget if none exists
		if (w === undefined) {
			var keyName = key;
			if (keyName.indexOf('/SmartDashboard/') === 0) {
				keyName = keyName.substr('/SmartDashboard/'.length);
			}
			var el = $('<div class="widget"><div class="widget-container"><h4 class="widget-keyname">' + keyName + '</h4><span class="nettable-widget"></span></div></div>');
			
			var widgetElement = el.find('.nettable-widget');
			if (wid) {
				widgetElement.data('key', key);
				//createdWidgets[key] = w = grid.gridster.add_widget(el, wid.cols || 3, wid.rows || 1);
				createdWidgets[key] = w = el;
				wid.init(widgetElement);
			} else {
				//createdWidgets[key] = w = grid.gridster.add_widget(el, 3, 1);
				createdWidgets[key] = w = el;
			}
			
			el.appendTo('#widgets').draggable({
				snap: true,
				disabled: true,
				containment: 'parent'
			}).resizable({
				containment: 'parent'
			});
		}

		// Update the value
		if (wid)
			wid.update(w.find('.nettable-widget'), value);
		else
			w.find('.nettable-widget').html(value);

		var no = getKeyTree(key, value);
		no.data.caption = value;
		no.renderTitle();

		w.find('.nettable-widget').data('value', value);

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