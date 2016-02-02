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

angular.module('snRequestsFilters', [])
.constant('SLOT_DATE_FORMAT', 'YYYY.MM.DD@hh:mm:ssZ')
.filter('filterSelected',

    /**
     * Filters out all the slots whose state is not 'SELECTED'.
     * 
     * @returns Slot object if the slot is 'SELECTED'.
     */
    function () {
        return function (slot) {
            if (slot.state === 'SELECTED') { return slot; }
        };
    }

)
.filter('filterFree',

    /**
     * Filters out all the slots whose state is not 'FREE'.
     * 
     * @returns Slot object if the slot is 'FREE'.
     */
    function () {
        return function (slot) {
            if (slot.state === 'FREE') {
                console.log('FREE');
                return slot;
            }
            return;
        };
    }

)
.filter('printRequest', [ 'SLOT_DATE_FORMAT',

    /**
     * Filter that prints out a human-readable definition of the slot request.
     * 
     * @returns {String} Human-readable string
     */
    function (SLOT_DATE_FORMAT) {
        return function (slot) {

            var start_d = moment(slot.date_start),
                end_d = moment(slot.date_end),
                duration = moment.duration(end_d.diff(start_d));

            return start_d.format(SLOT_DATE_FORMAT) +
                ' <' + duration.humanize() + '>';

        };
    }

]);