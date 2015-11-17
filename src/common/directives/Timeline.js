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

angular.module('snTimelineDirective', ['snTimelineServices'])
.controller('snTimelineCtrl', [
    '$scope', '$log',
    'SN_SCH_TIMELINE_DAYS', 'SN_SCH_HOURS_DAY',
    'SN_SCH_DATE_FORMAT', 'SN_SCH_HOUR_FORMAT',
    'SN_SCH_GS_ID_WIDTH', 'SN_SCH_GS_ID_MAX_LENGTH',
    'timeline',

    /**
     * Controller function for handling the SatNet availability dialog.
     *
     * @param {Object} $scope $scope for the controller
     */
    function (
        $scope, $log,
        SN_SCH_TIMELINE_DAYS, SN_SCH_HOURS_DAY,
        SN_SCH_DATE_FORMAT, SN_SCH_HOUR_FORMAT,
        SN_SCH_GS_ID_WIDTH, SN_SCH_GS_ID_MAX_LENGTH,
        timeline
    ) {

        $scope.gui = null;

        /**
         * Function that initializes the object with the configuration for the
         * GUI.
         */
        $scope.init = function () {
            $scope.gui = timeline.initScope();
        };

    }

])
.directive('snTimeline',

    /**
     * Function that creates the directive to include a timeline table row.
     * 
     * @returns {Object} Object directive required by Angular, with
     *                   restrict and templateUrl
     */
    function () {
        return {
            restrict: 'E',
            templateUrl: 'common/templates/availability/timeline.html',
            controller: 'snTimelineCtrl'
        };
    }

);
