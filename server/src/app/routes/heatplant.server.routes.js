/**
 * Created by U324210 on 22-03-2016.
 */

var heatplants = require('../controllers/heatplant.server.controller');
var authorization = require('../controllers/authorization.server.controller');
module.exports = function(app) {

    // Get all heatplants
    app.get('/api/v1/heatplants/getall', authorization.requiresLogin, heatplants.getAll);

    // Get a number of heatplants in the system
    app.get('/api/v1/heatplants/getcount', authorization.requiresLogin, heatplants.getCount);

    // Get all heatplants for a specific network
    app.get('/api/v1/heatplants/getall/:denetwork', authorization.requiresLogin, heatplants.getAllForNework);

    // Get specific heatplant's details
    app.get('/api/v1/heatplants/:heatplant', authorization.requiresLogin, heatplants.findOne);

    // Update heatplant's details
    app.post('/api/v1/heatplants/update', authorization.requiresLogin, heatplants.updateHeatplant);
};