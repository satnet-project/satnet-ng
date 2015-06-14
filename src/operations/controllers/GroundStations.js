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
        'ngMaterial',
        'remoteValidation',
        'snMapServices',
        'toastModule'
    ]
);

gsCtrlModule.controller('GsListCtrl', [
    '$log', '$scope', '$mdDialog', '$mdToast', 'satnetRPC',

    /**
     * Controller of the list with the Ground Stations registered for a given
     * user. This controller takes care of initializing the list and of
     * updating it whenever it is necessary through the SatNet RPC available
     * service.
     *
     * @param {Object} $scope Controller execution scope.
     */
    function ($log, $scope, $mdDialog, $mdToast, satnetRPC) {

        $scope.gsList = [];

        /**
         * Function that triggers the opening of a window to add a new ground
         * station into the system.
         */
        $scope.addGsMenu = function () {
            $mdDialog.hide();
            $mdDialog.show({
                templateUrl: 'operations/templates/gs-add-dialog.html'
            });
        };

        /**
         * Function that refreshes the list of registered ground stations.
         */
        $scope.refresh = function () {
            satnetRPC.rCall('gs.list', []).then(function (results) {
                if (results !== null) {
                    $scope.gsList = results.slice(0);
                }
            }).catch(function (cause) {
                $log.error('[satnet] ERROR, cause = ' + JSON.stringify(cause));
                $mdToast.show({
                    controller: 'ErrorToastCtrl',
                    templateUrl: 'common/templates/sn-error-toast.html',
                    locals: {
                        error: {
                            message: 'Network Error'
                        }
                    },
                    hideDelay: 5000,
                    position: 'bottom'
                });
                $mdDialog.hide();
            });
        };

        /**
         * Function that initializes the list of ground stations that is
         * displayed.
         */
        $scope.init = function () {
            $scope.refresh();
        };

    }

]);

gsCtrlModule.controller('GsAddCtrl', [
    '$log', '$scope', '$mdDialog', '$mdToast',
    'satnetRPC', 'mapServices', 'LAT', 'LNG', 'ZOOM_SELECT',

    /**
     * Controller of the dialog used to add a new Ground Station. This dialog
     * provides all the required controls as for gathering all the information
     * about the new element for the database.
     *
     * @param {Object} $scope Controller execution scope.
     */
    function (
        $log, $scope, $mdDialog, $mdToast,
        satnetRPC, mapServices, LAT, LNG, ZOOM_SELECT
    ) {

        $scope.configuration = {};
        $scope.uiCtrl = {
            add: {
                disabled: true
            }
        };

        $scope.center = {
            autoDiscover: true,
            zoom: ZOOM_SELECT
        };
        $scope.markers = {};
        /*
        $scope.layers = {
            baselayers:  mapServices.getESRIBaseLayer()
        };
        */

        $scope.init = function () {
            satnetRPC.getUserLocation().then(function (location) {
                $scope.markers.gs = {
                    lat: location.latitude,
                    lng: location.longitude,
                    focus: false,
                    draggable: true
                };
            });
        };

        /**
         * Function that triggers the opening of a window to add a new ground
         * station into the system.
         */
        $scope.add = function () {};

        $scope.cancel = function () {
            $mdDialog.hide();
            $mdDialog.show({
                templateUrl: 'operations/templates/gs-list-dialog.html'
            });
        };

    }

]);