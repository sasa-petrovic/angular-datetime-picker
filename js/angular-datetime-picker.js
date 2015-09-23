angular.module('angular.datetime.picker', ['ui.bootstrap', 'nya.bootstrap.select'])
    .provider('datetimepickerSettings', datetimepickerSettings)
    .directive('datetimepicker', ['$parse', '$timeout', '$filter', 'datetimepickerSettings', datetimepickerDirective]);

//date instanceof Date

function datetimepickerSettings() {
    this.templateUrl = "../html/angular-datetime-picker-template.html";
    this.hours = new Array();
    this.meridian_hours = new Array();
    var pad = "00";
    var hour;

    for (var i = 0; i < 24; i++) {
        if (i >= 0 && i <= 11) {
            hour = "" + i;
            hour = pad.substring(0, pad.length - hour.length) + hour;
            hour = hour === "00" ? "12" : hour;
            this.hours.push({
                value: i,
                formatted: hour
            });
        }

        hour = "" + i;
        hour = pad.substring(0, pad.length - hour.length) + hour;
        this.meridian_hours.push({
            value: i,
            formatted: hour
        });
    }


    this.generateMinutes = function(minutes_step) {
        var minutes = new Array(),
            pad = "00";
        for (var i = 0; i < 60; i += minutes_step) {
            minute = "" + i;
            minute = pad.substring(0, pad.length - minute.length) + minute;
            minutes.push({
                value: i,
                formatted: minute
            });
        }
        return minutes;
    };




    this.$get = function() {
        return {
            generateMinutes: this.generateMinutes,
            templateUrl: this.templateUrl,
            hours: this.hours,
            meridian_hours: this.meridian_hours
        };
    };
}

function datetimepickerDirective($parse, $timeout, $filter, settings) {
    return {
        restrict: 'A',
        require: ['ngModel'],
        templateUrl: settings.templateUrl,
        scope: {
            value: '=ngModel',
            meridians: '=dtpMeridians',
            hours: '=dtpHours',
            meridian_hours: '=dtpMeridianHours',
            minutes_step: '=dtpMinutesStep'
        },
        controller: function($scope, $element, $attrs, $transclude) {
            $scope.value = $scope.value instanceof Date ? $scope.value : new Date();
            $scope.meridians = !!$scope.meridians;
            $scope.hours = $scope.hours instanceof Array ? $scope.hours : settings.hours;
            $scope.meridian_hours = $scope.meridian_hours instanceof Array ? $scope.meridian_hours : settings.meridian_hours;
            $scope.minutes_step = $scope.minutes_step ? $scope.minutes_step : 15;
            $scope.minutes = settings.generateMinutes($scope.minutes_step);

            $scope.opened = false;

            var pm = $scope.value.getHours() >= 12;

            $scope.onOpenClick = function() {
                $scope.opened = !$scope.opened;
            };

            $scope.__defineSetter__('pm', function(new_pm) {
                var hours = $scope.value.getHours();
                if (new_pm && new_pm !== pm) {
                    $scope.value.setHours(hours + 12);
                } else
                if (!new_pm && new_pm !== pm) {
                    $scope.value.setHours(hours - 12);
                }
                pm = new_pm;
            });

            $scope.__defineGetter__('pm', function() {
                var hours = $scope.value.getHours();
                return hours >= 12;
            });

            $scope.__defineSetter__('hour', function(hours) {
                if (!$scope.meridians && $scope.pm) {
                    hours += 12;
                }
                $scope.value.setHours(hours);
            });

            $scope.__defineGetter__('hour', function() {
                var hours = $scope.value.getHours();
                if (!$scope.meridians && hours >= 12) {
                    hours -= 12;
                }
                return hours;
            });

            $scope.__defineSetter__('minute', function(minute) {

                var new_minute = minute;
                var diff = minute % $scope.minutes_step;
                if (diff > 0) {
                    new_minute = Math.floor(minute / $scope.minutes_step) * $scope.minutes_step + $scope.minutes_step;
                }


                if (new_minute >= 60) {
                    new_minute = $scope.minutes[0].value;
                    $scope.value.setHours($scope.value.getHours() + 1);
                }

                $scope.value.setMinutes(new_minute);
            });

            $scope.__defineGetter__('minute', function() {
                var minute = $scope.value.getMinutes();
                return minute;
            });

            $scope.minute = $scope.value.getMinutes();
        },
        compile: function(tElement, tAttrs) {
            // Compile

            return {

                pre: function(scope, iElement, iAttrs, controller, transcludeFn)

                {},

                post: function(scope, iElement, iAttrs, controller, transcludeFn) {}
            };
        }
    };
}
