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

describe("Testing Operations Interface", function () {

    var $controller, $mdSidenav, $mdDialog,
        $compile, $directive, $httpBackend,
        satnetRPC,
        $body = $("body"),
        mock__cookies = {},
        mock__server = {
            initStandalone: function () {
                return {
                    then: function () { return 'ok'; }
                };
            }
        },
        mock__window = {
            location: {
                href: ''
            },
            getComputedStyle: function (e) {
                return 'red';
            },
            matchMedia: function (q) {
                return {
                    addListener: function (l) {
                    }
                };
            }
        },
        $rootScope, app_scope, menu_scope,
        appCtrl, menuCtrl,
        simpleHtml = "<operations-app></operations-app>",
        x_post_geoip = {
            latitude: '40.0', longitude: '50.0'
        };

    beforeEach(function () {

        module(
            'templates',
            'snOperationsDirective',
            'snJRPCServices',
            'snPusherMock',
            function ($provide) {
                $provide.value('$cookies', mock__cookies);
                $provide.value('serverModels', mock__server);
                $provide.value('$window', mock__window);
            }
        );

        inject(function ($injector) {

            $rootScope = $injector.get('$rootScope');
            $compile = $injector.get('$compile');
            $controller = $injector.get('$controller');
            $mdSidenav = $injector.get('$mdSidenav');
            $mdDialog = $injector.get('$mdDialog');
            $httpBackend = $injector.get('$httpBackend');

            satnetRPC = $injector.get('satnetRPC');

            app_scope = $rootScope.$new();
            menu_scope = $rootScope.$new();

        });

        $directive = $compile(angular.element(simpleHtml))($rootScope);

        appCtrl = $controller("operationsAppCtrl", {
            $scope: app_scope,
            $mdSidenav: $mdSidenav
        });
        menuCtrl = $controller("operationsMenuCtrl", {
            $scope: menu_scope,
            $mdSidenav: $mdSidenav
        });

        $httpBackend
            .when('GET', 'http://server:80/configuration/user/geoip')
            .respond(x_post_geoip);

        $httpBackend
            .expectPOST('http://server:80/jrpc/')
            .respond(x_post_geoip);

        spyOn(satnetRPC, 'getServerLocation').and.callFake(function () {
            return {
                then: function () {
                    return ['gs_test_1', 'gs_test_2'];
                }
            };
        });

        $body.append($directive);
        $rootScope.$digest();

    });

    afterEach(function () {
        $body.empty();
    });

    /* TODO :: fix problem with mocking $window
    it('AppCtrl should toggle the menu opening', function () {

        var button = $("#toggleMenu");
        button.click();
        $rootScope.$digest();

        expect(button).toBeDefined();
        expect(button.length).toBe(1);

    });
    */

    it('MenuCtrl should close itself', function () {

        var button = $("#menuExit").eq(0);
        button.click();
        $rootScope.$digest();

        expect(button).toBeDefined();
        expect(button.length).toBe(1);

    });

    it("should render the directive within the DOM", function () {
        var $ops_main = $('.operations-main');
        expect($ops_main).toBeDefined();
        expect($ops_main.length).toEqual(1);
    });

    it('should render a map within the content', function () {
        var map = $('#mainMap');
        expect(map.length).toBe(1);
    });

    it('should add a unique toggle menu button with an icon', function () {
        var button = $('#toggleMenu'),
            icon = $('.fa-bars');
        expect(button.length).toBe(1);
        expect(icon.length).toBe(1);
    });

    it('should add a unique exit button on the menu with an icon', function () {
        var button = $('#menuExit'),
            icon = $('.fa-power-off'),
            label = $('#menuExit div b');
        expect(button.length).toBe(1);
        expect(icon.length).toBe(1);
        expect(label.length).toBe(1);
        expect(label.text()).toBe('exit');
    });

    it('should add a unique GS button on the menu with an icon', function () {
        var button = $('#menuGS'),
            icon = $('.fa-home'),
            label = $('#menuGS div b');
        expect(button.length).toBe(1);
        expect(icon.length).toBe(1);
        expect(label.length).toBe(1);
        expect(label.text()).toBe('ground stations');
    });

    it('should add a unique SC button on the menu with an icon', function () {
        var button = $('#menuSC'),
            icon = $('.fa-space-shuttle'),
            label = $('#menuSC div b');
        expect(button.length).toBe(1);
        expect(icon.length).toBe(1);
        expect(label.length).toBe(1);
        expect(label.text()).toBe('spacecraft');
    });

    it('should show the GS Menu', function () {

        expect(menu_scope.showGsMenu).toBeDefined();
        spyOn($mdDialog, 'show');

        menu_scope.showGsMenu();

        expect($mdDialog.show)
            .toHaveBeenCalledWith({
                templateUrl: 'operations/templates/segments/gs.list.html',
                controller: 'gsListCtrl'
            });

    });

});