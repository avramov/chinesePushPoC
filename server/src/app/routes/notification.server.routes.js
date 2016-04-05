/**
 * Created by U324210 on 22-03-2016.
 */
var notifications = require('../controllers/notification.server.controller');
var authorization = require('../controllers/authorization.server.controller');
module.exports = function(app) {

    // Get all notifications
    app.get('/api/v1/notifications/getall', authorization.requiresLogin, notifications.getAll);

    // Get a number of notifications in the system
    app.get('/api/v1/notifications/getcount', authorization.requiresLogin, notifications.getCount);

    // Get a notification count for specific Distric Energy Network
    app.get('/api/v1/notifications/getcount/:denetwork', authorization.requiresLogin, notifications.getCountForNetwork);


    // Get all notifications for a specific DE Network
    app.get('/api/v1/notifications/:denetwork', authorization.requiresLogin, notifications.findAllForNetwork);

};