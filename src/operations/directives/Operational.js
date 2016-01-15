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

angular.module('snOperationalDirective', [
    'ngMaterial',
    'snControllers', 'snJRPCServices', 'snTimelineServices', 'snSlotFilters'
])
.controller('snGlobalSchCtrl', [
    '$scope', '$log', 'satnetRPC', 'snDialog',

    /**
     * Controller function for handling the usage of the Global scheduler.
     *
     * @param {Object} $scope $scope for the controller
     */
    function ($scope, $log, satnetRPC, snDialog) {

        /** Object with the configuration for the GUI */
        $scope.gui = {
            gss: []
        };

        /**
         * Function that initializes the 
         */
        $scope.init = function () {

            satnetRPC.rCall('gs.list', []).then(function (results) {
                $scope.gui.gss = results;
            }).catch(function (c) {
                snDialog.exception('gs.list', '', c);
            });

        };

        $scope.init();

    }

])
.directive('snGlobalScheduler',

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
            controller: 'snGlobalSchCtrl',
            templateUrl: 'operations/templates/operational/global.html'
        };
    }

)
.controller('snBookingDlgCtrl', [
    '$scope', '$log', '$mdDialog', 'satnetRPC', 'snDialog',
    'groundstationId', 'spacecraftId', 'slot',

    /**
     * Controller function for handling the usage of the Global scheduler.
     *
     * @param {Object} $scope $scope for the controller
     */
    function (
        $scope, $log, $mdDialog, satnetRPC, snDialog,
        groundstationId, spacecraftId, slot
    ) {

        /** Object with the configuration for the GUI */
        $scope.gui = {
            gs: null,
            sc: null,
            slot: null
        };

        /**
         * Function that closes the dialog.
         */
        $scope.close = function () { $mdDialog.hide(); };

        /**
         * Function that initializes the 
         */
        $scope.init = function () {
            $scope.gui.slot = slot;
            satnetRPC.rCall('gs.get', [groundstationId]).then(function (results) {
                $scope.gui.gs = results;
            }).catch(function (c) {
                snDialog.exception('gs.get', '', c);
            });
            satnetRPC.rCall('sc.get', [spacecraftId]).then(function (results) {
                $scope.gui.sc = results;
            }).catch(function (c) {
                snDialog.exception('sc.get', '', c);
            });
            satnetRPC.rCall(
                'ss.compatibility', [spacecraftId, groundstationId]
            ).then(function (results) {
                $scope.gui.compatibility = results;
            }).catch(function (c) {
                snDialog.exception('ss.compatibility', '', c);
            });
        };

        $scope.init();

    }

])
.controller('snOperationalSchCtrl', [
    '$scope', '$log', '$mdDialog', 'satnetRPC', 'snDialog', 'timeline',

    /**
     * Controller function for handling the SatNet availability scheduler.
     *
     * @param {Object} $scope $scope for the controller
     */
    function ($scope, $log, $mdDialog, satnetRPC, snDialog, timeline) {

        /** Object with the configuration for the GUI */
        $scope.gui = null;

        /**
         * This function launches a dialog window that allows operators to
         * book the selected slot.
         * 
         * @param {String} groundstationId Identifier of the Ground Station
         * @param {String} spacecraftId Identifier of the Spacecraft
         * param {Object} slot The slot to be booked
         */
        $scope.book = function (groundstationId, spacecraftId, slot) {
            $mdDialog.show({
                templateUrl: 'operations/templates/operational/booking.html',
                controller: 'snBookingDlgCtrl',
                locals: {
                    groundstationId: groundstationId,
                    spacecraftId: spacecraftId,
                    slot: slot
                }
            });
        };

        /**
         * Promise function that should be used to retrieve the availability
         * slots for each of the Ground Stations.
         * 
         * @param {String} groundstation_id Ground Station identifier
         */
        $scope.getGSSlots = function (groundstation_id) {
            return satnetRPC.rCall('gs.operational', [groundstation_id]).then(
                function (results) {
                    return {
                        groundstation_id: groundstation_id,
                        slots: results
                    };
                }
            ).catch(function (c) {
                snDialog.exception('gs.operational', groundstation_id, c);
            });
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
            $scope.gui = timeline.initScope();

            // 2> the slots for the given GS are retrieved
            $scope.getGSSlots($scope.segmentId).then(function (results) {
                angular.forEach(results.slots, function (slots, sc_id) {
                    $scope.gui.slots[sc_id] = timeline.filterSlots(
                        $scope.gui, sc_id, slots
                    );
                });
            });

        };

        $scope.init();

    }
])
.directive('snOperationalScheduler',

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
            scope: {
                segmentId: '@'
            },
            controller: 'snOperationalSchCtrl',
            templateUrl: 'operations/templates/operational/scheduler.html'
        };
    }

)
.controller('snOperationalDlgCtrl', [
    '$scope', '$mdDialog',

    /**
     * Controller function for handling the SatNet operational dialog.
     *
     * @param {Object} $scope $scope for the controller
     */
    function ($scope, $mdDialog) {

        $scope.uiCtrl = {
            detachable: false,
        };

        /**
         * Function that closes the dialog.
         */
        $scope.close = function () { $mdDialog.hide(); };

    }

])
.controller('snOperationalCtrl', [
    '$scope', '$mdDialog',

    /**
     * Controller function for opening the SatNet operational dialog.
     *
     * @param {Object} $scope    $scope for the controller
     * @param {Object} $mdDialog Angular material Dialog service
     */
    function ($scope, $mdDialog) {

        /**
         * Function that opens the dialog when the snOperational button is
         * clicked.
         */
        $scope.openDialog = function () {
            $mdDialog.show({
                templateUrl: 'operations/templates/operational/dialog.html',
                controller: 'snOperationalDlgCtrl'
            });
        };

    }

])
.directive('snOperational',

    /**
     * Function that creates the directive itself returning the object required
     * by Angular.
     *
     * @returns {Object} Object directive required by Angular, with restrict
     *                   and templateUrl
     */
    function () {
        return {
            restrict: 'E',
            templateUrl: 'operations/templates/operational/menu.html'
        };
    }

);
