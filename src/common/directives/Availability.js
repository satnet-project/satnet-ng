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
.constant('SN_SCH_TIMELINE_DAYS', 3)
.constant('SN_SCH_HOURS_DAY', 3)
.constant('SN_SCH_DATE_FORMAT', 'DD-MM')
.constant('SN_SCH_HOUR_FORMAT', 'HH:mm')
.constant('SN_SCH_GS_ID_WIDTH', 10)
.controller('snAvailabilityDlgCtrl', [
    '$scope', '$log', '$mdDialog',
    'satnetRPC', 'snDialog',
    'SN_SCH_TIMELINE_DAYS', 'SN_SCH_HOURS_DAY',
    'SN_SCH_DATE_FORMAT', 'SN_SCH_HOUR_FORMAT',
    'SN_SCH_GS_ID_WIDTH',

    /**
     * Controller function for handling the SatNet availability dialog.
     *
     * @param {Object} $scope $scope for the controller
     */
    function (
        $scope, $log, $mdDialog, satnetRPC, snDialog,
        SN_SCH_TIMELINE_DAYS, SN_SCH_HOURS_DAY,
        SN_SCH_DATE_FORMAT, SN_SCH_HOUR_FORMAT,
        SN_SCH_GS_ID_WIDTH
    ) {

        $scope.animation = {
            duration: '5',
            initial_width: '0%',
            final_width: '0%'
        };

        $scope.gui = {
            gs_id_width: SN_SCH_GS_ID_WIDTH + '%',
            start_d: null,
            end_d: null,
            hours_per_day: -1,
            hour_step: null,
            no_cols: -1,
            days: [],
            no_days: SN_SCH_TIMELINE_DAYS,
            times: [],
            slots: {}
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

            $scope.gui.start_d = moment().hours(0).minutes(0).seconds(0);
            $scope.gui.end_d =  moment($scope.gui.start_d).add(
                $scope.gui.no_days, 'days'
            );

            var day = moment().hours(0).minutes(0).seconds(0),
                now = moment(),
                ellapsed_s = moment(now).unix() - moment($scope.gui.start_d).unix(),
                total_s = moment($scope.gui.end_d).unix() - moment($scope.gui.start_d).unix(),
                duration_s = moment($scope.gui.end_d).unix() - moment(now).unix(),
                scale_width = (100 - SN_SCH_GS_ID_WIDTH) / 100;

            $scope.gui.hours_per_day = 3;
            $scope.gui.hour_step = moment.duration(
                24 / $scope.gui.hours_per_day, 'hours'
            );
            $scope.gui.no_cols = $scope.gui.hours_per_day - 1;

            $scope.animation.initial_width = '' +
                (((ellapsed_s / total_s) * scale_width) * 100).toFixed(3) + '%';
            $scope.animation.final_width = '' + (100-SN_SCH_GS_ID_WIDTH) + '%';
            $scope.animation.duration = '' + duration_s;

            while (day.isBefore($scope.gui.end_d)) {

                var hour = moment().hours(0).minutes(0).seconds(0),
                    day_s = moment(day).format(SN_SCH_DATE_FORMAT);

                $scope.gui.days.push(day_s);
                $scope.gui.times.push(day_s);

                for (var i = 0; i < ( $scope.gui.hours_per_day - 1 ); i++) {

                    hour = moment(hour).add($scope.gui.hour_step, 'hours');
                    $scope.gui.times.push(hour.format(SN_SCH_HOUR_FORMAT));

                }

                day = moment(day).add(1, 'days');

            }

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
         * Function that returns the CSS style code for properly placing and
         * displaying the given slot in a timeline as a float div.
         * 
         * @param   {Object} slot The slot to be displayed
         * @returns {Object} CSS containing the left position and the width
         */
        $scope._getCSSSlot = function (slot) {
            return {
                'left': slot.slot.left,
                'width': slot.slot.width
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

        $scope._getCSSHoursWidth = function () {
            var max_width = 100 - SN_SCH_GS_ID_WIDTH,
                max_no_cols = $scope.gui.hours_per_day * $scope.gui.no_days;
            return {
                'width': (max_width / max_no_cols).toFixed(3) + '%'
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

            var r_slots = [];

            console.log('%%%% PROCESSING WINDOW : start_d = ' + moment($scope.gui.start_d).format());
            console.log('%%%% PROCESSING WINDOW :   end_d = ' + moment($scope.gui.end_d).format());

            for (var i = 0; i < slots.length; i++ ) {

                var slot = slots[i],
                    slot_start_d = moment(slot.date_start),
                    slot_end_d = moment(slot.date_end),
                    duration_s = moment($scope.gui.end_d).unix() - moment($scope.gui.start_d).unix();

                console.log('slot = ' + JSON.stringify(slot));
                console.log('%%%% PROCESSING SLOT : start = ' + moment(slot_start_d).format());
                console.log('%%%% PROCESSING SLOT :   end = ' + moment(slot_end_d).format());

                // 0) Old or futuristic slots are discarded first.
                if (moment(slot_end_d).isBefore($scope.gui.start_d)) {
                    $log.warn('Slot discarded, too old!');
                    continue;
                }
                if (moment(slot_start_d).isAfter($scope.gui.end_d)) {
                    $log.warn('Slot discarded, too futuristic!');
                    continue;
                }

                console.log('%%%% NORMALIZED SLOT : start = ' + moment(slot_start_d).format());
                console.log('%%%% NORMALIZED SLOT :   end = ' + moment(slot_end_d).format());

                // 1) The dates are first normalized, so that the slots are
                //      only displayed within the given start and end dates.
                slot_start_d = moment(slot_start_d).isBefore($scope.gui.start_d) ?
                    $scope.gui.start_d : slot_start_d;
                slot_end_d = moment(slot_end_d).isAfter($scope.gui.end_d) ?
                    $scope.gui.end_d : slot_end_d;

                // 2) After normalizing the dates, we can calculate the position
                //      and widths of the displayable slots.
                var start_s = moment(slot_start_d).unix() - moment($scope.gui.start_d).unix(),
                    slot_l = ( (start_s / duration_s) * 100 ).toFixed(3),
                    slot_duration_s = ( moment(slot_end_d).unix() - moment(slot_start_d).unix() ),
                    slot_w = ( (slot_duration_s / duration_s) * 100).toFixed(3);

                // 3) The resulting slot is added to the results array
                r_slots.push({
                    raw_slot: slot,
                    slot: {
                        left: slot_l,
                        width: slot_w
                    }
                });

            }

            return r_slots;

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

            // 1> init days and hours for the axis
            $scope.initAxisTimes();

            // 2> all the Ground Stations are retrieved
            satnetRPC.rCall('gs.list', []).then(function (results) {

                angular.forEach(results, function (gs_id) {
                    
                    $scope.getGSSlots(gs_id).then(function (results) {

                        $log.info(
                            '>>> Slots for GS = ' + gs_id +
                            ', RAW slots = ' + JSON.stringify(results)
                        );

                        var filtered_s = $scope.filter_slots(
                            gs_id, results.slots
                        );

                        $log.info(
                            '>>> Slots for GS = ' + gs_id +
                            ', FILTERED slots = ' + JSON.stringify(filtered_s)
                        );

                        $scope.gui.slots[gs_id] = filtered_s;

                    });
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
                controller: 'snAvailabilityDlgCtrl',
                hasBackdrop: true
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
