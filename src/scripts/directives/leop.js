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

angular.module('leopDirective', [])
.controller('AppCtrl', function ($scope, $timeout, $mdSidenav, $mdComponentRegistry, $log) {

    $scope.toggle = angular.noop;
    $scope.isOpen = function () { return false; };

    $mdComponentRegistry.when('right').then(function (sideNav) {

        $scope.isOpen = angular.bind(sideNav, sideNav.isOpen);
        $scope.toggle = angular.bind(sideNav, sideNav.toggle);

    });

    $scope.toggleMenu = function () {
        $mdSidenav('menu').toggle().then(function () {
            $log.debug("MENU is done");
        });
    };

})
.controller('MenuCtrl', function ($scope, $timeout, $mdSidenav, $log) {

    $scope.close = function () {
        $mdSidenav('left').close().then(function () {
            $log.debug("close LEFT is done");
        });
    };

})
.directive('leopApp', function () {
    'use strict';

    return {
        restrict: 'E',
        templateUrl: 'templates/leop/mainLeop.html'
    };

});