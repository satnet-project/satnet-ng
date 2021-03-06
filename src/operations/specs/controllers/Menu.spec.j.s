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

describe('Operations', function () {

    var $rootScope, $controller, $q, $mdSidenav,
        $body = $("body"),
        $scope, menuCtrl;

    close_fn = jasmine.createSpy("close").and.callFake(function () {
        return $q.when();
    }),
    toggle_fn = jasmine.createSpy("toggle").and.callFake(function () {
        return $q.when();
    }),

    /**
     * Factory for mocking $mdSidenav service from Angular material.
     *
     * @returns {Object} Factory for mocking.
     */
    mock__mdSidenav = function () {
        return {
            toggle: toggle_fn,
            close: close_fn
        };
    };

    beforeEach(function () {

        module('operationsMenuControllers');
        /*
        module('operationsMenuControllers', function ($provide) {
            $provide.value('$mdSidenav', mock__mdSidenav);
        });
        */

        inject(function ($injector) {

            $rootScope = $injector.get('$rootScope');
            $controller = $injector.get('$controller');
            $mdSidenav = $injector.get('$mdSidenav');
            $q = $injector.get('$q');

            $scope = $rootScope.$new();

        });

        menuCtrl = $controller("OperationsMenuCtrl", {
            $scope: $scope,
            $mdSidenav: $mdSidenav
                //$mdSidenav: mock__mdSidenav
        });

        $rootScope.$digest();

    });

    afterEach(function () {
        $body.empty();
    });

    it('MenuCtrl should close the $mdSidenav menu', function () {

        var exit_button = $("#menuExit").eq(0);
        exit_button.click();
        $rootScope.$digest();

        $scope.close();

    });

});