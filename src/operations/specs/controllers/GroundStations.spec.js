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

    var $rootScope, $scope, $controller, $mdDialog, $q,
        gsListCtrl,
        __rCall__fn = jasmine.createSpy('rCall').and.callFake(
            function () {
                return $q.when().then(function () {
                    return ['gs_test_1', 'gs_test_2'];
                });
            }
        ),
        __mock__cookies = {},
        __mock__satnetRPC = {
            rCall: __rCall__fn
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
            $scope = $rootScope.$new();
            $q = $injector.get('$q');
            $controller = $injector.get('$controller');
            $mdDialog = $injector.get('$mdDialog');

            satnetRPC = $injector.get('satnetRPC');

        });

        gsListCtrl = $controller("GsListCtrl", {
            $scope: $scope,
            $mdDialog: $mdDialog,
            satnetRPC: satnetRPC
        });

    });

    it('should compile the directive', function () {

        $scope.init();
        $rootScope.$digest();
        expect($scope.gsList).toEqual(['gs_test_1', 'gs_test_2']);

    });

});