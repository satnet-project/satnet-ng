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
            x_day_1 = moment().hours(0).minutes(0).seconds(0),
            x_day_2 = moment(x_day_1).add(1, 'days'),
            x_days = [
                moment(x_day_1).format('DD-MM'),
                '08:00',
                '16:00',
                moment(x_day_2).format('DD-MM'),
                '08:00',
                '16:00'
            ],
            dlgCtrl = $controller("snAvailabilityDlgCtrl", {
                $scope: $c_scope,
                $mdDialog: $mdDialog
            });

        expect(dlgCtrl).not.toBeNull();

        $c_scope.init();
        $rootScope.$digest();
        
        expect($c_scope.gui.days).toEqual(x_days);

    });

    it('should create the values for the animation', function () {

        var $c_scope = $rootScope.$new(),
            x_day_1 = moment().hours(0).minutes(0).seconds(0),
            end_d =  moment(x_day_1).add(2, 'days'),
            now = moment(),
            x_animation = {
                duration: '',
                initial_width: '',
                final_width: '100%'
            },
            dlgCtrl = $controller("snAvailabilityDlgCtrl", {
                $scope: $c_scope,
                $mdDialog: $mdDialog
            }),
            ellapsed_s = moment(now).unix() - moment(x_day_1).unix(),
            total_s = moment(end_d).unix() - moment(x_day_1).unix();

        x_animation.duration = '' + ( total_s - ellapsed_s );
        x_animation.initial_width = '' +
            ( ( ellapsed_s / total_s ) * 100 ).toFixed(3) + '%';

        expect(dlgCtrl).not.toBeNull();

        $c_scope.init();
        $rootScope.$digest();
        
        expect($c_scope.animation).toEqual(x_animation);

    });

});
