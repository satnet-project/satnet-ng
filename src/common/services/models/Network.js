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
 * Created by rtubio on 10/28/14.
 */

/** Module definition (empty array is vital!). */
angular.module('snNetworkModels', [
    'snJRPCServices',
    'snMarkerModels'
]).service('serverModels', [
    '$rootScope', '$location', 'broadcaster', 'satnetRPC',  'markers',

    /**
     * Function that provides the services for handling the markers related to
     * the elements of the network that must be shown on the map.
     * 
     * @param   {Object} $rootScope  Main Angular scope where the map is
     * @param   {Object} $location   Angular location service
     * @param   {Object} broadcaster SatNet service to broadcast events
     * @param   {Object} satnetRPC   SatNet service to access RPC methods
     * @param   {Object} markers     SatNet service to handle map markers
     * @returns {Object} Object that offers this service
     */
    function ($rootScope, $location, broadcaster, satnetRPC, markers) {

        /**
         * Function that initializes the listeners that connect this service
         * with the events happening in other places of the application.
         */
        this._initListeners = function () {
            $rootScope.$on(
                broadcaster.KEEP_ALIVE_EVENT,
                function (event, message) {
                    console.log('ev = ' + event + ', msg = ' + message);
                    satnetRPC.alive().then(function (data) {
                        console.log('alive! data = ' + JSON.stringify(data));
                    });
                }
            );
        };

        /**
         * Function that initializes a marker for a standalone server on the
         * map.
         * 
         * @returns {Object} Returns the object with the just created marker
         */
        this.initStandalone = function () {
            this._initListeners();
            var identifier = $location.host();
            return satnetRPC.getServerLocation(identifier).then(
                function (data) {
                    return markers.createServerMarker(
                        identifier, data.latitude, data.longitude
                    );
                }
            );
        };

    }
]);