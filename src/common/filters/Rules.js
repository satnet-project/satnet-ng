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

angular.module('snRuleFilters', [])
.constant('RULE_PERIODICITIES', {
    rule_periodicity_once: 'ONCE',
    rule_periodicity_daily: 'DAILY',
    rule_periodicity_weekly: 'WEEKLY'
})
.filter('printRule', [
    'RULE_PERIODICITIES',

    /**
     * Filter that prints out a human-readable definition of the rule to be
     * filtered.
     * 
     * @param   {Object} RULE_PERIODICITIES Dictionary with the conversion
     * @returns {String} Human-readable string
     */
    function (RULE_PERIODICITIES) {
        return function (rule) {
            var p = RULE_PERIODICITIES[rule.rule_periodicity],
                date_str;

            if ( p === RULE_PERIODICITIES.rule_periodicity_once ) {
                date_str = '' + rule.rule_dates.rule_once_date;
            }
            if ( p === RULE_PERIODICITIES.rule_periodicity_daily ) {
                date_str = '' +
                    rule.rule_dates.rule_daily_initial_date + ' >>> ' +
                    rule.rule_dates.rule_daily_final_date;
            }

            return '' + 
                '(' + rule.rule_operation + ', ' + p + ') [' + date_str + ']';

        };
    }

]);