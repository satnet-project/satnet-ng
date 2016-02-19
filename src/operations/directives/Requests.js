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
    'snCommonFilters', 'snApplicationBus',
    'snRequestsFilters', 'snControllers', 'snJRPCServices'
])
.controller('snRequestSlotCtrl', [
    '$scope', '$mdDialog', '$mdToast', 'satnetRPC', 'snDialog', 'snMessageBus',

    /**
     * Controller function for handling the SatNet requests dialog.
     *
     * @param {Object} $scope $scope for the controller
     */
    function ($scope, $mdDialog, $mdToast, satnetRPC, snDialog, snMessageBus) {

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
                $scope.slot.state = 'RESERVED';
                snMessageBus.send(
                    snMessageBus.CHANNELS.requests.id,
                    snMessageBus.EVENTS.accepted.id, {
                        gs_id: $scope.gui.groundstation_id,
                        sc_id: $scope.gui.spacecraft_id,
                        primary: $scope.gui.primary,
                        slot: $scope.gui.slot
                    }
                );
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
                $scope.slot.state = 'FREE';
                snMessageBus.send(
                    snMessageBus.CHANNELS.requests.id,
                    snMessageBus.EVENTS.denied.id, {
                        gs_id: $scope.gui.groundstation_id,
                        sc_id: $scope.gui.spacecraft_id,
                        primary: $scope.gui.primary,
                        slot: $scope.gui.slot
                    }
                );
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
                $scope.slot.state = 'FREE';
                snMessageBus.send(
                    snMessageBus.CHANNELS.requests.id,
                    snMessageBus.EVENTS.dropped.id, {
                        gs_id: $scope.gui.groundstation_id,
                        sc_id: $scope.gui.spacecraft_id,
                        primary: $scope.gui.primary,
                        slot: $scope.gui.slot
                    }
                );
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
    '$scope', '$log', '$mdDialog', 'satnetRPC','snDialog', 'snMessageBus',

    /**
     * Controller function for handling the SatNet requests dialog.
     *
     * @param {Object} $scope $scope for the controller
     */
    function ($scope, $log, $mdDialog, satnetRPC, snDialog, snMessageBus) {

        $scope.events =  {
            requests: {
                accepted: {
                    id: snMessageBus.createName(
                        snMessageBus.CHANNELS.requests.id,
                        snMessageBus.EVENTS.accepted.id
                    )
                },
                denied: {
                    id: snMessageBus.createName(
                        snMessageBus.CHANNELS.requests.id,
                        snMessageBus.EVENTS.denied.id
                    )
                },
                dropped: {
                    id: snMessageBus.createName(
                        snMessageBus.CHANNELS.requests.id,
                        snMessageBus.EVENTS.dropped.id
                    )
                }
            }
        };

        /**
         * This function finds the given slot within the dictionary/array of
         * slots within this controller.
         *
         * @param {String} segmentId Identifier of the segment
         * @param {String} slotId Identifier of the slot
         */
        $scope._findSlot = function (segmentId, slotId) {

            var slots = $scope.gui.slots[segmentId];
            if ((slots === undefined) || (slots.length === 0)) {
                throw 'No slots for ss = ' + segmentId;
            }

            for (var i = 0, L = slots.length; i < L; i++) {
                if (slots[i].identifier === slotId) {
                    return {
                        index: i,
                        slot: slots[i]
                    };
                }
            }
            throw 'Slot not found for ss = ' + segmentId;

        };

        /**
         * Updates the slots dictionary when the slot that triggered the event
         * was updated to the "FREE" state.
         *
         * @param {Object} data The data object attached to the event
         */
        $scope._updateFree = function (data) {

            var ss_id = (data.primary === 'spacecraft') ?
                    data.gs_id: data.sc_id,
                other_ss_id = (data.primary === 'spacecraft') ?
                    data.sc_id: data.gs_id,
                slot = $scope._findSlot(ss_id, data.slot.identifier),
                slot_other = $scope._findSlot(
                    other_ss_id, data.slot.identifier
                );

            $scope.gui.slots[ss_id].splice(slot.index, 1);
            $scope.gui.slots[other_ss_id].splice(slot_other.index, 1);

        };

        /**
         * Updates the slots dictionary when the slot that triggered the event
         * was not updated to the "FREE" state.
         *
         * @param {Object} data The data object attached to the event
         */
        $scope._updateNonFree = function (data) {
            var ss_id = (data.primary === 'spacecraft') ?
                    data.gs_id: data.sc_id,
                slot = $scope._findSlot(ss_id, data.slot.identifier);
            slot.slot.state = data.slot.state;
        };

        /**
         * CALLBACK
         * This function is the callback that handles the event triggered
         * whenever a request slot has been accepted, canceled or denied.
         *
         * @param {String} event The name of the event
         * @param {Object} data The data object generated by the event
         */
        $scope._updateRequestCb = function (event, data) {
            try {
                if (data.slot.state === 'FREE') { $scope._updateFree(data); }
                else { $scope._updateNonFree(data); }
            } catch (e) { $log.info(e); }
        };

        $scope.$on(
            $scope.events.requests.accepted.id, $scope._updateRequestCb
        );
        $scope.$on(
            $scope.events.requests.denied.id, $scope._updateRequestCb
        );
        $scope.$on(
            $scope.events.requests.dropped.id, $scope._updateRequestCb
        );

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
         * This function is used to check whether the given slot has to be
         * discarded from amongst the other slots or not.
         *
         * @param {Object} slot The slot to be checked
         * @param {Boolean} 'true' if the slot has to be discarded
         */
        $scope._filterByState = function(slot) {
            return (slot.state !== 'SELECTED') && (slot.state !== 'RESERVED');
        };

        /**
         * This function processes the slots received from the server in order
         * to adapt them to a more JavaScript "friendly" data structure. It
         * stores the results directly in the controller's data section.
         *
         * @param {String} segmentId Identifier of the segment
         * @param {Object} results Object with the results from the server
         */
        $scope._processSlots = function (segmentId, results) {

            $scope.gui.slots[segmentId] = [];

            if ((results === null) || (angular.equals({}, results))) {
                return;
            }

            var ss_id = Object.keys(results)[0],
                slots = results[ss_id];

            for (var i = 0, L = slots.length; i < L; i++) {
                if ($scope._filterByState(slots[i])) {continue;}
                slots[i].segment_id = ss_id;
                $scope.gui.slots[segmentId].push(slots[i]);
            }

        };

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
                $scope._processSlots(segmentId, results);
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
            satnetRPC.rCall('sc.list.mine', []).then(function (results) {
                $scope.gui.scs = results;
                for (var i = 0, l = $scope.gui.scs.length; i < l; i++ ) {
                    $scope._pullSlots('sc', $scope.gui.scs[i]);
                }
            }).catch(function (cause) {
                snDialog.exception('sc.list.mine', '-', cause);
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
