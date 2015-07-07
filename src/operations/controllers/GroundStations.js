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

angular.module(
    'snGsControllers', [
        'ngMaterial',
        'remoteValidation',
        'leaflet-directive',
        'snBroadcasterServices',
        'snControllers',
        'snMapServices'
    ]
).controller('gsListCtrl', [
    '$log', '$scope', '$mdDialog', '$mdToast',
    'broadcaster', 'satnetRPC', 'snDialog',

    /**
     * Controller of the list with the Ground Stations registered for a given
     * user. This controller takes care of initializing the list and of
     * updating it whenever it is necessary through the SatNet RPC available
     * service.
     *
     * @param {Object} $scope Controller execution scope.
     */
    function (
        $log, $scope, $mdDialog, $mdToast, broadcaster, satnetRPC, snDialog
    ) {

        $scope.gsList = [];

        /**
         * Function that triggers the opening of a window to add a new ground
         * station into the system.
         */
        $scope.addGsMenu = function () {
            $mdDialog.show({
                templateUrl: 'operations/templates/gs/dialog.html',
                controller: 'gsDialogCtrl',
                locals: {
                    identifier: '',
                    editing: false
                }
            });
        };

        /**
         * Controller function that shows the dialog for editing the properties
         * of a given Ground Station.
         *
         * @param {String} identifier Identifier of the Ground Station
         */
        $scope.editGs = function (identifier) {
            $mdDialog.show({
                templateUrl: 'operations/templates/gs/dialog.html',
                controller: 'gsDialogCtrl',
                locals: {
                    identifier: identifier,
                    editing: true
                }
            });
        };

        /**
         * Controller function that removes the given Ground Station from the
         * database in the remote server upon user request. It first asks for
         * confirmation before executing this removal.
         *
         * @param {String} gs_id Identifier of the Ground Station for removal
         */
        $scope.removeGs = function (gs_id) {
            satnetRPC.rCall('gs.delete', [gs_id]).then(function (results) {
                broadcaster.gsRemoved(gs_id);
                snDialog.success('gs.delete', gs_id, results, null);
                $scope.refresh();
            }).catch(function (cause) {
                snDialog.exception('gs.delete', gs_id, cause);
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
                snDialog.exception('gs.list', '-', cause);
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

]).controller('gsDialogCtrl', [
    '$log', '$scope', '$mdDialog', '$mdToast',
    'broadcaster', 'satnetRPC', 'snDialog',
    'mapServices', 'LAT', 'LNG', 'ZOOM_SELECT',
    'identifier', 'editing',

    /**
     * Controller of the dialog used to add a new Ground Station. This dialog
     * provides all the required controls as for gathering all the information
     * about the new element for the database.
     *
     * @param {Object} $scope Controller execution scope.
     */
    function (
        $log, $scope, $mdDialog, $mdToast,
        broadcaster, satnetRPC, snDialog,
        mapServices, LAT, LNG, ZOOM_SELECT,
        identifier, editing
    ) {

        if (!identifier) {
            identifier = '';
        }
        if (!editing) {
            editing = false;
        }

        $scope.configuration = {
            identifier: identifier,
            callsign: '',
            elevation: 0.0
        };
        $scope.uiCtrl = {
            add: {
                disabled: true
            },
            editing: editing
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

        $scope._listTemplateUrl = 'operations/templates/gs/list.html';

        /**
         * Function that triggers the opening of a window to add a new Ground
         * Station into the system.
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
                function (results) {
                    var gs_id = results.groundstation_id;
                    broadcaster.gsAdded(gs_id);
                    snDialog.success(gs_id, results, $scope._listTemplateUrl);
                },
                function (cause) {
                    snDialog.exception('gs.add', '-', cause);
                }
            );

        };

        /**
         * Function that saves the just edited ground station object within
         * the remote server.
         */
        $scope.update = function () {

            var cfg = {
                groundstation_id: identifier,
                groundstation_callsign: $scope.configuration.callsign,
                groundstation_elevation: $scope.configuration.elevation.toFixed(2),
                groundstation_latlon: [
                    $scope.markers.gs.lat.toFixed(6),
                    $scope.markers.gs.lng.toFixed(6)
                ]
            };

            satnetRPC.rCall('gs.update', [identifier, cfg]).then(
                function (gs_id) {
                    broadcaster.gsUpdated(gs_id);
                    snDialog.success(gs_id, gs_id, $scope._listTemplateUrl);
                },
                function (cause) {
                    snDialog.exception('gs.update', '-', cause);
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
                templateUrl: 'operations/templates/gs/list.html'
            });
        };

        /**
         * Generic method that initializes the Ground Station dialog discerning
         * whether this is going to be used either for adding a new Ground
         * Station or for editing an existing one. It also carries out all the
         * common initialization tasks that have to be executed for both.
         */
        $scope.init = function () {

            angular.extend($scope.events, {
                markers: ['dragend']
            });

            $scope.$on("leafletDirectiveMarker.dragend",
                function (event, args) {
                    $scope.markers.gs.lat = args.model.lat;
                    $scope.markers.gs.lng = args.model.lng;
                }
            );

            if (editing) {
                $scope.loadConfiguration();
            } else {
                $scope.initConfiguration();
            }

        };

        /**
         * Function that initializes this controller by correctly setting up
         * the markers and the position (lat, lng, zoom) of the map. This init
         * method must be invoked only when creating a dialog that requires the
         * user to input all the information about the Ground Station; this is,
         * a dialog for adding a "new" Ground Station.
         */
        $scope.initConfiguration = function () {

            satnetRPC.getUserLocation().then(function (location) {

                angular.extend($scope.center, {
                    lat: location.latitude,
                    lng: location.longitude,
                    zoom: ZOOM_SELECT
                });

                $scope.markers.gs.lat = location.latitude;
                $scope.markers.gs.lng = location.longitude;
                $scope.markers.gs.focus = true;

            });

        };

        /**
         * Function that initializes this controller by correctly setting up
         * the markers and the position (lat, lng, zoom) of the map. It loads
         * all the configuration for the Ground Station from the remote server.
         * Therefore, this initialization function must be used to initialize a
         * Ground Station dialog for editing the configuration of an existant
         * Ground Station.
         */
        $scope.loadConfiguration = function () {

            mapServices.centerAtGs($scope, identifier, 8).then(function (gs) {

                $scope.configuration.identifier = gs.groundstation_id;
                $scope.configuration.callsign = gs.groundstation_callsign;
                $scope.configuration.elevation = gs.groundstation_elevation;

                $scope.markers.gs.focus = true;
                $scope.markers.gs.message = "Drag me to your GS!";
                $scope.markers.gs.draggable = true;

            });

        };

    }

]);