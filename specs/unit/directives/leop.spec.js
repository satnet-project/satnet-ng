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

describe('Testing LEOP Directive', function () {

    var $rootScope, $scope,
        $compile,
        el, $el, $el_test,
        $body = $("body"),
        simpleHtml = "<div class='jtest'>JTEST</div><leopApp></leopApp>";

    beforeEach(function() {

        module('templates', 'leopDirective');

        inject(function($injector) {

            $rootScope = $injector.get('$rootScope');
            $compile = $injector.get('$compile');
            $scope = $rootScope.$new();

            el = $compile(angular.element(simpleHtml))($scope);

        });

        $body.append(el);
        $rootScope.$digest();

        $el = $(".xtest");
        $el_test = $(".jtest");

    });

    afterEach(function () {
        $body.empty();
    });

    it("Should render the directive out in the DOM", function () {
        //expect($el.length).toEqual(1);
        expect($el_test.length).toEqual(1);
        expect($el_test.text()).toEqual('JTEST');
    });
    
});