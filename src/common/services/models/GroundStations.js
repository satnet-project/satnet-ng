/**
 * Copyright 2014 Ricardo Tubio-Pardavila
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Created by rtubio on 10/24/14.
 */

/** Module definition . */
angular
    .module('snGroundStationModels', [
        'snBroadcasterServices',
        'snPushServices',
        'snJRPCServices',
        'snMarkerModels'
    ])
    .service('gsModels', [
        '$rootScope', '$q', '$log', 'broadcaster', 'satnetRPC', 'markers',

    /**
     * Service that handles the models for the Ground Stations. All the
     * information concerning the Ground Stations is temporary stored here in
     * this models and should be updated regularly after any change in the
     * network. The reason is that the main storage for the information is the
     * database in the central server.
     *
     * @param   {Object} $rootScope  Main Angular scope for the module
     * @param   {Object} $q          Promises service
     * @param   {Object} broadcaster Application service for broadcasting
     *                             events to other modules of the application
     * @param   {Object} satnetRPC Application service for accessing the RPC
     *                             methods of the central server
     * @param   {Object} markers   Service that handles the markers over the map
     */
    function ($rootScope, $q, $log, broadcaster, satnetRPC, markers) {

            /**
             * Initializes all the GroundStations reading the information from
             * the server. Markers are indirectly initialized.
             * @returns {ng.IPromise<[String]>} Identifier of the read GS.
             */
            this.initAll = function () {
                var self = this;
                return satnetRPC.rCall('gs.list', []).then(function (gss) {
                    return self._initAll(gss);
                });
            };

            /**
             * Initializes all the GroundStations reading the information from
             * the server, for all those that are registered for this LEOP cluster.
             * Markers are indirectly initialized.
             *
             * @returns {Object} Promise that returns the identifier of the Ground
             *                   Station
             */
            this.initAllLEOP = function (leop_id) {
                var self = this,
                    p = [];
                return satnetRPC.rCall('leop.gs.list', [leop_id])
                    .then(function (gss) {
                        angular.forEach(gss.leop_gs_inuse, function (gs) {
                            p.push(self.addGS(gs));
                        });
                        angular.forEach(gss.leop_gs_available, function (gs) {
                            p.push(self.addUnconnectedGS(gs));
                        });
                        return $q.all(p).then(function (gs_ids) {
                            var ids = [];
                            angular.forEach(gs_ids, function (id) {
                                ids.push(id);
                            });
                            return ids;
                        });
                    });
            };

            /**
             * Common and private method for GroundStation initializers.
             *
             * @param list The list of identifiers of the GroundStation objects.
             * @returns {ng.IPromise<[String]>} Identifier of the read GS.
             * @private
             */
            this._initAll = function (list) {
                var self = this,
                    p = [];
                angular.forEach(list, function (gs) {
                    p.push(self.addGS(gs));
                });
                return $q.all(p).then(function (gs_ids) {
                    var ids = [];
                    angular.forEach(gs_ids, function (id) {
                        ids.push(id);
                    });
                    return ids;
                });
            };

            /**
             * Adds a new GroundStation together with its marker, using the
             * configuration object that it retrieves from the server.
             *
             * @param identifier Identififer of the GroundStation to be added.
             * @returns String Identifier of the just-created object.
             */
            this.addGS = function (identifier) {
                return satnetRPC.rCall('gs.get', [identifier]).then(function (data) {
                    return markers.createGSMarker(data);
                });
            };

            /**
             * Adds a new GroundStation together with its marker, using the
             * configuration object that it retrieves from the server. It does not
             * include the connection line with the server.
             *
             * @param identifier Identififer of the GroundStation to be added.
             * @returns String Identifier of the just-created object.
             */
            this.addUnconnectedGS = function (identifier) {
                return satnetRPC.rCall('gs.get', [identifier]).then(
                    function (data) {
                        return markers.createUnconnectedGSMarker(data);
                    }
                );
            };

            /**
             * "Connects" the given groundstation to the server by adding the
             * necessary line.
             * @param identifier Identifier of the gs
             */
            this.connectGS = function (identifier) {
                markers.createGSConnector(identifier);
            };

            /**
             * "Disconnects" the GS marker by removing the line that binds it to
             * the server marker.
             * @param identifier Identifier of the gs
             */
            this.disconnectGS = function (identifier) {
                markers.removeGSConnector(identifier);
            };

            /**
             * Updates the markers for the given GroundStation object.
             * @param identifier Identifier of the GroundStation object.
             */
            this.updateGS = function (identifier) {
                satnetRPC.rCall('gs.get', [identifier]).then(function (data) {
                    return markers.updateGSMarker(data);
                });
            };

            /**
             * Removes the markers for the given GroundStation object.
             * @param identifier Identifier of the GroundStation object.
             */
            this.removeGS = function (identifier) {
                return markers.removeGSMarker(identifier);
            };

            /**
             * Private method that creates the event listeners for this service.
             */
            this.initListeners = function () {

                var self = this;
                $rootScope.$on(broadcaster.GS_ADDED_EVENT, function (event, id) {
                    $log.log(
                        '@on-gs-added-event, event = ' + event + ', id = ' + id
                    );
                    self.addGS(id);
                });
                $rootScope.$on(broadcaster.GS_REMOVED_EVENT, function (event, id) {
                    $log.log(
                        '@on-gs-removed-event, event = ' + event + ', id = ' + id
                    );
                    self.removeGS(id);
                });
                $rootScope.$on(broadcaster.GS_UPDATED_EVENT, function (event, id) {
                    $log.log(
                        '@on-gs-updated-event, event = ' + event + ', id = ' + id
                    );
                    self.updateGS(id);
                });
                $rootScope.$on(broadcaster.LEOP_GS_ASSIGNED_EVENT, function (event, id) {
                    $log.log(
                        '@on-gs-assigned-event, event = ' + event + ', id = ' + id
                    );
                    self.connectGS(id);
                });
                $rootScope.$on(broadcaster.LEOP_GS_RELEASED_EVENT, function (event, id) {
                    $log.log(
                        '@on-gs-released-event, event = ' + event + ', id = ' + id
                    );
                    self.disconnectGS(id);
                });
                $rootScope.$on(broadcaster.GS_AVAILABLE_ADDED_EVENT, function (event, id) {
                    $log.log(
                        '@on-gs-added-event, event = ' + event + ', id = ' + id
                    );
                    self.addUnconnectedGS(id);
                });
                $rootScope.$on(broadcaster.GS_AVAILABLE_REMOVED_EVENT, function (event, id) {
                    $log.log(
                        '@on-gs-removed-event, event = ' + event + ', id = ' + id
                    );
                    self.removeGS(id);
                });
                $rootScope.$on(broadcaster.GS_AVAILABLE_UPDATED_EVENT, function (event, id) {
                    $log.log(
                        '@on-gs-updated-event, event = ' + event + ', id = ' + id
                    );
                    self.updateGS(id);
                });

            };

    }
]);