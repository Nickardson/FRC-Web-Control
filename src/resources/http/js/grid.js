/**
 * Creates a grid.
 */
define([], function () {
	var grid = {};

	var gridster = $(".gridster ul").gridster({
        widget_margins: [3, 3],
        widget_base_dimensions: [100, 50],
        
        resize: {
        	enabled: true
        },

        serialize_params: function($w, wgd) {
        	return {
        		col: wgd.col,
        		row: wgd.row,
        		size_x: wgd.size_x,
        		size_y: wgd.size_y
        	};
        }
    }).data('gridster');

	/**
	 * The gridster instance for the main grid
	 * @type {Gridster}
	 */
    grid.gridster = gridster;

    gridster.disable();
    gridster.disable_resize();

    // Button to toggle move/resize
    var draggable = false;

    /**
     * Toggles whether grid elements are movable/resizable
     */
    grid.toggleMovable = function () {
    	draggable = !draggable;

    	if (draggable) {
    		gridster.enable();
    		gridster.enable_resize();
    	} else {
    		gridster.disable();
    		gridster.disable_resize();
    		
    	}
    };

    /**
     * @return {Boolean} Whether the grid elements are movable/resizable.
     */
    grid.isMovable = function() {
    	return draggable;
    };

    return grid;
});