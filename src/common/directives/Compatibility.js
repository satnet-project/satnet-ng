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

angular.module('snCompatibilityDirective', [
    'ngMaterial',
    'snControllers',
    'snJRPCServices'
])
.controller('snCompatibilityCtrl', ['$scope', '$mdDialog',

    /**
     * Controller function for opening the SatNet compatibility dialog.
     *
     * @param {Object} $scope    $scope for the controller.
     * @param {Object} $mdDialog Angular material Dialog service.
     */
    function ($scope, $mdDialog) {

        /**
         * Function that opens the dialog when the snAbout button is
         * clicked.
         */
        $scope.openDialog = function () {
            $mdDialog.show({
                templateUrl: 'common/templates/sn-compatibility-dialog.html'
            });
        };

    }

])
.controller('snCompatibilityDlgCtrl', [
    '$scope', '$mdDialog', 'satnetRPC', 'snDialog',

    /**
     * Controller function for the SatNet compatibility dialog.
     *
     * @param {Object} $scope    $scope for the controller.
     */
    function ($scope, $mdDialog, satnetRPC, snDialog) {

        /**
         * Function that handles the close of the Compatibility dialog.
         */
        $scope.closeDialog = function () {
            $mdDialog.hide();
        };

        /**
         * Loads the compatibility information for the channels of the
         * spacecraft segments registered with this user.
         */
        $scope.loadCompatibility = function () {
            var sc_c = {}, cfield = 'Compatibility';

            satnetRPC.rCall('sc.list', []).then(
                function (results) {
                    angular.forEach(results, function (sc) {
                        $scope.compatibility = [];
                        satnetRPC.rCall('sc.compatibility', [sc]).then(
                            function (results) {
                                console.log('>>> results = ' + JSON.stringify(results[0], null, '  '));
                                console.log('>>> results.c = ' + JSON.stringify(results[0][cfield], null, '  '));
                                sc_c = angular.copy(results.Compatibility);
                                console.log('>>> compat for sc <' + sc + '> = ' + JSON.stringify(sc_c, null, '  '));
                                $scope.compatibility.push(sc_c);
                            },
                            function (cause) {
                                snDialog.exception(
                                    'sc.compatibility', '-', cause
                                );
                            }
                        );
                    });
                    console.log('>>> compat = ' + JSON.stringify(results, null, '  '));
                },
                function (cause) {
                    snDialog.exception('sc.list', '-', cause);
                }
            );
        };

        /**
         * Initialization of the controller.
         */
        $scope.init = function () {
            $scope.loadCompatibility();
        };

    }

])
.directive('snCompatibility', [

    /**
     * Directive that creates a dialog with the compatibility configuration.
     * 
     * @returns {Object} Object directive required by Angular, with restrict
     *                   and templateUrl.
     */
    function () {
        return {
            restrict: 'E',
            templateUrl: 'common/templates/sn-compatibility.html'
        };
    }

]);