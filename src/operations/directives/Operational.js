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

angular.module('snOperationalDirective', [
    'ngMaterial',
    'snControllers',
    'snJRPCServices',
    'snTimelineServices'
])
.controller('snOperationalDlgCtrl', [
    '$scope', '$mdDialog',

    /**
     * Controller function for handling the SatNet operational dialog.
     *
     * @param {Object} $scope $scope for the controller
     */
    function ($scope, $mdDialog) {

        /**
         * Function that closes the dialog.
         */
        $scope.close = function () { $mdDialog.hide(); };

    }

])
.controller('snOperationalCtrl', ['$scope', '$mdDialog',

    /**
     * Controller function for opening the SatNet operational dialog.
     *
     * @param {Object} $scope    $scope for the controller
     * @param {Object} $mdDialog Angular material Dialog service
     */
    function ($scope, $mdDialog) {

        /**
         * Function that opens the dialog when the snOperational button is
         * clicked.
         */
        $scope.openDialog = function () {
            $mdDialog.show({
                templateUrl: 'operations/templates/operational/dialog.html',
                controller: 'snOperationalDlgCtrl'
            });
        };

    }

])
.directive('snOperational',

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
            templateUrl: 'operations/templates/operational/menu.html'
        };
    }

);
