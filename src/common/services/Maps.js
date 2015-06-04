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
]);