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
        $rootScope, app_scope, menu_scope,
        appCtrl, menuCtrl,
        simpleHtml = "<operations-app></operations-app>";

    beforeEach(function () {

        module('templates', 'operationsDirective', 'satnetServices');

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

            $directive = $compile(angular.element(simpleHtml))($rootScope);

        });

        appCtrl = $controller("OperationsAppCtrl", {
            $scope: app_scope,
            $mdSidenav: $mdSidenav
        });
        menuCtrl = $controller("OperationsMenuCtrl", {
            $scope: menu_scope,
            $mdSidenav: $mdSidenav,
            $mdDialog: $mdDialog
        });

        $httpBackend
            .when('GET', 'http://server:80/configuration/user/geoip')
            .respond({
                latitude: '40.0',
                longitude: '50.0'
            });

        $body.append($directive);
        $rootScope.$digest();

    });

    afterEach(function () {
        $body.empty();
    });

    it('AppCtrl should toggle the menu opening', function () {

        var button = $("#toggleMenu");
        button.click();
        $rootScope.$digest();

        expect(button).toBeDefined();
        expect(button.length).toBe(1);

    });

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
                templateUrl: 'operations/templates/gslist-dialog.html'
            });

    });

});