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

angular
.module('snSlotFilters', ['snAvailabilityDirective'])
.constant('SLOT_DATE_FORMAT', 'YYYY.MM.DD@hh:mm:ssZ')
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

            return r_slots;

        };

    }

]).filter('printState', [

    /**
     * Function that filters the state for each slot and returns an identifier.
     */
    function () {

        return function (slot) {

            if (!slot) { return '!'; }

            if (slot.state === 'UNDEFINED' ) { return '?'; }
            if (slot.state === 'FREE') { return 'F'; }
            if (slot.state === 'SELECTED') { return 'S'; }
            if (slot.state === 'RESERVED') { return 'R'; }
            if (slot.state === 'DENIED') { return 'D'; }
            if (slot.state === 'CANCELED') { return 'C'; }
            if (slot.state === 'REMOVED') { return 'X'; }

        };

    }

]).filter('printSlotDate', [ 'SLOT_DATE_FORMAT',

    /**
     * Function that filters the date of a slot and applies the proper format.
     */
    function (SLOT_DATE_FORMAT) {

        return function (date) {
            if (!date) { return '!'; }
            return moment(date).format(SLOT_DATE_FORMAT);
        };

    }

]);
