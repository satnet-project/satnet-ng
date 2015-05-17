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

describe('Testing Maps directive', function () {

    var $compile, $rootScope, $scope, $httpBackend,
        mapServices,
        $directive, $body, html = "<sn-map></sn-map>";

    beforeEach(function () {

        module('templates', 'snMapDirective', 'snMapServices');

        inject(function ($injector) {

            $rootScope = $injector.get('$rootScope');
            $compile = $injector.get('$compile');
            $httpBackend = $injector.get('$httpBackend');
            mapServices = $injector.get('mapServices');

            $scope = $rootScope.$new();
            $directive = $compile(angular.element(html))($scope);

        });

        $httpBackend
            .when('GET', '/configuration/user/geoip')
            .respond({
                latitude: '40.0',
                longitude: '50.0'
            });

        $body = $("body");
        $body.append($directive);
        $rootScope.$digest();

        expect(mapServices).toBeDefined();

    });

    afterEach(function () {
        $body.empty();
    });

    it('should create a Leaflet map', function () {
        var map = $('#mainMap').eq(0);
        expect(map.length).toBe(1);
    });

});