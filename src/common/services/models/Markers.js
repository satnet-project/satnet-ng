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

/** Module definition (empty array is vital!). */
angular
    .module('snMarkerServices', [
        'snMapServices'
    ]);

/**
 * eXtended GroundStation models. Services built on top of the satnetRPC
 * service and the basic GroundStation models.
 */
angular.module('snMarkerServices')
    .constant('_RATE', 1)
    .constant('_SIM_DAYS', 1)
    .constant('_GEOLINE_STEPS', 1)
    .service('markers', [
        '$log',
        'mapServices', 'LAT', 'LNG', 'ZOOM',
        '_SIM_DAYS', '_GEOLINE_STEPS',

        /**
         * Service that provides the basic functions for handling the markers
         * over the Leaflet map. In order to add new markers, update or remove
         * the ones on the map, the functions provided by this service must be
         * used. They automatically handle additional features like the
         * addition of the connection lines among Ground Stations and Servers,
         * or the labels for each of the markers.
         *
         * @param   {Object}        $log           Angular logging service
         * @param   {Object}        mapServices    SatNet map services
         * @param   {Number}        _SIM_DAYS      Number of days for the
         *                                       simulation
         * @param   {Number}        _GEOLINE_STEPS Number of steps for each of
         *                                       the GeoLines
         * @returns {Object|String} Object that provides this service
         */
        function ($log, mapServices, LAT, LNG, ZOOM, _SIM_DAYS, _GEOLINE_STEPS) {

            /******************************************************************/
            /****************************************************** MAP SCOPE */
            /******************************************************************/

            // Structure that holds a reference to the map and to the
            // associated structures.
            this._mapInfo = {};
            // Scope where the leaflet angular pluing has its variables.
            this._mapScope = null;

            /**
             * Returns the current scope to which this markers service is bound
             * to.
             * @returns {null|*} The _mapScope object.
             */
            this.getScope = function () {
                if (this._mapScope === null) {
                    throw '<_mapScope> has not been set.';
                }
                return this._mapScope;
            };

            /**
             * Configures the scope of the Map controller to set the variables
             * for the angular-leaflet plugin.
             *
             * @param scope Scope ($scope) of the controller for the
             *              angular-leaflet plugin.
             */
            this.configureMapScope = function (scope) {

                this._mapScope = scope;

                angular.extend(
                    this._mapScope, {
                        center: {
                            lat: LAT,
                            lng: LNG,
                            zoom: ZOOM
                        },
                        layers: {
                            baselayers: {},
                            overlays: {}
                        },
                        markers: {},
                        paths: {},
                        maxbounds: {}
                    }
                );
                angular.extend(
                    this._mapScope.layers.baselayers,
                    mapServices.getBaseLayers()
                );
                angular.extend(
                    this._mapScope.layers.overlays,
                    mapServices.getOverlays()
                );
                angular.extend(
                    this._mapScope.layers.overlays,
                    this.getOverlays()
                );

                var mapInfo = this._mapInfo;
                mapServices.createTerminatorMap(true).then(function (data) {
                    $log.log(
                        'markers.js@configureMapScope: Created map = <' +
                        mapServices.asString(data) + '>'
                    );
                    angular.extend(mapInfo, data);
                    return mapInfo;
                });

            };

            /******************************************************************/
            /**************************************************** MARKER KEYS */
            /******************************************************************/

            this._KEY_HEADER = 'MK'; // "MK" stands for "marker key"
            this._key_number = 0;

            /**
             * Dictionary that contains the relation between the identifiers
             * of the objects and the keys for the markers that represent those
             * objects.
             *
             * @type {{}}
             */
            this._ids2keys = {};

            /**
             * Creates a new key for the given identifier and adds it to the
             * dictionary of identifiers and keys.
             *
             * @param identifier Identifier of the marker.
             * @returns {string} Key for accessing to the marker.
             */
            this.createMarkerKey = function (identifier) {

                if (this._ids2keys[identifier] !== undefined) {
                    return this.getMarkerKey(identifier);
                }

                var key = this._KEY_HEADER + this._key_number;
                this._key_number += 1;
                this._ids2keys[identifier] = key;
                return key;

            };

            /**
             * Returns the key for the given object that holds a marker.
             *
             * @param identifier Identifier of the object
             * @returns {string} Key for accessing to the marker
             */
            this.getMarkerKey = function (identifier) {
                if (this._ids2keys.hasOwnProperty(identifier) === false) {
                    throw '@getMarkerKey: No key for <' + identifier + '>';
                }
                return this._ids2keys[identifier];
            };

            /**
             * Returns the marker for the server, in case it exists!
             *
             * @param gs_identifier Identifier of the GroundStation object that
             *                      is bound to the server
             * @returns {null|*} String with the key for the marker of the
             *                      server
             */
            this.getServerMarker = function (gs_id) {
                if (this._serverMarkerKey === null) {
                    throw '@getServerMarker: no server defined for <' + gs_id +
                        '>';
                }
                return this.getScope().markers[this._serverMarkerKey];
            };

            /**
             * Returns the marker for the object with the given identifier.
             *
             * @param identifier Identifier of the object, which can be either
             *                      a GroundStation, a Spacecraft or a Server
             * @returns {*} Marker object
             */
            this.getMarker = function (identifier) {
                return this.getScope().markers[this.getMarkerKey(identifier)];
            };

            /**
             * Returns the overlays to be included as markerclusters within
             * the map.
             *
             * @return Object   Object to configure the overlays of the $scope
             *                      with the overlays
             */
            this.getOverlays = function () {
                return {
                    network: {
                        name: 'Network',
                        type: 'markercluster',
                        visible: true
                    },
                    groundstations: {
                        name: 'Ground Stations',
                        type: 'markercluster',
                        visible: true
                    }
                    /* TODO Native angular-leaflet support for MovingMarker
                    spacecraft: {
                        name: 'Spacecraft',
                        type: 'markercluster',
                        visible: true
                    }
                    */
                };
            };

            /**
             * This function pans the map to the point given by the provided
             * latitude and longitude.
             *
             * @param   {Object} latlng Leaflet LatLng object type
             * @returns {Object} $promise that returns the given Leaflet LatLNg
             *                   object where the map has been panned to, once
             *                   the panning process is over
             */
            this.panTo = function (latlng) {
                if (!latlng) {
                    throw '@panTo: no LatLng object provided';
                }

                return mapServices.getMainMap().then(function (mapInfo) {
                    mapInfo.map.panTo(latlng, {
                        animate: true
                    });
                    return latlng;
                });

            };

            /******************************************************************/
            /***************************************** NETWORK SERVER MARKERS */
            /******************************************************************/

            this._serverMarkerKey = null;

            /**
             * Creates a new marker for the given Network Server.
             * @param {String} id Identifier of the server.
             * @param {Number} latitude Server's estimated latitude.
             * @param {Number} longitude Server's estimated longitude.
             *
             * TODO Check possible bug: when 'noHide = false', once the layer
             * TODO is removed, the label does not appear again when the mouse
             * TODO is over the icon.
             */
            this.createServerMarker = function (id, latitude, longitude) {
                this._serverMarkerKey = this.createMarkerKey(id);
                this.getScope().markers[this._serverMarkerKey] = {
                    lat: latitude,
                    lng: longitude,
                    focus: true,
                    draggable: false,
                    layer: 'network',
                    icon: {
                        iconUrl: '/images/server-icon-3.svg',
                        iconSize: [15, 15]
                    },
                    label: {
                        message: id,
                        options: {
                            noHide: true
                        }
                    },
                    groundstations: [],
                    identifier: id
                };
                return id;
            };

            /******************************************************************/
            /***************************************** GROUND STATION MARKERS */
            /******************************************************************/

            /**
             * Creates a unique identifier for the connector of this
             * GroundStation and the Standalone network server.
             *
             * @param gs_identifier Identifier of the GroundStation object.
             * @returns {string} Identifier for the connector.
             */
            this.createConnectorIdentifier = function (gs_identifier) {
                if (!gs_identifier) {
                    throw 'No identifier provided';
                }
                var server_marker = this.getServerMarker(gs_identifier);
                return 'connect:' + gs_identifier + '_2_' +
                    server_marker.identifier;
            };

            /* TODO The structure for modelling what server owns each
             * GroundStation has already started to be implemented. In the
             * 'this.servers' dictionary, each entry has a field called
             * 'groundstations' that enables the correct modelling of the
             * network. Right now, the first server is always chosen and all
             * the GroundStations are bound to it. In the future, each time a
             * GroundStation is added, the server that it belongs to should be
             * specified and used accordingly.
             */

            /**
             * This function creates a connection line object to be draw on the
             * map in between the provided Server and the Ground Station
             * objects.
             *
             * @param {Object} gs_identifier Identifier of the GroundStation
             *                                  object.
             * @returns {*} L.polyline object
             */
            this.createGSConnector = function (gs_identifier) {
                if (!gs_identifier) {
                    throw '@createGSConnector: no GS identifier provided';
                }

                var s_marker = this.getServerMarker(gs_identifier),
                    g_marker = this.getMarker(gs_identifier),
                    c_id = this.createConnectorIdentifier(gs_identifier),
                    c_key,
                    r = {};

                c_key = this.createMarkerKey(c_id);
                r[c_key] = {
                    // FIXME Path removal if added as a layer
                    // layer: 'network',
                    // color: '#A52A2A',
                    color: 'gray',
                    type: 'polyline',
                    weight: 3,
                    opacity: 0.5,
                    latlngs: [s_marker, g_marker],
                    identifier: c_id
                };

                angular.extend(this.getScope().paths, r);
                return c_id;

            };

            /**
             * Pans the current view of the map to the coordinates of the
             * marker for the given groundstation.
             *
             * @param groundstation_id Identifier of the groundstation
             */
            this.panToGSMarker = function (groundstation_id) {
                if (!groundstation_id) {
                    throw '@panToGSMarker: no GS identifier provided';
                }

                var marker = this.getMarker(groundstation_id),
                    m_ll = new L.LatLng(marker.lat, marker.lng);
                return this.panTo(m_ll);
            };

            /**
             * Creates a new marker object for the given GroundStation.
             *
             * @param cfg The configuration of the GroundStation.
             * @returns Angular leaflet marker.
             */
            this.createUnconnectedGSMarker = function (cfg) {
                var id = cfg.groundstation_id,
                    marker_key = this.createMarkerKey(id);

                this.getScope().markers[marker_key] = {
                    lat: cfg.groundstation_latlon[0],
                    lng: cfg.groundstation_latlon[1],
                    focus: true,
                    draggable: false,
                    layer: 'groundstations',
                    icon: {
                        iconUrl: '/images/gs-icon.svg',
                        iconSize: [15, 15]
                    },
                    label: {
                        message: cfg.groundstation_id,
                        options: {
                            noHide: true
                        }
                    },
                    identifier: id
                };

                return id;

            };

            /**
             * Creates a new marker object for the given GroundStation, adding
             * the connector to the server.
             *
             * @param cfg The configuration of the GroundStation.
             * @returns Angular leaflet marker.
             */
            this.createGSMarker = function (cfg) {

                var id = cfg.groundstation_id;
                this.createUnconnectedGSMarker(cfg);
                this.createGSConnector(id);
                return id;

            };

            /**
             * Updates the configuration for the markers of the given
             * GroundStation object.
             *
             * @param cfg New configuration of the object.
             * @returns {cfg.groundstation_id|*} Identifier.
             */
            this.updateGSMarker = function (cfg) {
                if (cfg === null) {
                    throw '@updateGSMarker, wrong <cfg>';
                }

                var new_lat = cfg.groundstation_latlon[0],
                    new_lng = cfg.groundstation_latlon[1],
                    marker = this.getMarker(cfg.groundstation_id);

                if (marker.lat !== new_lat) {
                    marker.lat = new_lat;
                }
                if (marker.lng !== new_lng) {
                    marker.lng = new_lng;
                }

                return cfg.groundstation_id;

            };

            /**
             * Removes the connector for the given gs_marker (if it exists).
             *
             * @param identifier Identifier of the gs_marker
             */
            this.removeGSConnector = function (identifier) {
                var p_key = this.getMarkerKey(
                    this.createConnectorIdentifier(identifier)
                );
                if (this.getScope().paths.hasOwnProperty(p_key)) {
                    delete this.getScope().paths[p_key];
                }
            };

            /**
             * Removes a given GroundStation marker, together with its
             * associated connector path to the server and with the identifier
             * within the servers lists of bounded GroundStations.
             *
             * @param identifier Identifier of the GroundStation whose markers
             *                      are going to be removed
             */
            this.removeGSMarker = function (identifier) {
                var m_key = this.getMarkerKey(identifier);
                delete this.getScope().markers[m_key];
                this.removeGSConnector(identifier);
            };

            /******************************************************************/
            /********************************************* SPACECRAFT MARKERS */
            /******************************************************************/

            this.sc = {};
            this.scLayers = L.layerGroup();
            this.trackLayers = L.layerGroup();

            this.scStyle = {
                autostart: true,
                draggable: false,
                icon: L.icon({
                    iconUrl: '/images/sc-icon.svg',
                    iconSize: [15, 15]
                })
            };

            this.trackStyle = {
                weight: 1,
                opacity: 0.725,
                steps: _GEOLINE_STEPS
            };

            this.colors = [
                //'#57EF1E', '#47DE2D', '#37CD3C', '#27BC4B', '#17AB5A'
                //'#00DFFC', '#00B4CC', '#008C9E', '#005F6B',
                '#00ABAF', '#74FF60', '#499F3C', '#2C6024'
                /*
                '#000033', '#003333', '#006633', '#009933', '#00CC33',
                '#00FF33', '#000066', '#003366', '#006666', '#009966',
                '#00CC66' '#00FF66'
                */
            ];
            this.color_n = 0;

            /**
             * Pans the current view of the map to the coordinates of the marker
             * for the given spacecraft.
             * @param spacecraft_id Identifier of the spacecraft
             */
            this.panToSCMarker = function (spacecraft_id) {

                if (!spacecraft_id) {
                    throw '@panToGSMarker: no SC identifier provided';
                }

                var sc_marker = this.sc[spacecraft_id],
                    m_ll = sc_marker.marker.getLatLng();
                return this.panTo(m_ll);

            };


            /**
             * Function that reads the RAW groundtrack from the server and
             * transforms it into a usable one for the JS client.
             *
             * @param groundtrack RAW groundtrack from the server
             * @returns {{durations: Array, positions: Array, geopoints: Array}}
             */
            this.readTrack = function (groundtrack) {

                var i, gt_i,
                    positions = [],
                    durations = [],
                    geopoints = [],
                    first = true,
                    valid = false,
                    t0 = Date.now() * 1000,
                    tf = moment().add(
                        _SIM_DAYS,
                        "days"
                    ).toDate().getTime() * 1000;

                if ((groundtrack === null) || (groundtrack.length === 0)) {
                    throw '@readTrack: empty groundtrack';
                }

                for (i = 0; i < groundtrack.length; i += 1) {

                    gt_i = groundtrack[i];

                    if (gt_i.timestamp < t0) {
                        continue;
                    }
                    if (gt_i.timestamp > tf) {
                        break;
                    }

                    positions.push([gt_i.latitude, gt_i.longitude]);
                    geopoints.push(new L.LatLng(gt_i.latitude, gt_i.longitude));

                    if (first === true) {
                        first = false;
                        continue;
                    }

                    durations.push(
                        (gt_i.timestamp - groundtrack[i - 1].timestamp) / 1000
                    );
                    valid = true;

                }

                if (valid === false) {
                    throw '@readTrack: invalid groundtrack';
                }

                return {
                    durations: durations,
                    positions: positions,
                    geopoints: geopoints
                };

            };

            /**
             * For a given Spacecraft configuration object, it creates the
             * marker for the spacecraft, its associated label and the
             * groundtrack.
             *
             * @param cfg Configuration object
             * @returns {{marker: L.Marker, track: L.polyline}}
             */
            this.createSCMarkers = function (cfg) {

                if (!cfg || !Object.keys(cfg).length) {
                    throw '@createSCMarkers: wrong cfg, no <spacecraft_id>';
                }

                var id = cfg.spacecraft_id,
                    gt,
                    mo = this.scStyle,
                    color = this.colors[this.color_n % this.colors.length];
                this.color_n += 1;
                this.trackStyle.color = color;
                gt = this.readTrack(cfg.groundtrack);

                return {
                    marker: L.Marker.movingMarker(
                        gt.positions,
                        gt.durations,
                        mo
                    ).bindLabel(id, {
                        noHide: true
                    }),
                    track: L.geodesic([gt.geopoints], this.trackStyle)
                };

            };

            /**
             * Adds the markers for the new Spacecraft, this is: the marker for
             * the Spacecraft itself (together with its associated label) and
             * associated groundtrack geoline.
             *
             * @param id Identifier of the Spacecraft
             * @param cfg Configuration for the Spacecraft
             * @returns {{
             *              id: String,
             *              cfg: Object,
             *              marker: m.L.Marker,
             *              track: m.L
             *          }}
             */
            this.addSC = function (id, cfg) {
                if (!id) {
                    throw '@addSC: wrong id';
                }
                if (this.sc.hasOwnProperty(id)) {
                    throw '@addSC: SC Marker already exists, id = ' + id;
                }

                var m = this.createSCMarkers(cfg);
                this.sc[id] = m;
                this.scLayers.addLayer(m.marker);
                this.trackLayers.addLayer(m.track);

                return mapServices.getMainMap().then(function (mapInfo) {
                    m.track.addTo(mapInfo.map);
                    m.marker.addTo(mapInfo.map);
                    return id;
                });

            };

            /**
             * Updates the configuration for a given Spacecraft object.
             *
             * @param id Identifier of the spacecraft.
             * @param cfg Object with the new configuration for the Spacecraft.
             * @returns {String} Identifier of the just-updated Spacecraft.
             */
            this.updateSC = function (id, cfg) {
                if (!id) {
                    throw '@removeSC: no id provided';
                }
                if (!this.sc.hasOwnProperty(id)) {
                    throw '@updateSC: marker <' + id + '> does not exist';
                }

                var self = this;
                this.removeSC(id).then(function (data) {
                    $log.log('@updateSC: marker <' + data + '> removed');
                    self.addSC(id, cfg).then(function (data) {
                        $log.log('@updateSC: marker <' + data + '> added');
                    });
                });

                return id;

            };

            /**
             * Removes all the markers associated with this Spacecraft object.
             *
             * @param id Identifier of the Spacecraft.
             * @returns {String} Spacecraft identifier.
             */
            this.removeSC = function (id) {
                if (!id) {
                    throw '@removeSC: no id provided';
                }
                if (!this.sc.hasOwnProperty(id)) {
                    throw '@removeSC: marker <' + id + '> does not exist';
                }

                var m = this.sc[id];
                this.scLayers.removeLayer(m.marker);
                this.trackLayers.removeLayer(m.track);
                delete this.sc[id];

                return mapServices.getMainMap().then(function (mapInfo) {
                    mapInfo.map.removeLayer(m.marker);
                    mapInfo.map.removeLayer(m.track);
                    return id;
                });

            };

        }
    ]);