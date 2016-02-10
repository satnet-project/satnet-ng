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
    'snCommonFilters',
    'snRequestsFilters', 'snControllers', 'snJRPCServices'
])
.controller('snRequestSlotCtrl', [
    '$scope', '$mdDialog', '$mdToast',
    'satnetRPC', 'snDialog',

    /**
     * Controller function for handling the SatNet requests dialog.
     *
     * @param {Object} $scope $scope for the controller
     */
    function (
        $scope, $mdDialog, $mdToast, satnetRPC, snDialog
    ) {

        $scope.gui = {
            groundstation_id: '',
            spacecraft_id: '',
            primary: '',
            hide: {
                accept: true,
                drop: true,
                deny: true,
            },
            slot: {}
        };

        /**
         * Function that handles the process of accepting a given request that
         * has already been selected.
         */
        $scope.accept = function () {
            satnetRPC.rCall(
                'gs.operational.accept', [
                    $scope.groundstation_id, [$scope.slot.identifier]
                ]
            ).then(function (results) {
                snDialog.toastAction('Confirmed slot #',$scope.slot.identifier);
            }).catch(function (c) {
                snDialog.exception('gs.operational.accept', '', c);
            });
        };

        /**
         * Function that handles the process of denying a given request that
         * has already been selected.
         *
         * TODO :: Temporary, it has been linked to the drop function so that
         *          the slot does not stay forever with the DENIED state.
         */
        $scope.deny = function () {
            satnetRPC.rCall(
                'gs.operational.drop', [
                    $scope.groundstation_id, [$scope.slot.identifier]
                ]
            ).then(function (results) {
                snDialog.toastAction('Denied slot #', $scope.slot.identifier);
            }).catch(function (c) {
                snDialog.exception('gs.operational.drop', '', c);
            });
        };

        /**
         * Function that handles the process of droping a given request that
         * has already been booked.
         *
         * IMPORTANT: This function works both for spacecraft and for
         *              groundstation slots; therefore, there is an inherent
         *              level of complexity added in addition in order to
         *              handle both cases.
         */
        $scope.drop = function () {

            var rpc = ($scope.gui.primary === 'groundstation') ?
                        'gs.operational.drop' : 'sc.cancel',
                segment_id = ($scope.gui.primary === 'groundstation') ?
                        $scope.groundstation_id : $scope.spacecraft_id;

            satnetRPC.rCall(
                rpc, [segment_id, [$scope.slot.identifier]]
            ).then(function (results) {
                snDialog.toastAction('Dropped slot #', $scope.slot.identifier);
            }).catch(function (c) {
                snDialog.exception(rpc, '', c);
            });

        };

        /**
         * Function that returns whether o not the "accept" button should be
         * displayed, taking into account the state of the controller.
         */
        $scope.showAccept = function () {
            return ($scope.gui.slot.state === 'SELECTED') &&
                !($scope.gui.hide.accept);
        };

        /**
         * Function that returns whether o not the "deny" button should be
         * displayed, taking into account the state of the controller.
         */
        $scope.showDeny = function () {
            return ($scope.gui.slot.state === 'SELECTED') &&
                !($scope.gui.hide.deny);
        };

        /**
         * Function that returns whether o not the "drop" button should be
         * displayed, taking into account the state of the controller.
         */
        $scope.showDrop = function () {
            if ($scope.gui.primary === 'spacecraft') {
                return !($scope.gui.hide.drop) && (
                        ($scope.gui.slot.state === 'SELECTED') ||
                        ($scope.gui.slot.state === 'RESERVED')
                    );
            } else {
                return !($scope.gui.hide.drop) && (
                        ($scope.gui.slot.state === 'RESERVED')
                    );
            }
        };

        /**
         * Initialization of the controller.
         */
        $scope.init = function () {

            $scope.gui.groundstation_id = $scope.gs;
            $scope.gui.spacecraft_id = $scope.sc;
            $scope.gui.primary = $scope.primary;
            $scope.gui.slot = $scope.slot;

            if ( $scope.gui.primary === 'spacecraft' ) {
                $scope.gui.hide.drop = false;
            } else {
                $scope.gui.hide.accept = false;
                $scope.gui.hide.deny = false;
                $scope.gui.hide.drop = false;
            }

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
                primary: '@',
                slot: '='
            }
        };
    }

)
.controller('snRequestsDlgCtrl', [
    '$scope', '$filter', '$mdDialog', 'satnetRPC','snDialog',

    /**
     * Controller function for handling the SatNet requests dialog.
     *
     * @param {Object} $scope $scope for the controller
     */
    function ($scope, $filter, $mdDialog, satnetRPC, snDialog) {

        $scope.gui = {
            gss: [],
            scs: [],
            slots: {},
            filtered: {}
        };

        /**
         * Function that closes the dialog.
         */
        $scope.close = function () { $mdDialog.hide(); };

        /**
         * This function retrieves the operational slots from the server for a
         * given segment and stores them internally in a single list for the
         * controller.
         * IMPORTANT: It processes the list so that it adds the reference to
         * the other segment related in the slot by place its id inside the
         * object of the slot rather than as a key to access the slot.
         * IMPORTANT 2: It filters out all the slots whose states are neither
         *              'SELECTED' nor 'BOOKED'.
         *
         * @param segmentType String that indicates whether the reference
         *                      segment is a ground station ('sc') or a
         *                      spacecraft ('sc')
         * @param segmentId String Identifier of the segment
         */
        $scope._pullSlots = function (segmentType, segmentId) {
            var rpc_name = segmentType + '.operational';

            satnetRPC.rCall(rpc_name, [segmentId]).then(function (results) {

                $scope.gui.slots[segmentId] = [];

                if ((results === null) || (angular.equals({}, results))) {
                    return;
                }

                var ss_id = Object.keys(results)[0],
                    slots = results[ss_id];

                for (var i = 0, L = slots.length; i < L; i++) {

                    if (
                        (slots[i].state !== 'SELECTED') &&
                        (slots[i].state !== 'RESERVED')
                    ) {
                        continue;
                    }

                    slots[i].segment_id = ss_id;
                    $scope.gui.slots[segmentId].push(slots[i]);

                }

            }).catch(function (cause) {
                snDialog.exception(segmentType + '.operational', '-', cause);
            });

        };

        /**
         * Retrieves the slots for all the ground stations owned by the
         * currently logged-in user.
         * @returns
         */
        $scope._pullGsSlots = function () {
            satnetRPC.rCall('gs.list.mine', []).then(function (results) {
                $scope.gui.gss = results;
                for (var i = 0, l = $scope.gui.gss.length;i < l; i++) {
                    $scope._pullSlots('gs', $scope.gui.gss[i]);
                }
            }).catch(function (cause) {
                snDialog.exception('gs.list.mine', '-', cause);
            });
        };

        /**
         * Retrieves the slots for all the spacecraft owned by the
         * currently logged-in user.
         * @returns
         */
        $scope._pullScSlots = function () {
            satnetRPC.rCall('sc.list', []).then(function (results) {
                $scope.gui.scs = results;
                for (var i = 0, l = $scope.gui.scs.length; i < l; i++ ) {
                    $scope._pullSlots('sc', $scope.gui.scs[i]);
                }
            }).catch(function (cause) {
                snDialog.exception('sc.list', '-', cause);
            });
        };

        /**
         * Initialization of the controller.
         */
        $scope.init = function () {
            $scope._pullGsSlots();
            $scope._pullScSlots();
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
