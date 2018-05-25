'use strict';

var Protocol = require('azure-iot-device-amqp').Amqp;
var Client = require('azure-iot-device').Client;
var Message = require('azure-iot-device').Message;
var device_config = require("./device_config.json");
var moment = require("moment");
var modbus = require('.'); // Library used for Modbus TCP communication to the ECL
var util = require('util');
var isECLinAutoMode = false;
var currentPlannedFlow = 0;
var currentActuatorPosition = 0;
var totalHeatplantFlow = 0;
var totalHeatplantEnergy = 0;
var currentActuatorState = 1; // 1=STOP; 2=CLOSE; 3=OPEN

var connectionString = device_config.conn_string_device;

var clientModbus = modbus.createTCPClient(device_config.ECL_local_port_nr, device_config.ECL_local_IP_Address),
    cntr        = 0,
    closeClient = function () {
        cntr += 1;
        if (cntr === 5) {
            clientModbus.close();
        }
    };

// fromConnectionString must specify a transport constructor, coming from any transport package.
var client = Client.fromConnectionString(connectionString, Protocol);

var connectCallback = function (err) {
    if (err) {
        console.error('Could not connect: ' + err.message);
    } else {
        console.log('Client connected, ready to start sending messages to the cloud service');
        console.log('Client connected, ready to receive messages from the cloud service');

        client.on('message', function (msg) {
        
	        if (!isECLinAutoMode) {
	            setDeviceToAutoMode();
            } else {
                console.log(msg);
                var data = JSON.parse(msg.data);

                console.log('Id: ' + msg.messageId + ' Body: ' + msg.data);
                client.complete(msg, printResultFor('completed'));
                console.log("Received data from the cloud service: " + data);
                    
                if ((data.message == "MAXIMUM_FLOW_SETTING") || (data.message == "MAXIMUM_FLOW_ENERGY_SETTING")) {
                    console.log("Balancing needed");
                    totalHeatplantFlow = data.totalheatplantflow;
                    setNewActuatorPosition(data.maximumflowpercentage, data.maxflow);
                }
            }
        });

        // Create a message and send it to the IoT Hub at a specified interval
        var sendInterval = setInterval(function () {

            console.log("The device is connected so it can send the data");

            var dataFromECL = {
                "name": device_config.initial_name,
                "devicetype": "substation",
                "macaddress": device_config.mac_address,
                "plannedflow": currentPlannedFlow,
                "actualflow": 0,
                "totalheatplantflow": totalHeatplantFlow,
                "totalheatplantenergy": totalHeatplantEnergy,
                "plannedenergy": 0,
                "actualenergy": 0,
                "supplytemp": 0,
                "returntemp": 0,
                "kvm": device_config.kvm,
                "long": device_config.long,
                "lat": device_config.lat,
                "currentactuatorpos": 0,
                "timestamp": moment().unix(),
                "timestampdatetime": moment().format("YYYY-MM-DD HH:mm:ss")
            };

            // Get the current actual flow from the ECL
            clientModbus.readInputRegister(6008, 1, function (resp, err) {
                console.log('Get the current actual flow from the ECL');
                console.log(resp, err);

                // The flow is sent in l/h
                var actualFlow = (resp.register[0]) / 10;

                dataFromECL.actualflow = actualFlow;

                // Get the current actual energy from the ECL in kW
                clientModbus.readInputRegister(6010, 1, function (resp, err) {
                    console.log('Get the current actual energy from the ECL');
                    console.log(resp, err);

                    // Get the current actuator position in percentage
                    clientModbus.readInputRegister(3994, 1, function (resp, err) {

                    var actuatorPos = (resp.register[0]);

                    dataFromECL.currentactuatorpos = actuatorPos / 100;

                    var message = new Message(JSON.stringify(dataFromECL));

                    console.log('Sending message: ' + message.getData());
                    client.sendEvent(message, printResultFor('send event'));
                    });
                });
            });
        },60*1000); // The ECL device is sending its data at a specified interval

        client.on('error', function (err) {
          console.error(err.message);
        });

        client.on('disconnect', function () {
          clearInterval(sendInterval);
          client.removeAllListeners();
          client.open(connectCallback);
        });
  }
};


// Setting the Device into Auto controlled mode
var setDeviceToAutoMode = function () {

    console.log("Setting the ECL in Auto mode");
	isECLinAutoMode = false;

	clientModbus.readInputRegister(4200, 1, function (resp, err) {

		var currentMode = resp.register[0];
		
		console.log('Current ECL mode is: '+currentMode);
		if (currentMode == 0)
		{
			clientModbus.writeSingleRegister(4200, 2, function (resp, err) {
			    console.log(err, resp);
				isECLinAutoMode = true;
			});
		} else {
		   isECLinAutoMode = true;
		}
	});
};


setTimeout(function() {

    client.open(connectCallback);
    
    if (!isECLinAutoMode) {
    	setDeviceToAutoMode();
    }
}, 5000);



function setNewActuatorPosition(maxFlowPercentage, maxflow) {
    currentPlannedFlow = maxflow;
    console.log("New flow for this substation shall be: "+maxflow);
    console.log("New actuator position for this substation shall be: "+maxFlowPercentage);


    if (!isECLinAutoMode) {
        setDeviceToAutoMode();
    } else {

	if (currentActuatorState == 1) {

        // Start by reading the current position of the actuator in percentage
        clientModbus.readInputRegister(3994, 1, function (resp, err) {
	    currentActuatorPosition = resp.register[0] / 100;            

        console.log("Starting from following actuator position"+currentActuatorPosition);

            if (currentActuatorPosition > maxFlowPercentage) {
                clientModbus.writeSingleRegister(4059, 2, function (resp, err) {
                    console.log("Starting to close the actuator");
                    currentActuatorState = 2;
                });                
            } else {
                clientModbus.writeSingleRegister(4059, 3, function (resp, err) {
                    console.log("Starting to open the actuator");
                    currentActuatorState = 3;
                });
            }

            // Periodically read the current actuator position to see if we have reached the wanted actuator position
            var moveActuator = setInterval(function () {

                // Reading the current position of the actuator in percentage
                clientModbus.readInputRegister(3994, 1, function (resp, err) {
                    currentActuatorPosition = resp.register[0] / 100;
                    console.log("Current actuator position is"+currentActuatorPosition);

                    if (currentActuatorState == 1) {
                        
                        clientModbus.writeSingleRegister(4059, 1, function (resp, err) {
                            console.log("Actuator moving should alredy be stopped");
                            clearInterval(moveActuator);
                        });
                    } else if ((currentActuatorState == 2)&&(Math.floor(currentActuatorPosition) <= Math.floor(maxFlowPercentage))) {
                        clearInterval(moveActuator);
                        clientModbus.writeSingleRegister(4059, 1, function (resp, err) {
                            console.log("Stopping actuator closing");
                            currentActuatorState = 1;
                        });
                    } else if ((currentActuatorState == 3)&&(Math.floor(currentActuatorPosition)>=Math.floor(maxFlowPercentage))) {
                        clearInterval(moveActuator);
                        clientModbus.writeSingleRegister(4059, 1, function (resp, err) {
                            console.log("Stopping actuator opening");
                            currentActuatorState = 1;
                        });
                    }
	            });

            }, 250);
        });
        }
    }
}


// Helper function to print results in the console
function printResultFor(op) {
  return function printResult(err, res) {
      if (err) {
          console.log(op + ' error: ' + err.toString());
      } else {
          console.log(op + ' status: ' + res.constructor.name);
    }
  };
}
