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
.constant('SC_LIST_MOCK', ['sc-test-1', 'sc-test-2'])
.constant('SC_COMPATIBILITY_MOCK', {
  "spacecraft_id": "HumSAT",
  "Compatibility": [
    {
      "Compatibility": [
        {
          "GroundStation": {
            "identifier": "gs-ag-1"
          },
          "GsChannel": {
            "band": {
              "IARU_allocation_minimum_frequency": "435000000.000000",
              "IARU_allocation_maximum_frequency": "438000000.000000",
              "downlink": true,
              "uplink": true
            },
            "polarizations": [
              {
                "polarization": "LHCP"
              },
              {
                "polarization": "RHCP"
              }
            ],
            "enabled": true,
            "bitrates": [
              {
                "bitrate": 300
              },
              {
                "bitrate": 600
              },
              {
                "bitrate": 900
              }
            ],
            "identifier": "ch-fm-1",
            "modulations": [
              {
                "modulation": "FM"
              }
            ],
            "bandwidths": [
              {
                "bandwidth": "12.500000000"
              },
              {
                "bandwidth": "25.000000000"
              }
            ],
            "automated": false
          }
        }
      ],
      "ScChannel": {
        "enabled": true,
        "frequency": "437365000.000",
        "identifier": "humd-fm1",
        "modulation": "FM",
        "bandwidth": "25.000000000",
        "polarization": "LHCP",
        "bitrate": 600
      }
    }
  ]
})
.constant('GS_AVAILABILITY_MOCK', [
    {
        identifier: 1,
        slot_start: '2014-09-08T06:00:00-05:00',
        slot_end: '2014-09-08T09:00:00-05:00'
    }
])
.constant('CHANNELS_OPTIONS_MOCK', {
    bands: ['UHF', 'VHF'],
    modulations: ['FM', 'AFSK'],
    polarizations: ['LHCP'],
    bitrates: [1200, 2400],
    bandwidths: [25.00, 50.00]
})
.constant('SC_CHANNEL_MOCK', {
    frequency: 437365000.0,
    modulation: 'FM', polarization: 'LHCP',
    bitrate: 1200, bandwidth: 25.00
})
.constant('GS_LIST_MOCK', [
    'gs-1', 'gs-2', 'gs-3'
])
.constant('GS_CHANNEL_MOCK', {
    band: 'UHF',
    modulations: ['FM'], polarizations: ['RHCP'],
    bitrates: [1200], bandwidths: [25.00, 37.50]
})
.constant('GS_RULES_MOCK', [
    '1', '2', '3'
])
.constant('GS_RULE_ID_MOCK', 1)
.service('satnetRPC', [
    '$log', '$q',
    'CHANNEL_ID_MOCK', 'CHANNEL_LIST_MOCK', 'CHANNELS_OPTIONS_MOCK',
    'SC_LIST_MOCK', 'GS_LIST_MOCK',
    'SC_COMPATIBILITY_MOCK',
    'GS_AVAILABILITY_MOCK',
    'SC_CHANNEL_MOCK', 'GS_CHANNEL_MOCK',
    'GS_RULES_MOCK', 'GS_RULE_ID_MOCK',

    function (
        $log, $q,
        CHANNEL_ID_MOCK, CHANNEL_LIST_MOCK, CHANNELS_OPTIONS_MOCK,
        SC_LIST_MOCK, GS_LIST_MOCK,
        SC_COMPATIBILITY_MOCK,
        GS_AVAILABILITY_MOCK,
        SC_CHANNEL_MOCK, GS_CHANNEL_MOCK,
        GS_RULES_MOCK, GS_RULE_ID_MOCK
    ) {

        this.getServerLocation = function (hostname) {
            $log.debug(
                '@satnetRPC [MOCK]: getServerLocation, hostname = ' + hostname
            );
            return $q.when().then(function() {
                return ['gs_test_1', 'gs_test_2'];
            });
        };

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
            $log.debug(
                '@satnetRPC [MOCK]: ' + service +
                ', params = ' + JSON.stringify(params, null, '  ')
            );

            if (service === 'sc.list') {
                result = SC_LIST_MOCK;
            }

            if (service === 'gs.list') {
                result = GS_LIST_MOCK;
            }

            if (service === 'sc.compatibility') {
                result = SC_COMPATIBILITY_MOCK;
            }

            if (service === 'gs.availability') {
                result = GS_AVAILABILITY_MOCK;
            }

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

            if (service === 'sc.channel.add') {
                result = true;
            }
            if (service === 'sc.channel.get') {
                result = SC_CHANNEL_MOCK;
            }
            if (service === 'gs.channel.add') {
                result = true;
            }
            if (service === 'gs.channel.get') {
                result = GS_CHANNEL_MOCK;
            }

            if (service === 'rules.add') {
                result = GS_RULE_ID_MOCK;
            }
            if (service === 'rules.list') {
                result = GS_RULES_MOCK;
            }
            if (service === 'rules.delete') {
                result = true;
            }

            if (result === null) {
                throw '@satnetRPC [MOCK]: Service <' + service + '> not found';
            }
            
            return $q.when().then(function() {
                return result;
            });

        };

    }]);