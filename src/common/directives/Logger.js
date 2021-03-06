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

angular.module('snLoggerDirective', [])
.constant('MAX_LOG_MSGS', 20)
.constant('TIMESTAMP_FORMAT', 'HH:mm:ss.sss')
.controller('snLoggerCtrl', [
    '$scope', '$filter', 'TIMESTAMP_FORMAT', 'MAX_LOG_MSGS',

    /** 
     * Log controller.
     * 
     * @param {Object} $scope           Angular $scope controller
     * @param {Object} $filter          Angular $filter service
     * @param {String} TIMESTAMP_FORMAT Timestamp date format
     * @param {Number} MAX_LOG_MSGS     Maximum number of allowed messages
     */
    function ($scope, $filter, TIMESTAMP_FORMAT, MAX_LOG_MSGS) {

        $scope.eventLog = [];

        /**
         * Function that adds the just-captured event to the list of events to
         * be logged. It can keep up to the maximum number of events whose
         * messages are going to be displayed, a mark after which it starts
         * dropping htme.
         * 
         * @param {Object} event   Event to be logged
         * @param {String} message Type of the event (necessary to display it)
         */
        $scope.logEvent = function (event, message) {

            $scope.eventLog.unshift({
                type: event.name,
                timestamp: $filter('date')(new Date(), TIMESTAMP_FORMAT),
                msg:  message
            });

            if ($scope.eventLog.length > MAX_LOG_MSGS) {
                $scope.eventLog.pop();
            }

        };

        $scope.$on('logEvent', function (event, message) {
            $scope.logEvent(event, message);
        });
        $scope.$on('infoEvent', function (event, message) {
            $scope.logEvent(event, message);
        });
        $scope.$on('warnEvent', function (event, message) {
            $scope.logEvent(event, message);
        });
        $scope.$on('errEvent', function (event, message) {
            $scope.logEvent(event, message);
        });
        $scope.$on('debEvent', function (event, message) {
            $scope.logEvent(event, message);
        });

    }

])
.directive('snLogger', [

    /**
     * Directive that creates a logger box.
     * 
     * @returns {Object} Object directive required by Angular, with restrict
     *                   and templateUrl.
     */
    function () {
        return {
            restrict: 'E',
            templateUrl: 'common/templates/sn-logger.html'
        };
    }

])
.config(['$provide',

    /**
     * Function that configures a decorator 
     * 
     * @param   {Object} $provide Angular $provide service
     * @returns {Object} Decorator that intercepts the Angular $log service
     */
    function ($provide) {

        $provide.decorator('$log', function ($delegate) {
            var rScope = null;
            return {
                setScope: function (scope) { rScope = scope; },
                log: function (args) {
                    $delegate.log.apply(null, [args]);
                    rScope.$broadcast('logEvent', args);
                },
                info: function (args) {
                    $delegate.info.apply(null, [args]);
                    rScope.$broadcast('infoEvent', args);
                },
                error: function () {
                    $delegate.error.apply(null, arguments);
                    rScope.$broadcast('errEvent', arguments);
                },
                debug: function () {
                    $delegate.debug.apply(null, arguments);
                    rScope.$broadcast('debEvent', arguments[0]);
                },
                warn: function (args) {
                    $delegate.warn.apply(null, [args]);
                    rScope.$broadcast('warnEvent', args);
                }
            };
        });

    }

])
.run(['$rootScope', '$log',

    /**
     * Runtime configuration given at the startup of the application to this
     * module.
     * 
     * @param {Object} $rootScope Angular $rootScope scope
     * @param {Object} $log       Angular $log service
     */
    function ($rootScope, $log) {
        $log.setScope($rootScope);
    }

]);
