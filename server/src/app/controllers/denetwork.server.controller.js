/**
 * Created by U324210 on 22-03-2016.
 */

var mongoose = require('mongoose');	// mongoose for mongodb
require('../models/denetwork.server.model');
var DENetwork = mongoose.model('DENetwork');


exports.findOne = function(req, res){

    DENetwork.findOne({
        id: req.params.denetwork
    }, function(err, denetwork) {
        if(err) {
            res.send(err);
        }

        res.json(denetwork);
    });
};

exports.getCount = function(req, res) {

    console.log("Getting denetwork count");


    DENetwork.find({}, function(err, denetworks){
        console.log(denetworks);

        if(err) {
            res.send(err);
        }

        res.json({count: denetworks.length});
    });

};


// Get all denetworks
exports.getAll = function(req, res) {
    console.log("Getting all DE Networks");

    DENetwork.find({}, function(err, denetworks){
        console.log(denetworks);

        if(err) {
            res.send(err);
        }

        res.json(denetworks);
    });
};

// Update DE Network
exports.updateDENetwork = function(req, res) {
    console.log("Updating details of the DENetwork");

    var denetworkDetails = {
        name: req.body.name,
        optimizationtype: req.body.optimizationtype
    };

    DENetwork.update({id: req.body.id}, { $set: denetworkDetails}, function (err, denetwork) {
        if (err) {
            res.send(err);
        }

        res.send(denetwork);
    });
};