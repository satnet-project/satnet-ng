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

angular.module('snCompatibilityDirective', ['ngMaterial'])
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
.controller('snCompatibilityDlgCtrl', ['$scope', '$mdDialog',

    /**
     * Controller function for the SatNet compatibility dialog.
     *
     * @param {Object} $scope    $scope for the controller.
     */
    function ($scope, $mdDialog) {

        /**
         * Function that handles the close of the Compatibility dialog.
         */
        $scope.cancel = function () {
            $mdDialog.hide();
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