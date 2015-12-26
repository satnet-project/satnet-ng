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

describe('Testing Spacecraft controllers', function () {

    var $rootScope, $controller, $mdDialog, $q,
        celestrak,
        __mock__cookies = {},
        __mock__satnetRPC = {
            rCall: function () {}
        },
        satnetRPC;

    beforeEach(function () {

        module('snScControllers', 'snCelestrakServices', 'snPusherMock');
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
            celestrak = $injector.get('celestrak');

        });

    });

    it('should create the List Controller', function () {

        var $scope = $rootScope.$new(),
            __fn_list = function () {
                return $q.when().then(function () {
                    return ['sc_test_1', 'sc_test_2'];
                });
            };

        __mock__satnetRPC.rCall =
            jasmine.createSpy('rCall').and.callFake(__fn_list);

        $controller("scListCtrl", {
            $scope: $scope,
            $mdDialog: $mdDialog,
            satnetRPC: satnetRPC
        });

        $scope.init();
        $rootScope.$digest();

        expect($scope.scList).toEqual(['sc_test_1', 'sc_test_2']);

    });

    it('should create the Dialog Controller for creation', function () {

        var $scope = $rootScope.$new();

        $controller("scDialogCtrl", {
            $scope: $scope,
            $mdDialog: $mdDialog,
            satnetRPC: satnetRPC,
            identifier: null,
            editing: false
        });

        $scope.init();
        $rootScope.$digest();

        expect($scope.configuration).toEqual({
            identifier: '',
            callsign: '',
            tle_group: '',
            tle: ''
        });
        expect($scope.uiCtrl).toEqual({
            add: {
                disabled: true
            },
            editing: false,
            tle_groups: celestrak.CELESTRAK_SELECT_SECTIONS,
            tles: []
        });

    });

});