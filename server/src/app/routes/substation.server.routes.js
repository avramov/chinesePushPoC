/**
 * Created by U324210 on 22-03-2016.
 */

var substations = require('../controllers/substation.server.controller');
var authorization = require('../controllers/authorization.server.controller');
module.exports = function(app) {

    // Get all substations
    app.get('/api/v1/substations/getall', authorization.requiresLogin, substations.getAll);

    // Get a number of substations in the system
    app.get('/api/v1/substations/getcount', authorization.requiresLogin, substations.getCount);

    // Get all substations for a specific network
    app.get('/api/v1/substations/getall/:denetwork', authorization.requiresLogin, substations.getAllForNework);

    // Get specific substation's details
    app.get('/api/v1/substations/:macaddress', authorization.requiresLogin, substations.findOne);

    // Activate substation (the substations exist as dormant from when they are connected to the cloud but only appear in the Dashboard and are part of the control algorithm when activated
    app.post('/api/v1/substations/activate', authorization.requiresLogin, substations.activateSubstation);

    app.post('/api/v1/substations/deactivate', authorization.requiresLogin, substations.deactivateSubstation);

};