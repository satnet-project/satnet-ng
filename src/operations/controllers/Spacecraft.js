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

angular.module('snScControllers', [
    'ngMaterial',
    'remoteValidation',
    'leaflet-directive',
    'snBroadcasterServices',
    'snMapServices',
    'snControllers',
    'snPassesDirective',
    'snCelestrakServices'
])
.controller('scListCtrl', [
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

        $scope.scList = [];

        /**
         * Function that triggers the opening of a window to add a new ground
         * station into the system.
         */
        $scope.showAddDialog = function () {
            $mdDialog.show({
                templateUrl: 'operations/templates/segments/sc.dialog.html',
                controller: 'scDialogCtrl',
                locals: { identifier: '', editing: false }
            });
        };

        /**
         * Controller function that shows the dialog for editing the properties
         * of a given Spacecraft.
         *
         * @param {String} identifier Identifier of the Spacecraft
         */
        $scope.showEditDialog = function (identifier) {
            $mdDialog.show({
                templateUrl: 'operations/templates/segments/sc.dialog.html',
                controller: 'scDialogCtrl',
                locals: { identifier: identifier, editing: true }
            });
        };

        /**
         * Function that triggers the opening of a window to add a new
         * Availability Rule to this Spacecraft.
         * 
         * @param {String} identifier Identifier of the Spacecraft
         */
        $scope.showChannelList = function (identifier) {
            $mdDialog.show({
                templateUrl: 'operations/templates/channels/list.html',
                controller: 'channelListCtrl',
                locals: { segmentId: identifier, isSpacecraft: true }
            });
        };

        /**
         * Controller function that removes the given Spacecraft from the
         * database in the remote server upon user request. It first asks for
         * confirmation before executing this removal.
         *
         * @param {String} identifier Identifier of the Spacecraft
         */
        $scope.delete = function (identifier) {
            
            var confirm = $mdDialog.confirm()
                .title('Would you like to remove this Spacecraft?')
                .content(
                    'This action will remove your Spacecraft named <' +
                    identifier + '> and all its associated resources'
                )
                .ariaLabel('spacecraft removal confirmation')
                .ok('REMOVE')
                .cancel('CANCEL');

            $mdDialog.show(confirm).then(function() {

                satnetRPC.rCall('sc.delete', [identifier]).then(
                    function (results) {
                        broadcaster.scRemoved(identifier);
                        snDialog.success('sc.delete', identifier, results, null);
                        $scope.refresh();
                    }
                ).catch(function (cause) {
                    snDialog.exception('sc.delete', identifier, cause);
                });

            },  function () {
                console.log('Spacecraft removal canceled');
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
                snDialog.exception('sc.list', '-', cause);
            });
        };

        /**
         * Function that initializes the list of ground stations that are to be
         * displayed.
         */
        $scope.init = function () {
            $scope.refresh();
        };

        // INITIALIZATION: avoids using ng-init within the template
        $scope.init();

    }

]).controller('scDialogCtrl', [
    '$log', '$scope', '$mdDialog', '$mdToast',
    'broadcaster', 'satnetRPC', 'celestrak', 'snDialog',
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
        broadcaster, satnetRPC, celestrak, snDialog,
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

        $scope.listTemplateUrl = 'operations/templates/segments/sc.list.html';

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
         * Function that triggers the opening of a window to add a new
         * Spacecraft into the system.
         */
        $scope.add = function () {

            var cfg = [
                $scope.configuration.identifier,
                $scope.configuration.callsign,
                $scope.configuration.tle.spacecraft_tle_id
            ];

            satnetRPC.rCall('sc.add', cfg).then(
                function (response) {
                    var id = response.spacecraft_id;
                    broadcaster.scAdded(id);
                    // FIXME ISSUE #10: Error while showing the $mdDialog
                    $mdDialog.hide();
                    snDialog.success('sc.add', id, response, null);
                },
                function (cause) {
                    snDialog.exception('sc.add', '-', cause);
                }
            );

        };

        /**
         * Function that saves the just edited spacecraft object in the remote
         * server.
         */
        $scope.update = function () {

            var cfg = {
                'spacecraft_id': identifier,
                'spacecraft_callsign': $scope.configuration.callsign,
                'spacecraft_tle_id': $scope.configuration.tle.spacecraft_tle_id
            };

            satnetRPC.rCall('sc.update', [identifier, cfg]).then(
                function (response) {
                    broadcaster.scUpdated(response);
                    // FIXME ISSUE #10: Error while showing the $mdDialog
                    $mdDialog.hide();
                    snDialog.success('sc.update', response, response, null);
                },
                function (cause) {
                    snDialog.exception('sc.update', '-', cause);
                }
            );

        };

        /**
         * Function that handles the behavior of the modal dialog once the user
         * cancels the operation of adding a new Ground Station.
         */
        $scope.cancel = function () {
            $mdDialog.hide();
            // FIXME ISSUE #10: Error while showing the $mdDialog
            // $mdDialog.show({ templateUrl: $scope.listTemplateUrl });
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