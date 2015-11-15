/*
   Copyright 2015 Ricardo Tubio-Pardavila

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

angular.module('snTimelineDirective', [])
.constant('SN_SCH_TIMELINE_DAYS', 3)
.constant('SN_SCH_HOURS_DAY', 3)
.constant('SN_SCH_DATE_FORMAT', 'DD-MM')
.constant('SN_SCH_HOUR_FORMAT', 'HH:mm')
.constant('SN_SCH_GS_ID_WIDTH', 10)
.constant('SN_SCH_GS_ID_MAX_LENGTH', 6)
.service('snTimelineService', [
    '$log',
    'SN_SCH_TIMELINE_DAYS',
    'SN_SCH_HOURS_DAY',
    'SN_SCH_GS_ID_WIDTH',
    'SN_SCH_DATE_FORMAT',
    'SN_SCH_HOUR_FORMAT',

    /**
     * Function services to create reusable timeline services.
     * 
     * @param {Object} $log Angular JS $log services
     */
    function (
        $log,
        SN_SCH_TIMELINE_DAYS,
        SN_SCH_HOURS_DAY,
        SN_SCH_GS_ID_WIDTH,
        SN_SCH_DATE_FORMAT,
        SN_SCH_HOUR_FORMAT
    ) {

        /**
         * Function that initializes the days within the given scope for the
         * timeline.
         * 
         * @param {Object} x_scope Object with timeline's configuration
         */
        this.initScopeDays = function (x_scope) {

            var day = moment().hours(0).minutes(0).seconds(0);

            while (day.isBefore(x_scope.end_d)) {

                var hour = moment().hours(0).minutes(0).seconds(0),
                    day_s = moment(day).format(SN_SCH_DATE_FORMAT);

                x_scope.days.push(day_s);
                x_scope.times.push(day_s);

                for (var i = 0; i < ( x_scope.hours_per_day - 1 ); i++) {

                    hour = moment(hour).add(x_scope.hour_step, 'hours');
                    x_scope.times.push(hour.format(SN_SCH_HOUR_FORMAT));

                }

                day = moment(day).add(1, 'days');

            }

        };
            
        /**
         * Function that initializes the dictionary with the days and hours for
         * the axis of the timeline. It simply contains as many days as
         * specified in the variable "SN_SCH_TIMELINE_DAYS".
         */
        this.initScope = function () {

            var x_scope = {
                start_d: moment().hours(0).minutes(0).seconds(0),
                start_d_s: -1,
                end_d: null,
                end_d_s: -1,
                hour_step: null,
                gs_id_width: SN_SCH_GS_ID_WIDTH + '%',
                max_width: 100 - SN_SCH_GS_ID_WIDTH,
                scaled_width: 100 - SN_SCH_GS_ID_WIDTH,
                scale_width: (100 - SN_SCH_GS_ID_WIDTH) / 100,
                hours_per_day: SN_SCH_HOURS_DAY,
                no_days: SN_SCH_TIMELINE_DAYS,
                total_s: -1,
                no_cols: -1,
                max_no_cols: -1,
                days: [],
                times: [],
                slots: {}
            };

            x_scope.end_d = moment(x_scope.gui.start_d).add(
                x_scope.gui.no_days, 'days'
            );
            x_scope.start_d_s = moment(x_scope.start_d).unix();
            x_scope.end_d_s = moment(x_scope.end_d).unix();
            x_scope.total_s = x_scope.end_d_s - x_scope.start_d_s;
            x_scope.hour_step = moment.duration(
                (24 / x_scope.hours_per_day), 'hours'
            );
            x_scope.no_cols = x_scope.hours_per_day - 1;
            x_scope.max_no_cols = x_scope.hours_per_day * x_scope.no_days;

            this.initScopeDays(x_scope);
            
            return x_scope;

        };

        /**
         * Function that returns the width of a any column within the timeline.
         * 
         * @param   {Object} cfg Object containing timeline's configuration
         * @returns {Object} CSS ng-style object with the calculated width
         */
        this.getCSSHoursWidth = function (cfg) {
            return {
                'width': (cfg.max_width / cfg.max_no_cols).toFixed(3) + '%'
            };
        };

    }

])
.controller('snTimelineCtrl', [
    '$scope', '$log',
    'SN_SCH_TIMELINE_DAYS', 'SN_SCH_HOURS_DAY',
    'SN_SCH_DATE_FORMAT', 'SN_SCH_HOUR_FORMAT',
    'SN_SCH_GS_ID_WIDTH',
    'snTimelineService',

    /**
     * Controller function for handling the SatNet availability dialog.
     *
     * @param {Object} $scope $scope for the controller
     */
    function (
        $scope, $log,
        SN_SCH_TIMELINE_DAYS, SN_SCH_HOURS_DAY,
        SN_SCH_DATE_FORMAT, SN_SCH_HOUR_FORMAT,
        SN_SCH_GS_ID_WIDTH, SN_SCH_GS_ID_MAX_LENGTH,
        snTimelineService
    ) {

        $scope.gui = null;

        /**
         * Returns the CSS object with the width for the hours of the timeline.
         * 
         * @returns {Object} CSS object with the width
         */
        $scope._getCSSHoursWidth = function () {
            snTimelineService.getCSSHoursWidth($scope.gui);
        };

        /**
         * Function that initializes the object with the configuration for the
         * GUI.
         */
        $scope.init = function () {
            $scope.gui = snTimelineService.initScope();
        };

    }

])
.directive('snTimeline',

    /**
     * Function that creates the directive to include a timeline table row.
     * 
     * @returns {Object} Object directive required by Angular, with
     *                   restrict and templateUrl
     */
    function () {
        return {
            restrict: 'E',
            templateUrl: 'common/templates/availability/timeline.html'
        };
    }

)
;
