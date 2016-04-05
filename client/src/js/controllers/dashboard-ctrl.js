/**
 * Created by U324210 on 24-02-2016.
 */

/**
 * Dashboard Controller
 */


angular
    .module('RDash')
    .controller('DashboardCtrl', ['$scope', '$http', '$interval', "NgMap", 'moment', '$confirm', 'loginService', DashboardCtrl]);

function DashboardCtrl($scope, $http, $interval, NgMap, moment, $confirm, loginService) {

    $scope.demoConf = false;
    var apiUrl = "http://ec2-54-187-243-139.us-west-2.compute.amazonaws.com/";

    // Helper function to convert Unix timestamps to human readable formats
    $scope.convertTimestampsToText = function(arrayOfDevices) {

        for (i in arrayOfDevices)
        {
            var currentDevice = arrayOfDevices[i];

            for (index in currentDevice.history.oneday.timestamps) {
                currentDevice.history.oneday.timestamps[index] = moment.unix(currentDevice.history.oneday.timestamps[index]).format('hh:mm A');
            }

            for (index in currentDevice.history.oneweek.timestamps) {
                currentDevice.history.oneweek.timestamps[index] = moment.unix(currentDevice.history.oneweek.timestamps[index]).format('dddd Do');
            }

            for (index in currentDevice.history.onemonth.timestamps) {
                currentDevice.history.onemonth.timestamps[index] = moment.unix(currentDevice.history.onemonth.timestamps[index]).format('[Week] WW');
            }

            for (index in currentDevice.history.oneyear.timestamps) {
                currentDevice.history.oneyear.timestamps[index] = moment.unix(currentDevice.history.oneyear.timestamps[index]).format('MMMM');
            }
        };
    };


    // Function to get all the substations for the current network from the API
    $scope.getAllSubstations = function(currentNetworkId) {

        var req = {
            method: 'GET',
            url: loginService.apiUrl + '/api/v1/substations/getall/' + currentNetworkId,
            headers: {'Authorization': 'Bearer ' + loginService.token}
        };

        console.log(req);

        $http(req).then(function successCallback(response) {
            console.log(response);

            $scope.substations = response.data;
            return true;

        }, function errorCallback(response, err) {
            console.log(err);
            return false;
        });
    };


    // Function to get all the heatplants for the current network from the API
    $scope.getAllHeatplants = function(currentNetworkId) {
        var req = {
            method: 'GET',
            url: loginService.apiUrl + '/api/v1/heatplants/getall/' + currentNetworkId,
            headers: {'Authorization': 'Bearer ' + loginService.token}
        };

        console.log(req);

        $http(req).then(function successCallback(response) {
            console.log(response);

            if (response.data.success) {
                $scope.heatplants = response.data;
                return true;
            }
            else {
                return false;
            }

        }, function errorCallback(response, err) {
            console.log(err);
            return false;
        });
    };

    // Function to get all the notifications for the current network from the API
    $scope.getAllNotifications = function(currentNetworkId) {
        var req = {
            method: 'GET',
            url: loginService.apiUrl + '/api/v1/notifications/' + currentNetworkId,
            headers: {'Authorization': 'Bearer ' + loginService.token}
        };

        console.log(req);

        $http(req).then(function successCallback(response) {
            console.log(response);

            if (response.data.success) {
                $scope.notifications = response.data;
                return true;
            }
            else {
                return false;
            }

        }, function errorCallback(response, err) {
            console.log(err);
            return false;
        });
    };



    // Chart.js Substation Data description
    $scope.substationData = {
        labels: ['', ''],
        datasets: [
            {
                label: '',
                fillColor: 'rgba(124,181,236,0.2)',
                strokeColor: 'rgba(124,181,236,1)',
                pointColor: 'rgba(124,181,236,1)',
                pointStrokeColor: '#fff',
                pointHighlightFill: '#fff',
                pointHighlightStroke: 'rgba(124,181,236,1)',
                data: []
            },
            {
                label: '',
                fillColor: 'rgba(220,20,60,0.2)',
                strokeColor: 'rgba(220,20,60,1)',
                pointColor: 'rgba(220,20,60,1)',
                pointStrokeColor: '#fff',
                pointHighlightFill: '#fff',
                pointHighlightStroke: 'rgba(220,20,60,1)',
                data: []
            }
        ]
    };

    // Chart.js Heatplant Data description
    $scope.heatplantData = {
        labels: ['', ''],
        datasets: [
            {
                label: '',
                fillColor: 'rgba(124,181,236,0.2)',
                strokeColor: 'rgba(124,181,236,1)',
                pointColor: 'rgba(124,181,236,1)',
                pointStrokeColor: '#fff',
                pointHighlightFill: '#fff',
                pointHighlightStroke: 'rgba(124,181,236,1)',
                data: []
            },
            {
                label: '',
                fillColor: 'rgba(220,20,60,0.2)',
                strokeColor: 'rgba(220,20,60,1)',
                pointColor: 'rgba(220,20,60,1)',
                pointStrokeColor: '#fff',
                pointHighlightFill: '#fff',
                pointHighlightStroke: 'rgba(220,20,60,1)',
                data: []
            }
        ]
    };

    // Chart.js DE Network Data description
    $scope.denetworkData = {
        labels: ['', ''],
        datasets: [
            {
                label: '',
                fillColor: 'rgba(124,181,236,0.2)',
                strokeColor: 'rgba(124,181,236,1)',
                pointColor: 'rgba(124,181,236,1)',
                pointStrokeColor: '#fff',
                pointHighlightFill: '#fff',
                pointHighlightStroke: 'rgba(124,181,236,1)',
                data: []
            },
            {
                label: '',
                fillColor: 'rgba(220,20,60,0.2)',
                strokeColor: 'rgba(220,20,60,1)',
                pointColor: 'rgba(220,20,60,1)',
                pointStrokeColor: '#fff',
                pointHighlightFill: '#fff',
                pointHighlightStroke: 'rgba(220,20,60,1)',
                data: []
            }
        ]
    };

    // Chart.js Options
    $scope.options =  {

        // Sets the chart to be responsive
        responsive: true,

        ///Boolean - Whether grid lines are shown across the chart
        scaleShowGridLines : true,

        //String - Colour of the grid lines
        scaleGridLineColor : "rgba(0,0,0,.05)",

        //Number - Width of the grid lines
        scaleGridLineWidth : 1,

        //Boolean - Whether the line is curved between points
        bezierCurve : true,

        //Number - Tension of the bezier curve between points
        bezierCurveTension : 0.4,

        //Boolean - Whether to show a dot for each point
        pointDot : true,

        //Number - Radius of each point dot in pixels
        pointDotRadius : 4,

        //Number - Pixel width of point dot stroke
        pointDotStrokeWidth : 1,

        //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
        pointHitDetectionRadius : 20,

        //Boolean - Whether to show a stroke for datasets
        datasetStroke : true,

        //Number - Pixel width of dataset stroke
        datasetStrokeWidth : 2,

        //Boolean - Whether to fill the dataset with a colour
        datasetFill : false,

        // Function - on animation progress
        onAnimationProgress: function(){},

        // Function - on animation complete
        onAnimationComplete: function(){},

        //String - A legend template
        legendTemplate : '<ul class="tc-chart-js-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].strokeColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>'
    };

    // Update Substation History Data: 0: Planned/Actual flow, 1: Planned/Actual energy, 2: Supply/Return Temp
    $scope.updateSubstationChartData = function() {
        switch ($scope.currentSubstationChartType) {
            case 0:
                if ($scope.granularity == '1day') {
                    $scope.substationData.labels = $scope.currentSubstation.history.oneday.timestamps;
                    $scope.substationData.datasets[0].label = "Average maximum flow (t/h)";
                    $scope.substationData.datasets[0].data = $scope.currentSubstation.history.oneday.plannedflow;
                    $scope.substationData.datasets[1].label = "Average actual flow (t/h)";
                    $scope.substationData.datasets[1].data = $scope.currentSubstation.history.oneday.actualflow;
                } else if ($scope.granularity == '1week') {
                    $scope.substationData.labels = $scope.currentSubstation.history.oneweek.timestamps;
                    $scope.substationData.datasets[0].label = "Average maximum flow (t/h)";
                    $scope.substationData.datasets[0].data = $scope.currentSubstation.history.oneweek.plannedflow;
                    $scope.substationData.datasets[1].label = "Average actual flow (t/h)";
                    $scope.substationData.datasets[1].data = $scope.currentSubstation.history.oneweek.actualflow;
                } else if ($scope.granularity == '1month') {
                    $scope.substationData.labels = $scope.currentSubstation.history.onemonth.timestamps;
                    $scope.substationData.datasets[0].label = "Average maximum flow (t/h)";
                    $scope.substationData.datasets[0].data = $scope.currentSubstation.history.onemonth.plannedflow;
                    $scope.substationData.datasets[1].label = "Average actual flow (t/h)";
                    $scope.substationData.datasets[1].data = $scope.currentSubstation.history.onemonth.actualflow;
                } else if ($scope.granularity == '1year') {
                    $scope.substationData.labels = $scope.currentSubstation.history.oneyear.timestamps;
                    $scope.substationData.datasets[0].label = "Average maximum flow (t/h)";
                    $scope.substationData.datasets[0].data = $scope.currentSubstation.history.oneyear.plannedflow;
                    $scope.substationData.datasets[1].label = "Average actual flow (t/h)";
                    $scope.substationData.datasets[1].data = $scope.currentSubstation.history.oneyear.actualflow;
                }

                $scope.currentSubstationChartTypeText = "Maximum/Actual Flow (t/h)";
                break;

            case 1:
                if ($scope.granularity == '1day') {
                    $scope.substationData.labels = $scope.currentSubstation.history.oneday.timestamps;
                    $scope.substationData.datasets[0].label = "Average maximum energy";
                    $scope.substationData.datasets[0].data = $scope.currentSubstation.history.oneday.plannedenergy;
                    $scope.substationData.datasets[1].label = "Average actual energy";
                    $scope.substationData.datasets[1].data = $scope.currentSubstation.history.oneday.actualenergy;
                } else if ($scope.granularity == '1week') {
                    $scope.substationData.labels = $scope.currentSubstation.history.oneweek.timestamps;
                    $scope.substationData.datasets[0].label = "Average maximum energy";
                    $scope.substationData.datasets[0].data = $scope.currentSubstation.history.oneweek.plannedenergy;
                    $scope.substationData.datasets[1].label = "Average actual energy";
                    $scope.substationData.datasets[1].data = $scope.currentSubstation.history.oneweek.actualenergy;
                } else if ($scope.granularity == '1month') {
                    $scope.substationData.labels = $scope.currentSubstation.history.onemonth.timestamps;
                    $scope.substationData.datasets[0].label = "Average maximum energy";
                    $scope.substationData.datasets[0].data = $scope.currentSubstation.history.onemonth.plannedenergy;
                    $scope.substationData.datasets[1].label = "Average actual energy";
                    $scope.substationData.datasets[1].data = $scope.currentSubstation.history.onemonth.actualenergy;
                } else if ($scope.granularity == '1year') {
                    $scope.substationData.labels = $scope.currentSubstation.history.oneyear.timestamps;
                    $scope.substationData.datasets[0].label = "Average maximum energy";
                    $scope.substationData.datasets[0].data = $scope.currentSubstation.history.oneyear.plannedenergy;
                    $scope.substationData.datasets[1].label = "Average actual energy";
                    $scope.substationData.datasets[1].data = $scope.currentSubstation.history.oneyear.actualenergy;
                }

                $scope.currentSubstationChartTypeText = "Maximum/Actual Energy (kW)";
                break;

            case 2:
                if ($scope.granularity == '1day') {
                    $scope.substationData.labels = $scope.currentSubstation.history.oneday.timestamps;
                    $scope.substationData.datasets[0].label = "Average supply temp";
                    $scope.substationData.datasets[0].data = $scope.currentSubstation.history.oneday.supplytemp;
                    $scope.substationData.datasets[1].label = "Average return temp";
                    $scope.substationData.datasets[1].data = $scope.currentSubstation.history.oneday.returntemp;
                } else if ($scope.granularity == '1week') {
                    $scope.substationData.labels = $scope.currentSubstation.history.oneweek.timestamps;
                    $scope.substationData.datasets[0].label = "Average supply temp";
                    $scope.substationData.datasets[0].data = $scope.currentSubstation.history.oneweek.supplytemp;
                    $scope.substationData.datasets[1].label = "Average return temp";
                    $scope.substationData.datasets[1].data = $scope.currentSubstation.history.oneweek.returntemp;
                } else if ($scope.granularity == '1month') {
                    $scope.substationData.labels = $scope.currentSubstation.history.onemonth.timestamps;
                    $scope.substationData.datasets[0].label = "Average supply temp";
                    $scope.substationData.datasets[0].data = $scope.currentSubstation.history.onemonth.supplytemp;
                    $scope.substationData.datasets[1].label = "Average return temp";
                    $scope.substationData.datasets[1].data = $scope.currentSubstation.history.onemonth.returntemp;
                } else if ($scope.granularity == '1year') {
                    $scope.substationData.labels = $scope.currentSubstation.history.oneyear.timestamps;
                    $scope.substationData.datasets[0].label = "Average supply temp";
                    $scope.substationData.datasets[0].data = $scope.currentSubstation.history.oneyear.supplytemp;
                    $scope.substationData.datasets[1].label = "Average return temp";
                    $scope.substationData.datasets[1].data = $scope.currentSubstation.history.oneyear.returntemp;
                }

                $scope.currentSubstationChartTypeText = "Supply/Return Temperature (Celsius)";
                break;
        }
    };

    // Update Heatplant History Data: 0: Actual flow, 1: Actual energy, 2: Supply/Return Temp
    $scope.updateHeatplantChartData = function() {
        switch ($scope.currentHeatplantChartType) {
            case 0:
                if ($scope.granularity == '1day') {
                    $scope.heatplantData.labels = $scope.currentHeatplant.history.oneday.timestamps;
                    $scope.heatplantData.datasets[0].label = "Average flow (t/h)";
                    $scope.heatplantData.datasets[0].data = $scope.currentHeatplant.history.oneday.actualflow;
                } else if ($scope.granularity == '1week') {
                    $scope.heatplantData.labels = $scope.currentHeatplant.history.oneweek.timestamps;
                    $scope.heatplantData.datasets[0].label = "Average flow (t/h)";
                    $scope.heatplantData.datasets[0].data = $scope.currentHeatplant.history.oneweek.actualflow;
                } else if ($scope.granularity == '1month') {
                    $scope.heatplantData.labels = $scope.currentHeatplant.history.onemonth.timestamps;
                    $scope.heatplantData.datasets[0].label = "Average flow (t/h)";
                    $scope.heatplantData.datasets[0].data = $scope.currentHeatplant.history.onemonth.actualflow;
                } else if ($scope.granularity == '1year') {
                    $scope.heatplantData.labels = $scope.currentHeatplant.history.oneyear.timestamps;
                    $scope.heatplantData.datasets[0].label = "Average flow (t/h)";
                    $scope.heatplantData.datasets[0].data = $scope.currentHeatplant.history.oneyear.actualflow;
                }

                $scope.currentHeatplantChartTypeText = "Average Flow (t/h)";
                break;

            case 1:
                if ($scope.granularity == '1day') {
                    $scope.heatplantData.labels = $scope.currentHeatplant.history.oneday.timestamps;
                    $scope.heatplantData.datasets[0].label = "Average energy";
                    $scope.heatplantData.datasets[0].data = $scope.currentHeatplant.history.oneday.actualenergy;
                } else if ($scope.granularity == '1week') {
                    $scope.heatplantData.labels = $scope.currentHeatplant.history.oneweek.timestamps;
                    $scope.heatplantData.datasets[0].label = "Average energy";
                    $scope.heatplantData.datasets[0].data = $scope.currentHeatplant.history.oneweek.actualenergy;
                } else if ($scope.granularity == '1month') {
                    $scope.heatplantData.labels = $scope.currentHeatplant.history.onemonth.timestamps;
                    $scope.heatplantData.datasets[0].label = "Average energy";
                    $scope.heatplantData.datasets[0].data = $scope.currentHeatplant.history.onemonth.actualenergy;
                } else if ($scope.granularity == '1year') {
                    $scope.heatplantData.labels = $scope.currentHeatplant.history.oneyear.timestamps;
                    $scope.heatplantData.datasets[0].label = "Average energy";
                    $scope.heatplantData.datasets[0].data = $scope.currentHeatplant.history.oneyear.actualenergy;
                }

                $scope.currentHeatplantChartTypeText = "Average Energy (kW)";
                break;

            case 2:
                if ($scope.granularity == '1day') {
                    $scope.heatplantData.labels = $scope.currentHeatplant.history.oneday.timestamps;
                    $scope.heatplantData.datasets[0].label = "Average supply temp";
                    $scope.heatplantData.datasets[0].data = $scope.currentHeatplant.history.oneday.supplytemp;
                    $scope.heatplantData.datasets[1].label = "Average return temp";
                    $scope.heatplantData.datasets[1].data = $scope.currentHeatplant.history.oneday.returntemp;
                } else if ($scope.granularity == '1week') {
                    $scope.heatplantData.labels = $scope.currentHeatplant.history.oneweek.timestamps;
                    $scope.heatplantData.datasets[0].label = "Average supply temp";
                    $scope.heatplantData.datasets[0].data = $scope.currentHeatplant.history.oneweek.supplytemp;
                    $scope.heatplantData.datasets[1].label = "Average return temp";
                    $scope.heatplantData.datasets[1].data = $scope.currentHeatplant.history.oneweek.returntemp;
                } else if ($scope.granularity == '1month') {
                    $scope.heatplantData.labels = $scope.currentHeatplant.history.onemonth.timestamps;
                    $scope.heatplantData.datasets[0].label = "Average supply temp";
                    $scope.heatplantData.datasets[0].data = $scope.currentHeatplant.history.onemonth.supplytemp;
                    $scope.heatplantData.datasets[1].label = "Average return temp";
                    $scope.heatplantData.datasets[1].data = $scope.currentHeatplant.history.onemonth.returntemp;
                } else if ($scope.granularity == '1year') {
                    $scope.heatplantData.labels = $scope.currentHeatplant.history.oneyear.timestamps;
                    $scope.heatplantData.datasets[0].label = "Average supply temp";
                    $scope.heatplantData.datasets[0].data = $scope.currentHeatplant.history.oneyear.supplytemp;
                    $scope.heatplantData.datasets[1].label = "Average return temp";
                    $scope.heatplantData.datasets[1].data = $scope.currentHeatplant.history.oneyear.returntemp;
                }

                $scope.currentHeatplantChartTypeText = "Supply/Return Temperature (Celsius)";
                break;
        }
    };

    // Update DE Network History Data: 0: Actual flow, 1: Actual energy, 2: Outdoor Temp
    $scope.updateDENetworkChartData = function() {
        switch ($scope.currentDENetworkChartType) {
            case 0:
                if ($scope.granularity == '1day') {
                    $scope.denetworkData.labels = $scope.currentNetwork.history.oneday.timestamps;
                    $scope.denetworkData.datasets[0].label = "Average flow (t/h)";
                    $scope.denetworkData.datasets[0].data = $scope.currentNetwork.history.oneday.actualflow;
                } else if ($scope.granularity == '1week') {
                    $scope.denetworkData.labels = $scope.currentNetwork.history.oneweek.timestamps;
                    $scope.denetworkData.datasets[0].label = "Average flow (t/h)";
                    $scope.denetworkData.datasets[0].data = $scope.currentNetwork.history.oneweek.actualflow;
                } else if ($scope.granularity == '1month') {
                    $scope.denetworkData.labels = $scope.currentNetwork.history.onemonth.timestamps;
                    $scope.denetworkData.datasets[0].label = "Average flow (t/h)";
                    $scope.denetworkData.datasets[0].data = $scope.currentNetwork.history.onemonth.actualflow;
                } else if ($scope.granularity == '1year') {
                    $scope.denetworkData.labels = $scope.currentNetwork.history.oneyear.timestamps;
                    $scope.denetworkData.datasets[0].label = "Average flow (t/h)";
                    $scope.denetworkData.datasets[0].data = $scope.currentNetwork.history.oneyear.actualflow;
                }

                $scope.currentDENetworkChartTypeText = "Average Flow (t/h)";
                break;

            case 1:
                if ($scope.granularity == '1day') {
                    $scope.denetworkData.labels = $scope.currentNetwork.history.oneday.timestamps;
                    $scope.denetworkData.datasets[0].label = "Average energy";
                    $scope.denetworkData.datasets[0].data = $scope.currentNetwork.history.oneday.actualenergy;
                } else if ($scope.granularity == '1week') {
                    $scope.denetworkData.labels = $scope.currentNetwork.history.oneweek.timestamps;
                    $scope.denetworkData.datasets[0].label = "Average energy";
                    $scope.denetworkData.datasets[0].data = $scope.currentNetwork.history.oneweek.actualenergy;
                } else if ($scope.granularity == '1month') {
                    $scope.denetworkData.labels = $scope.currentNetwork.history.onemonth.timestamps;
                    $scope.denetworkData.datasets[0].label = "Average energy";
                    $scope.denetworkData.datasets[0].data = $scope.currentNetwork.history.onemonth.actualenergy;
                } else if ($scope.granularity == '1year') {
                    $scope.denetworkData.labels = $scope.currentNetwork.history.oneyear.timestamps;
                    $scope.denetworkData.datasets[0].label = "Average energy";
                    $scope.denetworkData.datasets[0].data = $scope.currentNetwork.history.oneyear.actualenergy;
                }

                $scope.currentDENetworkChartTypeText = "Average Energy (kW)";
                break;

            case 2:
                if ($scope.granularity == '1day') {
                    $scope.denetworkData.labels = $scope.currentNetwork.history.oneday.timestamps;
                    $scope.denetworkData.datasets[0].label = "Average outdoor temp";
                    $scope.denetworkData.datasets[0].data = $scope.currentNetwork.history.oneday.outdoortemp;
                } else if ($scope.granularity == '1week') {
                    $scope.denetworkData.labels = $scope.currentNetwork.history.oneweek.timestamps;
                    $scope.denetworkData.datasets[0].label = "Average outdoor temp";
                    $scope.denetworkData.datasets[0].data = $scope.currentNetwork.history.oneweek.outdoortemp;
                } else if ($scope.granularity == '1month') {
                    $scope.denetworkData.labels = $scope.currentNetwork.history.onemonth.timestamps;
                    $scope.denetworkData.datasets[0].label = "Average outdoor temp";
                    $scope.denetworkData.datasets[0].data = $scope.currentNetwork.history.onemonth.outdoortemp;
                } else if ($scope.granularity == '1year') {
                    $scope.denetworkData.labels = $scope.currentNetwork.history.oneyear.timestamps;
                    $scope.denetworkData.datasets[0].label = "Average outdoor temp";
                    $scope.denetworkData.datasets[0].data = $scope.currentNetwork.history.oneyear.outdoortemp;
                }

                $scope.currentDENetworkChartTypeText = "Average Outdoor Temperature (Celsius)";
                break;
        }
    };



    if ($scope.demoConf) {


        $scope.userNetworks = [{
            "id": 1,
            "name": "Jylland network",
            "optimizationtype": 'flowbasedoptimization',
            "plannedflow": 600,
            "actualflow": 60,
            "plannedenergy": 30000,
            "actualenergy": 3000,
            "history": {
                "oneday": {
                    "timestamps": [1457308800, 1457312400, 1457316000, 1457319600, 1457323200, 1457326800, 1457330400, 1457334000, 1457337600, 1457337600, 1457344800, 1457348400, 1457352000, 1457355600, 1457359200, 1457362800, 1457366400, 1457370000, 1457373600, 1457377200, 1457380800],
                    "actualflow": [420, 420, 420, 420, 420, 420, 420, 625, 625, 625, 625, 625, 830, 830, 830, 830, 830, 830, 830, 830, 215, 215],
                    "actualenergy": [12120, 12120, 12120, 12120, 12120, 14125, 14125, 14125, 14125, 14125, 16130, 16130, 10115, 10115, 10115, 10115, 10115, 10115, 10115, 10115, 10115, 10115],
                    "outdoortemp": [20, 20, 20, 20, 20, 20, 20, 20, 25, 25, 25, 25, 25, 27, 27, 27, 27, 27, 15, 15, 15, 15]
                },
                "oneweek": {
                    "timestamps": [1456786799, 1456873199, 1456959599, 1457045999, 1457132399],
                    "actualflow": [830, 830, 830, 420, 420],
                    "actualenergy": [16130, 16130, 16130, 12120, 12120],
                    "outdoortemp": [17, 17, 17, 17, 17]
                },
                "onemonth": {
                    "timestamps": [1455490799, 1456095599, 1456700399, 1457305199],
                    "actualflow": [420, 420, 420, 420],
                    "actualenergy": [12120, 12120, 12120, 12120],
                    "outdoortemp": [12, 17, 20, 15]
                },
                "oneyear": {
                    "timestamps": [1446332399, 1448924399, 1451602799, 1454281199, 1456786799],
                    "actualflow": [420, 420, 420, 420, 420],
                    "actualenergy": [12120, 12120, 12120, 12120, 12120],
                    "supplytemp": [15, 15, 20, 20, 20]
                }
            }
        }];

        $scope.currentUser = {};

        $scope.users = [
            {"id": 1, "name": "admin", "roles": ['user', 'admin']}
        ];

        // Status 0=Online, 1=CRITICAL ERROR, 2=OFFLINE
        $scope.substations = [
            {
                "id": 1,
                "name": "Substation 1",
                "macaddress": "00010304050607",
                "branchname": "Nordborg",
                "status": 0,
                "kvm": 60,
                "address": "Nordborgvej 81, Nordborg, Denmark",
                "long": 55.68048,
                "lat": 9.4185263,
                "plannedflow": 20,
                "actualflow": 20,
                "plannedenergy": 1000,
                "actualenergy": 1000,
                "history": {
                    "oneday": {
                        "timestamps": [1457308800, 1457312400, 1457316000, 1457319600, 1457323200, 1457326800, 1457330400, 1457334000, 1457337600, 1457337600, 1457344800, 1457348400, 1457352000, 1457355600, 1457359200, 1457362800, 1457366400, 1457370000, 1457373600, 1457377200, 1457380800],
                        "plannedflow": [20, 20, 20, 20, 20, 20, 25, 25, 25, 25, 25, 25, 30, 30, 30, 15, 15, 15, 15, 15, 15, 15],
                        "actualflow": [20, 20, 20, 20, 20, 20, 20, 25, 25, 25, 25, 25, 30, 30, 30, 30, 30, 30, 30, 30, 15, 15],
                        "plannedenergy": [120, 120, 120, 120, 120, 125, 125, 125, 125, 125, 130, 130, 115, 115, 115, 115, 115, 115, 115, 115, 115, 115],
                        "actualenergy": [120, 120, 120, 120, 120, 125, 125, 125, 125, 125, 130, 130, 115, 115, 115, 115, 115, 115, 115, 115, 115, 115],
                        "supplytemp": [80, 80, 80, 80, 80, 80, 80, 80, 90, 90, 90, 90, 90, 100, 100, 100, 100, 100, 75, 75, 75, 75],
                        "returntemp": [40, 40, 40, 40, 40, 40, 40, 40, 50, 50, 50, 50, 50, 60, 60, 60, 60, 60, 40, 40, 40, 40]
                    },
                    "oneweek": {
                        "timestamps": [1456786799, 1456873199, 1456959599, 1457045999, 1457132399],
                        "plannedflow": [25, 25, 25, 20, 20],
                        "actualflow": [30, 30, 30, 20, 20],
                        "plannedenergy": [125, 125, 125, 130, 130],
                        "actualenergy": [130, 130, 130, 120, 120],
                        "supplytemp": [80, 80, 80, 80, 80],
                        "returntemp": [40, 40, 40, 40, 40]
                    },
                    "onemonth": {
                        "timestamps": [1455490799, 1456095599, 1456700399, 1457305199],
                        "plannedflow": [20, 20, 20, 20],
                        "actualflow": [20, 20, 20, 20],
                        "plannedenergy": [120, 120, 120, 120],
                        "actualenergy": [120, 120, 120, 120],
                        "supplytemp": [80, 80, 80, 80],
                        "returntemp": [40, 40, 40, 40]
                    },
                    "oneyear": {
                        "timestamps": [1446332399, 1448924399, 1451602799, 1454281199, 1456786799],
                        "plannedflow": [20, 20, 20, 20, 20],
                        "actualflow": [20, 20, 20, 20, 20],
                        "plannedenergy": [120, 120, 120, 120, 120],
                        "actualenergy": [120, 120, 120, 120, 120],
                        "supplytemp": [80, 80, 80, 80, 80],
                        "returntemp": [40, 40, 40, 40, 40]
                    }
                }
            },
            {
                "id": 2,
                "name": "Substation 2",
                "macaddress": "00010304050608",
                "branchname": "Nordborg",
                "status": 0,
                "kvm": 40,
                "address": "Nordborgvej 96, Nordborg, Denmark",
                "long": 55.704477,
                "lat": 9.5405013,
                "plannedflow": 20,
                "actualflow": 20,
                "plannedenergy": 1000,
                "actualenergy": 1000,
                "history": {
                    "oneday": {
                        "timestamps": [1457308800, 1457312400, 1457316000, 1457319600, 1457323200, 1457326800, 1457330400, 1457334000, 1457337600, 1457337600, 1457344800, 1457348400, 1457352000, 1457355600, 1457359200, 1457362800, 1457366400, 1457370000, 1457373600, 1457377200, 1457380800],
                        "plannedflow": [20, 20, 20, 20, 20, 20, 25, 25, 25, 25, 25, 25, 30, 30, 30, 15, 15, 15, 15, 15, 15, 15],
                        "actualflow": [20, 20, 20, 20, 20, 20, 20, 25, 25, 25, 25, 25, 30, 30, 30, 30, 30, 30, 30, 30, 15, 15],
                        "plannedenergy": [120, 120, 120, 120, 120, 125, 125, 125, 125, 125, 130, 130, 115, 115, 115, 115, 115, 115, 115, 115, 115, 115],
                        "actualenergy": [120, 120, 120, 120, 120, 125, 125, 125, 125, 125, 130, 130, 115, 115, 115, 115, 115, 115, 115, 115, 115, 115],
                        "supplytemp": [80, 80, 80, 80, 80, 80, 80, 80, 90, 90, 90, 90, 90, 100, 100, 100, 100, 100, 75, 75, 75, 75],
                        "returntemp": [40, 40, 40, 40, 40, 40, 40, 40, 50, 50, 50, 50, 50, 60, 60, 60, 60, 60, 40, 40, 40, 40]
                    },
                    "oneweek": {
                        "timestamps": [1456786799, 1456873199, 1456959599, 1457045999, 1457132399],
                        "plannedflow": [25, 25, 25, 20, 20],
                        "actualflow": [30, 30, 30, 20, 20],
                        "plannedenergy": [125, 125, 125, 130, 130],
                        "actualenergy": [130, 130, 130, 120, 120],
                        "supplytemp": [80, 80, 80, 80, 80],
                        "returntemp": [40, 40, 40, 40, 40]
                    },
                    "onemonth": {
                        "timestamps": [1455490799, 1456095599, 1456700399, 1457305199],
                        "plannedflow": [20, 20, 20, 20],
                        "actualflow": [20, 20, 20, 20],
                        "plannedenergy": [120, 120, 120, 120],
                        "actualenergy": [120, 120, 120, 120],
                        "supplytemp": [80, 80, 80, 80],
                        "returntemp": [40, 40, 40, 40]
                    },
                    "oneyear": {
                        "timestamps": [1446332399, 1448924399, 1451602799, 1454281199, 1456786799],
                        "plannedflow": [20, 20, 20, 20, 20],
                        "actualflow": [20, 20, 20, 20, 20],
                        "plannedenergy": [120, 120, 120, 120, 120],
                        "actualenergy": [120, 120, 120, 120, 120],
                        "supplytemp": [80, 80, 80, 80, 80],
                        "returntemp": [40, 40, 40, 40, 40]
                    }
                }
            },
            {
                "id": 3,
                "name": "Substation 3",
                "macaddress": "00010304050609",
                "branchname": "Nordborg",
                "status": 1,
                "kvm": 80,
                "address": "Nordborgvej 60, Nordborg, Denmark",
                "long": 55.704107,
                "lat": 9.5266013,
                "plannedflow": 20,
                "actualflow": 0,
                "plannedenergy": 1000,
                "actualenergy": 0,
                "history": {
                    "oneday": {
                        "timestamps": [1457308800, 1457312400, 1457316000, 1457319600, 1457323200, 1457326800, 1457330400, 1457334000, 1457337600, 1457337600, 1457344800, 1457348400, 1457352000, 1457355600, 1457359200, 1457362800, 1457366400, 1457370000, 1457373600, 1457377200, 1457380800],
                        "plannedflow": [20, 20, 20, 20, 20, 20, 25, 25, 25, 25, 25, 25, 30, 30, 30, 15, 15, 15, 15, 15, 15, 15],
                        "actualflow": [20, 20, 20, 20, 20, 20, 20, 25, 25, 25, 25, 25, 30, 30, 30, 30, 30, 30, 30, 30, 15, 15],
                        "plannedenergy": [120, 120, 120, 120, 120, 125, 125, 125, 125, 125, 130, 130, 115, 115, 115, 115, 115, 115, 115, 115, 115, 115],
                        "actualenergy": [120, 120, 120, 120, 120, 125, 125, 125, 125, 125, 130, 130, 115, 115, 115, 115, 115, 115, 115, 115, 115, 115],
                        "supplytemp": [80, 80, 80, 80, 80, 80, 80, 80, 90, 90, 90, 90, 90, 100, 100, 100, 100, 100, 75, 75, 75, 75],
                        "returntemp": [40, 40, 40, 40, 40, 40, 40, 40, 50, 50, 50, 50, 50, 60, 60, 60, 60, 60, 40, 40, 40, 40]
                    },
                    "oneweek": {
                        "timestamps": [1456786799, 1456873199, 1456959599, 1457045999, 1457132399],
                        "plannedflow": [25, 25, 25, 20, 20],
                        "actualflow": [30, 30, 30, 20, 20],
                        "plannedenergy": [125, 125, 125, 130, 130],
                        "actualenergy": [130, 130, 130, 120, 120],
                        "supplytemp": [80, 80, 80, 80, 80],
                        "returntemp": [40, 40, 40, 40, 40]
                    },
                    "onemonth": {
                        "timestamps": [1455490799, 1456095599, 1456700399, 1457305199],
                        "plannedflow": [20, 20, 20, 20],
                        "actualflow": [20, 20, 20, 20],
                        "plannedenergy": [120, 120, 120, 120],
                        "actualenergy": [120, 120, 120, 120],
                        "supplytemp": [80, 80, 80, 80],
                        "returntemp": [40, 40, 40, 40]
                    },
                    "oneyear": {
                        "timestamps": [1446332399, 1448924399, 1451602799, 1454281199, 1456786799],
                        "plannedflow": [20, 20, 20, 20, 20],
                        "actualflow": [20, 20, 20, 20, 20],
                        "plannedenergy": [120, 120, 120, 120, 120],
                        "actualenergy": [120, 120, 120, 120, 120],
                        "supplytemp": [80, 80, 80, 80, 80],
                        "returntemp": [40, 40, 40, 40, 40]
                    }
                }
            },
            {
                "id": 4,
                "name": "Substation 4",
                "macaddress": "00010304050610",
                "branchname": "Vejle",
                "status": 0,
                "kvm": 30,
                "address": "Nordborgvej 70, Nordborg, Denmark",
                "long": 55.7075618,
                "lat": 9.5347123,
                "plannedflow": 20,
                "actualflow": 20,
                "plannedenergy": 1000,
                "actualenergy": 1000,
                "history": {
                    "oneday": {
                        "timestamps": [1457308800, 1457312400, 1457316000, 1457319600, 1457323200, 1457326800, 1457330400, 1457334000, 1457337600, 1457337600, 1457344800, 1457348400, 1457352000, 1457355600, 1457359200, 1457362800, 1457366400, 1457370000, 1457373600, 1457377200, 1457380800],
                        "plannedflow": [20, 20, 20, 20, 20, 20, 25, 25, 25, 25, 25, 25, 30, 30, 30, 15, 15, 15, 15, 15, 15, 15],
                        "actualflow": [20, 20, 20, 20, 20, 20, 20, 25, 25, 25, 25, 25, 30, 30, 30, 30, 30, 30, 30, 30, 15, 15],
                        "plannedenergy": [120, 120, 120, 120, 120, 125, 125, 125, 125, 125, 130, 130, 115, 115, 115, 115, 115, 115, 115, 115, 115, 115],
                        "actualenergy": [120, 120, 120, 120, 120, 125, 125, 125, 125, 125, 130, 130, 115, 115, 115, 115, 115, 115, 115, 115, 115, 115],
                        "supplytemp": [80, 80, 80, 80, 80, 80, 80, 80, 90, 90, 90, 90, 90, 100, 100, 100, 100, 100, 75, 75, 75, 75],
                        "returntemp": [40, 40, 40, 40, 40, 40, 40, 40, 50, 50, 50, 50, 50, 60, 60, 60, 60, 60, 40, 40, 40, 40]
                    },
                    "oneweek": {
                        "timestamps": [1456786799, 1456873199, 1456959599, 1457045999, 1457132399],
                        "plannedflow": [25, 25, 25, 20, 20],
                        "actualflow": [30, 30, 30, 20, 20],
                        "plannedenergy": [125, 125, 125, 130, 130],
                        "actualenergy": [130, 130, 130, 120, 120],
                        "supplytemp": [80, 80, 80, 80, 80],
                        "returntemp": [40, 40, 40, 40, 40]
                    },
                    "onemonth": {
                        "timestamps": [1455490799, 1456095599, 1456700399, 1457305199],
                        "plannedflow": [20, 20, 20, 20],
                        "actualflow": [20, 20, 20, 20],
                        "plannedenergy": [120, 120, 120, 120],
                        "actualenergy": [120, 120, 120, 120],
                        "supplytemp": [80, 80, 80, 80],
                        "returntemp": [40, 40, 40, 40]
                    },
                    "oneyear": {
                        "timestamps": [1446332399, 1448924399, 1451602799, 1454281199, 1456786799],
                        "plannedflow": [20, 20, 20, 20, 20],
                        "actualflow": [20, 20, 20, 20, 20],
                        "plannedenergy": [120, 120, 120, 120, 120],
                        "actualenergy": [120, 120, 120, 120, 120],
                        "supplytemp": [80, 80, 80, 80, 80],
                        "returntemp": [40, 40, 40, 40, 40]
                    }
                }
            },
            {
                "id": 5,
                "name": "Substation 5",
                "macaddress": "00010304050611",
                "branchname": "Vejle",
                "status": 2,
                "kvm": 100,
                "address": "Nordborgvej 100, Nordborg, Denmark",
                "long": 55.700081,
                "lat": 9.5248413,
                "plannedflow": 20,
                "actualflow": 0,
                "plannedenergy": 1000,
                "actualenergy": 0,
                "history": {
                    "oneday": {
                        "timestamps": [1457308800, 1457312400, 1457316000, 1457319600, 1457323200, 1457326800, 1457330400, 1457334000, 1457337600, 1457337600, 1457344800, 1457348400, 1457352000, 1457355600, 1457359200, 1457362800, 1457366400, 1457370000, 1457373600, 1457377200, 1457380800],
                        "plannedflow": [20, 20, 20, 20, 20, 20, 25, 25, 25, 25, 25, 25, 30, 30, 30, 15, 15, 15, 15, 15, 15, 15],
                        "actualflow": [20, 20, 20, 20, 20, 20, 20, 25, 25, 25, 25, 25, 30, 30, 30, 30, 30, 30, 30, 30, 15, 15],
                        "plannedenergy": [120, 120, 120, 120, 120, 125, 125, 125, 125, 125, 130, 130, 115, 115, 115, 115, 115, 115, 115, 115, 115, 115],
                        "actualenergy": [120, 120, 120, 120, 120, 125, 125, 125, 125, 125, 130, 130, 115, 115, 115, 115, 115, 115, 115, 115, 115, 115],
                        "supplytemp": [80, 80, 80, 80, 80, 80, 80, 80, 90, 90, 90, 90, 90, 100, 100, 100, 100, 100, 75, 75, 75, 75],
                        "returntemp": [40, 40, 40, 40, 40, 40, 40, 40, 50, 50, 50, 50, 50, 60, 60, 60, 60, 60, 40, 40, 40, 40]
                    },
                    "oneweek": {
                        "timestamps": [1456786799, 1456873199, 1456959599, 1457045999, 1457132399],
                        "plannedflow": [25, 25, 25, 20, 20],
                        "actualflow": [30, 30, 30, 20, 20],
                        "plannedenergy": [125, 125, 125, 130, 130],
                        "actualenergy": [130, 130, 130, 120, 120],
                        "supplytemp": [80, 80, 80, 80, 80],
                        "returntemp": [40, 40, 40, 40, 40]
                    },
                    "onemonth": {
                        "timestamps": [1455490799, 1456095599, 1456700399, 1457305199],
                        "plannedflow": [20, 20, 20, 20],
                        "actualflow": [20, 20, 20, 20],
                        "plannedenergy": [120, 120, 120, 120],
                        "actualenergy": [120, 120, 120, 120],
                        "supplytemp": [80, 80, 80, 80],
                        "returntemp": [40, 40, 40, 40]
                    },
                    "oneyear": {
                        "timestamps": [1446332399, 1448924399, 1451602799, 1454281199, 1456786799],
                        "plannedflow": [20, 20, 20, 20, 20],
                        "actualflow": [20, 20, 20, 20, 20],
                        "plannedenergy": [120, 120, 120, 120, 120],
                        "actualenergy": [120, 120, 120, 120, 120],
                        "supplytemp": [80, 80, 80, 80, 80],
                        "returntemp": [40, 40, 40, 40, 40]
                    }
                }
            }
        ];

        $scope.heatplants = [
            {
                "id": 6,
                "name": "Heatplant 1",
                "branchname": "Sonderborg",
                "address": "Lufthavnsvej 1, Sonderborg, Denmark",
                "long": 55.704477,
                "lat": 9.5405013,
                "plannedflow": 120,
                "actualflow": 120,
                "plannedenergy": 6000,
                "actualenergy": 6000,
                "history": {
                    "oneday": {
                        "timestamps": [1457308800, 1457312400, 1457316000, 1457319600, 1457323200, 1457326800, 1457330400, 1457334000, 1457337600, 1457337600, 1457344800, 1457348400, 1457352000, 1457355600, 1457359200, 1457362800, 1457366400, 1457370000, 1457373600, 1457377200, 1457380800],
                        "actualflow": [220, 220, 220, 220, 220, 220, 220, 325, 325, 325, 325, 325, 430, 430, 430, 430, 430, 430, 430, 430, 115, 115],
                        "actualenergy": [6120, 6120, 6120, 6120, 6120, 7125, 7125, 7125, 7125, 7125, 8130, 8130, 5115, 5115, 5115, 5115, 5115, 5115, 5115, 5115, 5115, 5115],
                        "supplytemp": [80, 80, 80, 80, 80, 80, 80, 80, 90, 90, 90, 90, 90, 100, 100, 100, 100, 100, 75, 75, 75, 75],
                        "returntemp": [40, 40, 40, 40, 40, 40, 40, 40, 50, 50, 50, 50, 50, 60, 60, 60, 60, 60, 40, 40, 40, 40]

                    },
                    "oneweek": {
                        "timestamps": [1456786799, 1456873199, 1456959599, 1457045999, 1457132399],
                        "actualflow": [430, 430, 430, 220, 220],
                        "actualenergy": [8130, 8130, 8130, 6120, 6120],
                        "supplytemp": [80, 80, 80, 80, 80],
                        "returntemp": [40, 40, 40, 40, 40]
                    },
                    "onemonth": {
                        "timestamps": [1455490799, 1456095599, 1456700399, 1457305199],
                        "actualflow": [220, 220, 220, 220],
                        "actualenergy": [6120, 6120, 6120, 6120],
                        "supplytemp": [80, 80, 80, 80],
                        "returntemp": [40, 40, 40, 40]
                    },
                    "oneyear": {
                        "timestamps": [1446332399, 1448924399, 1451602799, 1454281199, 1456786799],
                        "actualflow": [220, 220, 220, 220, 220],
                        "actualenergy": [6120, 6120, 6120, 6120, 6120],
                        "supplytemp": [80, 80, 80, 80, 80],
                        "returntemp": [40, 40, 40, 40, 40]
                    }
                }
            },
            {
                "id": 7,
                "name": "Heatplant 2",
                "branchname": "Sonderborg",
                "address": "Rosengade 2, Sonderborg, Denmark",
                "long": 55.704107,
                "lat": 9.5266013,
                "plannedflow": 120,
                "actualflow": 120,
                "plannedenergy": 6000,
                "actualenergy": 6000,
                "history": {
                    "oneday": {
                        "timestamps": [1457308800, 1457312400, 1457316000, 1457319600, 1457323200, 1457326800, 1457330400, 1457334000, 1457337600, 1457337600, 1457344800, 1457348400, 1457352000, 1457355600, 1457359200, 1457362800, 1457366400, 1457370000, 1457373600, 1457377200, 1457380800],
                        "actualflow": [220, 220, 220, 220, 220, 220, 220, 325, 325, 325, 325, 325, 430, 430, 430, 430, 430, 430, 430, 430, 115, 115],
                        "actualenergy": [6120, 6120, 6120, 6120, 6120, 7125, 7125, 7125, 7125, 7125, 8130, 8130, 5115, 5115, 5115, 5115, 5115, 5115, 5115, 5115, 5115, 5115],
                        "supplytemp": [80, 80, 80, 80, 80, 80, 80, 80, 90, 90, 90, 90, 90, 100, 100, 100, 100, 100, 75, 75, 75, 75],
                        "returntemp": [40, 40, 40, 40, 40, 40, 40, 40, 50, 50, 50, 50, 50, 60, 60, 60, 60, 60, 40, 40, 40, 40]

                    },
                    "oneweek": {
                        "timestamps": [1456786799, 1456873199, 1456959599, 1457045999, 1457132399],
                        "actualflow": [430, 430, 430, 220, 220],
                        "actualenergy": [8130, 8130, 8130, 6120, 6120],
                        "supplytemp": [80, 80, 80, 80, 80],
                        "returntemp": [40, 40, 40, 40, 40]
                    },
                    "onemonth": {
                        "timestamps": [1455490799, 1456095599, 1456700399, 1457305199],
                        "actualflow": [220, 220, 220, 220],
                        "actualenergy": [6120, 6120, 6120, 6120],
                        "supplytemp": [80, 80, 80, 80],
                        "returntemp": [40, 40, 40, 40]
                    },
                    "oneyear": {
                        "timestamps": [1446332399, 1448924399, 1451602799, 1454281199, 1456786799],
                        "actualflow": [220, 220, 220, 220, 220],
                        "actualenergy": [6120, 6120, 6120, 6120, 6120],
                        "supplytemp": [80, 80, 80, 80, 80],
                        "returntemp": [40, 40, 40, 40, 40]
                    }
                }
            },
            {
                "id": 8,
                "name": "Heatplant 3",
                "branchname": "",
                "address": "Gammel Guderup 2, Nordborg, Denmark",
                "long": 55.7075618,
                "lat": 9.5347123,
                "plannedflow": 120,
                "actualflow": 120,
                "plannedenergy": 6000,
                "actualenergy": 6000,
                "history": {
                    "oneday": {
                        "timestamps": [1457308800, 1457312400, 1457316000, 1457319600, 1457323200, 1457326800, 1457330400, 1457334000, 1457337600, 1457337600, 1457344800, 1457348400, 1457352000, 1457355600, 1457359200, 1457362800, 1457366400, 1457370000, 1457373600, 1457377200, 1457380800],
                        "actualflow": [220, 220, 220, 220, 220, 220, 220, 325, 325, 325, 325, 325, 430, 430, 430, 430, 430, 430, 430, 430, 115, 115],
                        "actualenergy": [6120, 6120, 6120, 6120, 6120, 7125, 7125, 7125, 7125, 7125, 8130, 8130, 5115, 5115, 5115, 5115, 5115, 5115, 5115, 5115, 5115, 5115],
                        "supplytemp": [80, 80, 80, 80, 80, 80, 80, 80, 90, 90, 90, 90, 90, 100, 100, 100, 100, 100, 75, 75, 75, 75],
                        "returntemp": [40, 40, 40, 40, 40, 40, 40, 40, 50, 50, 50, 50, 50, 60, 60, 60, 60, 60, 40, 40, 40, 40]

                    },
                    "oneweek": {
                        "timestamps": [1456786799, 1456873199, 1456959599, 1457045999, 1457132399],
                        "actualflow": [430, 430, 430, 220, 220],
                        "actualenergy": [8130, 8130, 8130, 6120, 6120],
                        "supplytemp": [80, 80, 80, 80, 80],
                        "returntemp": [40, 40, 40, 40, 40]
                    },
                    "onemonth": {
                        "timestamps": [1455490799, 1456095599, 1456700399, 1457305199],
                        "actualflow": [220, 220, 220, 220],
                        "actualenergy": [6120, 6120, 6120, 6120],
                        "supplytemp": [80, 80, 80, 80],
                        "returntemp": [40, 40, 40, 40]
                    },
                    "oneyear": {
                        "timestamps": [1446332399, 1448924399, 1451602799, 1454281199, 1456786799],
                        "actualflow": [220, 220, 220, 220, 220],
                        "actualenergy": [6120, 6120, 6120, 6120, 6120],
                        "supplytemp": [80, 80, 80, 80, 80],
                        "returntemp": [40, 40, 40, 40, 40]
                    }
                }
            },
            {
                "id": 9,
                "name": "Heatplant 4",
                "branchname": "",
                "address": "Sandbjergvej 2, Nordborg, Denmark",
                "long": 55.700081,
                "lat": 9.5248413,
                "plannedflow": 120,
                "actualflow": 120,
                "plannedenergy": 6000,
                "actualenergy": 6000,
                "history": {
                    "oneday": {
                        "timestamps": [1457308800, 1457312400, 1457316000, 1457319600, 1457323200, 1457326800, 1457330400, 1457334000, 1457337600, 1457337600, 1457344800, 1457348400, 1457352000, 1457355600, 1457359200, 1457362800, 1457366400, 1457370000, 1457373600, 1457377200, 1457380800],
                        "actualflow": [220, 220, 220, 220, 220, 220, 220, 325, 325, 325, 325, 325, 430, 430, 430, 430, 430, 430, 430, 430, 115, 115],
                        "actualenergy": [6120, 6120, 6120, 6120, 6120, 7125, 7125, 7125, 7125, 7125, 8130, 8130, 5115, 5115, 5115, 5115, 5115, 5115, 5115, 5115, 5115, 5115],
                        "supplytemp": [80, 80, 80, 80, 80, 80, 80, 80, 90, 90, 90, 90, 90, 100, 100, 100, 100, 100, 75, 75, 75, 75],
                        "returntemp": [40, 40, 40, 40, 40, 40, 40, 40, 50, 50, 50, 50, 50, 60, 60, 60, 60, 60, 40, 40, 40, 40]

                    },
                    "oneweek": {
                        "timestamps": [1456786799, 1456873199, 1456959599, 1457045999, 1457132399],
                        "actualflow": [430, 430, 430, 220, 220],
                        "actualenergy": [8130, 8130, 8130, 6120, 6120],
                        "supplytemp": [80, 80, 80, 80, 80],
                        "returntemp": [40, 40, 40, 40, 40]
                    },
                    "onemonth": {
                        "timestamps": [1455490799, 1456095599, 1456700399, 1457305199],
                        "actualflow": [220, 220, 220, 220],
                        "actualenergy": [6120, 6120, 6120, 6120],
                        "supplytemp": [80, 80, 80, 80],
                        "returntemp": [40, 40, 40, 40]
                    },
                    "oneyear": {
                        "timestamps": [1446332399, 1448924399, 1451602799, 1454281199, 1456786799],
                        "actualflow": [220, 220, 220, 220, 220],
                        "actualenergy": [6120, 6120, 6120, 6120, 6120],
                        "supplytemp": [80, 80, 80, 80, 80],
                        "returntemp": [40, 40, 40, 40, 40]
                    }
                }
            },
            {
                "id": 10,
                "name": "Heatplant 5",
                "branchname": "Nordborg",
                "address": "Nordborgvej 81, Nordborg, Denmark",
                "long": 55.68048,
                "lat": 9.4185263,
                "plannedflow": 120,
                "actualflow": 120,
                "plannedenergy": 6000,
                "actualenergy": 6000,
                "history": {
                    "oneday": {
                        "timestamps": [1457308800, 1457312400, 1457316000, 1457319600, 1457323200, 1457326800, 1457330400, 1457334000, 1457337600, 1457337600, 1457344800, 1457348400, 1457352000, 1457355600, 1457359200, 1457362800, 1457366400, 1457370000, 1457373600, 1457377200, 1457380800],
                        "actualflow": [220, 220, 220, 220, 220, 220, 220, 325, 325, 325, 325, 325, 430, 430, 430, 430, 430, 430, 430, 430, 115, 115],
                        "actualenergy": [6120, 6120, 6120, 6120, 6120, 7125, 7125, 7125, 7125, 7125, 8130, 8130, 5115, 5115, 5115, 5115, 5115, 5115, 5115, 5115, 5115, 5115],
                        "supplytemp": [80, 80, 80, 80, 80, 80, 80, 80, 90, 90, 90, 90, 90, 100, 100, 100, 100, 100, 75, 75, 75, 75],
                        "returntemp": [40, 40, 40, 40, 40, 40, 40, 40, 50, 50, 50, 50, 50, 60, 60, 60, 60, 60, 40, 40, 40, 40]

                    },
                    "oneweek": {
                        "timestamps": [1456786799, 1456873199, 1456959599, 1457045999, 1457132399],
                        "actualflow": [430, 430, 430, 220, 220],
                        "actualenergy": [8130, 8130, 8130, 6120, 6120],
                        "supplytemp": [80, 80, 80, 80, 80],
                        "returntemp": [40, 40, 40, 40, 40]
                    },
                    "onemonth": {
                        "timestamps": [1455490799, 1456095599, 1456700399, 1457305199],
                        "actualflow": [220, 220, 220, 220],
                        "actualenergy": [6120, 6120, 6120, 6120],
                        "supplytemp": [80, 80, 80, 80],
                        "returntemp": [40, 40, 40, 40]
                    },
                    "oneyear": {
                        "timestamps": [1446332399, 1448924399, 1451602799, 1454281199, 1456786799],
                        "actualflow": [220, 220, 220, 220, 220],
                        "actualenergy": [6120, 6120, 6120, 6120, 6120],
                        "supplytemp": [80, 80, 80, 80, 80],
                        "returntemp": [40, 40, 40, 40, 40]
                    }
                }
            }
        ];

        // Severity 0=CRITICAL, 1=IMPORTANT, 2=WARNING; Timestamp is epoch time
        $scope.notifications = [
            {
                "id": 1,
                "name": "SUBSTATION_OFFLINE",
                "text": "Substation 5 is offline",
                "severity": 0,
                "timestamp": 1454488124
            },
            {
                "id": 2,
                "name": "CRITICAL_ERROR_ON_SUBSTATION",
                "text": "Critical error detected on Substation 3",
                "severity": 0,
                "timestamp": 1455956924
            },
            {
                "id": 3,
                "name": "CRITICAL_ERROR_ON_SUBSTATION",
                "text": "Critical error detected on Substation 4",
                "severity": 0,
                "timestamp": 1455964124
            },
            {
                "id": 4,
                "name": "CONSUMPTION_TOO_HIGH",
                "text": "Substation 4 is consumiing too much energy",
                "severity": 1,
                "timestamp": 1456568924
            }
        ];

        $scope.currentNetwork = $scope.userNetworks[0];
        $scope.convertTimestampsToText($scope.substations);
        $scope.convertTimestampsToText($scope.heatplants);
        $scope.convertTimestampsToText($scope.userNetworks);

    } else {

        $scope.currentUser = loginService.userDetails;
        $scope.nrNetworks = $scope.currentUser.denetworks.length;
        $scope.userNetworks = loginService.userNetworks;
        $scope.convertTimestampsToText($scope.userNetworks);
        $scope.currentNetwork = $scope.userNetworks[0];
        $scope.currentNetworkId = $scope.currentNetwork.id;

        $scope.substations = loginService.userSubstations;
        $scope.heatplants = loginService.userHeatplants;
        $scope.notifications = loginService.userNotifications;

        $scope.convertTimestampsToText($scope.substations);
        $scope.convertTimestampsToText($scope.heatplants);

        if ($scope.substations.length > 0) $scope.currentSubstation = $scope.substations[0];
        if ($scope.heatplants.length > 0) $scope.currentHeatplant = $scope.heatplants[0];

        var promise = $interval($scope.refreshData, 60000);
    }


    NgMap.getMap().then(function(map) {

        console.log(map.getCenter());
        $scope.map = map;

        console.log('markers', map.markers);
        console.log('shapes', map.shapes);
    });

    $scope.selectedDatatype = 0;

    $scope.switchDataType = function () {

        if ($scope.selectedDatatype == 0) {
            $scope.selectedDatatype = 1;
        }
        else if ($scope.selectedDatatype == 1) {
            $scope.selectedDatatype = 0;
        }
        else  {
            $scope.selectedDatatype = 0;
        }
    };

    // Calculate percentage of total flow for the substation for the dashboard page
    $scope.calculatePercentageOfTotalFlow = function(substationid) {
        var substationFlow = 0;
        var totalFlow = 0;

        for (i in $scope.substations) {
            if ($scope.substations[i].macaddress == substationid) {
                substationFlow = $scope.substations[i].actualflow;
            }

            totalFlow += $scope.substations[i].actualflow;
        }

        return Math.round(substationFlow/totalFlow*100);
    };

    // Calculate percentage of total energy for the substation for the dashboard page
    $scope.calculatePercentageOfTotalEnergy = function(substationid) {
        var substationEnergy = 0;
        var totalEnergy = 0;

        for (i in $scope.substations) {
            if ($scope.substations[i].macaddress == substationid) {
                substationEnergy = $scope.substations[i].actualenergy;
            }

            totalEnergy += $scope.substations[i].actualenergy;
        }

        return Math.round(substationEnergy/totalEnergy*100);
    };

    // View types: 0=All substation view, 1=Add substation, 2=View single substation
    $scope.currentSubstationViewMode = 0;

    $scope.addSubstationView = function () {
        $scope.currentSubstationViewMode = 1;
    };

    $scope.backToSubstationsView = function () {
        $scope.selectedsubstation = $scope.currentSubstation.macaddress;
        $scope.currentSubstationViewMode = 0;
    };

    $scope.checkSubstationName = function(substationname) {
        $scope.newSubstationName = substationname;
    };

    $scope.checkSubstationMAC = function(substationmac) {
        $scope.newSubstationMAC = substationmac;
    };

    $scope.checkSubstationConnString = function(substationconnstring) {
        $scope.newSubstationConnString = substationconnstring;
    };

    $scope.checkSubstationHeatedArea = function(substationheatedarea) {
        $scope.newSubstationHeatedArea = substationheatedarea;
    };

    $scope.checkSubstationBranchName = function(substationbranchname) {
        $scope.newSubstationBranchName = substationbranchname;
    };

    //Add/Activate substation
    $scope.addSubstation = function() {
        var req = {
            method: 'POST',
            url: loginService.apiUrl + '/api/v1/substations/activate',
            headers: {
                'Authorization': 'Bearer ' + loginService.token
            },
            data: {
                'macaddress': $scope.newSubstationMAC,
                'name': $scope.newSubstationName,
                'connstring': $scope.newSubstationConnString,
                'branchname': $scope.newSubstationBranchName,
                'kvm': $scope.newSubstationHeatedArea,
                'address': $scope.address,
                'denetwork': $scope.currentNetworkId
            }
        };

        console.log("Substation activation request: "+req);

        $http(req).then(function successCallback(response) {
            console.log(response);

            if (response.data.success) {

            }
            else {
                console.log("Error occured when activating the Substation");
            }

            if ($scope.substations.lenght > 0) {
                $scope.currentSubstation = $scope.substations[0];
            }


            $scope.backToSubstationsView();
            $scope.refreshData();

        }, function errorCallback(response, err) {
            console.log(err);
        });
    };


    // Show a confirmation modal dialog before the substation is removed
    $scope.removeSubstationsView = function() {
        $confirm({text: 'Are you sure you want to delete the substation?'})
            .then(function() {
                $scope.deletedConfirm = 'Deleted';

                var req = {
                    method: 'POST',
                    url: loginService.apiUrl + '/api/v1/substations/deactivate',
                    headers: {
                        'Authorization': 'Bearer ' + loginService.token
                    },
                    data: {
                        'macaddress': $scope.currentSubstation.macaddress
                    }
                };

                $http(req).then(function successCallback(response) {
                    console.log(response);

                    if (response.data.success) {

                    }
                    else {
                        console.log("Error occured when deactivating the Substation");

                    }

                    if ($scope.substations.lenght > 0) {
                        $scope.currentSubstation = $scope.substations[0];
                    }

                    $scope.backToSubstationsView();
                    $scope.refreshData();

                }, function errorCallback(response, err) {
                    console.log(err);
                });
            });
    };

    // By default the first substation is the viewed substation
    $scope.currentSubstation = $scope.substations[0];

    $scope.viewSingleSubstationView = function () {
        $scope.currentSubstationViewMode = 2;
    };

    // Iterate through the substations to set the currently selected substation
    $scope.updateCurrentSubstation = function (selectedsubstation) {

        for (index in $scope.substations)
        {

            if ($scope.substations[index].macaddress == selectedsubstation) {

                $scope.currentSubstation = $scope.substations[index];
                $scope.address = $scope.substations[index].address;
                $scope.updateSubstationChartData();
                return;
            }
        }
    };

    // View types: 0=All heatplant view, 1=Add heatplant, 2=View single heatplant
    $scope.currentHeatplantViewMode = 0;

    $scope.addHeatplantView = function () {
        $scope.currentHeatplantViewMode = 1;
    };

    $scope.backToHeatplantsView = function () {
        $scope.currentHeatplantViewMode = 0;
    };

    // By default the first heatplant is the viewed heatplant
    $scope.currentHeatplant = $scope.heatplants[0];

    $scope.viewSingleHeatplantView = function () {
        $scope.currentHeatplantViewMode = 2;
    };

    // Iterate through the heatplants to set the currently selected heatplant
    $scope.updateCurrentHeatplant = function (selectedheatplant) {

        for (index in $scope.heatplants)
        {

            if ($scope.heatplants[index].id == selectedheatplant) {

                $scope.currentHeatplant = $scope.heatplants[index];
                $scope.address = $scope.heatplants[index].address;
                $scope.updateHeatplantChartData();
                return;
            }
        }


    };


    $scope.onlinecount = 0;
    $scope.offlinecount = 0;
    $scope.notificationcount = 0;
    $scope.userscount = 0;

    $scope.convertStatusToText = function(status) {

        switch (status) {
            case 0:
                return "Online";
                break;
            case 1:
                return "Error";
                break;
            case 2:
                return "Offline";
                break;
            default:
                return "";
                break;
        }
    };

    $scope.getNrOnlineSubstations = function() {
        var countonline = 0;

        for (i in $scope.substations)
        {
            if ($scope.substations[i].status === 0) {
                countonline++;
            }
        }

        $scope.onlinecount = countonline;
    };

    $scope.getNrOfflineSubstations = function() {
        var countoffline = 0;

        for (a in $scope.substations)
        {
            if ($scope.substations[a].status === 2) {
                countoffline++;
            }
        }

        $scope.offlinecount = countoffline;
    };

    $scope.getNrNotifications = function() {
        var countnotifications = 0;

        for (a in $scope.notifications)
        {
            countnotifications++;
        }

        $scope.notificationcount = countnotifications;
    };

    $scope.getNrUsers = function() {
        var countusers = 0;

        if ($scope.demoConf) {

            for (a in $scope.users)
            {
                countusers++;
            }
        } else {
            var req = {
                method: 'GET',
                url: loginService.apiUrl + '/api/v1/users/getcount/' + $scope.currentNetworkId,
                headers: {'Authorization': 'Bearer ' + loginService.token}
            };

            console.log(req);

            $http(req).then(function successCallback(response) {
                console.log(response);

                if (response.data.success) {
                    countusers = response.data.count;
                }
                else {
                    countusers = 0;
                }

            }, function errorCallback(response, err) {
                console.log(err);
                countusers = 0;
            });
        }


        $scope.userscount = countusers;
    };

    // Function for filtering the substation records based on the criteria defined in the Search input field

    $scope.filterSubstations = function(filtersubstationstext)
    {
        $scope.filtersubstationstext = filtersubstationstext;
    };

    // Function for filtering the heatplant records based on the criteria defined in the Search input field

    $scope.filterHeatplants = function(filterheatplantstext)
    {
        $scope.filterheatplantstext = filterheatplantstext;
    };

    // Function for filtering substations or heatplants in the right widget on the dashboard page
    $scope.filterSubsHeatplantRecords = function(filtertextsubsheatplants)
    {
        $scope.filtertextsubsheatplants = filtertextsubsheatplants;
    }

    // Function for filtering notifications
    $scope.filterNotifications = function(filtertextnotifications)
    {
        $scope.filtertextnotifications = filtertextnotifications;
    }


    // Function for filtering of the substation records based on Address
    $scope.checkAddress = function (address) {
        $scope.address = address;
    }

    // Initial update of the number of substations
    $scope.getNrOnlineSubstations();
    $scope.getNrOfflineSubstations();
    $scope.getNrNotifications();
    $scope.getNrUsers();


    $scope.refreshData = function() {
        console.log("Refreshing Dashboard Data ...");

        $scope.getAllSubstations($scope.currentNetworkId);
        $scope.getAllHeatplants($scope.currentNetworkId);
        $scope.getAllNotifications($scope.currentNetworkId);

        $scope.convertTimestampsToText($scope.substations);
        $scope.convertTimestampsToText($scope.heatplants);

        if ($scope.substations.length > 0) $scope.updateSubstationChartData();
        if ($scope.heatplants.length > 0) $scope.updateHeatplantChartData();
        $scope.updateDENetworkChartData();

        $scope.getNrOnlineSubstations();
        $scope.getNrOfflineSubstations();
        $scope.getNrNotifications();
        $scope.getNrUsers();
    };

    // Cancel interval on page changes
    $scope.$on('$destroy', function(){
        if (angular.isDefined(promise)) {
                $interval.cancel(promise);
            promise = undefined;
        }
    });

    $scope.placeChanged = function() {
        $scope.place = this.getPlace();
        console.log('location', $scope.place.geometry.location);
        $scope.map.setCenter($scope.place.geometry.location);
    };


    // Default location on the Google map
    $scope.selectedLocation = {"lat": 0, "long": 0};
    $scope.showmarker = false;

    // Choose location for new substation/heatplant
    $scope.addMarker = function(event) {
        $scope.selectedLocation.lat = event.latLng.lat();
        $scope.selectedLocation.long = event.latLng.lng();
        $scope.showmarker = true;

        console.log("New marker at: "+event.latLng.lat()+" and "+event.latLng.lng());
    };



    // Update optimization type and the respective units on the DE Network page
    $scope.updateUnits = function(optimizationtypeunits) {
        if (optimizationtypeunits == 'flowbasedoptimization') {
            $scope.optimizationTypeUnits = '(t/h)';
        } else if (optimizationtypeunits == 'energybasedoptimization') {
            $scope.optimizationTypeUnits = '(kW)';
        }
    };

    $scope.optimizationtype = $scope.currentNetwork.optimizationtype;
    $scope.updateUnits($scope.optimizationtype);

    $scope.calculateNetworkFlowProduction = function() {

        var totalFlow = 0;

        for (index in $scope.heatplants) {
            totalFlow += $scope.heatplants[index].plannedflow;
        }

        return totalFlow;
    };

    $scope.calculateNetworkFlowConsumption = function() {

        var totalFlow = 0;

        for (index in $scope.substations) {
            totalFlow += $scope.substations[index].actualflow;
        }

        return totalFlow;
    };

    $scope.calculateNetworkEnergyProduction = function() {

        var totalEnergy = 0;

        for (index in $scope.heatplants) {
            totalEnergy += $scope.heatplants[index].plannedenergy;
        }

        return totalEnergy;
    };

    $scope.calculateNetworkEnergyConsumption = function() {

        var totalEnergy = 0;

        for (index in $scope.substations) {
            totalEnergy += $scope.substations[index].actualenergy;
        }

        return totalEnergy;
    };


    $scope.updateOptimizationType = function(optimizationtype) {
        $scope.currentNetwork.optimizationtype = optimizationtype;
    };

    $scope.currentSubstationChartType = 0;
    $scope.currentHeatplantChartType = 0;
    $scope.currentDENetworkChartType = 0;
    $scope.granularity = '1day';

    // Change the granulation for the charts view between 1day, 1week, 1month, 1year
    $scope.changeGranulation = function(granularity) {
        console.log("Granularity changed")
        $scope.granularity = granularity;
        $scope.updateSubstationChartData();
        $scope.updateHeatplantChartData();
        $scope.updateDENetworkChartData();
    };

    // Change Substation History View: 0: Planned/Actual flow, 1: Planned/Actual energy, 2: Supply/Return Temp
    $scope.changeSubstationChartType = function() {
        if ($scope.currentSubstationChartType >=2) {
            $scope.currentSubstationChartType = 0;
        } else {
            $scope.currentSubstationChartType++;
        }

        $scope.updateSubstationChartData();
    };


    // Change Heatplant History View: 0: Actual flow, 1: Actual energy, 2: Supply/Return Temp
    $scope.changeHeatplantChartType = function() {
        if ($scope.currentHeatplantChartType >=2) {
            $scope.currentHeatplantChartType = 0;
        } else {
            $scope.currentHeatplantChartType++;
        }

        $scope.updateHeatplantChartData();
    };


    // Change DE Network History View: 0: Actual flow, 1: Actual energy, 2: Outdoor Temp
    $scope.changeDENetworkChartType = function() {
        if ($scope.currentDENetworkChartType >=2) {
            $scope.currentDENetworkChartType = 0;
        } else {
            $scope.currentDENetworkChartType++;
        }

        $scope.updateDENetworkChartData();
    };


    if ($scope.substations.length > 0) $scope.updateSubstationChartData();
    if ($scope.heatplants.length > 0) $scope.updateHeatplantChartData();
    $scope.updateDENetworkChartData();
}