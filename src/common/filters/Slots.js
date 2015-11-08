/*
   Copyright 2014 Ricardo Tubio-Pardavila

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

angular.module('snSlotFilters', [ 'snAvailabilityDirective' ])
.filter('slotify', [
    'SN_SCH_TIMELINE_DAYS', 'snAvailabilityDlgCtrl',

    /**
     * Function that filters out the availability slots and transforms them
     * into an array of slots that can be directly displayed in a timeline.
     * 
     * @param   {Number} SN_SCH_TIMELINE_DAYS Constant with the number of days
     *                                        to be displayed in the timeline
     *                                        where the slots are supposed to
     *                                        be relatively positioned
     * @returns {Array}  Array with the new displayable slots
     */
    function (SN_SCH_TIMELINE_DAYS, snAvailabilityDlgCtrl) {

        return function (slots) {

            console.log('FFFF slots = ' + JSON.stringify(slots));

            if (!slots) { return []; }
            if (slots.length === 0) { return []; }

            var r_slots = {},
                start_d = moment().hours(0).minutes(0).seconds(0),
                end_d = moment(start_d).add(SN_SCH_TIMELINE_DAYS, 'days');

            angular.forEach(slots, function (gs_slots, gs_id) {
                r_slots[gs_id] = snAvailabilityDlgCtrl.filter_slots(
                    gs_id, gs_slots, start_d, end_d
                );
            });

            console.log('FFFF R_SLOTS = ' + JSON.stringify(slots));
            return r_slots;

        };

    }

]);
