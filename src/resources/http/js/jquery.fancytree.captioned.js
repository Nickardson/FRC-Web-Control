(function($, undefined) {
    // Adding methods
    // --------------

    // New member functions can be added to the `Fancytree` class.
    // This function will be available for every tree instance.
    //
    //     var tree = $("#tree").fancytree("getTree");
    //     tree.countSelected(false);

    $.ui.fancytree._FancytreeClass.prototype.countSelected = function(topOnly) {
        var tree = this,
            treeOptions = tree.options;
        return tree.getSelectedNodes(topOnly).length;
    };


    // The `FancytreeNode` class can also be easily extended. This would be called
    // like
    //
    //     node.toUpper();

    $.ui.fancytree._FancytreeNodeClass.prototype.toUpper = function() {
        var node = this;
        return node.setTitle(node.title.toUpperCase());
    };


    // Finally, we can extend the widget API and create functions that are called
    // like so:
    //
    //     $("#tree").fancytree("widgetMethod1", "abc");

    $.ui.fancytree.prototype.widgetMethod1 = function(arg1) {
        var tree = this.tree;
        return arg1;
    };


    // Register a Fancytree extension
    // ------------------------------
    // A full blown extension, extension is available for all trees and can be
    // enabled like so (see also the [live demo](http://wwwendt.de/tech/fancytree/demo/sample-ext-childcounter.html)):
    //
    //    <script src="../src/jquery.fancytree.js" type="text/javascript"></script>
    //    <script src="../src/jquery.fancytree.childcounter.js" type="text/javascript"></script>
    //    ...
    //
    //     $("#tree").fancytree({
    //         extensions: ["childcounter"],
    //         childcounter: {
    //             hideExpanded: true
    //         },
    //         ...
    //     });
    //


    /* 'childcounter' extension */
    $.ui.fancytree.registerExtension({
        // Every extension must be registered by a unique name.
        name: "captioned",
        // Version information should be compliant with [semver](http://semver.org)
        version: "1.0.0",

        // Extension specific options and their defaults.
        // This options will be available as `tree.options.childcounter.hideExpanded`

        options: {
            deep: true,
            hideZeros: true,
            hideExpanded: false
        },

        // Attributes other than `options` (or functions) can be defined here, and
        // will be added to the tree.ext.EXTNAME namespace, in this case `tree.ext.childcounter.foo`.
        // They can also be accessed as `this._local.foo` from within the extension
        // methods.
        foo: 42,

        // Local functions are prefixed with an underscore '_'.
        // Callable as `this._local._appendCounter()`.

        _appendCounter: function(bar) {
            var tree = this;
        },

        // **Override virtual methods for this extension.**
        //
        // Fancytree implements a number of 'hook methods', prefixed by 'node...' or 'tree...'.
        // with a `ctx` argument (see [EventData](http://www.wwwendt.de/tech/fancytree/doc/jsdoc/global.html#EventData)
        // for details) and an extended calling context:<br>
        // `this`       : the Fancytree instance<br>
        // `this._local`: the namespace that contains extension attributes and private methods (same as this.ext.EXTNAME)<br>
        // `this._super`: the virtual function that was overridden (member of previous extension or Fancytree)
        //
        // See also the [complete list of available hook functions](http://www.wwwendt.de/tech/fancytree/doc/jsdoc/Fancytree_Hooks.html).

        /* Init */
        // `treeInit` is triggered when a tree is initalized. We can set up classes or
        // bind event handlers here...
        treeInit: function(ctx) {
            console.log('tree init');
            var tree = this, // same as ctx.tree,
                opts = ctx.options,
                extOpts = ctx.options.childcounter;
            // Optionally check for dependencies with other extensions
            /* this._requireExtension("glyph", false, false); */
            // Call the base implementation
            this._superApply(arguments);
            // Add a class to the tree container
            this.$container.addClass("fancytree-ext-childcounter");
        },

        // Destroy this tree instance (we only call the default implementation, so
        // this method could as well be omitted).

        treeDestroy: function(ctx) {
            this._superApply(arguments);
        },

        // Overload the `renderTitle` hook, to append a counter badge
        nodeRenderTitle: function(ctx, title) {
            var node = ctx.node;
            // Let the base implementation render the title
            this._superApply(arguments);
            
            // Append a name change
            if (node.data.caption) {
            	$(node.span).find(".fancytree-title").html(node.title + '<span class="fancytree-ext-captioned-sep"></span>' + '<span class="fancytree-ext-captioned-caption">' + node.data.caption + '</span>');
            }
        },
        // Overload the `setExpanded` hook, so the counters are updated
        nodeSetExpanded: function(ctx, flag, opts) {
            var tree = ctx.tree,
                node = ctx.node;
            // Let the base implementation expand/collapse the node, then redraw the title
            // after the animation has finished
            return this._superApply(arguments).always(function() {
                tree.nodeRenderTitle(ctx);
            });
        }

        // End of extension definition
    });
    // End of namespace closure
}(jQuery));
