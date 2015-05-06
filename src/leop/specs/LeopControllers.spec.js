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

describe('MenuCtrl controller', function () {

    var $rootScope, $scope, $controller, $q, menuCtrl,
        mock__mdSidenav = function () {
            return {
                close: function () {
                    return $q.when();
                }
            };
        };

    beforeEach(function () {

        module('leopMenuControllers', function ($provide) {
            $provide.value('$mdSidenav', mock__mdSidenav);
        });

        inject(function ($injector) {

            $rootScope = $injector.get('$rootScope');
            $controller = $injector.get('$controller');
            $q = $injector.get('$q');

            $scope = $rootScope.$new();

        });

        menuCtrl = $controller("MenuCtrl", {
            $scope: $scope,
            $mdSidenav: mock__mdSidenav
        });

    });

    it('should close the $mdSidenav menu', function () {

        expect($scope.closed).toBe(false);

        $scope.close();
        $rootScope.$digest();

        expect($scope.closed).toBe(true);

    });

});