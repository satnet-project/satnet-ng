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

describe('Testing the Timeline Services', function () {

    var timeline,
        SN_SCH_TIMELINE_DAYS,
        SN_SCH_HOURS_DAY,
        SN_SCH_GS_ID_WIDTH,
        SN_SCH_DATE_FORMAT,
        SN_SCH_HOUR_FORMAT,
        SN_SCH_GS_ID_MAX_LENGTH;

    beforeEach(function () {

        module('snTimelineServices');

        inject(function ($injector) {
            timeline = $injector.get('timeline');
            SN_SCH_TIMELINE_DAYS = $injector.get('SN_SCH_TIMELINE_DAYS');
            SN_SCH_HOURS_DAY = $injector.get('SN_SCH_HOURS_DAY');
            SN_SCH_GS_ID_WIDTH = $injector.get('SN_SCH_GS_ID_WIDTH');
            SN_SCH_DATE_FORMAT = $injector.get('SN_SCH_DATE_FORMAT');
            SN_SCH_HOUR_FORMAT = $injector.get('SN_SCH_HOUR_FORMAT');
            SN_SCH_GS_ID_MAX_LENGTH = $injector.get('SN_SCH_GS_ID_MAX_LENGTH');
        });

    });

    it('should return a non-null valid snTimelineService object', function () {
        expect(timeline).not.toBeNull();
        expect(timeline.initScope).not.toBeNull();
        expect(timeline.initScope).toBeDefined();
        expect(SN_SCH_TIMELINE_DAYS).toBe(3);
        expect(SN_SCH_HOURS_DAY).toBe(3);
        expect(SN_SCH_DATE_FORMAT).toBe('DD-MM');
        expect(SN_SCH_HOUR_FORMAT).toBe('HH:mm');
        expect(SN_SCH_GS_ID_WIDTH).toBe(10);
        expect(SN_SCH_GS_ID_MAX_LENGTH).toBe(6);
    });

    it('should properly initialize a given scope', function () {

        var x_scope = {
            start_d: moment().hours(0).minutes(0).seconds(0),
            start_d_s: -1,
            end_d: null,
            end_d_s: -1,
            hour_step: null,
            gs_id_width: SN_SCH_GS_ID_WIDTH + '%',
            max_width: 100 - SN_SCH_GS_ID_WIDTH,
            scaled_width: 100 - SN_SCH_GS_ID_WIDTH,
            scale_width: (100 - SN_SCH_GS_ID_WIDTH) / 100,
            hours_per_day: SN_SCH_HOURS_DAY,
            no_days: SN_SCH_TIMELINE_DAYS,
            total_s: -1,
            no_cols: -1,
            max_no_cols: -1,
            days: [],
            times: [],
            slots: {}
        };
        
        x_scope.end_d = moment(x_scope.start_d).add(3, 'days');
        x_scope.start_d_s = moment(x_scope.start_d).unix();
        x_scope.end_d_s = moment(x_scope.end_d).unix();
        x_scope.total_s = 3 * 24 * 60 * 60;
        x_scope.hour_step = moment.duration(8, 'hours');
        x_scope.no_cols = 2;
        x_scope.max_no_cols = 9;

        x_scope.days = [
            moment().format('DD-MM'),
            moment().add(1, 'days').format('DD-MM'),
            moment().add(2, 'days').format('DD-MM')
        ];

        x_scope.times = [
            moment().format('DD-MM'),
            '08:00',
            '16:00',
            moment().add(1, 'days').format('DD-MM'),
            '08:00',
            '16:00',
            moment().add(2, 'days').format('DD-MM'),
            '08:00',
            '16:00'
        ];

        var a_scope = timeline.initScope();

        // TODO :: use mocked common reference time instead of moment() both
        //          for the test and for the code; otherwise, the moment()
        //          objects will differ by miliseconds...
        //expect(a_scope.start_d).toEqual(x_scope.start_d);
        //expect(a_scope.end_d).toEqual(x_scope.end_d);

        expect(a_scope.start_d_s).toBe(x_scope.start_d_s);
        expect(a_scope.end_d_s).toBe(x_scope.end_d_s);
        expect(a_scope.hour_step).toEqual(x_scope.hour_step);
        expect(a_scope.gs_id_width).toBe(x_scope.gs_id_width);
        expect(a_scope.max_width).toBe(x_scope.max_width);
        expect(a_scope.scaled_width).toBe(x_scope.scaled_width);
        expect(a_scope.scale_width).toBe(x_scope.scale_width);
        expect(a_scope.hours_per_day).toBe(x_scope.hours_per_day);
        expect(a_scope.no_days).toBe(x_scope.no_days);
        expect(a_scope.total_s).toBe(x_scope.total_s);
        expect(a_scope.no_cols).toBe(x_scope.no_cols);
        expect(a_scope.max_no_cols).toBe(x_scope.max_no_cols);
        expect(a_scope.days).toEqual(x_scope.days);
        expect(a_scope.times).toEqual(x_scope.times);
        expect(a_scope.slots).toEqual(x_scope.slots);

    });

    it('should return the width for the hours column', function () {

        var cfg = {
                max_width: 90,
                max_no_cols: 9
            },
            x_width = '10.000%';

        expect(timeline.getCSSHoursWidth(cfg)).toEqual({
            'width': x_width
        });

    });

});