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

angular.module('snRequestsDirective', [
    'ngMaterial',
    'snCommonFilters', 'snRequestsFilters', 'snControllers', 'snJRPCServices'
])
.controller('snRequestSlotCtrl', [
    '$scope', '$mdDialog', 'satnetRPC','snDialog',

    /**
     * Controller function for handling the SatNet requests dialog.
     *
     * @param {Object} $scope $scope for the controller
     */
    function (
        $scope, $mdDialog, satnetRPC, snDialog
    ) {

        $scope.gui = {
            groundstation_id: '',
            spacecraft_id: '',
            state: '',
            slot: {}
        };

        /**
         * Function that handles the process of accepting a given request that
         * has already been selected.
         */
        $scope.accept = function () {

        };

        /**
         * Function that handles the process of denying a given request that
         * has already been selected.
         */
        $scope.deny = function () {

        };

        /**
         * Function that handles the process of droping a given request that
         * has already been booked.
         */
        $scope.drop = function () {

        };

        /**
         * Initialization of the controller.
         */
        $scope.init = function () {

            $scope.gui.groundstation_id = $scope.gs;
            $scope.gui.spacecraft_id = $scope.sc;
            $scope.gui.state = $scope.state;
            $scope.gui.slot = $scope.slot;

            console.log('>>> slot.gui = ' + JSON.stringify(
                $scope.gui, null, 4
            ));
        };

        $scope.init();

    }

])
.directive('snRequestSlot',

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
            templateUrl: 'operations/templates/requests/slot.html',
            controller: 'snRequestSlotCtrl',
            scope: {
                sc: '@',
                gs: '@',
                state: '@',
                slot: '='
            }
        };
    }

)
.controller('snScRequestsCtrl', ['$scope',

    /**
     * Controller function for handling the SatNet requests dialog.
     *
     * @param {Object} $scope $scope for the controller
     */
    function ($scope) {

        $scope.gui = {
            groundstation_id: '',
            spacecraft_id: '',
            state: '',
            slots: [],
            filtered: []
        };

        /**
         * Function that filters the slots by state, holding only those who
         * match the required state. The result is hold at the
         * $scope.gui.filtered internal variable.
         *
         * @param {Array} slots Array with the slots to be filtered
         */
        $scope._filterSlots = function(slots) {
            angular.forEach(slots, function(s) {
                if (s.state === $scope.gui.state) {
                    $scope.gui.filtered.push(s);
                }
            });
        };

        /**
         * Initialization of the controller.
         */
        $scope.init = function () {

            $scope.gui.groundstation_id = $scope.gs;
            $scope.gui.spacecraft_id = $scope.sc;
            $scope.gui.state = $scope.state;
            $scope.gui.slots = $scope.slots;

            $scope._filterSlots($scope.slots);

        };

        $scope.init();

    }

])
.directive('snScRequests',

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
            templateUrl: 'operations/templates/requests/spacecraft.html',
            controller: 'snScRequestsCtrl',
            scope: {
                sc: '@',
                gs: '@',
                state: '@',
                slots: '='
            }
        };
    }

)
.controller('snGsRequestsCtrl', [
    '$scope', '$mdDialog', 'satnetRPC','snDialog',

    /**
     * Controller function for handling the SatNet requests dialog.
     *
     * @param {Object} $scope $scope for the controller
     */
    function (
        $scope, $mdDialog, satnetRPC, snDialog
    ) {

        $scope.gui = {
            groundstation_id: '',
            requests: {}
        };

        /**
         * Initialization of the controller.
         */
        $scope.init = function () {

            $scope.gui.groundstation_id = $scope.gs;

            satnetRPC.rCall(
                'gs.operational', [$scope.gui.groundstation_id]
            ).then(function (results) {
                $scope.gui.requests = results;
                console.log('>>> @gs: gui = ' + JSON.stringify($scope.gui));
            }).catch(function (c) {
                snDialog.exception(
                    'gs.operational', $scope.gui.groundstation_id, c
                );
            });

        };

        $scope.init();

    }

])
.directive('snGsRequests',

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
            templateUrl: 'operations/templates/requests/groundstation.html',
            controller: 'snGsRequestsCtrl',
            scope: {
                gs: '@'
            }
        };
    }

)
.controller('snRequestsDlgCtrl', [
    '$scope', '$mdDialog', 'satnetRPC','snDialog',

    /**
     * Controller function for handling the SatNet requests dialog.
     *
     * @param {Object} $scope $scope for the controller
     */
    function ($scope, $mdDialog, satnetRPC, snDialog) {

        $scope.gui = {
            groundstations: [],
            tab: 0
        };

        /**
         * Function that closes the dialog.
         */
        $scope.close = function () { $mdDialog.hide(); };

        /**
         * Initialization of the controller.
         */
        $scope.init = function () {
            satnetRPC.rCall('gs.list', []).then(function (results) {
                $scope.gui.groundstations = results.slice(0);
            }).catch(function (cause) {
                snDialog.exception('gs.list', '-', cause);
            });
        };

        $scope.init();

    }

])
.controller('snRequestsCtrl', [
    '$scope', '$mdDialog',

    /**
     * Controller function for opening the SatNet requests dialog.
     *
     * @param {Object} $scope    $scope for the controller
     * @param {Object} $mdDialog Angular material Dialog service
     */
    function ($scope, $mdDialog) {

        /**
         * Function that opens the dialog when the snRequests button is
         * clicked.
         */
        $scope.openDialog = function () {
            $mdDialog.show({
                templateUrl: 'operations/templates/requests/list.html',
                controller: 'snRequestsDlgCtrl'
            });
        };

    }

])
.directive('snRequests',

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
            templateUrl: 'operations/templates/requests/menu.html',
            controller: 'snRequestsCtrl'
        };
    }

);
