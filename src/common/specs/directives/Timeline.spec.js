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

describe('Testing Timeline directive', function () {

    var $compile, $directive, $log,
        $rootScope, $scope,
        __mock__cookies = {},
        $controller, controller,
        timeline,
        SN_SCH_TIMELINE_DAYS,
        SN_SCH_HOURS_DAY,
        SN_SCH_GS_ID_WIDTH,
        SN_SCH_DATE_FORMAT,
        SN_SCH_HOUR_FORMAT,
        SN_SCH_GS_ID_MAX_LENGTH,
        $body = $("body"),
        html = "<sn-timeline/>";

    beforeEach(function () {

        module(
            'templates', 'snTimelineDirective', 'snTimelineServices',
            function($provide) {
                $provide.value('$cookies', __mock__cookies);
            }
        );

        inject(function ($injector) {

            $rootScope = $injector.get('$rootScope');
            $compile = $injector.get('$compile');
            $controller = $injector.get('$controller');
            $log = $injector.get('$log');

            SN_SCH_TIMELINE_DAYS = $injector.get('SN_SCH_TIMELINE_DAYS');
            SN_SCH_HOURS_DAY = $injector.get('SN_SCH_HOURS_DAY');
            SN_SCH_GS_ID_WIDTH = $injector.get('SN_SCH_GS_ID_WIDTH');
            SN_SCH_DATE_FORMAT = $injector.get('SN_SCH_DATE_FORMAT');
            SN_SCH_HOUR_FORMAT = $injector.get('SN_SCH_HOUR_FORMAT');
            SN_SCH_GS_ID_MAX_LENGTH = $injector.get('SN_SCH_GS_ID_MAX_LENGTH');

            timeline = $injector.get('timeline');

        });

        $scope = $rootScope.$new();
        controller = $controller("snTimelineCtrl", {
            $scope: $scope,
            $log: $log,
            SN_SCH_TIMELINE_DAYS: SN_SCH_TIMELINE_DAYS,
            SN_SCH_HOURS_DAY: SN_SCH_HOURS_DAY,
            SN_SCH_GS_ID_WIDTH: SN_SCH_GS_ID_WIDTH,
            SN_SCH_DATE_FORMAT: SN_SCH_DATE_FORMAT,
            SN_SCH_HOUR_FORMAT: SN_SCH_HOUR_FORMAT,
            SN_SCH_GS_ID_MAX_LENGTH: SN_SCH_GS_ID_MAX_LENGTH,
            timeline: timeline
        });

        $directive = $compile(angular.element(html))($scope);

        $body.append($directive);
        $rootScope.$digest();

    });

    it('Should create a proper timeline', function () {

        var row_container = $('.sn-sch-row-hours-container').eq(0),
            row_table = $('.sn-sch-row-table').eq(0);

        expect(row_container).toBeDefined();
        expect(row_table).toBeDefined();

    });

    afterEach(function () {
        $body.empty();
    });

});
