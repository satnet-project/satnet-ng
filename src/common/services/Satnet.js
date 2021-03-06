/**
 * Copyright 2015 Ricardo Tubio-Pardavila
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

angular
.module('snJRPCServices', ['jsonrpc', 'ngCookies'])
.run(['$http', '$cookies',

    /**
     * This function configures the JSONRPC service by changing some of the
     * properties from the underlaying Angular JS $http and $cookies services.
     * Basically, it sets the 'X-CSRFToken' in the HTTP packages with the
     * cookie CSRF Token currently in use. This avoids problems with CSRF.
     *
     * @param {Object} $http    Angular JS $http service
     * @param {Object} $cookies Angular JS $cookies service
     */
    function ($http, $cookies) {
            $http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken;
    }

])
.constant('RPC_GS_PREFIX', 'gs')
.constant('RPC_SC_PREFIX', 'sc')
.constant('TEST_PORT', 8000)
.service('satnetRPC', [
    'jsonrpc', '$location', '$log', '$q', '$http', 'TEST_PORT',

    /**
     * Service that defines the basic calls to the services of the SATNET
     * network through JSON RPC. It defines a common error handler for all
     * the errors that can be overriden by users.
     *
     * @param   {Object} jsonrpc   JSON RPC service.
     * @param   {Object} $location $location service.
     * @param   {Object} $log      $log service.
     * @param   {Object} $q        $q service.
     * @param   {Object} $http     $http service.
     */
    function (jsonrpc, $location, $log, $q, $http, TEST_PORT) {

        /**
         * PRIVATE METHOD
         *
         * Returns the complete address to connect to the sever where the
         * SatNet services are running. This can be use as the base for any
         * of the offered services, regardless of whether they are offered
         * over JRPC or over HTTP (AJAX requests).
         *
         * If the current connection address is "localhost", it assumes
         * debug mode and the URL that it returns has the port changed so
         * that it re-routes the calls to the port 8000. At that port, the
         * code for the SatNet server is supposed to be running.
         *
         * The latter policy for automatic test detection might incurr in
         * further Cross-Reference connection problems.
         *
         * @returns {String} Corrected address for the remote SatNet server.
         */
        this._getSatNetAddress = function () {
            var protocol = $location.protocol(),
                hostname = $location.host(),
                port = $location.port();
            if (hostname === 'localhost') {
                port = TEST_PORT;
            }
            return '' + protocol + '://' + hostname + ':' + port;
        };

        /**
         * PRIVATE METHOD
         *
         * Returns the complete address to connect with the remote server
         * that implements the remote SATNET API over JRPC.
         *
         * If the current connection address is "localhost", it assumes
         * debug mode and the URL that it returns has the port changed so
         * that it re-routes the calls to the port 8000. At that port, the
         * code for the SatNet server is supposed to be running.
         *
         * The latter policy for automatic test detection might incurr in
         * further Cross-Reference connection problems.
         *
         * @returns {String} Corrected address for the remote SatNet server.
         */
        this._getRPCAddress = function () {
            return this._getSatNetAddress() + '/jrpc/';
        };

        var _rpc = this._getRPCAddress();
        this._configuration = jsonrpc.newService('configuration', _rpc);
        this._simulation = jsonrpc.newService('simulation', _rpc);
        this._leop = jsonrpc.newService('leop', _rpc);
        this._network = jsonrpc.newService('network', _rpc);
        this._scheduling = jsonrpc.newService('scheduling', _rpc);

        this._services = {
            'channels.options':
                this._configuration.createMethod('bands.available'),
            // Configuration methods (Ground Stations)
            'gs.list':
                this._configuration.createMethod('gs.list'),
            'gs.list.mine':
                this._configuration.createMethod('gs.list.mine'),
            'gs.list.others':
                this._configuration.createMethod('gs.list.others'),
            'gs.add':
                this._configuration.createMethod('gs.create'),
            'gs.get':
                this._configuration.createMethod('gs.get'),
            'gs.update':
                this._configuration.createMethod('gs.set'),
            'gs.delete':
                this._configuration.createMethod('gs.delete'),
            'gs.channel.list':
                this._configuration.createMethod('gs.channel.list'),
            'gs.channel.add':
                this._configuration.createMethod('gs.channel.create'),
            'gs.channel.get':
                this._configuration.createMethod('gs.channel.get'),
            'gs.channel.set':
                this._configuration.createMethod('gs.channel.set'),
            'gs.channel.delete':
                this._configuration.createMethod('gs.channel.delete'),
            // Rules management
            'rules.list':
                this._configuration.createMethod('gs.rules.list'),
            'rules.add':
                this._configuration.createMethod('gs.rules.add'),
            'rules.delete':
                this._configuration.createMethod('gs.rules.delete'),
            // Configuration methods (Spacecraft)
            'sc.list':
                this._configuration.createMethod('sc.list'),
            'sc.list.mine':
                this._configuration.createMethod('sc.list.mine'),
            'sc.list.others':
                this._configuration.createMethod('sc.list.others'),
            'sc.add':
                this._configuration.createMethod('sc.create'),
            'sc.get':
                this._configuration.createMethod('sc.get'),
            'sc.update':
                this._configuration.createMethod('sc.set'),
            'sc.delete':
                this._configuration.createMethod('sc.delete'),
            'sc.channel.list':
                this._configuration.createMethod('sc.channel.list'),
            'sc.channel.add':
                this._configuration.createMethod('sc.channel.create'),
            'sc.channel.get':
                this._configuration.createMethod('sc.channel.get'),
            'sc.channel.set':
                this._configuration.createMethod('sc.channel.set'),
            'sc.channel.delete':
                this._configuration.createMethod('sc.channel.delete'),
            // User configuration
            'user.getLocation':
                this._configuration.createMethod('user.getLocation'),
            // TLE methods
            'tle.celestrak.getSections':
                this._configuration.createMethod('tle.celestrak.sections'),
            'tle.celestrak.getResource':
                this._configuration.createMethod('tle.celestrak.resource'),
            'tle.celestrak.getTle':
                this._configuration.createMethod('tle.celestrak.tle'),
            // Simulation methods
            'sc.getGroundtrack':
                this._simulation.createMethod('sc.groundtrack'),
            'sc.getPasses':
                this._simulation.createMethod('sc.passes'),
            'gs.getPasses':
                this._simulation.createMethod('gs.passes'),

            // NETWORK services
            'net.alive':
                this._network.createMethod('alive'),
            'net.geoip':
                this._network.createMethod('geoip'),
            'net.user':
                this._network.createMethod('user'),

            // SCHEDULING services
            'gs.availability':
                this._scheduling.createMethod('gs.availability'),
            'sc.compatibility':
                this._scheduling.createMethod('sc.compatibility'),
            'gs.operational':
                this._scheduling.createMethod('gs.operational'),
            'gs.operational.accept':
                this._scheduling.createMethod('gs.confirmSelections'),
            'gs.operational.deny':
                this._scheduling.createMethod('gs.denySelections'),
            'gs.operational.drop':
                this._scheduling.createMethod('gs.cancelReservations'),
            'sc.operational':
                this._scheduling.createMethod('sc.operational'),
            'sc.select':
                this._scheduling.createMethod('sc.selectSlots'),
            'sc.cancel':
                this._scheduling.createMethod('sc.cancelSelections'),
            'ss.compatibility':
                this._scheduling.createMethod('segment.compatibility'),

        };

        /**
         * PRIVATE function that is used only by this service in order to
         * generate in the same way all possible errors produced by the
         * remote invokation of the SatNet services.
         *
         * @param {String} service Name of the SatNet JRPC service that
         *                         has just been invoked
         * @param {Array}  params  Array with the parameters for the
         *                         service to be invoked
         * @param {String} code    Error code
         * @param {String} message Messsage description
         * @returns
         */
        this._generateError = function (service, params, code, message) {

            var msg = 'Satnet.js@_generateError: invoking = <' + service +
                '>, with params = <' + JSON.stringify(params) +
                '>, code = <' + JSON.stringify(code) +
                '>, description = <' + JSON.stringify(message) + '>';
            $log.warn(msg);
            throw msg;

        };

        /**
         * Method for calling the remote service through JSON-RPC.
         *
         * @param service The name of the service, as per the internal
         * services name definition
         * @param params The parameters for the service (as an array)
         * @returns {*}
         */
        this.rCall = function (service, params) {
            var error_fn = this._generateError;
            if ((this._services.hasOwnProperty(service)) === false) {
                throw '@rCall: service not found, id = <' + service + '>';
            }
            $log.info(
                '@rCall: Invoked service = <' + service + '>' +
                ', params = ' + JSON.stringify(params)
            );
            return this._services[service](params).then(function (data) {

                // TODO Workaround for the JSON-RPC library.
                if (data.data.name === 'JSONRPCError') {
                    error_fn(
                        service, params, data.data.code, data.data.message
                    );
                }

                // NOTICE GroundTracks are not displayed completely...
                var result_msg = ', result = <';
                if (service === 'sc.getGroundtrack') {
                    result_msg += '$GT_TOO_LONG$>';
                } else {
                    result_msg += JSON.stringify(data) + '>';
                }
                $log.info(
                    '@rCall: Invoked service = <' + service + '>' +
                    ', params = <' + JSON.stringify(params) + '>, ' +
                    ', result = <' + result_msg
                );
                return data.data;

            }, function (error) {
                $log.error("error = " + JSON.stringify(error));
                error_fn(service, params, 'NONE', error);
            });

        };

        /**
         * Simple convenience method for invoking the remote keep alive of
         * the network sevice.
         *
         * @returns {*} Promise that returns True
         */
        this.alive = function () {
            return this.rCall('net.alive', []).then(function () {
                return true;
            });
        };

        /**
         * Function that retrieves the username of the currently logged user.
         *
         * @returns {String} String with the name of the user
         */
        this.getMyUsername = function () {
            return this.rCall('net.user', []).then(function (result) {
                return result;
            }).catch(function (cause) {
                console.error('net.user', '-', cause);
            });
        };

        /**
         * Retrieves the user location using an available Internet service.
         *
         * @returns Promise that returns a { latitude, longitude } object
         */
        this.getUserLocation = function () {
            var url = this._getSatNetAddress() + '/configuration/user/geoip';
            return $http.get(url).then(function (data) {
                $log.info(
                    'Satnet.js@getUserLocation: user@(' +
                    JSON.stringify(data.data) + ')'
                );
                return {
                    latitude: parseFloat(data.data.latitude),
                    longitude: parseFloat(data.data.longitude)
                };
            });
        };

        /**
         * Retrieves the server location using an available Internet
         * service.
         *
         * @returns Promise that returns a { latitude, longitude } object
         */
        this.getServerLocation = function (hostname) {
            return this.rCall('net.geoip', [hostname]).then(

                function (location) {

                    var lat = (typeof(location.latitude) === 'string') ?
                                parseFloat(location.latitude):
                                location.latitude,
                        lng = (typeof(location.longitude) === 'string') ?
                                parseFloat(location.longitude):
                                location.longitude;

                    return {
                        latitude: lat, longitude: lng
                    };
                }

            );
        };

        /**
         * Reads the configuration for a given spacecraft, including the
         * estimated groundtrack.
         *
         * @param scId The identifier of the spacecraft.
         * @returns Promise that resturns the Spacecraft configuration
         * object.
         */
        this.readSCCfg = function (scId) {
            var cfg = {},
                p = [
                    this.rCall('sc.get', [scId]),
                    this.rCall('sc.getGroundtrack', [scId]),
                    this.rCall('tle.celestrak.getTle', [scId])
                ];

            return $q.all(p).then(function (results) {
                cfg = results[0];
                cfg.groundtrack = results[1];
                cfg.tle = results[2];
                angular.extend(cfg, results[0]);
                angular.extend(cfg.groundtrack, results[1]);
                angular.extend(cfg.tle, results[2]);
                return cfg;
            });
        };

    }

]);
