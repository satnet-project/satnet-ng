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

/** Module definition (empty array is vital!). */
angular.module('snJRPCMock', [])
.constant('CHANNEL_ID_MOCK', 'channel-test')
.constant('CHANNEL_LIST_MOCK', ['channel_1', 'channel_2'])
.service('satnetRPC', [
    '$log', '$q',
    'CHANNEL_ID_MOCK', 'CHANNEL_LIST_MOCK',

    function (
        $log, $q,
        CHANNEL_ID_MOCK, CHANNEL_LIST_MOCK
    ) {

        /**
         * Method for calling the remote service through JSON-RPC.
         *
         * @param service The name of the service, as per the internal
         * services name definition.
         * @param params The parameters for the service (as an array).
         * @returns {*}
         */
        this.rCall = function (service, params) {
            $log.debug('@satnetRPC: using mocked service');

            if  (
                    (service === 'sc.channel.list') ||
                    (service === 'gs.channel.list')
                )
            {
                return $q.when().then(function() {
                    return CHANNEL_LIST_MOCK;
                });
            }

            if  (
                    (service === 'sc.channel.delete') ||
                    (service === 'gs.channel.delete')
                )
            {
                return $q.when().then(function() {
                    return params[1];
                });
            }

            if  (service === 'channels.options') {
                return $q.when().then(function () {
                    return {
                        bands: [],
                        modulations: [],
                        polarizations: [],
                        bitrates: [],
                        bandwidths: []
                    };
                });
            }

        };

    }]);