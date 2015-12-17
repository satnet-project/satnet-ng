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

    var printRuleFilter, printRuleTitleFilter;

    beforeEach(function () {
        module('snRuleFilters');

        inject(function ($injector) {
            printRuleFilter = $injector.get('printRuleFilter');
            printRuleTitleFilter = $injector.get('printRuleTitleFilter');
        });

    });

    describe('printRule', function () {

        it('should print once rules', function () {

            var rule_cfg = {
                key: 1,
                rule_periodicity: 'rule_periodicity_once',
                rule_operation: '+',
                rule_dates: {
                    rule_once_date: '2014-09-08T00:00:00+00:00',
                    rule_once_starting_time: '2014-09-08T06:00:00-05:00',
                    rule_once_ending_time: '2014-09-08T07:00:00-05:00'
                }
            },
            x_str = '(+,O)[2014-09-08:06:00:00-05:00>07:00:00-05:00]';

            expect(printRuleFilter(rule_cfg)).toEqual(x_str);

        });

        it('should print daily rules', function () {

            var rule_cfg = {
                key: 1,
                rule_periodicity: 'rule_periodicity_daily',
                rule_operation: '+',
                rule_dates: {
                    rule_daily_initial_date: 'XXX',
                    rule_daily_final_date: 'ZZZ',
                    rule_daily_starting_time: 'TTT',
                    rule_daily_ending_time: 'WWW'
                }
            },
            x_str = '(+,D)[' +
                rule_cfg.rule_dates.rule_daily_initial_date +
                ' > ' +
                rule_cfg.rule_dates.rule_daily_final_date +
            ']';

            expect(printRuleFilter(rule_cfg)).toEqual(x_str);

        });

    });

    describe('printRuleTitle', function () {

        it('should print once rules', function () {

            var rule_cfg = {
                key: 1,
                rule_periodicity: 'rule_periodicity_once',
                rule_operation: '+',
                rule_dates: {
                    rule_once_date: '2014-09-08T00:00:00+00:00',
                    rule_once_starting_time: '2014-09-08T06:00:00-05:00',
                    rule_once_ending_time: '2014-09-08T07:00:00-05:00'
                }
            },
            x_str = '(+, ONCE)';

            expect(printRuleTitleFilter(rule_cfg)).toEqual(x_str);

        });

        it('should print daily rules', function () {

            var rule_cfg = {
                key: 1,
                rule_periodicity: 'rule_periodicity_daily',
                rule_operation: '+',
                rule_dates: {
                    rule_daily_initial_date: 'XXX',
                    rule_daily_final_date: 'ZZZ',
                    rule_daily_starting_time: 'TTT',
                    rule_daily_ending_time: 'WWW'
                }
            },
            x_str = '(+, DAILY)';

            expect(printRuleTitleFilter(rule_cfg)).toEqual(x_str);

        });

    });

});