var path = require('path');

module.exports = {
    // Helper functions
    root: function (args) {
        args = Array.prototype.slice.call(arguments, 0);
        return path.join.apply(path, [__dirname].concat(args));
    },

    packageSort: function (packages) {
        // packages = ['polyfills', 'vendor', 'app']
        var len = packages.length - 1;
        var first = packages[0];
        var last = packages[len];
        return function sort(a, b) {
            // polyfills always first
            if (a.names[0] === first) {
                return -1;
            }
            // main always last
            if (a.names[0] === last) {
                return 1;
            }
            // vendor before app
            if (a.names[0] !== first && b.names[0] === last) {
                return -1;
            } else {
                return 1;
            }
        };
    }
};