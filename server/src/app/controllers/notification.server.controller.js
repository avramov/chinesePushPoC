/**
 * Created by U324210 on 22-03-2016.
 */
var mongoose = require('mongoose');	// mongoose for mongodb
require('../models/notification.server.model');
var Notification = mongoose.model('Notification');
var jwt = require('jsonwebtoken');	// used to create, sign, and verify tokens
var config = require('../../config');

exports.getAll = function(req, res) {

    Notification.find({}, function(err, notifications){
        console.log(notifications);
        res.json(notifications);
    });
};


exports.findAllForNetwork = function(req, res) {

    Notification.find({denetwork: req.params.denetwork}, function(err, notifications){
        console.log(notifications);
        res.json(notifications);
    });
};



// Get a count of all the notifications raised in the system
exports.getCount = function(req, res) {

    console.log("Getting notification count");

    Notification.find({}, 'name', function(err, notifications){
        console.log(notifications);

        if(err) {
            res.send(err);
        }

        res.json({count: notifications.length});
    });
};


// Get a count of the notifications associated with the specified de network
exports.getCountForNetwork = function(req, res) {
    console.log("Getting number of notifications for DE Network");

    Notification.find({denetwork: req.params.denetwork}, 'name', function(err, notifications){
        console.log(notifications);

        if(err) {
            res.send(err);
        }

        res.json({count: notifications.length});
    });
};