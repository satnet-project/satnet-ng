/*
   Copyright 2015 Ricardo Tubio-Pardavila

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

angular.module('snSlotFilters', [])
.constant('SN_SCH_TIMELINE_DAYS', '2')
.filter('slotify', [
    'SN_SCH_TIMELINE_DAYS',

    /**
     * Filter that prints out a human-readable definition of the rule to be
     * filtered.
     * 
     * @returns {String} Human-readable string
     */
    function (SN_SCH_TIMELINE_DAYS) {
        return function (slot) {

            var start_d = moment().hours(0).minutes(0).seconds(0),
                end_d = moment(start_d).add(SN_SCH_TIMELINE_DAYS, 'days'),
                slot_start_d = moment(slot.date_start),
                slot_end_d = moment(slot.date_end);

            // 1) The dates are first normalized, so that the slots are only
            //      displayed within the given start and end dates.
            slot_start_d = moment(slot_start_d).isBefore(start_d) ? start_d : slot_start_d;
            slot_end_d = moment(slot_end_d).isAfter(end_d) ? end_d : slot_end_d;

            // 2) After normalizing the dates, we can calculate the position
            //      and widths of the displayable slots.
            // TODO
            
            return {
                raw_slot: slot,
                container: {
                    width: 0
                },
                blank: {
                    left: 0,
                    width: 0
                },
                slot: {
                    left: 0,
                    width: 0
                }
            };

        };
    }

]);
