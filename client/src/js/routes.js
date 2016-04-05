'use strict';

/**
 * Route configuration for the RDash module.
 */
angular.module('RDash').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

        // For unmatched routes
        $urlRouterProvider.otherwise('/');

        // Application routes
        $stateProvider
            .state('index', {
                url: '/',
                templateUrl: 'templates/dashboard.html',
                authenticate: true
            })
            .state('substations', {
                url: '/substations',
                templateUrl: 'templates/substations.html',
                authenticate: true
            })
            .state('heatplants', {
                url: '/heatplants',
                templateUrl: 'templates/heatplants.html',
                authenticate: true
            })
            .state('denetwork', {
                url: '/denetwork',
                templateUrl: 'templates/denetwork.html',
                authenticate: true
            })
            .state('notifications', {
            url: '/notifications',
            templateUrl: 'templates/notifications.html',
            authenticate: true
            })
            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html',
                authenticate: false
            })
            .state('users', {
                url: '/users',
                templateUrl: 'templates/users.html',
                authenticate: true
            });
    }
]);

angular
    .module('RDash')
    .service('loginService',['$http', '$state', 'md5', loginService]);

    function loginService($http, $state, md5) {

        var service = {
            token : '',
            loggedInUserName:'',
            apiUrl: 'http://104.45.131.110:8080',
            authenticated: false,
            userDetails: {},
            userNetworks: [],
            userSubstations: [],
            userHeatplants: [],
            userNotifications: [],
            isLoggedIn:function(){
                return service.token!='';
            },
            isAuthorized : function(){
                if(!service.isLoggedIn()){
                    return false;
                }

                var req = {
                    method: 'GET',
                    url: service.apiUrl + '/api/v1/users/validatetoken',
                    headers: {'Authorization': 'Bearer '+service.token}
                };


                $http(req).then(function successCallback(response) {
                    console.log(response);

                    if (response.data.success) {
                        console.log("The token is valid");
                        service.authenticated = true;
                        return true;
                    }
                    else {
                        console.log("The token is not valid");
                        service.authenticated = false;
                        return false;
                    }
                }, function errorCallback(response, err) {
                    console.log(err.message);
                    service.authenticated = false;
                    return false;
                });

            }
            ,doLogin:function(username,password,oncomplete){
                service.token= 'test token';

                var req = {
                    method: 'POST',
                    url: service.apiUrl + '/api/v1/users/authenticate',
                    headers: {
                    },
                    data:
                    {
                        username: username,
                        password: md5.createHash(password || '')
                    }
                };

                $http(req).then(function successCallback(response) {
                    console.log(response);

                    if (response.data.success) {
                        console.log("Successfully received new token");
                        service.token = response.data.token;

                        var req = {
                            method: 'GET',
                            url: service.apiUrl + '/api/v1/users/'+username,
                            headers: {'Authorization': 'Bearer '+service.token}
                        };


                        $http(req).then(function successCallback(response) {
                            console.log(response);
                            service.userDetails = response.data;

                            var userNetworkIds = response.data.denetworks;
                            var count = 0;

                            userNetworkIds.forEach(function(denetwork) {
                                var req = {
                                    method: 'GET',
                                    url: service.apiUrl + '/api/v1/denetworks/' + denetwork.id,
                                    headers: {'Authorization': 'Bearer ' + service.token}
                                };

                                console.log(req);

                                $http(req).then(function successCallback(response) {
                                    console.log(response);

                                    count++;
                                    service.userNetworks.push(response.data);
                                    console.log("Current count is: "+count);

                                    if (count == userNetworkIds.length) {

                                        var req = {
                                            method: 'GET',
                                            url: service.apiUrl + '/api/v1/substations/getall/' + service.userNetworks[0].id,
                                            headers: {'Authorization': 'Bearer ' + service.token}
                                        };

                                        $http(req).then(function successCallback(response) {
                                            console.log(response);
                                            service.userSubstations = response.data;


                                            var req = {
                                                method: 'GET',
                                                url: service.apiUrl + '/api/v1/heatplants/getall/' + service.userNetworks[0].id,
                                                headers: {'Authorization': 'Bearer ' + service.token}
                                            };

                                            $http(req).then(function successCallback(response) {
                                                console.log(response);
                                                service.userHeatplants = response.data;


                                                var req = {
                                                    method: 'GET',
                                                    url: service.apiUrl + '/api/v1/notifications/' + service.userNetworks[0].id,
                                                    headers: {'Authorization': 'Bearer ' + service.token}
                                                };

                                                $http(req).then(function successCallback(response) {
                                                    console.log(response);
                                                    service.userNotifications = response.data;


                                                    console.log("All network details: "+service.userNetworks);
                                                    service.authenticated = true;
                                                    service.loggedInUserName=username;
                                                    service.isAuthorized();
                                                    $state.transitionTo("index");
                                                    return true;

                                                }, function errorCallback(response, err) {
                                                    service.token = "";
                                                    service.authenticated = false;
                                                    service.loggedInUserName='';
                                                    $state.transitionTo("login");
                                                    return false;
                                                });


                                            }, function errorCallback(response, err) {
                                                service.token = "";
                                                service.authenticated = false;
                                                service.loggedInUserName='';
                                                $state.transitionTo("login");
                                                return false;
                                            });


                                        }, function errorCallback(response, err) {
                                            service.token = "";
                                            service.authenticated = false;
                                            service.loggedInUserName='';
                                            $state.transitionTo("login");
                                            return false;
                                        });

                                    }

                                }, function errorCallback(response, err) {
                                    service.token = "";
                                    service.authenticated = false;
                                    service.loggedInUserName='';
                                    $state.transitionTo("login");
                                    return false;
                                });

                            });

                        }, function errorCallback(response, err) {
                            service.token = "";
                            service.authenticated = false;
                            service.loggedInUserName='';
                            $state.transitionTo("login");
                            return false;
                        });

                    }
                    else {
                        console.log("Token not received, most likely wrong credentials");
                        service.token = "";
                        service.authenticated = false;
                        service.loggedInUserName='';
                        return false;
                    }
                }, function errorCallback(response, err) {
                    console.log(err.message);
                    service.authenticated = false;
                    service.token = "";
                    service.loggedInUserName='';
                    return false;
                });

                if(oncomplete){
                    oncomplete();
                }
            }
            ,doLogout:function(oncomplete){
                service.token= '';
                service.authenticated = false;
                service.loggedInUserName='';

                $state.transitionTo("login");

                if(oncomplete){
                    oncomplete();
                }
            }
        };
        return service;
    };

angular
    .module('RDash')
    .run(['$rootScope','$state','loginService', function ($rootScope, $state,loginService) {
    $rootScope.loginService = loginService;
    $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
        $rootScope.loginService.isAuthorized(toState);

        if (toState.authenticate && ! $rootScope.loginService.authenticated)
        {
            console.log("User not authenticated");
            $state.transitionTo("login");
            event.preventDefault();
        }
    });
}]);
