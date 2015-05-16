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

    var snMapServices, $rootScope;

    beforeEach(function () {

        module('snMapServices');

        inject(function ($injector) {
            snMapServices = $injector.get('mapServices');
            $rootScope = $injector.get('$rootScope');
        });

        expect(snMapServices).toBeDefined();

    });

    it('should return the base layer objects', function () {

        var expected_baselayers = {
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

        expect(snMapServices.getOSMBaseLayer()).toEqual(expected_baselayers);

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

        expect(snMapServices.getOverlays()).toEqual(expected_overlays);

    });

});