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
    'snJRPCServices',
    'snTimelineServices'
])
.controller('snAvailabilitySchCtrl', [
    '$scope', '$log',
    'satnetRPC', 'snDialog',
    'SN_SCH_TIMELINE_DAYS', 'SN_SCH_HOURS_DAY',
    'SN_SCH_DATE_FORMAT', 'SN_SCH_HOUR_FORMAT',
    'SN_SCH_GS_ID_WIDTH', 'SN_SCH_GS_ID_MAX_LENGTH',
    'timeline',

    /**
     * Controller function for handling the SatNet availability scheduler.
     *
     * @param {Object} $scope $scope for the controller
     */
    function (
        $scope, $log,
        satnetRPC, snDialog,
        SN_SCH_TIMELINE_DAYS, SN_SCH_HOURS_DAY,
        SN_SCH_DATE_FORMAT, SN_SCH_HOUR_FORMAT,
        SN_SCH_GS_ID_WIDTH, SN_SCH_GS_ID_MAX_LENGTH,
        timeline
    ) {


        /** Object that holds the configuration for the timeline animation */
        $scope.animation = {
            duration: '5',
            initial_width: '0%',
            final_width: '0%'
        };

        /** Object with the configuration for the GUI */
        $scope.gui = null;

        /**
         * Initializes the animation to be displayed over the timeline.
         */
        $scope.initAnimation = function () {

            var now = moment(),
                now_s = moment(now).unix(),
                ellapsed_s = now_s - $scope.gui.start_d_s,
                ellapsed_p = ellapsed_s /  $scope.gui.total_s,
                scaled_p = ellapsed_p * $scope.gui.scale_width * 100,
                scaled_w = $scope.gui.scaled_width;

            $scope.animation.initial_width = '' + scaled_p.toFixed(3) + '%';
            $scope.animation.final_width = '' + scaled_w.toFixed(3) + '%';
            $scope.animation.duration = '' + $scope.gui.total_s;

        };

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
         * Returns the CSS object for ng-style with the width of the cells
         * within the column of the Ground Station ID.
         * 
         * @returns {Object} CSS object with the width
         */
        $scope._getCSSGsIdWidth = function () {
            return {
                'width': $scope.gui.gs_id_width
            };
        };

        /**
         * Returns the CSS object for ng-style with the width of the overlay for
         * the time marker animation.
         * 
         * @returns {Object} CSS object with the width
         */
        $scope._getCSSOverlayWidth = function () {
            return {
                'width': (100 - SN_SCH_GS_ID_WIDTH) + '%'
            };
        };

        /**
         * Function that discards the given slot depending on whether it is
         * within the applicable window or outside.
         * 
         * @param   {Object}  start moment.js slot start
         * @param   {Object}  end   moment.js slot end
         * @returns {Boolean} 'true' if the object has to be discarded
         */
        $scope.discardSlot = function (start, end) {

            if (moment(start).isBefore($scope.gui.start_d)) {
                $log.warn('Slot discarded, too old!');
                return true;
            }
            if (moment(end).isAfter($scope.gui.end_d)) {
                $log.warn('Slot discarded, too futuristic!');
                return true;
            }
            return false;

        };

        /**
         * Function that normalizes a given slot, restricting its start and end
         * to the upper and lower limits for the applicable window.
         * 
         * @param   {Object}  start moment.js slot start
         * @param   {Object}  end   moment.js slot end
         */
        $scope.normalizeSlot = function (start, end) {

            start = moment(start).isBefore($scope.gui.start_d) ?
                $scope.gui.start_d : start;
            end = moment(end).isAfter($scope.gui.end_d) ?
                $scope.gui.end_d : end;

            return {
                start: start,
                end: end
            };

        };

        /**
         * Creates a slot that can be displayed within the GUI.
         * 
         * @param {Object} raw_slot Non-modified original slot
         * @param {Object} n_slot Normalized slot
         * @returns {Object} GUI displayable slot
         */
        $scope.createSlot = function (raw_slot, n_slot) {

            var slot_s_s = moment(n_slot.start).unix(),
                slot_e_s = moment(n_slot.end).unix(),
                start_s = slot_s_s - $scope.gui.start_d_s,
                slot_l = (start_s / $scope.gui.total_s) * 100,
                slot_duration_s = slot_e_s - slot_s_s,
                slot_w = (slot_duration_s / $scope.gui.total_s) * 100,
                id = raw_slot.identifier + '';

            return {
                raw_slot: raw_slot,
                slot: {
                    id: id.substring(SN_SCH_GS_ID_MAX_LENGTH),
                    s_date: moment(n_slot.start).format(),
                    e_date: moment(n_slot.end).format(),
                    left: slot_l.toFixed(3),
                    width: slot_w.toFixed(3)
                }
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
        $scope.filter_slots = function (groundstation_id, slots) {

            var results = [];

            console.log(
                '%%%% WINDOW: (' + moment($scope.gui.start_d).format() +
                ', ' + moment($scope.gui.end_d).format() + ')'
            );

            for (var i = 0; i < slots.length; i++ ) {

                var raw_slot = slots[i],
                    slot_s = moment(raw_slot.date_start),
                    slot_e = moment(raw_slot.date_end);

                // 0) Old or futuristic slots are discarded first.
                if ( $scope.discardSlot(slot_s, slot_e) ) {
                    continue;
                }

                console.log('%%%% raw_slot = ' + JSON.stringify(raw_slot));

                // 1) The dates are first normalized, so that the slots are
                //      only displayed within the given start and end dates.
                var n_slot = $scope.normalizeSlot(slot_s, slot_e);

                // 2) The resulting slot is added to the results array
                results.push($scope.createSlot(raw_slot, n_slot));

                console.log('%%%% n_slot = ' + JSON.stringify(n_slot));

            }

            return results;

        };

        /**
         * Promise function that should be used to retrieve the availability
         * slots for each of the Ground Stations.
         * 
         * @param {String} groundstation_id Ground Station identifier
         */
        $scope.getGSSlots = function (groundstation_id) {
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

            // 1.a> init days and hours for the axis
            $scope.gui = timeline.initScope();
            // 1.b> init the animation
            $scope.initAnimation();

            // 2> all the Ground Stations are retrieved
            satnetRPC.rCall('gs.list', []).then(function (results) {

                angular.forEach(results, function (gs_id) {
                    
                    $scope.getGSSlots(gs_id).then(function (results) {
                        $scope.gui.slots[gs_id] = $scope.filter_slots(
                            gs_id, results.slots
                        );
                    });

                });

            }).catch(function (cause) {
                snDialog.exception('gs.list', [], cause);
            });

        };

    }
])
.directive('snAvailabilityScheduler',

    /**
     * Function that creates the directive to embed the availability scheduler
     * wherever it is necessary within the application.
     * 
     * @returns {Object} Object directive required by Angular, with
     *                   restrict and templateUrl
     */
    function () {
        return {
            restrict: 'E',
            templateUrl: 'common/templates/availability/scheduler.html'
        };
    }

)
.controller('snAvailabilityDlgCtrl', [
    '$scope', '$mdDialog',

    /**
     * Controller function for handling the SatNet availability dialog.
     *
     * @param {Object} $scope $scope for the controller
     */
    function ($scope, $mdDialog) {

        /**
         * Function that closes the dialog.
         */
        $scope.close = function () { $mdDialog.hide(); };

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
