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

var toastModule = angular.module(
    'toastModule', [
        'ngMaterial'
    ]
);

toastModule.controller('ErrorToastCtrl', [
    '$scope', '$mdToast', '$mdDialog', 'error',

    /**
     * Controller of the Error Toast toast.
     *
     * @param {Object} $scope Controller execution scope.
     */
    function ($scope, $mdToast, $mdDialog, error) {

        $scope.message = error.message;

        /**
         * Handles the closing of the Toast element.
         */
        $scope.hide = function() {
            $mdToast.hide();
        };

    }

]);;/*
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

angular.module('splashDirective', [])
    .directive('mAppLoading', ['$animate',

    /**
     * This function implements the controller.
     *
     * This CSS class-based directive controls the pre-bootstrap loading screen.
     * By default, it is visible on the screen; but, once the application loads,
     * we'll fade it out and remove it from the DOM.
     *
     * @param   {Object} $animate $animate service.
     * @returns {Object} Object with the description of the directive.
     */
    function ($animate) {
            'use strict';

            /**
             * This function links the just created CSS class-like directive in
             * order to control the end of the animation. Once the animation is
             * over, it removes itself from the DOM tree.
             *
             * Due to the way AngularJS prevents animation during the bootstrap
             * of the application, we can't animate the top-level container;
             * but, since we added "ngAnimateChildren", we can animated the
             * inner container during this phase.
             * --
             * NOTE: Am using .eq(1) so that we don't animate the Style block.
             *
             * @param {Object} scope      The scope for this directive.
             * @param {Object} element    The parent element from the DOM tree.
             * @param {Object} attributes Object with the attributes of the
             *                            element.
             */
            var link = function (scope, element, attributes) {

                $animate.leave(element.children().eq(1)).then(
                    function cleanupAfterAnimation() {
                        element.remove();
                        scope = element = attributes = null;
                    }
                );

            };

            return ({
                link: link,
                restrict: "C"
            });

    }]);;/*
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

angular.module('snAboutDirective', ['ngMaterial'])
    .controller('snAboutDlgCtrl', ['$scope', '$mdDialog',

        /**
         * Controller function for handling the SatNet about dialog itself.
         *
         * @param {Object} $scope $scope for the controller.
         */
        function ($scope, $mdDialog) {

            /**
             * Function that closes the dialog.
             */
            $scope.closeDialog = function () {
                $mdDialog.hide();
            };

        }

    ])
    .controller('snAboutCtrl', ['$scope', '$mdDialog',

        /**
         * Controller function for opening the SatNet About dialog.
         *
         * @param {Object} $scope    $scope for the controller.
         * @param {Object} $mdDialog Angular material Dialog service.
         */
        function ($scope, $mdDialog) {

            /**
             * Function that opens the dialog when the snAbout button is
             * clicked.
             */
            $scope.openSnAbout = function () {
                $mdDialog.show({
                    templateUrl: 'common/templates/sn-about-dialog.html'
                });
            };

        }

    ])
    .directive('snAbout',

        /**
         * Function that creates the directive itself returning the object
         * required by Angular.
         *
         * @returns {Object} Object directive required by Angular, with
         *                   restrict and templateUrl.
         */
        function () {
            'use strict';

            return {
                restrict: 'E',
                templateUrl: 'common/templates/sn-about.html'
            };

        }

    );;/**
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
 * Created by rtubio on 15/05/15.
 */

angular.module('snMapDirective', ['leaflet-directive', 'snMapServices'])
    .controller('MapCtrl', ['$scope', 'mapServices', 'ZOOM',

        /**
         * Main controller for the map directive. It should be in charge of all
         * the additional controls and/or objects that are overlayed over the
         * original map. The main control of the map should be written in
         * re-usable functions within the 'mapServices' object.
         *
         * @param {Object} $scope      $scope for the controller.
         * @param {Object} mapServices Service with the custom functions to
         *                             control the maps object.
         */
        function ($scope, mapServices, ZOOM) {
            'use strict';

            $scope.center = {};
            $scope.markers = {};
            $scope.layers = {
                baselayers: {},
                overlays: {}
            };

            /**
             * Function that handles the initialization of the map.
             */
            $scope.init = function () {
                $scope.map = mapServices.createTerminatorMap(true);
                mapServices.autocenterMap($scope, ZOOM);
            };

        }
    ])
    .directive('snMap',

        /**
         * Function that creates the directive itself returning the object
         * required by Angular.
         *
         * @returns {Object} Object directive required by Angular, with
         *                   restrict and templateUrl.
         */
        function () {
            'use strict';

            return {
                restrict: 'E',
                templateUrl: 'common/templates/sn-map.html'
            };

        }

    );;/**
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
 * Created by rtubio on 15/05/15.
 */

/** Module definition (empty array is vital!). */
angular.module('snMapServices', [
    'satnetServices',
    'leaflet-directive'
])
    .constant('T_OPACITY', 0.125)
    .constant('LAT', 37.7833)
    .constant('LNG', -122.4167)
    .constant('MIN_ZOOM', 2)
    .constant('MAX_ZOOM', 12)
    .constant('ZOOM', 7)
    .service('mapServices', [
        '$q', 'leafletData', 'satnetRPC',
        'MIN_ZOOM', 'MAX_ZOOM', 'ZOOM', 'T_OPACITY',

        /**
         * Function to construct the services provided by this module.
         *
         * @param   {Object}   $q          $q angular service.
         * @param   {Object}   leafletData Object to access to the Leaflet
         *                               map properties.
         * @param   {Object}   satnetRPC   Object with the RPC services
         *                               of the SatNet network.
         * @param   {Number}   MIN_ZOOM    Minimum value for the zoom.
         * @param   {Number}   MAX_ZOOM    Maximum value for the zoom.
         * @param   {Number}   ZOOM        Default value of the zoom over.
         * @param   {Number} T_OPACITY   Default opacity of the layers.
         */
        function (
            $q, leafletData, satnetRPC,
            MIN_ZOOM, MAX_ZOOM, ZOOM, T_OPACITY
        ) {

            'use strict';

            /**
             * Returns the mapInfo structure for the rest of the chained
             * promises.
             * 
             * @returns {*} Promise that returns the mapInfo structure with
             *               a reference to the Leaflet map object.
             */
            this.getMainMap = function () {
                return leafletData.getMap('mainMap').then(function (m) {
                    return {
                        map: m
                    };
                });
            };

            /**
             * Redraws the Terminator to its new position.
             * 
             * @returns {*} Promise that returns the updated Terminator object.
             * @private
             */
            this._updateTerminator = function (t) {
                var t2 = L.terminator();
                t.setLatLngs(t2.getLatLngs());
                t.redraw();
                return t;
            };

            /**
             * Creates the main map and adds a terminator for the illuminated
             * surface of the Earth.
             * 
             * @returns {*} Promise that returns the mapInfo object
             *               {map, terminator}.
             */
            this.createTerminatorMap = function () {
                var update_function = this._updateTerminator;
                return this.getMainMap().then(function (mapInfo) {
                    var t = L.terminator({
                        fillOpacity: T_OPACITY
                    });
                    t.addTo(mapInfo.map);
                    mapInfo.terminator = t;
                    setInterval(function () {
                        update_function(t);
                    }, 500);
                    return mapInfo;
                });
            };

            /**
             * Creates a map centered at the estimated user position.
             *
             * @param scope $scope to be configured
             * @param zoom Zoom level
             * @returns {ng.IPromise<{empty}>|*}
             */
            this.autocenterMap = function (scope, zoom) {
                var self = this;
                return satnetRPC.getUserLocation().then(function (location) {
                    self.configureMap(
                        scope,
                        location.latitude,
                        location.longitude,
                        zoom
                    );
                });
            };

            /**
             * Creates a map centered at the position of the given Ground
             * Station.
             *
             * @param scope $scope to be configured
             * @param identifier Identifier of the GroundStation
             * @param zoom Zoom level
             * @returns {ng.IPromise<{}>|*}
             */
            this.centerAtGs = function (scope, identifier, zoom) {
                var self = this;
                return satnetRPC.rCall('gs.get', [identifier])
                    .then(function (cfg) {
                        self.configureMap(
                            scope,
                            cfg.groundstation_latlon[0],
                            cfg.groundstation_latlon[1],
                            zoom
                        );
                        return cfg;
                    });
            };

            /**
             * Configures the given scope variable to correctly hold a map. It
             * zooms with the provided level, at the center given through the
             * latitude and longitude parameters. It also adds a draggable
             * marker at the center of the map.
             *
             * @param scope Scope to be configured (main variables passed as
             *              instances to angular-leaflet should have been
             *              already created, at least, as empty objects before
             *              calling this function)
             * @param latitude Latitude of the map center
             * @param longitude Longitude of the map center
             * @param zoom Zoom level
             */
            this.configureMap = function (scope, latitude, longitude, zoom) {

                scope.center = {
                    lat: latitude,
                    lng: longitude,
                    zoom: zoom,
                };
                scope.markers = {
                    gs: {
                        lat: latitude,
                        lng: longitude,
                        focus: true,
                        draggable: false,
                        icon: {
                            iconUrl: '/images/user.png',
                            iconSize: [15, 15]
                        },
                        label: {
                            message: 'Drag me!',
                            options: {
                                noHide: true
                            }
                        }
                    }
                };

                scope.layers.baselayers = this.getBaseLayers();
                scope.layers.overlays = this.getOverlays();

            };

            /**
             * Returns the base layers in the format required by the Angular
             * Leaflet plugin.
             *
             * @returns Object with the baselayers indexed by their names.
             */
            this.getBaseLayers = function () {
                return {
                    esri_baselayer: {
                        name: 'ESRI Base Layer',
                        type: 'xyz',
                        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
                        layerOptions: {
                            noWrap: false,
                            continuousWorld: false,
                            minZoom: MIN_ZOOM,
                            maxZoom: MAX_ZOOM,
                            attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
                        }
                    },
                    osm_baselayer: {
                        name: 'OSM Base Layer',
                        type: 'xyz',
                        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        layerOptions: {
                            noWrap: false,
                            continuousWorld: false,
                            minZoom: MIN_ZOOM,
                            maxZoom: MAX_ZOOM,
                            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        }
                    }
                };
            };

            /**
             * Returns the OSM baselayer for Angular Leaflet.
             *
             * @returns Object with the baselayers indexed by their names.
             */
            this.getOSMBaseLayer = function () {
                return {
                    osm_baselayer: {
                        name: 'OSM Base Layer',
                        type: 'xyz',
                        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        layerOptions: {
                            noWrap: true,
                            continuousWorld: false,
                            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        }
                    }
                };
            };

            /**
             * Returns the overlays in the format required by the Angular
             * Leaflet plugin.
             *
             * @returns Object with the overlays indexed by their names
             */
            this.getOverlays = function () {
                return {
                    oms_admin_overlay: {
                        name: 'Administrative Boundaries',
                        type: 'xyz',
                        url: 'http://openmapsurfer.uni-hd.de/tiles/adminb/x={x}&y={y}&z={z}',
                        visible: true,
                        layerOptions: {
                            noWrap: true,
                            continuousWorld: false,
                            minZoom: MIN_ZOOM,
                            maxZoom: MAX_ZOOM,
                            attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        }
                    },
                    hydda_roads_labels_overlay: {
                        name: 'Roads and Labels',
                        type: 'xyz',
                        url: 'http://{s}.tile.openstreetmap.se/hydda/roads_and_labels/{z}/{x}/{y}.png',
                        layerOptions: {
                            noWrap: true,
                            continuousWorld: false,
                            minZoom: MIN_ZOOM,
                            maxZoom: MAX_ZOOM,
                            attribution: 'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        }
                    },
                    stamen_toner_labels_overlay: {
                        name: 'Labels',
                        type: 'xyz',
                        url: 'http://{s}.tile.stamen.com/toner-labels/{z}/{x}/{y}.png',
                        layerOptions: {
                            noWrap: true,
                            continuousWorld: false,
                            minZoom: MIN_ZOOM,
                            maxZoom: MAX_ZOOM,
                            subdomains: 'abcd',
                            attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        }
                    },
                    owm_rain_overlay: {
                        name: 'Rain',
                        type: 'xyz',
                        url: 'http://{s}.tile.openweathermap.org/map/rain/{z}/{x}/{y}.png',
                        layerOptions: {
                            noWrap: true,
                            continuousWorld: false,
                            minZoom: MIN_ZOOM,
                            maxZoom: MAX_ZOOM,
                            opacity: 0.325,
                            attribution: 'Map data &copy; <a href="http://openweathermap.org">OpenWeatherMap</a>'
                        }
                    },
                    owm_temperature_overlay: {
                        name: 'Temperature',
                        type: 'xyz',
                        url: 'http://{s}.tile.openweathermap.org/map/temp/{z}/{x}/{y}.png',
                        layerOptions: {
                            noWrap: true,
                            continuousWorld: false,
                            minZoom: MIN_ZOOM,
                            maxZoom: MAX_ZOOM,
                            attribution: 'Map data &copy; <a href="http://openweathermap.org">OpenWeatherMap</a>'
                        }
                    }
                };
            };

            /**
             * Returns a string with the data from a MapInfo like structure.
             *
             * @param   {Object} mapInfo The structure to be printed out.
             * @returns {String} Human-readable representation (string).
             */
            this.asString = function (mapInfo) {
                return 'mapInfo = {' +
                    '"center": ' + JSON.stringify(mapInfo.center) + ', ' +
                    '"terminator": ' + mapInfo.terminator + ', ' +
                    '"map": ' + mapInfo.map +
                    '}';
            };

    }
]);;/**
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

/** Module definition (empty array is vital!). */
angular
    .module('satnetServices', ['jsonrpc'])
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
            'use strict';

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

            this._services = {
                // Configuration methods (Ground Stations)
                'gs.list': this._configuration
                    .createMethod('gs.list'),
                'gs.add': this
                    ._configuration.createMethod('gs.create'),
                'gs.get': this._configuration
                    .createMethod('gs.getConfiguration'),
                'gs.update': this._configuration
                    .createMethod('gs.setConfiguration'),
                'gs.delete': this._configuration
                    .createMethod('gs.delete'),
                // Configuration methods (Spacecraft)
                'sc.list': this._configuration
                    .createMethod('sc.list'),
                'sc.add': this._configuration
                    .createMethod('sc.create'),
                'sc.get': this._configuration
                    .createMethod('sc.getConfiguration'),
                'sc.update': this._configuration
                    .createMethod('sc.setConfiguration'),
                'sc.delete': this._configuration
                    .createMethod('sc.delete'),
                // User configuration
                'user.getLocation': this._configuration
                    .createMethod('user.getLocation'),
                // TLE methods
                'tle.celestrak.getSections': this._configuration
                    .createMethod('tle.celestrak.getSections'),
                'tle.celestrak.getResource': this._configuration
                    .createMethod('tle.celestrak.getResource'),
                'tle.celestrak.getTle': this._configuration
                    .createMethod('tle.celestrak.getTle'),
                // Simulation methods
                'sc.getGroundtrack': this._simulation
                    .createMethod('spacecraft.getGroundtrack'),
                'sc.getPasses': this._simulation
                    .createMethod('spacecraft.getPasses'),
                'gs.getPasses': this._simulation
                    .createMethod('groundstation.getPasses'),
                // LEOP services
                'leop.getCfg': this._leop
                    .createMethod('getConfiguration'),
                'leop.setCfg': this._leop
                    .createMethod('setConfiguration'),
                'leop.getPasses': this._leop
                    .createMethod('getPasses'),
                'leop.gs.list': this._leop
                    .createMethod('gs.list'),
                'leop.sc.list': this._leop
                    .createMethod('sc.list'),
                'leop.gs.add': this._leop
                    .createMethod('gs.add'),
                'leop.gs.remove': this._leop
                    .createMethod('gs.remove'),
                'leop.ufo.add': this._leop
                    .createMethod('launch.addUnknown'),
                'leop.ufo.remove': this._leop
                    .createMethod('launch.removeUnknown'),
                'leop.ufo.identify': this._leop
                    .createMethod('launch.identify'),
                'leop.ufo.forget': this._leop
                    .createMethod('launch.forget'),
                'leop.ufo.update': this._leop
                    .createMethod('launch.update'),
                'leop.getMessages': this._leop
                    .createMethod('getMessages'),
                // NETWORK services
                'net.alive': this._network
                    .createMethod('keepAlive')
            };

            /**
             * PRIVATE function that is used only by this service in order to
             * generate in the same way all possible errors produced by the
             * remote invokation of the SatNet services.
             *
             * @param {String} service Name of the SatNet JRPC service that
             *                         has just been invoked.
             * @param {Array}  params  Array with the parameters for the
             *                         service to be invoked.
             * @param {String} code    Error code.
             * @param {String} message Messsage description.
             */
            this._generateError = function (service, params, code, message) {

                var msg = '[satnetRPC] Error invoking = <' + service +
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
             * services name definition.
             * @param params The parameters for the service (as an array).
             * @returns {*}
             */
            this.rCall = function (service, params) {
                var error_fn = this._generateError;

                if ((this._services.hasOwnProperty(service)) === false) {
                    throw '[satnetRPC] service not found, id = <' +
                    service + '>';
                }
                $log.info(
                    '[satnetRPC] Invoked service = <' + service + '>' +
                    ', params = ' + JSON.stringify(params)
                );
                return this._services[service](params).then(

                    function (data) {
                        // TODO Workaround for the JSON-RPC library.
                        if (data.data.name === 'JSONRPCError') {
                            error_fn(service, params, data.code, data.message);
                        }
                        return data.data;
                    },
                    function (error) {
                        error_fn(service, params, 'NONE', error);
                    }

                );
            };

            /**
             * Retrieves the user location using an available Internet service.
             *
             * @returns Promise that returns a { latitude, longitude } object.
             */
            this.getUserLocation = function () {
                var url = this._getSatNetAddress() + '/configuration/user/geoip';
                return $http.get(url).then(function (data) {
                    $log.info('[satnet] user@(' + JSON
                        .stringify(data.data) + ')');
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
             * @returns Promise that returns a { latitude, longitude } object.
             */
            this.getServerLocation = function (hostname) {
                return $http
                    .post('/configuration/hostname/geoip', {
                        'hostname': hostname
                    })
                    .then(function (data) {
                        $log.info(
                            '[satnet] server name = ' + hostname + '@(' + JSON
                            .stringify(data.data) + ')'
                        );
                        return {
                            latitude: parseFloat(data.data.latitude),
                            longitude: parseFloat(data.data.longitude)
                        };
                    });
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

            /**
             * Reads the configuration for all the GroundStations associated
             * with this LEOP cluster.
             * 
             * @param leop_id Identifier of the LEOP cluster.
             * @returns {*} { leop_gs_available: [gs_cfg], leop_gs_inuse: [gs_cfg]}
             */
            this.readAllLEOPGS = function (leop_id) {
                var self = this;
                return this.rCall('leop.gs.list', [leop_id])
                    .then(function (gss) {
                        var p = [];
                        angular.forEach(gss.leop_gs_available, function (gs) {
                            p.push(self.rCall('gs.get', [gs]));
                        });
                        angular.forEach(gss.leop_gs_inuse, function (gs) {
                            p.push(self.rCall('gs.get', [gs]));
                        });
                        return $q.all(p).then(function (results) {
                            var a_cfgs = [],
                                u_cfgs = [],
                                j, r_j, r_j_id;
                            for (j = 0; j < results.length; j += 1) {
                                r_j = results[j];
                                r_j_id = r_j.groundstation_id;
                                if (gss.leop_gs_available.indexOf(r_j_id) >= 0) {
                                    a_cfgs.push(r_j);
                                } else {
                                    u_cfgs.push(r_j);
                                }
                            }
                            return {
                                leop_gs_available: a_cfgs,
                                leop_gs_inuse: u_cfgs
                            };
                        });
                    });
            };

    }]);;/**
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

/** Module definition (empty array is vital!). */
angular.module('pushServices', ['pusher-angular']);

/**
 * Service that defines the basic calls to the services of the SATNET network
 * through JSON RPC. It defines a common error handler for all the errors that
 * can be overriden by users.
 */
angular.module('pushServices').service('satnetPush', [
    '$log', '$pusher',
    function ($log, $pusher) {
        'use strict';

        this._API_KEY = '79bee37791b6c60f3e56';

        this._client = null;
        this._service = null;

        // Names of the channels for subscription
        this.LEOP_DOWNLINK_CHANNEL = 'leop.downlink.ch';
        this.EVENTS_CHANNEL = 'configuration.events.ch';
        this.NETWORK_EVENTS_CHANNEL = 'network.events.ch';
        this.SIMULATION_CHANNEL = 'simulation.events.ch';
        this.LEOP_CHANNEL = 'leop.events.ch';
        // List of events that an application can get bound to.
        this.KEEP_ALIVE = 'keep_alive';
        this.FRAME_EVENT = 'frameEv';
        this.GS_ADDED_EVENT = 'gsAddedEv';
        this.GS_REMOVED_EVENT = 'gsRemovedEv';
        this.GS_UPDATED_EVENT = 'gsUpdatedEv';
        this.PASSES_UPDATED_EVENT = 'passesUpdatedEv';
        this.GT_UPDATED_EVENT = 'groundtrackUpdatedEv';
        this.LEOP_GSS_UPDATED_EVENT = 'leopGSsUpdatedEv';
        this.LEOP_GS_ASSIGNED_EVENT = 'leopGSAssignedEv';
        this.LEOP_GS_RELEASED_EVENT = 'leopGSReleasedEv';
        this.LEOP_UPDATED_EVENT = 'leopUpdatedEv';
        this.LEOP_UFO_IDENTIFIED_EVENT = 'leopUFOIdentifiedEv';
        this.LEOP_UFO_FORGOTTEN_EVENT = 'leopUFOForgottenEv';
        this.LEOP_SC_UPDATED_EVENT = 'leopSCUpdatedEv';

        // List of channels that the service automatically subscribes to.
        this._channel_names = [
            this.LEOP_DOWNLINK_CHANNEL,
            this.EVENTS_CHANNEL,
            this.SIMULATION_CHANNEL,
            this.NETWORK_EVENTS_CHANNEL,
            this.LEOP_CHANNEL
        ];

        /**
         * Initializes the pusher service.
         */
        this._initData = function () {

            this._client = new Pusher(this._API_KEY, {
                encrypted: true
            });
            this._service = $pusher(this._client);
            this._service.connection.bind('state_change', this._logConnection);
            $log.info('[push] pusher.com service initialized!');

            this._subscribeChannels();

        };

        /**
         * Logs changes in the connection state for the pusher service.
         *
         * @param {Array} states Array with the former and current state of the
         *                       connection.
         */
        this._logConnection = function (states) {
            $log.warn(
                '[push] State connection change, states = ' +
                JSON.stringify(states)
            );
        };

        /**
         * Subscribe this service to all the channels whose names are part of
         * the "_channel_names_ array.
         */
        this._subscribeChannels = function () {
            var self = this;
            angular.forEach(this._channel_names, function (name) {
                self._service.subscribe(name);
                $log.info('[push] Subscribed to channel <' + name + '>');
            });
        };

        /**
         * Method that binds the given function to the events triggered by
         * that channel.
         *
         * @param {String} channel_name Name of the channel
         * @param {String} event_name Name of the event
         * @param {Function} callback_fn Function to be executed when that
         *                               event happens
         */
        this.bind = function (channel_name, event_name, callback_fn) {
            if (!this._service.allChannels().hasOwnProperty(channel_name)) {
                throw 'Not subscribed to this channel, ' +
                'name = <' + channel_name + '>';
            }
            this._service.channel(channel_name).bind(event_name, callback_fn);
        };

        /**
         * Binds the given callback function to the reception of any event
         * frames on the downlink channel.
         *
         * @param {Object} callback_fn Callback function to be bound
         */
        this.bindFrameReceived = function (callback_fn) {
            this.bind(
                this.LEOP_DOWNLINK_CHANNEL,
                this.FRAME_EVENT,
                callback_fn,
                this
            );
        };

        this._initData();

    }

]);;/*
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

        $scope.groundStations = [];

        /**
         * Function that triggers the opening of a window to add a new ground
         * station into the system.
         */
        $scope.addGsMenu = function () {};

        /**
         * Function that refreshes the list of registered ground stations.
         */
        $scope.refresh = function () {
            satnetRPC.rCall('gs.list', []).then(function (results) {
                if (results !== null) {
                    $scope.groundStations = results.slice(0);
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

]);;/*
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

var opsMenuCtrlModule = angular.module(
    'operationsMenuControllers', [
        'ngMaterial'
    ]
);

opsMenuCtrlModule.controller('OperationsMenuCtrl', [
    '$scope', '$mdSidenav', '$mdDialog',

    /**
     * Controller of the menu for the Operations application. It creates a
     * function bound to the event of closing the menu that it controls and
     * a flag with the state (open or closed) of that menu.
     * @param   {Object} $scope Controller execution scope.
     * @param   {Object} $mdSidenav Side mane service from Angular Material.
     */
    function ($scope, $mdSidenav, $mdDialog) {

        /**
         * Handler to close the menu that actually takes the user out of the
         * application.
         */
        $scope.close = function () {
            $mdSidenav("menu").close();
        };

        /**
         * Handler to open the dialog for managing the ground stations.
         */
        $scope.showGsMenu = function () {
            $mdDialog.show({
                templateUrl: 'operations/templates/gslist-dialog.html'
            });
        };

    }

]);;/*
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

angular.module('operationsDirective', [
        'ngMaterial',
        'ngAnimate',
        'leaflet-directive',
        'splashDirective',
        'snAboutDirective',
        'snMapDirective',
        'operationsMenuControllers',
        'gsControllers'
    ]).config(function ($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('blue-grey')
            .accentPalette('grey');
    })
    .controller('OperationsAppCtrl',

        /**
         * Main controller for the Operations application.
         * @param   {Object}   $scope       Controller execution scope.
         * @param   {Object}   $mdSidenav   Side mane service from Angular
         *                                  Material.
         */
        function ($scope, $mdSidenav) {

            /**
             * Handler to toggle the menu on and off. It is based on the
             * $mdSidenav service provided by Angular Material. Its main
             * objective is to provide a button overlayed over the map so that
             * in case the menu is hidden (due to the small size of the screen),
             * the menu can still be shown.
             */
            $scope.toggleMenu = function () {
                $mdSidenav("menu").toggle();
            };

        })
    .directive('operationsApp',

        /**
         * Function that creates the directive itself returning the
         * object required by Angular.
         *
         * @returns {Object} Object directive required by Angular,
         *                   with restrict and templateUrl.
         */
        function () {

            return {
                restrict: 'E',
                templateUrl: 'operations/templates/operations-app.html'
            };

        }

    );