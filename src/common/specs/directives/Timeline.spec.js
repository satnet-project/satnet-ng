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
        $rootScope, $scope,
        __mock__cookies = {},
        $controller, dialogCtrl,
        snTimelineService,
        $body = $("body"),
        html = "<sn-timeline></sn-timeline>";

    beforeEach(function () {

        module(
            'templates',
            'snTimelineDirective',
            function($provide) {
                $provide.value('$cookies', __mock__cookies);
            }
        );

        inject(function ($injector) {

            $rootScope = $injector.get('$rootScope');
            $compile = $injector.get('$compile');
            $controller = $injector.get('$controller');

            $scope = $rootScope.$new();
            $directive = $compile(angular.element(html))($scope);

            snTimelineService = $injector.get('snTimelineService');

        });

        dialogCtrl = $controller("snTimelineCtrl", {
            $scope: $scope
        });

        $body.append($directive);
        $rootScope.$digest();

    });

    it('Should create a valid snTimelineService object', function () {
        expect(snTimelineService).not.toBeNull();
        expect(snTimelineService.initScope).toBeDefined();
    });
    
    afterEach(function () {
        $body.empty();
    });

});
