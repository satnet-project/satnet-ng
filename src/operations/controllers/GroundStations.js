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

var gsCtrlModule = angular.module(
    'gsControllers', [
        'ngMaterial'
    ]
);

gsCtrlModule.controller('GsListCtrl', [
    '$scope', '$mdDialog',
    'satnetRPC',

    /**
     * Controller of the list with the Ground Stations registered for a given
     * user. This controller takes care of initializing the list and of
     * updating it whenever it is necessary through the SatNet RPC available
     * service.
     *
     * @param {Object} $scope Controller execution scope.
     */
    function ($scope, $mdDialog, satnetRPC) {

        $scope.groundStations = {};

        /**
         * Function that refreshes the list of registered ground stations.
         */
        $scope.refresh = function () {
            satnetRPC.rCall('gs.list', []).then(function (results) {
                if (results !== null) {
                    $scope.groundStations = results.slice(0);
                }
            });
        };

        /**
         * Function that initializes the list of ground stations that is
         * displayed.
         */
        $scope.init = function () {
            console.log('XXX');
            $scope.refresh();
        };

    }

]);