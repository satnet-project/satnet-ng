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

describe('Testing snMapServices Service', function () {

    var $rootScope, $httpBackend, $q,
        mapServices, satnetRPC,
        __mock__terminator = {
            getLatLngs: function () {},
            setLatLngs: function () {},
            redraw: function () {}
        },
        __mock__L = {
            terminator: jasmine.createSpy('terminator')
                .and.callFake(function () {
                    return (__mock__terminator);
                })
        },
        x_gs_cfg = {
            groundstation_latlon: [40.0, 50.0]
        },
        x_baselayer = {
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

    beforeEach(function () {

        module('snMapServices');

        module(function ($provide) {
            $provide.value('L', __mock__L);
        });

        inject(function ($injector) {

            $rootScope = $injector.get('$rootScope');
            $httpBackend = $injector.get('$httpBackend');
            $q = $injector.get('$q');

            satnetRPC = $injector.get('satnetRPC');
            mapServices = $injector.get('mapServices');

            spyOn(satnetRPC, 'rCall').and.callFake(function () {
                var deferred = $q.defer();
                deferred.resolve(x_gs_cfg);
                return deferred.promise;
            });

        });

        $httpBackend
            .when('GET', '/configuration/user/geoip')
            .respond({
                latitude: '40.0',
                longitude: '50.0'
            });

        expect(mapServices).toBeDefined();

    });

    it('should return the default base layer object', function () {

        expect(mapServices.getOSMBaseLayer()).toEqual(x_baselayer);

    });

    it('should return the set of available base layers', function () {

        var expected_MIN_ZOOM = 2,
            expected_MAX_ZOOM = 12,
            expected_baselayers = {
                osm_baselayer: {
                    name: 'OSM Base Layer',
                    type: 'xyz',
                    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    layerOptions: {
                        noWrap: false,
                        continuousWorld: false,
                        minZoom: expected_MIN_ZOOM,
                        maxZoom: expected_MAX_ZOOM,
                        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    }
                },
                esri_baselayer: {
                    name: 'ESRI Base Layer',
                    type: 'xyz',
                    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
                    layerOptions: {
                        noWrap: false,
                        continuousWorld: false,
                        minZoom: expected_MIN_ZOOM,
                        maxZoom: expected_MAX_ZOOM,
                        attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
                    }
                }
            };

        expect(mapServices.getBaseLayers()).toEqual(expected_baselayers);

    });

    it('should return the overlay objects', function () {

        var expected_MIN_ZOOM = 2,
            expected_MAX_ZOOM = 12,
            expected_overlays = {
                oms_admin_overlay: {
                    name: 'Administrative Boundaries',
                    type: 'xyz',
                    url: 'http://openmapsurfer.uni-hd.de/tiles/adminb/x={x}&y={y}&z={z}',
                    visible: true,
                    layerOptions: {
                        noWrap: true,
                        continuousWorld: false,
                        minZoom: expected_MIN_ZOOM,
                        maxZoom: expected_MAX_ZOOM,
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
                        minZoom: expected_MIN_ZOOM,
                        maxZoom: expected_MAX_ZOOM,
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
                        minZoom: expected_MIN_ZOOM,
                        maxZoom: expected_MAX_ZOOM,
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
                        minZoom: expected_MIN_ZOOM,
                        maxZoom: expected_MAX_ZOOM,
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
                        minZoom: expected_MIN_ZOOM,
                        maxZoom: expected_MAX_ZOOM,
                        attribution: 'Map data &copy; <a href="http://openweathermap.org">OpenWeatherMap</a>'
                    }
                }
            };

        expect(mapServices.getOverlays()).toEqual(expected_overlays);

    });

    /* FIXME: should execute the code within the promises */
    it('should create a map with a terminator', function () {

        var x_map_info = {
            map: Object,
            terminator: Object
        };

        mapServices._createTerminatorMap().then(
            function (result) {
                expect(result.toEqual(x_map_info));
            }
        );

        $rootScope.$digest();

    });

    /* FIXME: should execute the code within the promises */
    it('should create a main map with a terminator', function () {

        var x_map_info = {
            map: Object,
            terminator: Object,
            center: {
                lat: '41.0',
                lng: '50.0'
            }
        };

        mapServices.createMainMap(true).then(function (result) {
            expect(result.toEqual(x_map_info));
            expect(false).toBe(true);
        });
        $rootScope.$digest();

    });

    it('should center the map object', function () {

        var scope = {},
            x_lat = '30.0',
            x_lng = '31.0',
            x_zoom = '10',
            x_scope = {
                center: {
                    lat: x_lat,
                    lng: x_lng,
                    zoom: x_zoom
                },
                markers: {
                    gs: {
                        lat: x_lat,
                        lng: x_lng,
                        focus: true,
                        draggable: true,
                        label: {
                            message: 'Drag me!',
                            options: {
                                noHide: true
                            }
                        }
                    }
                },
                layers: {
                    baselayers: x_baselayer
                }

            };

        mapServices.centerMap(scope, x_lat, x_lng, x_zoom);
        expect(scope).toEqual(x_scope);

    });

    it('should automatically center the map object', function () {

        var scope = {},
            x_lat = 40.0,
            x_lng = 50.0,
            x_zoom = '10',
            x_scope = {
                center: {
                    lat: x_lat,
                    lng: x_lng,
                    zoom: x_zoom
                },
                markers: {
                    gs: {
                        lat: x_lat,
                        lng: x_lng,
                        focus: true,
                        draggable: true,
                        label: {
                            message: 'Drag me!',
                            options: {
                                noHide: true
                            }
                        }
                    }
                },
                layers: {
                    baselayers: x_baselayer
                }

            };

        mapServices.autocenterMap(scope, x_zoom);
        $httpBackend.flush();
        expect(scope).toEqual(x_scope);

    });

    it('should automatically center the map object at a GS', function () {

        var scope = {},
            x_lat = 40.0,
            x_lng = 50.0,
            x_zoom = '10',
            x_gs_id = 'test-gs',
            x_scope = {
                center: {
                    lat: x_lat,
                    lng: x_lng,
                    zoom: x_zoom
                },
                markers: {
                    gs: {
                        lat: x_lat,
                        lng: x_lng,
                        focus: true,
                        draggable: true,
                        label: {
                            message: 'Drag me!',
                            options: {
                                noHide: true
                            }
                        }
                    }
                },
                layers: {
                    baselayers: x_baselayer
                }

            };

        mapServices.centerAtGs(scope, x_gs_id, x_zoom);
        $rootScope.$digest();
        expect(scope).toEqual(x_scope);

    });

    it('should implement a proper update for the Terminator', function () {

        /* FIXME: it seems that L from leaflet is not properly invoked...
        expect(mapServices._updateTerminator(__mock__terminator))
            .toBe(__mock__terminator);
        */

    });

});