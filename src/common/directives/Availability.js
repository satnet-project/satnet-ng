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

angular.module('snAvailabilityDirective', [
    'ngMaterial',
    'snControllers',
    'snJRPCServices'
])
.constant('SN_SCH_TIMELINE_DAYS', '2')
.constant('SN_SCH_HOURS_DAY', '3')
.constant('SN_SCH_DATE_FORMAT', 'DD-MM')
.constant('SN_SCH_HOUR_FORMAT', 'HH:mm')
.controller('snAvailabilityDlgCtrl', [
    '$q', '$scope', '$log', '$mdDialog',
    'satnetRPC', 'snDialog',
    'SN_SCH_TIMELINE_DAYS', 'SN_SCH_HOURS_DAY',
    'SN_SCH_DATE_FORMAT', 'SN_SCH_HOUR_FORMAT',

    /**
     * Controller function for handling the SatNet availability dialog.
     *
     * @param {Object} $scope $scope for the controller
     */
    function (
        $q, $scope, $log, $mdDialog, satnetRPC, snDialog,
        SN_SCH_TIMELINE_DAYS, SN_SCH_HOURS_DAY,
        SN_SCH_DATE_FORMAT, SN_SCH_HOUR_FORMAT
    ) {

        $scope.animation = {
            duration: '5',
            initial_width: '0%',
            final_width: '100%'
        };

        $scope.gui = {
            hours_per_day: -1,
            hour_step: null,
            no_cols: -1,
            days: [],
            slots: {},
            tmp_slots: {}
        };

        /**
         * Function that closes the dialog.
         */
        $scope.close = function () {
            $mdDialog.hide();
        };

        /**
         * Function that initializes the dictionary with the days and hours for
         * the axis of the timeline. It simply contains as many days as
         * specified in the variable "SN_SCH_TIMELINE_DAYS".
         */
        $scope.initAxisTimes = function () {

            var start_d = moment().hours(0).minutes(0).seconds(0),
                day = moment().hours(0).minutes(0).seconds(0),
                now = moment(),
                end_d = moment(start_d).add(SN_SCH_TIMELINE_DAYS, 'days'),
                ellapsed_s = moment(now).unix() - moment(start_d).unix(),
                total_s = moment(end_d).unix() - moment(start_d).unix(),
                duration_s = moment(end_d).unix() - moment(now).unix();

            $scope.gui.hours_per_day = 3;
            $scope.gui.hour_step = moment.duration(
                24 / $scope.gui.hours_per_day, 'hours'
            );
            $scope.gui.no_cols = $scope.gui.hours_per_day - 1;

            $scope.animation.initial_width = '' +
                ((ellapsed_s / total_s) * 100).toFixed(3) + '%';
            $scope.animation.duration = '' + duration_s;

            while (day.isBefore(end_d)) {

                var hour = moment().hours(0).minutes(0).seconds(0);
                $scope.gui.days.push(moment(day).format(SN_SCH_DATE_FORMAT));

                for (var i = 0; i < ( $scope.gui.hours_per_day - 1 ); i++) {

                    hour = moment(hour).add($scope.gui.hour_step, 'hours');
                    $scope.gui.days.push(hour.format(SN_SCH_HOUR_FORMAT));

                }

                day = moment(day).add(1, 'days');

            }

        };

        // animation: 'sn-sch-table-overlay 5s linear',

        /**
         * Function that returns the CSS animation decorator adapting it to the
         * estimated duration.
         * 
         * @returns {Object} ng-style CSS animation object
         */
        $scope._getCSSAnimation = function () {
            return {
                'animation': 'sn-sch-table-overlay-right  ' +
                    $scope.animation.duration + 's ' + ' linear',
                'width': $scope.animation.initial_width
            };
        };

        /**
         * This function filters all the slots for a given ground station and
         * creates slot objects that can be directly positioned and displayed
         * over a timeline.
         * 
         * @param   {String} groundstation_id Identifier of the Ground Station
         * @param   {Array}  slots            Array with the slots
         * @param   {Object} start_d          moment.js object with the start
         *                                  date of the timeline
         * @param   {Object} end_d            moment.js object with th end
         *                                  date of the timeline
         * @returns {Object} Dictionary addressed with the identifiers of the
         *                   Ground Stations as keys, whose values are the
         *                   filtered slots.
         */
        $scope.filter_slots = function (
            groundstation_id, slots, start_d, end_d
        ) {

            var r_slots = [];
            
            angular.forEach(slots, function (slot) {

                var slot_start_d = moment(slot.date_start),
                    slot_end_d = moment(slot.date_end),
                    duration_s = moment(end_d).unix() - moment(start_d).unix();

                // 1) The dates are first normalized, so that the slots are
                //      only displayed within the given start and end dates.
                slot_start_d = moment(slot_start_d).isBefore(start_d) ?
                    start_d : slot_start_d;
                slot_end_d = moment(slot_end_d).isAfter(end_d) ?
                    end_d : slot_end_d;

                // 2) After normalizing the dates, we can calculate the position
                //      and widths of the displayable slots.
                var start_s = moment(slot_start_d).unix() - moment(start_d).unix(),
                    slot_l = ( (start_s / duration_s) * 100 ).toFixed(3),
                    slot_duration_s = ( moment(slot_end_d).unix() - moment(slot_start_d).unix() ),
                    slot_w = ( (slot_duration_s / duration_s) * 100).toFixed(3);

                // 3) The resulting slot is added to the results array
                r_slots[groundstation_id] = {
                    raw_slot: slot,
                    slot: {
                        left: slot_l, width: slot_w
                    }
                };

            });

            return r_slots;

        };

        /**
         * Promise function that should be used to retrieve the availability
         * slots for each of the Ground Stations.
         * 
         * @param {String} groundstation_id Ground Station identifier
         */
        $scope._addGS = function (groundstation_id) {
            return satnetRPC.rCall('gs.availability', [groundstation_id]).then(
                function (results) {
                    return {
                        groundstation_id: groundstation_id,
                        slots: results
                    };
                }
            ).catch(
                function (cause) {
                    snDialog.exception(
                        'gs.availability', groundstation_id, cause
                    );
                }
            );
        };

        /**
         * Function that initializes the data structures for the visualization
         * of the available operational slots. The following data structures
         * have to be pulled out of the server:
         * 
         * 1) retrieve all the ground station identifiers from the server,
         * 2) retrieve the operatonal slots for the ground stations.
         */
        $scope.init = function () {

            // 1> init days and hours for the axis
            $scope.initAxisTimes();

            // 2> all the Ground Stations are retrieved
            satnetRPC.rCall('gs.list', []).then(function (results) {

                $log.info('XXXXX, gs list = ' + JSON.stringify(results));

                // 2.a> for each of the ground stations, a promise is created
                var p = [];
                angular.forEach(results, function (gs) {
                    $log.info('>>> loading slots for <' + gs + '>');
                    p.push($scope._addGS(gs));
                });

                // 2.b> the promises are resolved and only one all of them
                //      have been executed, the to-be-filtered structure within
                //      the controller's $scope is updated (avoids multiple
                //      calls to the filter through Angular's $watch()).
                $q.all(p).then(function (results) {
                    var t_slots = {};
                    console.log('>>>> results = '+ JSON.stringify(results));
                    angular.forEach(results, function (gs_slots) {
                        t_slots[gs_slots.groundstation_id] = angular.copy(
                            gs_slots.slots
                        );
                    });
                    console.log(
                        '>>>> $scope.gui.slots = '+ JSON.stringify($scope.gui.slots)
                    );
                    $scope.gui.slots = $scope.filter_slots(t_slots);
                    console.log(
                        '>>>> $scope.gui.slots = '+ JSON.stringify($scope.gui.slots)
                    );
                });

            }).catch(function (cause) {
                snDialog.exception('gs.list', [], cause);
            });

        };

    }

])
.controller('snAvailabilityCtrl', ['$scope', '$mdDialog',

    /**
     * Controller function for opening the SatNet availability dialog.
     *
     * @param {Object} $scope    $scope for the controller
     * @param {Object} $mdDialog Angular material Dialog service
     */
    function ($scope, $mdDialog) {

        /**
         * Function that opens the dialog when the snAvailability button is
         * clicked.
         */
        $scope.openDialog = function () {
            $mdDialog.show({
                templateUrl: 'common/templates/availability/dialog.html',
                controller: 'snAvailabilityDlgCtrl'
            });
        };

    }

])
.directive('snAvailability',

    /**
     * Function that creates the directive itself returning the object required
     * by Angular.
     *
     * @returns {Object} Object directive required by Angular, with
     *                   restrict and templateUrl
     */
    function () {
        return {
            restrict: 'E',
            templateUrl: 'common/templates/availability/menu.html'
        };
    }

);
