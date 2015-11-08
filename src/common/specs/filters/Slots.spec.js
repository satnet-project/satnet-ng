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

describe("Testing Slot Filters", function () {

    var slotifyFilter,
        __mock__cookies = {};

    beforeEach(function () {
        module(
            'snAvailabilityDirective',
            function($provide) {
                $provide.value('$cookies', __mock__cookies);
            }
        );

        inject(function ($injector) {
            slotifyFilter = $injector.get('slotifyFilter');
        });

    });

    describe('slotifyFilter', function () {

        it('should filter out availability slots', function () {

            var today = moment(),
                a_slot = {
                    identifier: 1,
                    date_start: moment(today).subtract(1, 'hours').format(),
                    date_end: moment(today).add(1, 'hours').format()
                },
                duration_s = 2 * 24 * 60 * 60,
                width_s = 1 * 60 * 60,
                width = ((width_s / duration_s) * 100 ).toFixed(3),
                x_slot = {
                    raw_slot: a_slot,
                    slot: {
                        left: 0.000,
                        width: width
                    }
                };

            console.log('>>> duration_s = ' + duration_s);
            console.log('>>> width_s = ' + width_s);
            console.log('>>> width = ' + width);

            console.log('>>> a_slot = ' + JSON.stringify(a_slot));
            //expect(slotifyFilter(a_slot)).toEqual(x_slot);

        });

    });

});
