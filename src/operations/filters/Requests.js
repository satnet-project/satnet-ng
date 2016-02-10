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
.filter('outByState', [

    /**
     * Filters out the sltos with the given state.
     *
     * @returns {Object} The given slot if the state does not match or 'null'
     */
    function () {
        return function (slot, state) {
            if (slot === undefined) { return null; }
            if (slot.state === state) {
                return null;
            }
            return slot;
        };
    }

])
.filter('printRequest', [ 'SLOT_DATE_FORMAT',

    /**
     * Filter that prints out a human-readable definition of the slot request.
     *
     * @returns {String} Human-readable string
     */
    function (SLOT_DATE_FORMAT) {
        return function (slot) {

            moment.locale('en');

            var start_d = moment(slot.date_start),
                end_d = moment(slot.date_end),
                duration = moment.duration(end_d.diff(start_d)),
                duration_s = duration.humanize().replace(/ minute(s)*/, '\'');

            return start_d.format(SLOT_DATE_FORMAT) + ' :: ' + duration_s;

        };
    }

]);
