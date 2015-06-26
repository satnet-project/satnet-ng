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

describe('Testing Markers Service', function () {

    var markers, $rootScope, $q, $log,
        mapServices, LAT, LNG, ZOOM,
        mock__cookies = {},
        _RATE, _SIM_DAYS, _GEOLINE_STEPS;

    beforeEach(function () {

        module('snMarkerServices', 'snMapServices',
            function ($provide) {
                $provide.value('$cookies', mock__cookies);
            }
        );

        inject(function ($injector) {
            markers = $injector.get('markers');
            mapServices = $injector.get('mapServices');
            LAT = $injector.get('LAT');
            LNG = $injector.get('LNG');
            ZOOM = $injector.get('ZOOM');
            $rootScope = $injector.get('$rootScope');
            $q = $injector.get('$q');
            $log = $injector.get('$log');
            _RATE = $injector.get('_RATE');
            _SIM_DAYS = $injector.get('_SIM_DAYS');
            _GEOLINE_STEPS = $injector.get('_GEOLINE_STEPS');
        });

    });

    it('should define the required constants', function () {

        expect(_RATE).toBeDefined();
        expect(_RATE).toBe(1);
        expect(_SIM_DAYS).toBeDefined();
        expect(_SIM_DAYS).toBe(1);
        expect(_GEOLINE_STEPS).toBeDefined();
        expect(_GEOLINE_STEPS).toBe(1);

    });

    it('should allow access to the $scope where the map is', function () {

        var $fake_scope = $rootScope.$new();

        expect(function () {
            markers.getScope();
        }).toThrow('<_mapScope> has not been set.');

        markers.configureMapScope($fake_scope);
        expect(markers.getScope()).not.toBeNull();

    });

    it('should set the map configuration in the given $scope', function () {

        var $fake_scope = {}, x_scope = {};

        x_scope = {
            center: {
                lat: LAT, lng: LNG, zoom: ZOOM
            },
            layers: {
                baselayers: mapServices.getBaseLayers(),
                overlays: mapServices.getOverlays()
            },
            markers: {},
            paths: {},
            maxbounds: {}
        };

        x_scope.layers.overlays.network = {
            name: 'Network', type: 'markercluster', visible: true
        };
        x_scope.layers.overlays.groundstations = {
            name: 'Ground Stations', type: 'markercluster', visible: true
        };

        expect(markers.getOverlays())
            .toEqual({
                network : {
                    name: 'Network',
                    type: 'markercluster',
                    visible: true
                },
                groundstations: {
                    name: 'Ground Stations',
                    type: 'markercluster',
                    visible: true
                }
            });

        markers.configureMapScope($fake_scope);
        expect($fake_scope).toEqual(x_scope);

    });

    it('should manage the keys for the markers', function () {

        var test_id_1 = 'id_1', test_id_2 = 'id_2', test_id_3 = 'id_3',
            server_id = 'server_0', server_lat = '1.0', server_lng = '2.0',
            connector_1_id = '',
            $fake_scope = $rootScope.$new();

        expect(markers.createMarkerKey(test_id_1)).toEqual('MK0');
        expect(markers.createMarkerKey(test_id_1)).toEqual('MK0');
        expect(markers.createMarkerKey(test_id_2)).toEqual('MK1');
        expect(markers.createMarkerKey(test_id_2)).toEqual('MK1');

        expect(markers.getMarkerKey(test_id_1)).toEqual('MK0');
        expect(markers.getMarkerKey(test_id_2)).toEqual('MK1');

        expect(function () { markers.getMarkerKey(test_id_3); })
            .toThrow('No key for marker <id_3>');

        expect(function () { markers.getServerMarker(test_id_1); })
            .toThrow('No server has been defined for <id_1>');

        markers.configureMapScope($fake_scope);

        expect(markers._serverMarkerKey).toBeNull();
        expect(markers.createServerMarker(server_id, server_lat, server_lng))
            .toEqual(server_id);
        expect(markers._serverMarkerKey).toEqual('MK2');
        expect(markers.getScope().markers.MK2).toEqual({
            lat: server_lat, lng: server_lng,
            focus: true, draggable: false,
            icon: {
                iconUrl: '/images/gs-icon.svg', iconSize: [15, 15]
            },
            label: {
                message: server_id, options: { noHide: true }
            },
            groundstations: [],
            identifier: server_id
        });

        expect(function () {
            markers.createConnectorIdentifier();
        }).toThrow('No identifier provided');
        expect(function () {
            markers.createConnectorIdentifier(null);
        }).toThrow('No identifier provided');
        expect(function () {
            markers.createConnectorIdentifier('');
        }).toThrow('No identifier provided');

        connector_1_id = markers.createConnectorIdentifier(test_id_1);
        expect(connector_1_id).toEqual('connect:id_1_2_server_0');

        expect(function () {
            markers.createGSConnector();
        }).toThrow('No identifier provided');

        expect(markers.createGSConnector(test_id_1)).toEqual(connector_1_id);
        expect(markers.getMarkerKey(connector_1_id)).toEqual('MK3');
        expect(markers.getScope().paths.MK3).toEqual({
            color: 'gray', type: 'polyline', weight: 3, opacity: 0.25,
            latlngs: [
                markers.getScope().markers.MK2,
                markers.getScope().markers.MK0
            ],
            identifier: connector_1_id
        });

    });

    it('should create GS markers', function () {

        var $fake_scope = $rootScope.$new(),
            server_id = 'server_0', server_lat = '1.0', server_lng = '2.0',
            gs_id_1 = 'gs_id_1', gs_lat = 1.0, gs_lng = 2.0,
            conn_gs_1 = '', conn_gs_1_key ='',
            gs_cfg = {
                groundstation_id: gs_id_1,
                groundstation_latlon: [gs_lat, gs_lng]
            };

        expect(function () {
            markers.createUnconnectedGSMarker(gs_cfg);
        }).toThrow('<_mapScope> has not been set.');

        markers.configureMapScope($fake_scope);
        expect(markers.createUnconnectedGSMarker(gs_cfg)).toEqual(gs_id_1);

        expect($fake_scope.markers.MK0).toEqual({
            lat: gs_cfg.groundstation_latlon[0],
            lng: gs_cfg.groundstation_latlon[1],
            focus: true, draggable: false,
            icon: { iconUrl: '/images/gs-icon.svg', iconSize: [15, 15] },
            label: {
                message: gs_cfg.groundstation_id, options: { noHide: true }
            },
            identifier: gs_id_1
        });

        expect(function () {
            markers.createGSConnector(gs_id_1);
        }).toThrow('No server has been defined for <' + gs_id_1 + '>');

        expect(markers.createServerMarker(server_id, server_lat, server_lng))
            .toEqual(server_id);
        expect(markers.createGSMarker(gs_cfg)).toEqual(gs_id_1);
        conn_gs_1 = markers.createGSConnector(gs_id_1);
        conn_gs_1_key = markers.createMarkerKey(conn_gs_1);

        expect($fake_scope.paths[conn_gs_1_key]).toEqual({
            color: 'gray', type: 'polyline', weight: 3, opacity: 0.25,
            latlngs: [
                $fake_scope.markers[markers._serverMarkerKey],
                $fake_scope.markers.MK0
            ],
            identifier: conn_gs_1
        });

    });

    /*
    it('should pan to a given GS location', function () {

        var $fake_scope = $rootScope.$new(),
            gs_id_1 = 'gs_id_1', gs_lat = 1.0, gs_lng = 2.0,
            gs_cfg = {
                id: gs_id_1,
                groundstation_latlon: [gs_lat, gs_lng]
            };

        expect(function () {
            markers.panToGSMarker(gs_id_1);
        }).toThrow('<_mapScope> has not been set.');

        markers.configureMapScope($fake_scope);

        expect(function () {
            markers.panToGSMarker(gs_id_1);
        }).toThrow('No key for marker <gs_id_1>');

        expect(function () {
            markers.createGSMarker(gs_cfg);
        }).toThrow('No server has been defined for <undefined>');
        
        //expect(markers.createGSMarker(gs_cfg)).toEqual('MK0');
        //markers.panToGSMarker(gs_id_1);

    });
    */

});