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
.constant('SN_SCH_TIMELINE_DAYS', '2')
.constant('SN_SCH_DATE_FORMAT', 'DD-MM')
.controller('snAvailabilityDlgCtrl', [
    '$scope', '$log', '$mdDialog',
    'satnetRPC', 'snDialog',
    'SN_SCH_TIMELINE_DAYS', 'SN_SCH_DATE_FORMAT',

    /**
     * Controller function for handling the SatNet availability dialog.
     *
     * @param {Object} $scope $scope for the controller
     */
    function (
        $scope, $log, $mdDialog, satnetRPC, snDialog,
         SN_SCH_TIMELINE_DAYS, SN_SCH_DATE_FORMAT
    ) {

        $scope.gui = {
            days: [],
            slots: {}
        };

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
            $scope.gui.slots[groundstation_id] = angular.copy(slots);
        };

        /**
         * Function that initializes the dictionary with the days and hours for
         * the axis of the timeline. It simply contains as many days as
         * specified in the variable "SN_SCH_TIMELINE_DAYS".
         */
        $scope.initAxisTimes = function () {

            var day = moment().hours(0).minutes(0).seconds(0),
                last_day = moment(day).add(SN_SCH_TIMELINE_DAYS, 'days');

            while (day.isBefore(last_day)) {
                $scope.gui.days[$scope.gui.days.length] = moment(day).format(SN_SCH_DATE_FORMAT);
                $scope.gui.days[$scope.gui.days.length] = '12:00';
                day = moment(day).add(1, 'days');
            }

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
