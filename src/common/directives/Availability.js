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

        /** Identifier of the container wihere the timeline is to be drawn */
        $scope.container_id = 'a-slots-timeline';

        /**
         * Function that draws the timeline where the available slots are
         * displayed.
         */
        $scope.drawTimeline = function () {

            var container = document.getElementById($scope.container_id);
            var chart = new google.visualization.Timeline(container);
            var dataTable = new google.visualization.DataTable();

            dataTable.addColumn({ type: 'string', id: 'Ground Station' });
            dataTable.addColumn({ type: 'string', id: 'Spacecraft' });
            dataTable.addColumn({ type: 'string', id: 'SlotId' });
            dataTable.addColumn({ type: 'date', id: 'Start' });
            dataTable.addColumn({ type: 'date', id: 'End' });

            /**/
            dataTable.addRows([
                [
                    'Magnolia Room',
                    'Beginning JavaScript',
                    new Date(0,0,0,12,0,0),
                    new Date(0,0,0,13,30,0)
                ],
                [
                    'Magnolia Room',
                    'Intermediate JavaScript',
                    new Date(0,0,0,14,0,0),
                    new Date(0,0,0,15,30,0)
                ]
            ]);
            /**/

            var options = {
                timeline: { colorByRowLabel: true }
            };

            chart.draw(dataTable, options);

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

            // 1> all the Ground Stations are retrieved
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

            // 2> the draw callback is set up for when the page is ready
            $(document).ready(function () {
                google.load('visualization', '1.0', {
                    'packages': ['timeline'],
                    'callback': $scope.drawTimeline
                });
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
