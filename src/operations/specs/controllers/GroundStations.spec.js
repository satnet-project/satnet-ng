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

describe('Testing Ground Station controllers', function () {

    var $rootScope, $controller, $mdDialog, $q,
        __mock__cookies = {},
        __mock__satnetRPC = {
            rCall: function () {}
        },
        satnetRPC;

    beforeEach(function () {

        module('gsControllers');
        module(function ($provide) {
            $provide.value('$cookies', __mock__cookies);
            $provide.value('satnetRPC', __mock__satnetRPC);
        });

        inject(function ($injector) {

            $rootScope = $injector.get('$rootScope');
            $controller = $injector.get('$controller');
            $mdDialog = $injector.get('$mdDialog');
            $q = $injector.get('$q');

            satnetRPC = $injector.get('satnetRPC');

        });

    });

    it('should create the List Controller', function () {

        var $scope = $rootScope.$new(),
            __fn_list = function () {
                return $q.when().then(function () {
                    return ['gs_test_1', 'gs_test_2'];
                });
            };

        __mock__satnetRPC.rCall =
            jasmine.createSpy('rCall').and.callFake(__fn_list);

        $controller("GsListCtrl", {
            $scope: $scope,
            $mdDialog: $mdDialog,
            satnetRPC: satnetRPC
        });

        $scope.init();
        $rootScope.$digest();

        expect($scope.gsList).toEqual(['gs_test_1', 'gs_test_2']);

    });

    it('should create the Dialog Controller for creation', function () {

        var $scope = $rootScope.$new(),
            test_id = 'gs-id-1',
            __fn_get_user_location = function () {
                return $q.when().then(function () {
                    return {
                        groundstation_latlon: ['40.0', '50.0']
                    };
                });
            };

        $controller("GsDialogCtrl", {
            $scope: $scope,
            $mdDialog: $mdDialog,
            satnetRPC: satnetRPC,
            identifier: test_id,
            editing: true
        });

        __mock__satnetRPC.rCall =
            jasmine.createSpy('rCall').and.callFake(__fn_get_user_location);

        $scope.init();
        $rootScope.$digest();

        expect($scope.center).toEqual({
            lat: '40.0', lng: '50.0', zoom: 8
        });

    });

    it('should create the Dialog Controller for edition', function () {

        var $scope = $rootScope.$new(),
            test_id = 'gs-id-1',
            test_lat = 35.0, test_lng = 36.0,
            test_cfg = {
                groundstation_altitude: 231.551239013672,
                groundstation_callsign: "asfdasd",
                groundstation_elevation: 12,
                groundstation_id: test_id,
                groundstation_latlon: [test_lat, test_lng]
            },
            x_cfg = {
                callsign: test_cfg.groundstation_callsign,
                elevation: test_cfg.groundstation_elevation,
                identifier: test_cfg.groundstation_id
            },
            __fn__get_gs = function () {
                return $q.when().then(function () {
                    return test_cfg;
                });
            };

        $controller("GsDialogCtrl", {
            $scope: $scope,
            $mdDialog: $mdDialog,
            satnetRPC: satnetRPC,
            identifier: test_id,
            editing: true
        });

        __mock__satnetRPC.rCall =
            jasmine.createSpy('rCall').and.callFake(__fn__get_gs);

        $scope.init();
        $rootScope.$digest();

        expect($scope.center).toEqual({
            lat: test_lat, lng: test_lng, zoom: 8
        });
        expect($scope.configuration).toEqual(x_cfg);

    });

});