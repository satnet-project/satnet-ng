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

    var $rootScope, $controller, $q,
        $app_scope, $menu_scope,
        appCtrl, menuCtrl,
        /**
         * Factory for mocking $mdSidenav service from Angular material.
         *
         * @returns {Object} Factory for mocking.
         */
        mock__mdSidenav = function () {
            return {
                /**
                 * Mock up function for simulating the toggling method.
                 * @returns {Object} Promise object.
                 */
                toggle: function () {
                    return $q.when();
                },
                /**
                 * Mock up function for simulating the closing method.
                 * @returns {Object} Promise object.
                 */
                close: function () {
                    return $q.when();
                }
            };
        };

    beforeEach(function () {
        
        module('operationsMenuControllers', function ($provide) {
            $provide.value('$mdSidenav', mock__mdSidenav);
        });
        
        inject(function ($injector) {

            $rootScope = $injector.get('$rootScope');
            $controller = $injector.get('$controller');
            $q = $injector.get('$q');

            $menu_scope = $rootScope.$new();
            $app_scope = $rootScope.$new();

        });

        appCtrl = $controller("OperationsAppCtrl", {
            $scope: $app_scope,
            $mdSidenav: mock__mdSidenav
        });
        
        menuCtrl = $controller("OperationsMenuCtrl", {
            $scope: $menu_scope,
            $mdSidenav: mock__mdSidenav
        });

    });

    it('AppCtrl should toggle the menu opening', function () {

        spyOn($app_scope, 'toggleMenu');

        $app_scope.toggleMenu();
        $rootScope.$digest();

        expect($app_scope.toggleMenu).toHaveBeenCalled();
        expect($app_scope.toggle).toBeDefined();

    });
    
    it('MenuCtrl should close the $mdSidenav menu', function () {

        expect($menu_scope.closed).toBe(false);

        $menu_scope.close();
        $rootScope.$digest();

        expect($menu_scope.closed).toBe(true);

    });

});