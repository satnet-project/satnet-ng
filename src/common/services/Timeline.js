/**
 * Copyright 2015 Ricardo Tubio-Pardavila
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Created by rtubio on 10/24/14.
 */

angular.module('snTimelineServices', [])
.constant('SN_SCH_TIMELINE_DAYS', 3)
.constant('SN_SCH_HOURS_DAY', 3)
.constant('SN_SCH_DATE_FORMAT', 'DD-MM')
.constant('SN_SCH_HOUR_FORMAT', 'HH:mm')
.constant('SN_SCH_GS_ID_WIDTH', 10)
.constant('SN_SCH_GS_ID_MAX_LENGTH', 6)
.service('timeline', [
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
        this.initScopeTimes = function (x_scope) {

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

            var scope = {
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

            scope.end_d = moment(scope.start_d).add(scope.no_days, 'days');
            scope.start_d_s = moment(scope.start_d).unix();
            scope.end_d_s = moment(scope.end_d).unix();
            scope.total_s = scope.end_d_s - scope.start_d_s;
            scope.hour_step = moment.duration(
                (24 / scope.hours_per_day), 'hours'
            );
            scope.no_cols = scope.hours_per_day - 1;
            scope.max_no_cols = scope.hours_per_day * scope.no_days;

            this.initScopeTimes(scope);

            return scope;

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

]);