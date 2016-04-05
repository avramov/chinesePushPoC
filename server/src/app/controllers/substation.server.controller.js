/**
 * Created by U324210 on 22-03-2016.
 */

var mongoose = require('mongoose');	// mongoose for mongodb
require('../models/substation.server.model');
var Substation = mongoose.model('Substation');


exports.findOne = function(req, res){

    Substation.findOne({
        macaddress: req.params.macaddress
    }).select('-connstring').exec(function(err, substation) {
        if(err) {
            res.send(err);
        }

        res.json(substation);
    });
};

exports.getCount = function(req, res) {

    console.log("Getting substation count");


    Substation.find({status: {$gt: -1}}, function(err, substations){
        console.log(substations);

        if(err) {
            res.send(err);
        }

        res.json({count: substations.length});
    });
};



// Get all substations
exports.getAll = function(req, res) {
    console.log("Getting all Substations");

    Substation.find({status: {$gt: -1}}).select('-connstring').exec(function(err, substations){
        console.log(substations);

        if(err) {
            res.send(err);
        }

        res.json(substations);
    });
};


// Get all substations under a specific DE Network
exports.getAllForNework = function(req, res) {
    console.log("Getting all Substations for a specific DE Network");

    Substation.find({status: {$gt: -1}, denetwork: req.params.denetwork}).select('-connstring').exec(function(err, substations){
        console.log(substations);

        if(err) {
            res.send(err);
        }

        res.json(substations);
    });
};

exports.activateSubstation = function(req, res){

    console.log("Activating substation");

    if (req.body.macaddress.length == 16) {


        Substation.findOne({macaddress: req.body.macaddress}).lean().exec(function(err, substation){

            console.log(substation);

            if(err) {
                res.send(err);
            }

            if (substation.connstring == req.body.connstring) {
                var substationDetails = {
                    name: req.body.name,
                    branchname: req.body.branchname,
                    status: 0,
                    kvm: req.body.kvm,
                    address: req.body.address,
                    denetwork: req.body.denetwork
                };

                Substation.update({macaddress: req.body.macaddress}, { $set: substationDetails}, function (err, substation) {
                    if (err) {
                        res.send(err);
                    }

                    res.send(substation);
                });
            } else {
                res.send("Incorrect Connection String");
            }

        });

    }
    else {
        res.send("Invalid MAC Address");
    }
};

exports.deactivateSubstation = function(req, res){

    console.log("Deactivating substation");

    if (req.body.macaddress.length == 16) {


        Substation.findOne({macaddress: req.body.macaddress}).lean().exec(function(err, substation){

            console.log(substation);

            if(err) {
                res.send(err);
            }

            var substationDetails = {
                status: -1
            };

            Substation.update({macaddress: req.body.macaddress}, { $set: substationDetails}, function (err, substation) {
                if (err) {
                    res.send(err);
                }

                res.send(substation);
            });

        });

    }
    else {
        res.send("Invalid MAC Address");
    }
};

