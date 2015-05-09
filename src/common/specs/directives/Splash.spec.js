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

describe('Testing Splash directive', function () {

    var $rootScope, $scope, $q,
        $compile,
        $directive,
        $body = $("body"),
        mock__animate = {
            leave: function () {
                return $q.when();
            }
        },
        html =
        "<div class='m-app-loading' ng-animate-children>" +
        "   <div class='animated-container'>" +
        "       <div class='messaging'>" +
        "           <h2>Operations Interface</h2>" +
        "       </div>" +
        "   </div>" +
        "</div>";

    beforeEach(function () {

        module('splashDirective', function ($provide) {
            $provide.value('$animate', mock__animate);
        });

        inject(function ($injector) {

            $rootScope = $injector.get('$rootScope');
            $compile = $injector.get('$compile');
            $q = $injector.get('$q');

            $scope = $rootScope.$new();
            $directive = $compile(angular.element(html))($scope);

        });

        $body.append($directive);
        $rootScope.$digest();

    });

    it('should compile the directive', function () {
        expect($directive).toBeDefined();
        var div_directive = $("div.m-app-loading");
        expect(div_directive).not.toBeNull();
        //expect(div_directive.length).toBe(1);
    });

});