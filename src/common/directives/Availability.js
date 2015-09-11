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
    'snJRPCServices'
])
    .controller('snAvailabilityDlgCtrl', [
    '$scope', '$log', '$mdDialog',
    'satnetRPC', 'snDialog',

    /**
     * Controller function for handling the SatNet availability dialog.
     *
     * @param {Object} $scope $scope for the controller
     */
    function ($scope, $log, $mdDialog, satnetRPC, snDialog) {

            $scope.gss = [];
            $scope.slots = {};
            $scope.hours = [
                '0000', '0100', '0200', '0300', '0400', '0500',
                '0600', '0700', '0800', '0900', '1000', '1100',
                '1200', '1300', '1400', '1500', '1600', '1700',
                '1800', '1900', '2000', '2100', '2200', '2300'
            ];

            /**
             * Function that closes the dialog.
             */
            $scope.close = function () {
                $mdDialog.hide();
            };

            /**
             * Helps adding all the information structures related to a given
             * ground station correctly into the $scope. It post-processes them and
             * creates the associated structures that are easier to convert into
             * an HTML-like component.
             * 
             * @param {String} groundstation_id Ground Station identifier
             * @param {Object} slots            Array with the operational slots
             */
            $scope._addGS = function (groundstation_id, slots) {
                $scope.gss.push(groundstation_id);
                $scope.slots[groundstation_id] = angular.copy(slots);
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
                satnetRPC.rCall('gs.list', []).then(function (results) {
                    angular.forEach(results, function (gs) {
                        $log.debug('>>> loading slots for <' + gs + '>');
                        satnetRPC.rCall(
                            'gs.availability', [gs]
                        ).then(function (results) {
                                $scope._addGS(gs, results);
                            })
                            .catch(function (cause) {
                                snDialog.exception(
                                    'gs.availability', gs, cause
                                );
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
                    controller: 'snAvailabilityDlgCtrl'
                });
            };

    }

])
    .directive('snAvailability',

        /**
         * Function that creates the directive itself returning the object
         * required by Angular.
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