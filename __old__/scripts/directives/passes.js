/*
   Copyright 2014 Ricardo Tubio-Pardavila

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

angular.module('passDirective', [
    'broadcaster', 'satnet-services', 'ui-leop-modalufo-controllers'
])
    .service('passSlotsService', [
        '$rootScope', 'satnetRPC', 'oArrays',
        function ($rootScope, satnetRPC, oArrays) {
            'use strict';

            this._generateRowName = function (slot) {
                return slot.gs_identifier + ' / ' + slot.sc_identifier;
            };

            /**
             * Transforms a localize date in the ISO format into a UTC date
             * object.
             * @param isostring ISO formatted string
             * @returns {Date} UTC Date object
             */
            this.isostring_2_utc = function (isostring) {
                return new Date(isostring);
                /*
                return new Date(
                    isodate.getUTCFullYear(),
                    isodate.getUTCMonth(),
                    isodate.getUTCDate(),
                    isodate.getUTCHours(),
                    isodate.getUTCMinutes(),
                    isodate.getUTCSeconds()
                );
                */
            };

            /**
             * Creates a Gantt-like slot object from the slot read from the
             * server.
             * @param slot Slot as read from the server.
             * @returns {{
             *      name: (cfg.groundstation_id|*),
             *      tasks: {name: (cfg.spacecraft_id|*), start: *, end: *}[]
             *  }}
             * @private
             */
            this._createSlot = function (slot) {

                var date_from_utc = this.isostring_2_utc(slot.slot_start),
                    date_to_utc = this.isostring_2_utc(slot.slot_end);

                return {
                    name: this._generateRowName(slot),
                    classes: 'my-gantt-row',
                    tasks: [{
                        name: slot.sc_identifier,
                        classes: 'my-gantt-cell',
                        from: date_from_utc,
                        to: date_to_utc
                    }]
                };

            };

            /**
             * This function transforms the plain raw format of the server into
             * the one needed by the Gantt chart used within this directive.
             * @param pass_slots Raw passes from the server.
             * @private
             */
            this._parseSlots = function (pass_slots) {

                if (!pass_slots) { throw "<pass_slots> is null"; }

                var gantt_slots = [], g_slot, new_slot, self = this;

                angular.forEach(pass_slots, function (slot) {

                    new_slot = self._createSlot(slot);

                    try {
                        g_slot = oArrays.getObject(
                            gantt_slots,
                            'name',
                            self._generateRowName(slot)
                        ).object;
                        g_slot.tasks.push(new_slot.tasks[0]);
                    } catch (err) {
                        gantt_slots.push(new_slot);
                    }

                });

                return gantt_slots;

            };

            /**
             * Retrieves the slots from the server and transforms them into the
             * format required for the Gantt chart component.
             * @returns {ng.IPromise<>|*}
             */
            this.getPasses = function () {
                var self = this;
                return satnetRPC.rCall('leop.passes', [$rootScope.leop_id])
                    .then(function (passes) {
                        return self._parseSlots(passes);
                    });
            };

        }
    ])
    .controller('passSlotsCtrl', [
        '$rootScope', '$scope', 'passSlotsService', 'broadcaster',
        function ($rootScope, $scope, passSlotsService, broadcaster) {
            'use strict';

            $scope.data = [];

            $scope._initData = function () {
                $scope.data = [];
                passSlotsService.getPasses().then(function (g_slots) {
                    console.log('>>> passes = ' + JSON.stringify(g_slots));
                    angular.extend($scope.data, g_slots);
                });
            };

            $scope._initListeners = function () {
                $rootScope.$on(
                    broadcaster.PASSES_UPDATED,
                    function (event, id) {
                        console.log(
                            '@passes-updated-event, event = ' +
                                event + ', id = ' + id
                        );
                        $scope._initData();
                    }
                );
                $rootScope.$on(
                    broadcaster.LEOP_GS_UPDATED_EVENT,
                    function (event, id) {
                        console.log(
                            '@gs-updated-event, event = ' +
                                event + ', id = ' + id
                        );
                        $scope._initData();
                    }
                );
                $rootScope.$on(
                    broadcaster.LEOP_GS_ASSIGNED_EVENT,
                    function (event, id) {
                        console.log(
                            '@gs-assigned-event, event = ' +
                                event + ', id = ' + id
                        );
                        $scope._initData();
                    }
                );
                $rootScope.$on(
                    broadcaster.LEOP_GS_RELEASED_EVENT,
                    function (event, id) {
                        console.log(
                            '@gs-released-event, event = ' +
                                event + ', id = ' + id
                        );
                        $scope._initData();
                    }
                );
            };

            $scope.init = function () {
                $scope._initData();
                $scope._initListeners();
            };

            $scope.init();

        }
    ])
    .directive('passes', function () {
        'use strict';

        return {
            restrict: 'E',
            templateUrl: 'templates/passes/passes.html'
        };

    });