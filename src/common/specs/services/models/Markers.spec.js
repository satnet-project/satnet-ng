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
        mapServices,
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

    
    it('should configure the given $scope with the map variables', function () {

        /*
        var $fake_scope = $rootScope.$new(),
            x_scope = $rootScope.$new();
        */
        var $fake_scope = {}, x_scope = {};

        /**/
        x_scope = {
            center: {
                lat: mapServices.LAT,
                lng: mapServices.LNG,
                zoom: mapServices.ZOOM
            },
            layers: {
                baselayers: mapServices.getBaseLayers(),
                overlays: mapServices.getOverlays()
            },
            markers: {}
        };
        /**/

        markers.configureMapScope($fake_scope);
        expect($fake_scope).toBe(x_scope);

    });
    
});