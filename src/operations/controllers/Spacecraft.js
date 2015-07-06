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
        $scope.addScDialog = function () {
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
        $scope.editScDialog = function (identifier) {
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
        $scope.remove = function (identifier) {

            satnetRPC.rCall('sc.delete', [identifier]).then(function (results) {
                var message = '<' + identifier + '> succesfully deleted!';
                broadcaster.scRemoved(identifier);
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
            ]).then(function (tles) {
                $scope.uiCtrl.tles = tles.tle_list.slice(0);
            });
        };

        /**
         * Private function that is used to notify a success in an operation
         * within this Dialog.
         * 
         * @param {String} identifier Identifier of the spacecraft
         * @param {Object} results    Response from the server
         */
        $scope._notifySuccess = function(identifier, results) {
            var message = '<' + identifier + '> succesfully updated!';
            $log.info(message, ', response = ' + JSON.stringify(results));
            $mdToast.show($mdToast.simple().content(message));
            $mdDialog.hide();
            $mdDialog.show({
                templateUrl: 'operations/templates/sc/list.html'
            });
        };

        /**
         * Function that triggers the opening of a window to add a new
         * Spacecraft into the system.
         */
        $scope.add = function () {

            var self = this,
                cfg = [
                    $scope.configuration.identifier,
                    $scope.configuration.callsign,
                    $scope.configuration.tle.spacecraft_tle_id
                ];

            satnetRPC.rCall('sc.add', cfg).then(
                function (results) {
                    var id = results.spacecraft_id;
                    broadcaster.scAdded(id);
                    self._notifySuccess(id, results);
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

            var self = this,
                cfg = {
                    'spacecraft_id': identifier,
                    'spacecraft_callsign':
                        $scope.configuration.callsign,
                    'spacecraft_tle_id':
                        $scope.configuration.tle.spacecraft_tle_id
                };

            satnetRPC.rCall('sc.update', [identifier, cfg]).then(
                function (identifier) {
                    broadcaster.scUpdated(identifier);
                    self._notifySuccess(identifier, identifier);
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
                satnetRPC.rCall('sc.get', [identifier]).then(function (data) {
                    $scope.configuration.identifier = identifier;
                    $scope.configuration.callsign = data.spacecraft_callsign;
                    $scope.configuration.savedTleId = data.spacecraft_tle_id;
                });
            }

        };

    }

]);