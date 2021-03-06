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

    var $compile, $directive,
        $log, $mdDialog,
        $rootScope, $scope,
        timeline, snDialog,
        SN_SCH_TIMELINE_DAYS,
        SN_SCH_HOURS_DAY,
        SN_SCH_GS_ID_WIDTH,
        SN_SCH_DATE_FORMAT,
        SN_SCH_HOUR_FORMAT,
        SN_SCH_GS_ID_MAX_LENGTH,
        __mock__cookies = {},
        $controller, dialogCtrl, schedulerCtrl,
        $body = $("body"),
        html = "<sn-availability></sn-availability>";

    beforeEach(function () {

        module(
            'templates',
            'snControllers',
            'snTimelineServices',
            'snTimelineDirective',
            'snAvailabilityDirective',
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
            timeline = $injector.get('timeline');
            SN_SCH_TIMELINE_DAYS = $injector.get('SN_SCH_TIMELINE_DAYS');
            SN_SCH_HOURS_DAY = $injector.get('SN_SCH_HOURS_DAY');
            SN_SCH_GS_ID_WIDTH = $injector.get('SN_SCH_GS_ID_WIDTH');
            SN_SCH_DATE_FORMAT = $injector.get('SN_SCH_DATE_FORMAT');
            SN_SCH_HOUR_FORMAT = $injector.get('SN_SCH_HOUR_FORMAT');
            SN_SCH_GS_ID_MAX_LENGTH = $injector.get('SN_SCH_GS_ID_MAX_LENGTH');

        });

        $scope = $rootScope.$new();
        $directive = $compile(angular.element(html))($scope);

        dialogCtrl = $controller("snAvailabilityDlgCtrl", {
            $scope: $scope,
            $mdDialog: $mdDialog
        });

        schedulerCtrl = $controller("snAvailabilitySchCtrl", {
            $scope: $scope,
            $log: $log,
            snDialog: snDialog,
            SN_SCH_TIMELINE_DAYS: SN_SCH_TIMELINE_DAYS,
            SN_SCH_HOURS_DAY: SN_SCH_HOURS_DAY,
            SN_SCH_GS_ID_WIDTH: SN_SCH_GS_ID_WIDTH,
            SN_SCH_DATE_FORMAT: SN_SCH_DATE_FORMAT,
            SN_SCH_HOUR_FORMAT: SN_SCH_HOUR_FORMAT,
            SN_SCH_GS_ID_MAX_LENGTH: SN_SCH_GS_ID_MAX_LENGTH,
            timeline: timeline
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

    it('should initialize the controller for the scheduler', function () {

        var $c_scope = $rootScope.$new(),
            schedulerCtrl = $controller("snAvailabilitySchCtrl", {
                $scope: $c_scope,
                $mdDialog: $mdDialog
            });

        expect(schedulerCtrl).not.toBeNull();

        $c_scope.init();
        $rootScope.$digest();

        expect(Object.keys($c_scope.gui.slots).length).toEqual(3);

    });

});
