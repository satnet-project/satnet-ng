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

describe('Testing SatNet Service', function () {

    var satnetServices, $rootScope,
        __bind__createMethod = jasmine.createSpy("createMethod").and.callFake(
            function () {}
        ),
        __mock__rpc = {
            createMethod: __bind__createMethod
        },
        __bind__newService = jasmine.createSpy("newService").and.callFake(
            function () {
                return __mock__rpc;
            }
        ),
        __mock__jsonrpc = {
            newService: __bind__newService
        };

    beforeEach(function () {
        module('satnetServices');

        module(function ($provide) {
            $provide.value('jsonrpc', __mock__jsonrpc);
        });

        inject(function ($injector) {
            satnetServices = $injector.get('satnetRPC');
            $rootScope = $injector.get('$rootScope');
        });

    });

    it('should return a defined satnetServices object', function () {
        expect(satnetServices).toBeDefined();
    });

});