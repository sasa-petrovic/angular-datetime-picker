angular.module('app', ['angular.datetime.picker']);
angular.module('app').controller("Ctrl", ["$scope", function(s) {
    s.dateFrom = new Date();
}]);
