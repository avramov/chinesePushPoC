/**
 * Created by U324210 on 22-03-2016.
 */

var denetworks = require('../controllers/denetwork.server.controller');
var authorization = require('../controllers/authorization.server.controller');
module.exports = function(app) {

    // Get all denetworks
    app.get('/api/v1/denetworks/', authorization.requiresLogin, denetworks.getAll);

    // Get a number of denetworks in the system
    app.get('/api/v1/denetworks/count', authorization.requiresLogin, denetworks.getCount);

    // Get all the details for a specific DE Network
    app.get('/api/v1/denetworks/:denetwork', authorization.requiresLogin, denetworks.findOne);

    // Update denetwork details
    app.post('/api/v1/denetworks/update', authorization.requiresLogin, denetworks.updateDENetwork);
};
