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

var opsMenuCtrlModule = angular.module(
    'operationsMenuControllers', [
        'ngMaterial'
    ]
);

opsMenuCtrlModule.controller('OperationsMenuCtrl', [ '$scope', '$mdSidenav',

    /**
     * Controller of the menu for the Operations application. It creates a
     * function bound to the event of closing the menu that it controls and
     * a flag with the state (open or closed) of that menu.
     * @param   {Object} $scope               Controller execution scope.
     * @param   {Object} $mdSidenav           Side mane service from Angular
     *                                        Material.
     */
    function ($scope, $mdSidenav) {

        /**
         * Handler to close the menu that actually takes the user out of the
         * application.
         */
        $scope.close = function () {
            $mdSidenav("menu").close();
        };

        /**
         * Handler to open the dialog for managing the ground stations.
         */
        $scope.groundStations = function () {
        };
    
    }]);