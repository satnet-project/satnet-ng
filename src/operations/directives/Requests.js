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
    'ngMaterial', 'snControllers', 'snJRPCServices'
])
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
            requests: {}
        };

        /**
         * Function that closes the dialog.
         */
        $scope.close = function () { $mdDialog.hide(); };

        $scope.init = function () {
            satnetRPC.rCall('gs.list', []).then(function (results) {
                if (results !== null) {
                    $scope.gui.groundstations = results.slice(0);

                    console.log(
                        '>>> @request: gs.list = ' + JSON.stringify($scope.gui)
                    );

                    angular.forEach($scope.gui.groundstations, function(g) {
                        satnetRPC.rCall(
                            'gs.operational', [g]
                        ).then(function (results) {
                            $scope.gui.requests[g] = results;
                            console.log(
                                '>>> @request: gui = ' + JSON.stringify(
                                    $scope.gui
                                )
                            );
                        }).catch(function (c) {
                            snDialog.exception('gs.operational', g, c);
                        });

                    });
                }
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
