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
.constant('CHANNELS_OPTIONS_MOCK', {
    bands: ['UHF', 'VHF'],
    modulations: ['FM', 'AFSK'],
    polarizations: ['LHCP'],
    bitrates: [1200, 2400],
    bandwidths: [25.00, 50.00]
})
.service('satnetRPC', [
    '$log', '$q',
    'CHANNEL_ID_MOCK', 'CHANNEL_LIST_MOCK', 'CHANNELS_OPTIONS_MOCK',

    function (
        $log, $q,
        CHANNEL_ID_MOCK, CHANNEL_LIST_MOCK, CHANNELS_OPTIONS_MOCK
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
            var result = null;
            $log.debug('@satnetRPC: using mocked service');
            
            if ((service === 'sc.channel.list') ||
                (service === 'gs.channel.list')) {
                result = CHANNEL_LIST_MOCK;
            }

            if ((service === 'sc.channel.delete') ||
                (service === 'gs.channel.delete')) {
                result = params[1];
            }

            if (service === 'channels.options') {
                result = CHANNELS_OPTIONS_MOCK;
            }

            if (service === 'sc.channel.get') {
                result = {
                    frequency: 437.365, modulation: 'FM', polarization: 'LHCP',
                    bitrate: 1200, bandwidth: 25.00
                };
            }
            if (service === 'gs.channel.get') {
                result = {
                    band: 'UHF', modulations: ['FM', 'AFSK'],
                    polarizations: ['LHCP'],
                    bitrates: [1200, 2400], bandwidths: [25.00]
                };
            }

            return $q.when().then(function() {
                return result;
            });

        };

    }]);