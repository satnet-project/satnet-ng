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

angular.module('snOperationsDirective', [
    'ngMaterial',
    'ngAnimate',
    'angular-loading-bar',
    'leaflet-directive',
    'snJRPCServices',
    'snLoggerDirective',
    'snSplashDirective',
    'snAboutDirective',
    'snCompatibilityDirective',
    'snAvailabilityDirective',
    'snRuleFilters',
    'snLoggerFilters',
    'snControllers',
    'snOperationsMap',
    'snOperationsMenuControllers',
    'snGsControllers',
    'snScControllers'
])
.config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('blue-grey')
        .accentPalette('grey');
})
.controller('operationsAppCtrl',

    /**
     * Main controller for the Operations application.
     *
     * @param   {Object} $scope     Controller execution scope.
     * @param   {Object} $mdSidenav Side mane service from Angular
     *                              Material.
     */
    function ($scope, $mdSidenav) {
            /**
         * Handler to toggle the menu on and off. It is based on the
         * $mdSidenav service provided by Angular Material. Its main
         * objective is to provide a button overlayed over the map so that
         * in case the menu is hidden (due to the small size of the screen),
         * the menu can still be shown.
         */
        $scope.toggleMenu = function () {
            $mdSidenav("menu").toggle();
        };

    }

)
.directive('operationsApp',

    /**
     * Function that creates the directive itself returning the
     * object required by Angular.
     *
     * @returns {Object} Object directive required by Angular,
     *                   with restrict and templateUrl.
     */
    function () {
        return {
            restrict: 'E',
            templateUrl: 'operations/templates/app.html'
        };
    }

);
