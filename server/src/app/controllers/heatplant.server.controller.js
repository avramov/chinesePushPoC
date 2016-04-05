/**
 * Created by U324210 on 22-03-2016.
 */

var mongoose = require('mongoose');	// mongoose for mongodb
require('../models/heatplant.server.model');
var Heatplant = mongoose.model('Heatplant');


exports.findOne = function(req, res){

    Heatplant.findOne({
        id: req.params.heatplant
    }, function(err, heatplant) {
        if(err) {
            res.send(err);
        }

        res.json(heatplant);
    });
};

exports.getCount = function(req, res) {

    console.log("Getting heatplant count");


    Heatplant.find({}, function(err, heatplants){
        console.log(heatplants);

        if(err) {
            res.send(err);
        }

        res.json({count: heatplants.length});
    });
};



// Get all heatplants
exports.getAll = function(req, res) {
    console.log("Getting all Heatplants");

    Heatplant.find({}, function(err, heatplants){
        console.log(heatplants);

        if(err) {
            res.send(err);
        }

        res.json(heatplants);
    });
};

// Get all heatplants under a specific DE Network
exports.getAllForNework = function(req, res) {
    console.log("Getting all Heatplants for a specific DE Network");

    Heatplant.find({denetwork: req.params.denetwork}, function(err, heatplants){
        console.log(heatplants);

        if(err) {
            res.send(err);
        }

        res.json(heatplants);
    });
};

// Update Heatplant
exports.updateHeatplant = function(req, res) {
    console.log("Updating details of the Heatplant");

    var heatplantDetails = {
        name: req.body.name,
        plannedflow: req.body.plannedflow,
        actualflow: req.body.actualflow,
        plannedenergy: req.body.plannedenergy,
        actualenergy: req.body.actualenergy
    };

    Heatplant.update({id: req.body.id}, { $set: heatplantDetails}, function (err, heatplant) {
        if (err) {
            res.send(err);
        }

        res.send(heatplant);
    });
};