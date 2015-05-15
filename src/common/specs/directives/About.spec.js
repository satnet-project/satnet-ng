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

describe('Testing About directive', function () {

    var $compile, $directive, $mdDialog,
        $rootScope, $scope,
        $controller, dialogCtrl,
        $body = $("body"),
        html = "<sn-about></sn-about>";

    beforeEach(function () {

        module('templates', 'snAboutDirective');

        inject(function ($injector) {

            $rootScope = $injector.get('$rootScope');
            $compile = $injector.get('$compile');
            $controller = $injector.get('$controller');
            $mdDialog = $injector.get('$mdDialog');

            $scope = $rootScope.$new();
            $directive = $compile(angular.element(html))($scope);

        });

        dialogCtrl = $controller("snAboutDlgCtrl", {
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

    it('should add an ABOUT button on the menu with an icon', function () {
        var button = $('#menuAbout'),
            icon = $('.fa-question'),
            label = $('#menuAbout div b');
        expect(button.length).toBe(1);
        expect(icon.length).toBe(1);
        expect(label.length).toBe(1);
        expect(label.text()).toBe('about');
    });

    it('should show the ABOUT dialog and hide it', function () {

        var button = $('#menuAbout').eq(0);
        expect(button).toBeDefined();

        expect($mdDialog.show).not.toHaveBeenCalled();
        expect($mdDialog.hide).not.toHaveBeenCalled();
        button.click();
        expect($mdDialog.show).toHaveBeenCalledWith({
            templateUrl: 'common/templates/sn-about-dialog.html'
        });
        expect($mdDialog.hide).not.toHaveBeenCalled();

        $mdDialog.show.calls.reset();
        $mdDialog.hide.calls.reset();

        $scope.closeDialog();
        expect($mdDialog.hide).toHaveBeenCalled();

    });

});