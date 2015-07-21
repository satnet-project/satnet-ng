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

describe("Testing Rule Filters", function () {

    var printRuleFilter;

    beforeEach(function () {
        module('snRuleFilters');

        inject(function ($injector) {
            printRuleFilter = $injector.get('printRuleFilter');
        });

    });

    describe('printRule', function () {

        it('should print once rules', function () {

            var rule_cfg = {
                key: 1,
                rule_periodicity: 'rule_periodicity_once',
                rule_operation: '+',
                rule_dates: {
                    rule_once_date: 'XXX',
                    rule_once_starting_time: 'XXX',
                    rule_once_ending_time: 'XXX'
                }
            },
            x_str = '(+, ONCE)';

            expect(printRuleFilter(rule_cfg)).toEqual(x_str);

        });

    });

});