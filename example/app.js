angular.module('app', ['angular.datetime.picker']);

angular.module('app').config(['datetimepickerSettingsProvider',
    function(datetimepickerSettingsProvider) {
        //datetimepickerSettingsProvider.templateUrl = "test/html.html";
    }
]);


angular.module('app').controller("Ctrl", ["$scope", function(s) {
    s.dateFrom = new Date();
}]);
