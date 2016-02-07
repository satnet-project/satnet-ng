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
 * Created by rtubio on 10/24/14.
 */

angular
.module('snApplicationBus', ['jsonrpc', 'ngCookies'])
.service('snMessageBus', [
    '$rootScope', '$log',

    /**
     * Service that enables the internal message exchange among the angular
     * controllers running for this application.
     *
     * @param   {Object} $rootScope $rootScope scope
     * @param   {Object} $log       $log service
     */
    function ($rootScope, $log) {

        this.CHANNELS = {
            requests: {
                id: 'created'
            }
        };

        this.EVENTS = {
            created: {
                id: 'created'
            },
            updated: {
                id: 'updated'
            },
            deleted : {
                id: 'deleted'
            },
            accepted: {
                id: 'accepted'
            },
            denied: {
                id: 'denied'
            },
            dropped: {
                id: 'dropped'
            }
        };

        /**
         * Method that allows sending a message to a channel with an associated
         * event.
         *
         * @param {String} channel String with the identifier of the channel
         * @param {String} event String with the identifier of the event
         * @param {Object} data Object with the data to be serialized
         */
        this.send = function (channel, event, data) {
            var name = channel + ':' + event;
            $log.log(
                '>>> @sn-msg-bus: notification <' + name +
                '>: ' + JSON.stringify(data, null, 4)
            );
            $rootScope.$broadcast(name, data);
        };

    }

]);
