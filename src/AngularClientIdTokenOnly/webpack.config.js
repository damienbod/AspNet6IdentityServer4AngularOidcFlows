/// <binding ProjectOpened='Run - Development' />

var environment = (process.env.NODE_ENV || "development").trim();

if (environment === "development") {
    module.exports = require('./config/webpack.dev.js');
} else {
    module.exports = require('./config/webpack.prod.js');
}