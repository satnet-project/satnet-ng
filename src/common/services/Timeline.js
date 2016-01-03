/**
 * Copyright 2015 Ricardo Tubio-Pardavila
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

angular.module('snTimelineServices', [])
.constant('SN_SCH_TIMELINE_DAYS', 3)
.constant('SN_SCH_HOURS_DAY', 3)
.constant('SN_SCH_DATE_FORMAT', 'DD-MM')
.constant('SN_SCH_HOUR_FORMAT', 'HH:mm')
.constant('SN_PASS_FORMAT', 'HH:mm:ss')
.constant('SN_SCH_GS_ID_WIDTH', 10)
.constant('SN_SCH_GS_ID_MAX_LENGTH', 6)
.service('timeline', [
    '$log',
    'SN_SCH_TIMELINE_DAYS',
    'SN_SCH_HOURS_DAY',
    'SN_SCH_GS_ID_WIDTH', 'SN_SCH_GS_ID_MAX_LENGTH',
    'SN_SCH_DATE_FORMAT', 'SN_SCH_HOUR_FORMAT', 'SN_PASS_FORMAT',

    /**
     * Function services to create reusable timeline services.
     * 
     * @param {Object} $log Angular JS $log services
     */
    function (
        $log,
        SN_SCH_TIMELINE_DAYS,
        SN_SCH_HOURS_DAY,
        SN_SCH_GS_ID_WIDTH, SN_SCH_GS_ID_MAX_LENGTH,
        SN_SCH_DATE_FORMAT, SN_SCH_HOUR_FORMAT, SN_PASS_FORMAT
    ) {

        /**
         * Function that discards the given slot depending on whether it is
         * within the applicable window or outside.
         * 
         * @param   {Object} cfg    Configuration object by this service
         * @param   {Object} start  moment.js slot start
         * @param   {Object} end    moment.js slot end
         * @returns {Boolean} 'true' if the object has to be discarded
         */
        this.discardSlot = function (cfg, start, end) {

            if (moment(start).isBefore(cfg.start_d)) {
                $log.warn(
                    'Discarded, too OLD! ' +
                    'slot = (' + start.toISOString() +
                    ', ' + end.toISOString() +
                    '), interval = (' + cfg.start_d.toISOString() +
                    ', ' + cfg.end_d.toISOString() + ')'
                );
                return true;
            }
            if (moment(end).isAfter(cfg.end_d)) {
                $log.warn(
                    'Discarded, too FUTURISTIC! ' +
                    'slot = (' + start.toISOString() +
                    ', ' + end.toISOString() +
                    '), interval = (' + cfg.start_d.toISOString() +
                    ', ' + cfg.end_d.toISOString() + ')'
                );
                return true;
            }
            return false;

        };

        /**
         * Function that normalizes a given slot, restricting its start and end
         * to the upper and lower limits for the applicable window.
         * 
         * @param   {Object} cfg    Configuration object by this service
         * @param   {Object} start  moment.js slot start
         * @param   {Object} end    moment.js slot end
         */
        this.normalizeSlot = function (cfg, start, end) {

            start = moment(start).isBefore(cfg.start_d) ? cfg.start_d : start;
            end = moment(end).isAfter(cfg.end_d) ? cfg.end_d : end;

            return { start: start, end: end };

        };

        /**
         * Creates a slot that can be displayed within the GUI.
         * 
         * @param {Object} cfg Configuration of the controller
         * @param {Object} raw_slot Non-modified original slot
         * @param {Object} n_slot Normalized slot
         * @returns {Object} GUI displayable slot
         */
        this.createSlot = function (cfg, raw_slot, n_slot) {

            var slot_s_s = moment(n_slot.start).unix(),
                slot_e_s = moment(n_slot.end).unix(),
                start_s = slot_s_s - cfg.start_d_s,
                slot_l = (start_s / cfg.total_s) * 100,
                slot_duration_s = slot_e_s - slot_s_s,
                slot_d_ms = slot_duration_s * 1000,
                slot_w = (slot_duration_s / cfg.total_s) * 100,
                id = raw_slot.identifier + '',
                state = (raw_slot.state) ? raw_slot.state: 'UNDEFINED';

            return {
                raw_slot: raw_slot,
                slot: {
                    id: id.substring(SN_SCH_GS_ID_MAX_LENGTH),
                    s_date: moment(n_slot.start).format(),
                    e_date: moment(n_slot.end).format(),
                    duration: moment.utc(slot_d_ms).format(SN_PASS_FORMAT),
                    left: slot_l.toFixed(3),
                    width: slot_w.toFixed(3),
                    state: state,
                    state_undef: ( state === 'UNDEFINED' ) ? true : false,
                    state_free: ( state === 'FREE' ) ? true : false,
                    state_selected: ( state === 'SELECTED' ) ? true : false,
                    state_reserved: ( state === 'RESERVED' ) ? true: false,
                    state_denied: ( state === 'DENIED' ) ? true : false,
                    state_canceled: ( state === 'CANCELED' ) ? true : false,
                    state_removed: ( state === 'REMOVED' ) ? true : false
                }
            };

        };

        /**
         * This function filters all the slots for a given ground station and
         * creates slot objects that can be directly positioned and displayed
         * over a timeline.
         * 
         * @param   {String}   groundstation_id Identifier of the Ground Station
         * @param   {Array}    slots            Array with the slots
         * @param   {Object}   start_d          moment.js object with the start
         *                                      date of the timeline
         * @param   {Object}   end_d            moment.js object with th end
         *                                      date of the timeline
         * @returns {Object}   Dictionary addressed with the identifiers of the
         *                                      Ground Stations as keys, whose
         *                                      values are the filtered slots
         */
        this.filterSlots = function (cfg, groundstation_id, slots) {

            var results = [];

            console.log(
                '%%%% WINDOW: (' + moment(cfg.start_d).format() +
                ', ' + moment(cfg.end_d).format() + '), no_slots = ' +
                slots.length
            );

            for (var i = 0; i < slots.length; i++ ) {

                var raw_slot = slots[i],
                    slot_s = moment(raw_slot.date_start),
                    slot_e = moment(raw_slot.date_end);

                // 0) Old or futuristic slots are discarded first.
                if ( this.discardSlot(cfg, slot_s, slot_e) ) { continue; }
                console.log('%%%% raw_slot = ' + JSON.stringify(raw_slot));

                // 1) The dates are first normalized, so that the slots are
                //      only displayed within the given start and end dates.
                var n_slot = this.normalizeSlot(cfg, slot_s, slot_e);
                console.log('%%%% n_slot = ' + JSON.stringify(n_slot));

                // 2) The resulting slot is added to the results array
                results.push(this.createSlot(cfg, raw_slot, n_slot));

            }

            return results;

        };

        /**
         * Function that initializes the days within the given scope for the
         * timeline.
         * 
         * @param {Object} x_scope Object with timeline's configuration
         */
        this.initTimeScope = function (scope) {

            var day = moment().hours(0).minutes(0).seconds(0);

            while (day.isBefore(scope.end_d)) {

                var hour = moment().hours(0).minutes(0).seconds(0),
                    day_s = moment(day).format(SN_SCH_DATE_FORMAT);

                scope.days.push(day_s);
                scope.times.push(day_s);

                for (var i = 0; i < ( scope.hours_per_day - 1 ); i++) {

                    hour = moment(hour).add(scope.hour_step, 'hours');
                    scope.times.push(hour.format(SN_SCH_HOUR_FORMAT));

                }

                day = moment(day).add(1, 'days');

            }

        };

        /**
         * Initializes the animation to be displayed over the timeline.
         */
        this.initAnimationScope = function (scope) {

            var now = moment(),
                now_s = moment(now).unix(),
                ellapsed_s = now_s - scope.start_d_s,
                ellapsed_p = ellapsed_s /  scope.total_s,
                scaled_p = ellapsed_p * scope.scale_width * 100,
                scaled_w = scope.scaled_width;

            scope.animation = {
                initial_width: '' + scaled_p.toFixed(3) + '%',
                final_width: '' + scaled_w.toFixed(3) + '%',
                duration: '' + scope.total_s
            };

        };
  
        /**
         * Function that initializes the dictionary with the days and hours for
         * the axis of the timeline. It simply contains as many days as
         * specified in the variable "SN_SCH_TIMELINE_DAYS".
         */
        this.initScope = function () {

            var scope = {
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
                slots: {},
                animation: {
                    initial_width: '',
                    final_width: '',
                    duration: ''
                }
            };

            scope.end_d = moment(scope.start_d).add(scope.no_days, 'days');
            scope.start_d_s = moment(scope.start_d).unix();
            scope.end_d_s = moment(scope.end_d).unix();
            scope.total_s = scope.end_d_s - scope.start_d_s;
            scope.hour_step = moment.duration(
                (24 / scope.hours_per_day), 'hours'
            );
            scope.no_cols = scope.hours_per_day - 1;
            scope.max_no_cols = scope.hours_per_day * scope.no_days;

            this.initTimeScope(scope);
            this.initAnimationScope(scope);

            return scope;

        };

    }

]);
