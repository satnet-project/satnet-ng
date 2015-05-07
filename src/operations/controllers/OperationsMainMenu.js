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
        'ngMaterial',
        'ngAnimate',
        'leaflet-directive',
        'splashDirective'
    ]
);

opsMenuCtrlModule.controller('OperationsAppCtrl',

    /**
     * Main controller for the Operations application.
     * @param   {Object}   $scope               Controller execution scope.
     * @param   {Object}   $timeout             $timeout angular service.
     * @param   {Object}   $mdSidenav           Side mane service from Angular
     *                                          Material.
     * @param   {Object}   $log                 $log from Angular.
     */
    function ($scope, $timeout, $mdSidenav, $log) {
        'use strict';

        $scope.closed = false;
        $scope.toggle = angular.noop;

        /**
         * Handler that returns the status of the menu (open or closed).
         * @returns {Boolean} $scope.closed
         */
        $scope.isOpen = function () {
            return $scope.closed;
        };

        /**
         * Handler to toggle the menu on and off. It is based on the $mdSidenav
         * service provided by Angular Material. Its main objective is to
         * provide a button overlayed over the map so that in case the menu is
         * hidden (due to the small size of the screen), the menu can still be
         * shown.
         */
        $scope.toggleMenu = function () {
            $mdSidenav('menu').toggle().then(function () {
                $log.debug("MENU is done");
            });
        };

        console.log('Operations application BOOTED UP!');

    });

opsMenuCtrlModule.controller('OperationsMenuCtrl',

    /**
     * Controller of the menu for the Operations application. It creates a
     * function bound to the event of closing the menu that it controls and
     * a flag with the state (open or closed) of that menu.
     * @param   {Object} $scope               Controller execution scope.
     * @param   {Object} $timeout             $timeout angular service.
     * @param   {Object} $mdSidenav           Side mane service from Angular
     *                                        Material.
     * @param   {Object} $log                 $log from Angular.
     */
    function ($scope, $timeout, $mdSidenav, $log) {
        'use strict';

        $scope.closed = false;

        /**
         * Handler to close the menu that actually takes the user out of
         * the application.
         */
        $scope.close = function () {
            $mdSidenav("menu").close().then(function () {
                $log.debug("close LEFT is done");
                $scope.closed = true;
            });
        };

    });