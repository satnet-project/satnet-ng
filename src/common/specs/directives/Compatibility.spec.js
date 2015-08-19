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

describe('Testing Compatibility directive', function () {

    var $compile, $directive, $mdDialog,
        $rootScope, $scope,
        __mock__cookies = {},
        $controller, dialogCtrl,
        $body = $("body"),
        html = "<sn-compatibility></sn-compatibility>";

    beforeEach(function () {

        module(
            'templates', 'snCompatibilityDirective', 'snJRPCMock',
            function($provide) {
                $provide.value('$cookies', __mock__cookies);
            }
        );

        inject(function ($injector) {

            $rootScope = $injector.get('$rootScope');
            $compile = $injector.get('$compile');
            $controller = $injector.get('$controller');
            $mdDialog = $injector.get('$mdDialog');

            $scope = $rootScope.$new();
            $directive = $compile(angular.element(html))($scope);

        });

        dialogCtrl = $controller("snCompatibilityDlgCtrl", {
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

    it('should add a COMPAT button on the menu with an icon', function () {
        var button = $('#menuCompatibility'),
            icon = $('.fa-puzzle-piece'),
            label = $('#menuCompatibility div b');
        expect(button.length).toBe(1);
        expect(icon.length).toBe(1);
        expect(label.length).toBe(1);
        expect(label.text()).toBe('compatibility');
    });

    it('should show the COMPAT dialog and hide it', function () {

        var button = $('#menuCompatibility').eq(0);
        expect(button).toBeDefined();

        expect($mdDialog.show).not.toHaveBeenCalled();
        expect($mdDialog.hide).not.toHaveBeenCalled();
        button.click();
        expect($mdDialog.show).toHaveBeenCalledWith({
            templateUrl: 'common/templates/sn-compatibility-dialog.html'
        });
        expect($mdDialog.hide).not.toHaveBeenCalled();

        $mdDialog.show.calls.reset();
        $mdDialog.hide.calls.reset();

        $scope.closeDialog();
        expect($mdDialog.hide).toHaveBeenCalled();

    });

    it('should load the compatibility information for a SC', function () {

        var $c_scope = $rootScope.$new(),
            compatDlgCtrl = $controller("snCompatibilityDlgCtrl", {
                $scope: $c_scope,
                $mdDialog: $mdDialog
            });

        expect(compatDlgCtrl).not.toBeNull();

        $c_scope.init();
        $rootScope.$digest();

        expect();
    });

});
