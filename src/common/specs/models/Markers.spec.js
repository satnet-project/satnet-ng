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

    var markers, $rootScope, $q,
        mapServices, LAT, LNG, ZOOM,
        mock__cookies = {},
        _RATE, _SIM_DAYS, _GEOLINE_STEPS;

    beforeEach(function () {

        module('snMarkerModels', 'snMapServices',
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

        var $fake_scope = {},
            x_scope = {};

        x_scope = {
            center: {
                lat: LAT,
                lng: LNG,
                zoom: ZOOM
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
            name: 'Network',
            type: 'markercluster',
            visible: true
        };
        x_scope.layers.overlays.groundstations = {
            name: 'Ground Stations',
            type: 'markercluster',
            visible: true
        };

        markers.configureMapScope($fake_scope);
        expect($fake_scope).toEqual(x_scope);

    });

    it('should manage the keys for the markers', function () {

        var test_id_1 = 'id_1',
            test_id_2 = 'id_2',
            test_id_3 = 'id_3',
            server_id = 'server_0',
            server_lat = '1.0',
            server_lng = '2.0',
            connector_1_id = '',
            $fake_scope = $rootScope.$new();

        expect(markers.createMarkerKey(test_id_1)).toEqual('MK0');
        expect(markers.createMarkerKey(test_id_1)).toEqual('MK0');
        expect(markers.createMarkerKey(test_id_2)).toEqual('MK1');
        expect(markers.createMarkerKey(test_id_2)).toEqual('MK1');

        expect(markers.getMarkerKey(test_id_1)).toEqual('MK0');
        expect(markers.getMarkerKey(test_id_2)).toEqual('MK1');

        expect(function () {
                markers.getMarkerKey(test_id_3);
            })
            .toThrow('@getMarkerKey: No key for <' + test_id_3 + '>');

        expect(function () {
                markers.getServerMarker(test_id_1);
            })
            .toThrow(
                '@getServerMarker: no server for <' + test_id_1 + '>'
            );

        markers.configureMapScope($fake_scope);

        expect(markers._serverMarkerKey).toBeNull();
        expect(markers.createServerMarker(server_id, server_lat, server_lng))
            .toEqual(server_id);
        expect(markers._serverMarkerKey).toEqual('MK2');
        expect(markers.getScope().markers.MK2).toEqual({
            lat: server_lat,
            lng: server_lng,
            focus: true,
            draggable: false,
            layer: "network",
            icon: {
                iconUrl: '/images/server-icon-3.svg',
                iconSize: [15, 15]
            },
            label: {
                message: server_id,
                options: {
                    noHide: true
                }
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
        }).toThrow('@createGSConnector: no GS identifier provided');

        expect(markers.createGSConnector(test_id_1)).toEqual(connector_1_id);
        expect(markers.getMarkerKey(connector_1_id)).toEqual('MK3');
        expect(markers.getScope().paths.MK3).toEqual({
            color: 'gray',
            type: 'polyline',
            weight: 3,
            opacity: 0.5,
            latlngs: [
                markers.getScope().markers.MK2,
                markers.getScope().markers.MK0
            ],
            identifier: connector_1_id
        });

    });

    it('should create GS markers', function () {

        var $fake_scope = $rootScope.$new(),
            server_id = 'server_0',
            server_lat = '1.0',
            server_lng = '2.0',
            gs_id_1 = 'gs_id_1',
            gs_lat = 1.0,
            gs_lng = 2.0,
            conn_gs_1 = '',
            conn_gs_1_key = '',
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
            focus: true,
            draggable: false,
            layer: 'groundstations',
            icon: {
                iconUrl: '/images/gs-icon.svg',
                iconSize: [15, 15]
            },
            label: {
                message: gs_cfg.groundstation_id,
                options: {
                    noHide: true
                }
            },
            identifier: gs_id_1
        });

        expect(function () {
            markers.createGSConnector(gs_id_1);
        }).toThrow('@getServerMarker: no server for <' + gs_id_1 + '>');

        expect(markers.createServerMarker(server_id, server_lat, server_lng))
            .toEqual(server_id);
        expect(markers.createGSMarker(gs_cfg)).toEqual(gs_id_1);
        conn_gs_1 = markers.createGSConnector(gs_id_1);
        conn_gs_1_key = markers.createMarkerKey(conn_gs_1);

        expect($fake_scope.paths[conn_gs_1_key]).toEqual({
            color: 'gray',
            type: 'polyline',
            weight: 3,
            opacity: 0.5,
            latlngs: [
                $fake_scope.markers[markers._serverMarkerKey],
                $fake_scope.markers.MK0
            ],
            identifier: conn_gs_1
        });

    });

    it('should manage (CRUD) GS marker operations', function () {

        var $fake_scope = $rootScope.$new(),
            server_id = 'server_0',
            server_lat = 1.0,
            server_lng = 2.0,
            gs_id_1 = 'gs_id_1',
            gs_lat = 1.0,
            gs_lng = 2.0,
            conn_gs_1 = '',
            conn_gs_1_key = '',
            gs_cfg = {
                groundstation_id: gs_id_1,
                groundstation_latlon: [gs_lat, gs_lng]
            },
            new_gs_lat = 3.0,
            new_gs_lng = 4.0,
            new_gs_cfg = {
                groundstation_id: gs_id_1,
                groundstation_latlon: [new_gs_lat, new_gs_lng]
            };

        markers.configureMapScope($fake_scope);
        expect(markers.createServerMarker(server_id, server_lat, server_lng))
            .toEqual(server_id);
        expect(markers.createGSMarker(gs_cfg)).toEqual(gs_id_1);
        conn_gs_1 = markers.createGSConnector(gs_id_1);
        conn_gs_1_key = markers.createMarkerKey(conn_gs_1);

        expect(function () {
            markers.updateGSMarker(null);
        }).toThrow('@updateGSMarker, wrong <cfg>');

        expect(markers.updateGSMarker(new_gs_cfg)).toEqual(gs_id_1);
        expect($fake_scope.markers.MK1).toEqual({
            lat: new_gs_lat,
            lng: new_gs_lng,
            focus: true,
            draggable: false,
            layer: 'groundstations',
            icon: {
                iconUrl: '/images/gs-icon.svg',
                iconSize: [15, 15]
            },
            label: {
                message: new_gs_cfg.groundstation_id,
                options: {
                    noHide: true
                }
            },
            identifier: gs_id_1
        });

        expect(function () {
            markers.removeGSMarker();
        }).toThrow('@getMarkerKey: No key for <undefined>');

        expect($fake_scope.markers.hasOwnProperty('MK1')).toBeTruthy();
        expect($fake_scope.paths.hasOwnProperty(conn_gs_1_key)).toBeTruthy();
        markers.removeGSMarker(gs_id_1);
        expect($fake_scope.markers.hasOwnProperty('MK1')).toBeFalsy();
        expect($fake_scope.paths.hasOwnProperty(conn_gs_1_key)).toBeFalsy();

    });

    it('should manage (CRUD) SC marker operations', function () {

        var $fake_scope = $rootScope.$new(),
            sc_id = 'sc-1', wrong_sc_id = 'sc-2',
            sc_cfg = {
                spacecraft_id: sc_id,
                groundtrack: []
            };

        markers.configureMapScope($fake_scope);

        expect(function () {
            markers.addSC('', {});
        }).toThrow('@addSC: wrong id');
        expect(function () {
            markers.addSC(sc_id, {});
        }).toThrow('@createSCMarkers: wrong cfg, no <spacecraft_id>');
        expect(function () {
            markers.addSC(sc_id, sc_cfg);
        }).toThrow('@readTrack: empty groundtrack');

        sc_cfg.groundtrack = [{
            timestamp: Date.now() / 1000 + 1000,
            latitude: 5.0,
            longitude: 6.0
        }, {
            timestamp: Date.now() / 1000 + 1001,
            latitude: 6.0,
            longitude: 7.0
        }];

        expect(markers.sc.hasOwnProperty(sc_id)).toBeFalsy();
        markers.addSC(sc_id, sc_cfg);
        expect(markers.sc.hasOwnProperty(sc_id)).toBeTruthy();

        expect(function () {
            markers.addSC(sc_id, {});
        }).toThrow('@addSC: SC Marker already exists, id = ' + sc_id);

        expect(function () {
            markers.updateSC('', {});
        }).toThrow('@updateSC: no id provided');
        expect(function () {
            markers.updateSC(wrong_sc_id, {});
        }).toThrow('@updateSC: marker <' + wrong_sc_id + '> does not exist');

        //expect(markers.updateSC(sc_id, sc_cfg)).toEqual(sc_id);

        expect(function () {
            markers.removeSC();
        }).toThrow('@removeSC: no id provided');
        expect(function () {
            markers.removeSC('XXXX');
        }).toThrow('@removeSC: marker <XXXX> does not exist');

        expect(markers.sc.hasOwnProperty(sc_id)).toBeTruthy();
        markers.removeSC(sc_id);
        expect(markers.sc.hasOwnProperty(sc_id)).toBeFalsy();

    });

    it('should pan to a given location', function () {

        var gs_lat = 1.0, gs_lng = 2.0, latlng = {
                latitude: gs_lat, longitude: gs_lng
            },
            __getMainMap = function () {
                return {
                    then: function () {
                        return {
                            latitude: gs_lat,
                            longitude: gs_lng
                        };
                    }
                };
            };

        expect(function () {
            markers.panTo();
        }).toThrow('@panTo: no LatLng object provided');

        spyOn(mapServices, 'getMainMap').and.callFake(__getMainMap);
        markers.panTo(latlng);
        /* TODO Evaluate properly the call to this promises
        .then(function (result) {
            ???
        });
        */

    });

    it('should pan to a given SC', function () {

        var sc_id = 'sc_id_1',
            sc_cfg = {
                spacecraft_id: sc_id,
                groundtrack: [{
                    timestamp: Date.now() / 1000 + 10,
                    latitude: 5.0,
                    longitude: 6.0
                }, {
                    timestamp: Date.now() / 1000 + 11,
                    latitude: 6.0,
                    longitude: 7.0
                }]
            };

        expect(function () {
            markers.panToSCMarker();
        }).toThrow('@panToSCMarker: no SC identifier provided');

        expect(function () {
            markers.panToSCMarker(sc_id);
        }).toThrow('@panToSCMarker: no SC marker for <' + sc_id + '>');

        markers.addSC(sc_id, sc_cfg);
        markers.panToSCMarker(sc_id);

    });

    it('should pan to a given GS', function () {

        var $fake_scope = $rootScope.$new(),
            server_id = 'server_0',
            server_lat = '1.0',
            server_lng = '2.0',
            gs_id_1 = 'gs_id_1',
            gs_lat = 1.0,
            gs_lng = 2.0,
            gs_cfg = {
                groundstation_latlon: [gs_lat, gs_lng]
            },
            __getMainMap = function () {
                return {
                    then: function () {
                        return {
                            latitude: gs_lat,
                            longitude: gs_lng
                        };
                    }
                };
            };

        expect(function () {
            markers.panToGSMarker();
        }).toThrow('@panToGSMarker: no GS identifier provided');
        expect(function () {
            markers.panToGSMarker(gs_id_1);
        }).toThrow('<_mapScope> has not been set.');

        markers.configureMapScope($fake_scope);

        expect(function () {
            markers.panToGSMarker(gs_id_1);
        }).toThrow('@getMarkerKey: No key for <' + gs_id_1 + '>');

        expect(function () {
            markers.createGSMarker(gs_cfg);
        }).toThrow('@createGSConnector: no GS identifier provided');

        gs_cfg.groundstation_id = gs_id_1;
        expect(function () {
            markers.createGSMarker(gs_cfg);
        }).toThrow('@getServerMarker: no server for <' + gs_id_1 + '>');

        spyOn(mapServices, 'getMainMap').and.callFake(__getMainMap);
        markers.panToGSMarker(gs_id_1);
        $rootScope.$digest();

        expect(markers.createServerMarker(server_id, server_lat, server_lng))
            .toEqual(server_id);
        expect(markers.createGSMarker(gs_cfg)).toEqual(gs_id_1);

    });

    it('basic readTrack tests', function () {

        var groundtrack = [],
            nowUs = Date.now() * 1000,
            tomorrowUs = moment().add(1, "days").toDate().getTime() * 1000;

        expect(function () {
            markers.readTrack(null);
        }).toThrow('@readTrack: empty groundtrack');
        expect(function () {
            markers.readTrack(groundtrack);
        }).toThrow('@readTrack: empty groundtrack');

        groundtrack = [
            { timestamp: nowUs - 10000, latitude: 12.00, longitude: 145.00 }
        ];
        expect(function () {
            markers.readTrack(groundtrack);
        }).toThrow('@readTrack: invalid groundtrack');

        groundtrack = [ { timestamp: 0, latitude: 11.00, longitude: 144.00 } ];
        expect(function () {
            markers.readTrack(groundtrack);
        }).toThrow('@readTrack: invalid groundtrack');

        groundtrack = [
            { timestamp: tomorrowUs + 1000000, latitude: 12.00, longitude: 145.00 }
        ];
        expect(function () {
            markers.readTrack(groundtrack);
        }).toThrow('@readTrack: invalid groundtrack');

    });

    it('extended readTrack tests', function () {

        var _result, groundtrack = [],
            nowUs = Date.now() / 1000;

        groundtrack.push(
            { timestamp:  nowUs - 10000, latitude: 12.00, longitude: 145.00 }
        );
        expect(function () {
            markers.readTrack(groundtrack);
        }).toThrow('@readTrack: invalid groundtrack');

        groundtrack.push(
            { timestamp:  nowUs - 100000, latitude: 13.00, longitude: 146.00 }
        );
        expect(function () {
            markers.readTrack(groundtrack);
        }).toThrow('@readTrack: invalid groundtrack');

        groundtrack.push(
            { timestamp: nowUs + 40000, latitude: 14.00, longitude: 147.00 }
        );
        expect(function () {
            markers.readTrack(groundtrack);
        }).toThrow('@readTrack: invalid groundtrack');

        groundtrack.push(
            { timestamp: nowUs + 50000, latitude: 15.00, longitude: 148.00 }
        );
        _result = markers.readTrack(groundtrack);
        expect(_result.durations).toEqual([10]);
        expect(_result.positions).toEqual([[14, 147], [15, 148]]);

        groundtrack.push(
            { timestamp: nowUs + 400000, latitude: 16.00, longitude: 149.00 }
        );
        _result = markers.readTrack(groundtrack);
        expect(_result.durations).toEqual([10]);
        expect(_result.positions).toEqual([[14, 147], [15, 148]]);

    });

});