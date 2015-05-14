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

    it('should return a valid API pushServices object', function () {
        expect(satnetPush).toBeDefined();

        expect(satnetPush.LEOP_DOWNLINK_CHANNEL).toBe('leop.downlink.ch');
        expect(satnetPush.EVENTS_CHANNEL).toBe('configuration.events.ch');
        expect(satnetPush.NETWORK_EVENTS_CHANNEL).toBe('network.events.ch');
        expect(satnetPush.SIMULATION_CHANNEL).toBe('simulation.events.ch');
        expect(satnetPush.LEOP_CHANNEL).toBe('leop.events.ch');

        expect(satnetPush.KEEP_ALIVE).toBe('keep_alive');
        expect(satnetPush.FRAME_EVENT).toBe('frameEv');

        expect(satnetPush.GS_ADDED_EVENT).toBe('gsAddedEv');
        expect(satnetPush.GS_REMOVED_EVENT).toBe('gsRemovedEv');
        expect(satnetPush.GS_UPDATED_EVENT).toBe('gsUpdatedEv');

        expect(satnetPush.PASSES_UPDATED_EVENT).toBe('passesUpdatedEv');
        expect(satnetPush.GT_UPDATED_EVENT).toBe('groundtrackUpdatedEv');

        expect(satnetPush.LEOP_GSS_UPDATED_EVENT).toBe('leopGSsUpdatedEv');
        expect(satnetPush.LEOP_GS_ASSIGNED_EVENT).toBe('leopGSAssignedEv');
        expect(satnetPush.LEOP_GS_RELEASED_EVENT).toBe('leopGSReleasedEv');

        expect(satnetPush.LEOP_UPDATED_EVENT).toBe('leopUpdatedEv');

        expect(satnetPush.LEOP_UFO_IDENTIFIED_EVENT).toBe('leopUFOIdentifiedEv');
        expect(satnetPush.LEOP_UFO_FORGOTTEN_EVENT).toBe('leopUFOForgottenEv');
        expect(satnetPush.LEOP_SC_UPDATED_EVENT).toBe('leopSCUpdatedEv');

    });
    
    /* FIXME: $pusher.allChannels() is undefined, ask @github?
    it('it should bind callbacks to the channels', function () {

        var __mock__frame_rx_cb = function () {};

        expect(satnetPush.bind('xxxx', 'zzzz', function () {})).toThrow('Not subscribed to this channel, name = xxxx');

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