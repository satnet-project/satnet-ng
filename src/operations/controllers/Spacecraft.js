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

angular.module(
    'snScControllers', [
        'ngMaterial',
        'remoteValidation',
        'leaflet-directive',
        'snBroadcasterServices',
        'snMapServices',
        'snCelestrakServices'
    ]
).controller('scListCtrl', [
    '$log', '$scope', '$mdDialog', '$mdToast',
    'broadcaster', 'satnetRPC',

    /**
     * Controller of the list with the Ground Stations registered for a given
     * user. This controller takes care of initializing the list and of
     * updating it whenever it is necessary through the SatNet RPC available
     * service.
     *
     * @param {Object} $scope Controller execution scope.
     */
    function ($log, $scope, $mdDialog, $mdToast, broadcaster, satnetRPC) {

        $scope.scList = [];

        /**
         * Function that triggers the opening of a window to add a new ground
         * station into the system.
         */
        $scope.addScMenu = function () {
            $mdDialog.show({
                templateUrl: 'operations/templates/sc/dialog.html',
                controller: 'scDialogCtrl',
                locals: {
                    identifier: '',
                    editing: false
                }
            });
        };

        /**
         * Controller function that shows the dialog for editing the properties
         * of a given Spacecraft.
         *
         * @param {String} identifier Identifier of the Spacecraft
         */
        $scope.editSc = function (identifier) {
            $mdDialog.show({
                templateUrl: 'operations/templates/sc/dialog.html',
                controller: 'scDialogCtrl',
                locals: {
                    identifier: identifier,
                    editing: true
                }
            });
        };

        /**
         * Controller function that removes the given Spacecraft from the
         * database in the remote server upon user request. It first asks for
         * confirmation before executing this removal.
         *
         * @param {String} identifier Identifier of the Spacecraft
         */
        $scope.removeSc = function (identifier) {

            satnetRPC.rCall('sc.delete', [identifier]).then(function (results) {
                var message = '<' + identifier + '> succesfully deleted!';
                broadcaster.gsRemoved(identifier);
                $log.info(message, ', result = ' + JSON.stringify(results));
                $mdToast.show($mdToast.simple().content(message));
                $scope.refresh();
            }).catch(function (cause) {
                var message = 'Could not remove GS with id = <' +
                    identifier + '>';
                $log.error('[satnet] ERROR, cause = ' + JSON.stringify(cause));
                $mdToast.show($mdToast.simple().content(message));
                $mdDialog.hide();
            });

        };

        /**
         * Function that refreshes the list of registered spacecraft.
         */
        $scope.refresh = function () {
            satnetRPC.rCall('sc.list', []).then(function (results) {
                if (results !== null) {
                    $scope.scList = results.slice(0);
                }
            }).catch(function (cause) {
                $log.error('[satnet] ERROR, cause = ' + JSON.stringify(cause));
                $mdToast.show($mdToast.simple().content('Network Error'));
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

]).controller('scDialogCtrl', [
    '$log', '$scope', '$mdDialog', '$mdToast',
    'broadcaster', 'satnetRPC', 'celestrak',
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
        broadcaster, satnetRPC, celestrak,
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
            tle_group: '',
            tle: ''
        };
        $scope.uiCtrl = {
            add: {
                disabled: true
            },
            editing: editing,
            tle_groups: celestrak.CELESTRAK_SELECT_SECTIONS,
            tles: []
        };

        /**
         * Function that updates the list of selectable TLE's once the group
         * has changed in the other select control.
         */
        $scope.updateTles = function () {
            if (!$scope.configuration.tle_group) {
                return;
            }
            satnetRPC.rCall('tle.celestrak.getResource', [
                $scope.configuration.tle_group.subsection
            ])
                .then(function (tles) {
                    $scope.uiCtrl.tles = tles.tle_list.slice(0);
                });
        };

        /**
         * Function that triggers the opening of a window to add a new Ground
         * Station into the system.
         */
        $scope.add = function () {

            var gs_cfg = [
                $scope.configuration.identifier,
                $scope.configuration.callsign,
                $scope.configuration.tle.spacecraft_tle_id
            ];

            satnetRPC.rCall('sc.add', gs_cfg).then(
                function (results) {

                    var id = results.spacecraft_id,
                        message = '<' + id + '> succesfully created!';

                    broadcaster.scAdded(id);

                    $log.info(message, ', result = ' + JSON.stringify(results));
                    $mdToast.show($mdToast.simple().content(message));
                    $mdDialog.hide();
                    $mdDialog.show({
                        templateUrl: 'operations/templates/sc/list.html'
                    });

                },
                function (error) {
                    window.alert(error);
                }
            );

        };

        /**
         * Function that saves the just edited spacecraft object in the remote
         * server.
         */
        $scope.update = function () {

        };

        /**
         * Function that handles the behavior of the modal dialog once the user
         * cancels the operation of adding a new Ground Station.
         */
        $scope.cancel = function () {
            $mdDialog.hide();
            $mdDialog.show({
                templateUrl: 'operations/templates/sc/list.html'
            });
        };

        /**
         * Generic method that initializes the Spacecraft dialog discerning
         * whether this is going to be used either for adding a new Spacecraft
         * or for editing an existing one. It also carries out all the common
         * initialization tasks that have to be executed for both.
         */
        $scope.init = function () {

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
         * user to input all the information about the Spacecraft; this is,
         * a dialog for adding a "new" Spacecraft.
         */
        $scope.initConfiguration = function () {
            // TODO Init whatever configuration it is necessary
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