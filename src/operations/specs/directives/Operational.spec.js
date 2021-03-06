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
 * Created by rtubio on 10/26/15.
 */

describe('Testing Operational directive', function () {

    var $compile, $directive,
        $log, $mdDialog,
        $rootScope, $scope,
        snDialog,
        __mock__cookies = {},
        $controller, dialogCtrl,
        $body = $("body"),
        html = "<sn-operational></sn-operational>";

    beforeEach(function () {

        module(
            'templates',
            'snControllers',
            'snTimelineServices',
            'snTimelineDirective',
            'snOperationalDirective',
            'snJRPCMock'
        );

        module(function($provide) {
            $provide.value('$cookies', __mock__cookies);
        });

        inject(function ($injector) {

            $rootScope = $injector.get('$rootScope');
            $compile = $injector.get('$compile');
            $controller = $injector.get('$controller');
            $mdDialog = $injector.get('$mdDialog');
            $log = $injector.get('$log');

            snDialog = $injector.get('snDialog');

        });

        $scope = $rootScope.$new();
        $directive = $compile(angular.element(html))($scope);

        dialogCtrl = $controller("snOperationalDlgCtrl", {
            $scope: $scope,
            $mdDialog: $mdDialog
        });

        $body.append($directive);
        $rootScope.$digest();

        spyOn($mdDialog, 'show');
        spyOn($mdDialog, 'hide');

    });

    afterEach(function () {
        $body.empty();
    });

    it('should add a button on the menu with an icon', function () {

        var button = $('#menuOperational'),
            icon = $('.fa-skyatlas'),
            label = $('#menuOperational div b');
        expect(button.length).toBe(1);
        expect(icon.length).toBe(1);
        expect(label.length).toBe(1);
        expect(label.text()).toBe('operational');

    });

    it('should show the dialog and hide it', function () {

        var button = $('#menuOperational').eq(0);
        expect(button).toBeDefined();

        expect($mdDialog.show).not.toHaveBeenCalled();
        expect($mdDialog.hide).not.toHaveBeenCalled();
        button.click();
        expect($mdDialog.show).toHaveBeenCalledWith({
            templateUrl: 'operations/templates/operational/dialog.html',
            controller: 'snOperationalDlgCtrl'
        });
        expect($mdDialog.hide).not.toHaveBeenCalled();

        $mdDialog.show.calls.reset();
        $mdDialog.hide.calls.reset();

        $scope.close();
        expect($mdDialog.hide).toHaveBeenCalled();

    });

});
