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

describe('Testing Availability directive', function () {

    var $compile, $directive, $mdDialog,
        $rootScope, $scope,
        __mock__cookies = {},
        $controller, dialogCtrl,
        $body = $("body"),
        html = "<sn-availability></sn-availability>";

    beforeEach(function () {

        module(
            'templates', 'snAvailabilityDirective', 'snJRPCMock',
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

        dialogCtrl = $controller("snAvailabilityDlgCtrl", {
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
        var button = $('#menuAvailability'),
            icon = $('.fa-clock-o'),
            label = $('#menuAvailability div b');
        expect(button.length).toBe(1);
        expect(icon.length).toBe(1);
        expect(label.length).toBe(1);
        expect(label.text()).toBe('availability');
    });

    it('should show the COMPAT dialog and hide it', function () {

        var button = $('#menuAvailability').eq(0);
        expect(button).toBeDefined();

        expect($mdDialog.show).not.toHaveBeenCalled();
        expect($mdDialog.hide).not.toHaveBeenCalled();
        button.click();
        expect($mdDialog.show).toHaveBeenCalledWith({
            templateUrl: 'common/templates/availability/dialog.html',
            controller: 'snAvailabilityDlgCtrl'
        });
        expect($mdDialog.hide).not.toHaveBeenCalled();

        $mdDialog.show.calls.reset();
        $mdDialog.hide.calls.reset();

        $scope.close();
        expect($mdDialog.hide).toHaveBeenCalled();

    });

    it('should load the availability information for all GSs', function () {

        var $c_scope = $rootScope.$new(),
            dlgCtrl = $controller("snAvailabilityDlgCtrl", {
                $scope: $c_scope,
                $mdDialog: $mdDialog
            });

        expect(dlgCtrl).not.toBeNull();

        $c_scope.init();
        $rootScope.$digest();

        expect();

    });

    it('should create the times for the axis', function () {

        var $c_scope = $rootScope.$new(),
            hours = [
                '00:00', '01:00', '02:00', '03:00', '04:00', '05:00',
                '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
                '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
                '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
            ],
            day_1 = moment().hours(0).minutes(0).seconds(0),
            day_2 = moment(day_1).add(1, 'days'),
            x_axis = [
                { d: moment(day_1).format(), hours: hours},
                { d: moment(day_2).format(), hours: hours}
            ],
            dlgCtrl = $controller("snAvailabilityDlgCtrl", {
                $scope: $c_scope,
                $mdDialog: $mdDialog
            });

        expect(dlgCtrl).not.toBeNull();

        $c_scope.init();
        $rootScope.$digest();
        
        expect($c_scope.axisTimes).toEqual(x_axis);

    });
    
});
