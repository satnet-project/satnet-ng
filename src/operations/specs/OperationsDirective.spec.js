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

describe("Testing Operations Directive integration, ", function () {

    var $rootScope, $scope,
        $compile,
        $directive,
        $body = $("body"),
        simpleHtml = "<operations-app></operations-app>";

    beforeEach(function () {

        module('templates', 'operationsDirective');

        inject(function ($injector) {

            $rootScope = $injector.get('$rootScope');
            $compile = $injector.get('$compile');

            $scope = $rootScope.$new();
            $directive = $compile(angular.element(simpleHtml))($rootScope);

        });

        $body.append($directive);
        $rootScope.$digest();

    });

    afterEach(function () {
        $body.empty();
    });

    it("should render the directive within the DOM", function () {
        var $ops_main = $('.operations-main');
        expect($ops_main).toBeDefined();
        expect($ops_main.length).toEqual(1);
    });

    it("should render a sidenav containing a toolbar with a header", function () {
        var $toolbar_h1 = $('md-sidenav md-toolbar h1');
        expect($toolbar_h1.length).toBe(1);
        expect($toolbar_h1.text()).toBe('Operations Menu');
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

});