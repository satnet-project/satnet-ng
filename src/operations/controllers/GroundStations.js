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
        'leaflet-directive',
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

        // TODO: create gs-edit-dialog template and check edit behavior.

        /**
         * Controller function that shows the dialog for editing the properties
         * of a given Ground Station.
         *
         * @param {String} gs_id Identifier of the Ground Station for edition
         */
        $scope.editGs = function (gs_id) {
            $mdDialog.hide();
            $mdDialog.show({
                templateUrl: 'operations/templates/gs-edit-dialog.html',
                locals: {
                    gs_id: gs_id
                }
            });
        };

        // TODO : create sn-ok-toast template and check GS removal.

        /**
         * Controller function that removes the given Ground Station from the
         * database in the remote server upon user request. It first asks for
         * confirmation before executing this removal.
         *
         * @param {String} gs_id Identifier of the Ground Station for removal
         */
        $scope.removeGs = function (gs_id) {
            satnetRPC.rCall('gs.delete', [gs_id]).then(function (results) {
                var message = '<' + gs_id + '> succesfully deleted!';
                $log.info(message, ', result = ' + JSON.stringify(results));
                $mdToast.show($mdToast.simple().content(message));
                $scope.refresh();
            }).catch(function (cause) {
                $log.error('[satnet] ERROR, cause = ' + JSON.stringify(cause));
                $mdToast.show({
                    controller: 'ToastCtrl',
                    templateUrl: 'common/templates/sn-error-toast.html',
                    locals: {
                        message: 'Removal Error'
                    },
                    hideDelay: 5000,
                    position: 'bottom'
                });
                $mdDialog.hide();
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
                    controller: 'ToastCtrl',
                    templateUrl: 'common/templates/sn-error-toast.html',
                    locals: {
                        message: 'Network Error'
                    },
                    hideDelay: 5000,
                    position: 'bottom'
                });
                $mdDialog.hide();
            });
        };

        /**
         * Function that initializes the list of ground stations that are to be
         * displayed.
         */
        $scope.init = function () {
            $scope.refresh();
        };

    }

]);

gsCtrlModule.controller('GsAddCtrl', [
    '$log', '$scope', '$mdDialog', '$mdToast',
    'satnetRPC',
    'mapServices', 'LAT', 'LNG', 'ZOOM_SELECT',

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

        $scope.configuration = {
            identifier: '',
            callsign: '',
            elevation: 0.0
        };
        $scope.uiCtrl = {
            add: {
                disabled: true
            }
        };

        $scope.center = {};
        $scope.markers = {
            gs: {
                lat: 0,
                lng: 0,
                message: "Drag me to your GS!",
                draggable: true,
                focus: false
            }
        };
        $scope.events = {};

        /**
         * Function that triggers the opening of a window to add a new ground
         * station into the system.
         */
        $scope.add = function () {
            var gs_cfg = [
                $scope.configuration.identifier,
                $scope.configuration.callsign,
                $scope.configuration.elevation.toFixed(2),
                $scope.markers.gs.lat.toFixed(6),
                $scope.markers.gs.lng.toFixed(6)
            ];
            satnetRPC.rCall('gs.add', gs_cfg).then(
                function (data) {
                    var gsId = data.groundstation_id;
                    $log.info('[map-ctrl] GS added, id = ' + gsId);
                    // TODO : gs.add signal
                    // broadcaster.gsAdded(gsId);
                    $mdDialog.hide();
                    //$mdToast.show();
                },
                function (error) {
                    window.alert(error);
                }
            );
        };

        /**
         * Function that handles the behavior of the modal dialog once the user
         * cancels the operation of adding a new Ground Station.
         */
        $scope.cancel = function () {
            $mdDialog.hide();
            $mdDialog.show({
                templateUrl: 'operations/templates/gs-list-dialog.html'
            });
        };

        /**
         * Function that initializes this controller by correctly setting up
         * the markers and the position (lat, lng, zoom) of the map.
         */
        $scope.init = function () {
            satnetRPC.getUserLocation().then(function (location) {
                angular.extend($scope.center, {
                    lat: location.latitude,
                    lng: location.longitude,
                    zoom: ZOOM_SELECT
                });

                $scope.markers.gs.lat = location.latitude;
                $scope.markers.gs.lng = location.longitude;
                $scope.markers.gs.focus = true;

                angular.extend($scope.events, {
                    markers: ['dragend']
                });

            });

            $scope.$on("leafletDirectiveMarker.dragend", function (event, args) {
                $scope.markers.gs.lat = args.model.lat;
                $scope.markers.gs.lng = args.model.lng;
            });

        };

    }

]);