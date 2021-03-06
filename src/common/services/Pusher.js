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

/** Module definition (empty array is vital!). */
angular
.module('snPushServices', [
    'pusher-angular'
])
.service('satnetPush', [
    '$log', '$pusher',
    function ($log, $pusher) {
        'use strict';

        this._API_KEY = '79bee37791b6c60f3e56';

        this._client = null;
        this._service = null;

        // Names of the channels for subscription
        this.LEOP_DOWNLINK_CHANNEL = 'leop.downlink.ch';
        this.EVENTS_CHANNEL = 'configuration.events.ch';
        this.NETWORK_EVENTS_CHANNEL = 'network.events.ch';
        this.SIMULATION_CHANNEL = 'simulation.events.ch';
        this.LEOP_CHANNEL = 'leop.events.ch';
        // List of events that an application can get bound to.
        this.KEEP_ALIVE = 'keep_alive';
        this.FRAME_EVENT = 'frameEv';
        this.GS_ADDED_EVENT = 'gsAddedEv';
        this.GS_REMOVED_EVENT = 'gsRemovedEv';
        this.GS_UPDATED_EVENT = 'gsUpdatedEv';
        this.PASSES_UPDATED_EVENT = 'passesUpdatedEv';
        this.GT_UPDATED_EVENT = 'groundtrackUpdatedEv';
        this.LEOP_GSS_UPDATED_EVENT = 'leopGSsUpdatedEv';
        this.LEOP_GS_ASSIGNED_EVENT = 'leopGSAssignedEv';
        this.LEOP_GS_RELEASED_EVENT = 'leopGSReleasedEv';
        this.LEOP_UPDATED_EVENT = 'leopUpdatedEv';
        this.LEOP_UFO_IDENTIFIED_EVENT = 'leopUFOIdentifiedEv';
        this.LEOP_UFO_FORGOTTEN_EVENT = 'leopUFOForgottenEv';
        this.LEOP_SC_UPDATED_EVENT = 'leopSCUpdatedEv';

        // List of channels that the service automatically subscribes to.
        this._channel_names = [
            this.LEOP_DOWNLINK_CHANNEL,
            this.EVENTS_CHANNEL,
            this.SIMULATION_CHANNEL,
            this.NETWORK_EVENTS_CHANNEL,
            this.LEOP_CHANNEL
        ];

        /**
         * Initializes the pusher service.
         */
        this._initData = function () {

            this._client = new Pusher(this._API_KEY, {
                encrypted: true
            });
            this._service = $pusher(this._client);
            this._service.connection.bind('state_change', this._logConnection);
            $log.info('[push] pusher.com service initialized!');

            this._subscribeChannels();

        };

        /**
         * Logs changes in the connection state for the pusher service.
         *
         * @param {Array} states Array with the former and current state of the
         *                       connection.
         */
        this._logConnection = function (states) {
            $log.info(
                '[push] State connection change, states = ' +
                JSON.stringify(states)
            );
        };

        /**
         * Subscribe this service to all the channels whose names are part of
         * the "_channel_names_ array.
         */
        this._subscribeChannels = function () {
            var self = this;
            angular.forEach(this._channel_names, function (name) {
                self._service.subscribe(name);
                $log.info('[push] Subscribed to channel <' + name + '>');
            });
        };

        /**
         * Method that binds the given function to the events triggered by
         * that channel.
         *
         * @param {String} channel_name Name of the channel
         * @param {String} event_name Name of the event
         * @param {Function} callback_fn Function to be executed when that
         *                               event happens
         */
        this.bind = function (channel_name, event_name, callback_fn) {
            if (!this._service.allChannels().hasOwnProperty(channel_name)) {
                throw 'Not subscribed to this channel, ' +
                'name = <' + channel_name + '>';
            }
            this._service.channel(channel_name).bind(event_name, callback_fn);
        };

        /**
         * Binds the given callback function to the reception of any event
         * frames on the downlink channel.
         *
         * @param {Object} callback_fn Callback function to be bound
         */
        this.bindFrameReceived = function (callback_fn) {
            this.bind(
                this.LEOP_DOWNLINK_CHANNEL,
                this.FRAME_EVENT,
                callback_fn,
                this
            );
        };

        this._initData();

    }

]);