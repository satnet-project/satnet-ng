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

describe('Testing Pusher Service', function () {

    var $rootScope, $log,
        satnetPush,
        /**
         * Mock for the factory object of the pushServices service.
         * @param   {Object} $client $pusher object.
         * @returns {Object} $pusher object.
         */
        __mock__pusher = function ($client) {
            return $client;
        };

    beforeEach(function () {
        module('pushServices');

        module(function ($provide) {
            $provide.value('$pusher', __mock__pusher);
        });

        inject(function ($injector) {
            satnetPush = $injector.get('satnetPush');
            $rootScope = $injector.get('$rootScope');
            $log = $injector.get('$log');
        });

        spyOn($log, 'info');
        spyOn(satnetPush, '_subscribeChannels');
        spyOn(angular, 'forEach');

        satnetPush._initData();
        expect(satnetPush._subscribeChannels).toHaveBeenCalled();

        /* FIXME: angular.forEach never called in the tests
        expect(angular.forEach).toHaveBeenCalledWith(
            [
                'leop.downlink.ch',
                'configuration.events.ch',
                'simulation.events.ch',
                'network.events.ch',
                'leop.events.ch'
            ], Function
        );
        */

    });

    it('should return a non-null pushServices object', function () {
        expect(satnetPush).toBeDefined();
    });

    /* FIXME: $pusher.allChannels() is undefined, ask @github?
    it('it should bind callbacks to the channels', function () {

        var __mock__frame_rx_cb = function () {};

        satnetPush.bind(
            'leop.downlink.ch', 'frameEv', __mock__frame_rx_cb, satnetPush
        );

    });
    */

    it('should bind the frame received callback', function () {

        var __mock__frame_rx_cb = function () {};

        spyOn(satnetPush, 'bind');
        satnetPush.bindFrameReceived(__mock__frame_rx_cb);

        expect(satnetPush.bind).toHaveBeenCalledWith(
            'leop.downlink.ch', 'frameEv', __mock__frame_rx_cb, satnetPush
        );

    });

    it('should log the connection change status', function () {

        spyOn($log, 'warn');
        satnetPush._logConnection(['state_a', 'state_b']);

        expect($log.warn).toHaveBeenCalledWith(
            '[push] State connection change, states = [\"state_a\",\"state_b\"]'
        );

    });

});