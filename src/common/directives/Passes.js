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

angular.module('snPassesDirective', [
    'ngMaterial', 'snControllers', 'snJRPCServices', 'snTimelineServices'
])
.controller('snPassesSchCtrl', [
    '$scope', '$log',
    'RPC_GS_PREFIX', 'RPC_SC_PREFIX',
    'satnetRPC', 'snDialog', 'timeline',

    /**
     * Controller function for handling the SatNet availability scheduler.
     *
     * @param {Object} $scope $scope for the controller
     */
    function (
        $scope, $log,
        RPC_GS_PREFIX, RPC_SC_PREFIX,
        satnetRPC, snDialog, timeline
    ) {

        /** Object with the configuration for the GUI */
        $scope.gui = null;

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
            ).catch(function (c) {
                snDialog.exception('gs.availability', groundstation_id, c);
            });
        };

        /**
         * Function that refreshes the list of registered ground stations.
         */
        $scope.refresh = function () {
            var rpc_service = $scope.gui.rpcPrefix + '.getPasses';
            satnetRPC.rCall(
                rpc_service, [$scope.segmentId, []]
            ).then(function (results) {
                angular.forEach(results, function (value, key) {
                    $scope.gui.slots[key] = timeline.filterSlots(
                        $scope.gui, key, value
                    );
                });
                console.log('>>> slots = ' + JSON.stringify(
                    $scope.gui.slots, null, "    "
                ));
            }).catch(function (c) { snDialog.exception(rpc_service, [], c); });
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

            // 2> copy to the "gui" object the attributes of the element
            $scope.gui.segmentId = $scope.segmentId;
            $scope.gui.isSpacecraft = ( $scope.isSpacecraft === "true" );
            $scope.gui.rpcPrefix = ( $scope.gui.isSpacecraft === true ) ?
                RPC_SC_PREFIX : RPC_GS_PREFIX;

            // 3> slots retrieved for this spacecraft and all the gss
            $scope.refresh();

        };

        $scope.init();

    }
])
.directive('snPassesScheduler',

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
            templateUrl: 'common/templates/passes/scheduler.html',
            controller: 'snPassesSchCtrl',
            scope: {
                segmentId: '@',
                isSpacecraft: '@',
            }
        };
    }

)
.controller('snPassesDlgCtrl', [
    '$scope', '$mdDialog', 'segmentId', 'isSpacecraft',

    /**
     * Controller function for handling the SatNet availability dialog.
     *
     * @param {Object} $scope $scope for the controller
     */
    function ($scope, $mdDialog, segmentId, isSpacecraft) {

        $scope.uiCtrl = {
            detachable: false,
            segmentId: segmentId,
            isSpacecraft: isSpacecraft
        };

        /**
         * Function that closes the dialog.
         */
        $scope.close = function () { $mdDialog.hide(); };

        console.log('>>> segmentId = ' + segmentId);
        console.log('>>> isSpacecraft = ' + isSpacecraft);

    }

])
.controller('snPassesCtrl', [
    '$scope', '$mdDialog',

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
                templateUrl: 'common/templates/passes/dialog.html',
                controller: 'snPassesDlgCtrl',
                locals: {
                    segmentId: $scope.segmentId,
                    isSpacecraft: $scope.isSpacecraft
                }
            });
        };

    }

])
.directive('snPasses',

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
            scope: {
                segmentId: '@',
                isSpacecraft: '@',
            },
            templateUrl: 'common/templates/passes/menu.html'
        };
    }

);
