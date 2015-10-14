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

    var satnetServices, $rootScope, $q, $log,
        __mock__cookies = {},
        __mock__rpc_method = jasmine.createSpy("rpcMethod").and.callFake(
            function () {
                return $q.when();
            }
        ),
        __bind__createMethod = jasmine.createSpy("createMethod").and.callFake(
            function () {
                return __mock__rpc_method;
            }
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
        module('snJRPCServices');

        module(function ($provide) {
            $provide.value('jsonrpc', __mock__jsonrpc);
            $provide.value('$cookies', __mock__cookies);
        });

        inject(function ($injector) {
            satnetServices = $injector.get('satnetRPC');
            $rootScope = $injector.get('$rootScope');
            $q = $injector.get('$q');
            $log = $injector.get('$log');
        });

    });

    it('should tweak the port for the server during (TESTING)', function () {

        var x_satnet_address = 'http://server:80',
            x_rpc_address = 'http://server:80/jrpc/';

        expect(satnetServices._getSatNetAddress).toBeDefined();
        expect(satnetServices._getSatNetAddress()).toBe(x_satnet_address);

        expect(satnetServices._getRPCAddress).toBeDefined();
        expect(satnetServices._getRPCAddress()).toBe(x_rpc_address);

    });

    it('should return a valid satnetServices object', function () {

        expect(satnetServices).toBeDefined();
        expect(satnetServices._services).toBeDefined();

    });

    it('should implement a valid API for the GS services', function () {

        expect(satnetServices._services['gs.list']).toBeDefined();
        expect(satnetServices._services['gs.add']).toBeDefined();
        expect(satnetServices._services['gs.get']).toBeDefined();
        expect(satnetServices._services['gs.update']).toBeDefined();
        expect(satnetServices._services['gs.delete']).toBeDefined();

    });

    it('should implement a valid API for the SC services', function () {

        expect(satnetServices._services['sc.list']).toBeDefined();
        expect(satnetServices._services['sc.add']).toBeDefined();
        expect(satnetServices._services['sc.get']).toBeDefined();
        expect(satnetServices._services['sc.update']).toBeDefined();
        expect(satnetServices._services['sc.delete']).toBeDefined();

    });

    it('should implement a valid API for user services', function () {

        expect(satnetServices._services['user.getLocation']).toBeDefined();

    });

    it('should implement a valid API for TLE services', function () {

        expect(satnetServices._services['tle.celestrak.getSections'])
            .toBeDefined();
        expect(satnetServices._services['tle.celestrak.getResource'])
            .toBeDefined();
        expect(satnetServices._services['tle.celestrak.getTle'])
            .toBeDefined();

    });

    it('should implement a valid API for SIMULATION services', function () {

        expect(satnetServices._services['sc.getGroundtrack']).toBeDefined();
        expect(satnetServices._services['sc.getPasses']).toBeDefined();
        expect(satnetServices._services['gs.getPasses']).toBeDefined();

    });

    it('should implement a valid API for NETWORK services', function () {

        expect(satnetServices._services['net.alive']).toBeDefined();

    });

    /*
    it('should implement a valid API for LEOP services', function () {

        expect(satnetServices._services['leop.getCfg']).toBeDefined();
        expect(satnetServices._services['leop.setCfg']).toBeDefined();
        expect(satnetServices._services['leop.getPasses']).toBeDefined();

        expect(satnetServices._services['leop.getCfg']).toBeDefined();
        expect(satnetServices._services['leop.setCfg']).toBeDefined();
        expect(satnetServices._services['leop.getPasses']).toBeDefined();
        expect(satnetServices._services['leop.gs.list']).toBeDefined();
        expect(satnetServices._services['leop.sc.list']).toBeDefined();
        expect(satnetServices._services['leop.gs.add']).toBeDefined();
        expect(satnetServices._services['leop.gs.remove']).toBeDefined();
        expect(satnetServices._services['leop.ufo.add']).toBeDefined();
        expect(satnetServices._services['leop.ufo.remove']).toBeDefined();
        expect(satnetServices._services['leop.ufo.identify']).toBeDefined();
        expect(satnetServices._services['leop.ufo.forget']).toBeDefined();
        expect(satnetServices._services['leop.ufo.update']).toBeDefined();
        expect(satnetServices._services['leop.getMessages']).toBeDefined();

    });
    */

    it('should implement a remote calling method', function () {

        spyOn($log, 'info');

        expect(function () {
            satnetServices.rCall('xxxx', []);
        }).toThrow('@rCall: service not found, id = <xxxx>');

        satnetServices.rCall('gs.list', ['param_1']);
        expect($log.info).toHaveBeenCalledWith(
            '@rCall: Invoked service = <gs.list>, params = [\"param_1\"]'
        );

    });

    it('should internal handle JRPC errors', function () {

        var x_service = 'x_srv',
            x_param = ['p1'],
            x_code = 'c',
            x_msg = 'm',
            x_th_msg = 'Satnet.js@_generateError: invoking = <' + x_service +
            '>, with params = <' + JSON.stringify(x_param) +
            '>, code = <\"' + x_code + '\">, description = <\"' + x_msg + '\">';

        spyOn($log, 'warn');

        expect(function () {
            satnetServices._generateError(x_service, x_param, x_code, x_msg);
        }).toThrow(x_th_msg);

        expect($log.warn).toHaveBeenCalledWith(x_th_msg);

    });

});