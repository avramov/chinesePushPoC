/**
 * Master Controller
 */

angular.module('RDash')
    .controller('MasterCtrl', ['$scope', '$cookieStore', 'loginService', MasterCtrl]);

function MasterCtrl($scope, $cookieStore, loginService) {
    /**
     * Sidebar Toggle & Cookie Control
     */
    var mobileView = 992;

    $scope.getWidth = function() {
        return window.innerWidth;
    };

    $scope.$watch($scope.getWidth, function(newValue, oldValue) {
        if (newValue >= mobileView) {
            if (angular.isDefined($cookieStore.get('toggle'))) {
                $scope.toggle = ! $cookieStore.get('toggle') ? false : true;
            } else {
                $scope.toggle = true;
            }
        } else {
            $scope.toggle = false;
        }

    });

    $scope.defPageName = function(location) {

        console.log("New location is:"+location);

        switch (location)
        {
            case "/":
                $scope.pagename = "DASHBOARD"
            break;
            case "substations":
                $scope.pagename = "SUBSTATIONS";
            break;
            case "heatplants":
                $scope.pagename = "HEATPLANTS";
            break;
            case "denetwork":
                $scope.pagename = "DISTRICT ENERGY NETWORK";
            break;
            case "notifications":
                $scope.pagename = "NOTIFICATIONS";
            break;
            case "users":
                $scope.pagename = "USERS";
            break;
            default:
                $scope.pagename = "";
            break
        }
    };

    $scope.toggleSidebar = function() {
        $scope.toggle = !$scope.toggle;
        $cookieStore.put('toggle', $scope.toggle);
    };


    window.onresize = function() {
        $scope.$apply();
    };

    $scope.username = "";
    $scope.password = "";
    $scope.showerror = false;
    $scope.nrNetworks = 0;

    $scope.updateUsername = function(username) {
        $scope.username = username;
    };

    $scope.updatePassword = function(password) {
        $scope.password = password;
    };


    $scope.userLogin = function() {
        console.log("Username is: "+$scope.username);
        console.log("Password is: "+$scope.password);
        if (!loginService.doLogin($scope.username, $scope.password))
        {
            $scope.showerror = true;
        }
        else {

            $scope.showerror = false;
        }
    };

    $scope.logoutUser = function() {
        loginService.doLogout();
    };
}