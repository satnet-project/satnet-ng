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

angular.module('messagesDirective', [
    'satnet-services', 'broadcaster', 'ui-leop-modalufo-controllers'
])
    .constant('MAX_MESSAGES', 20)
    .controller('messagesCtrl', [
        '$rootScope', '$scope',
        'satnetRPC', 'broadcaster', 'oArrays', 'MAX_MESSAGES',
        function (
            $rootScope,
            $scope,
            satnetRPC,
            broadcaster,
            oArrays,
            MAX_MESSAGES
        ) {
            'use strict';

            $scope.data = [];

            $scope.cfg = {
                hideContent: false
            };

            $scope.toggle = function () {
                $scope.cfg.hideContent = !$scope.cfg.hideContent;
            };

            /**
             * This function pushes a new element into the array using the
             * insertion algorithm and keeping the array sorted by timestamp. It
             * respects the maximum messages limit for the array, as established
             * by the related constant.
             * @param message Message to be inserted within the array
             * @private
             */
            $scope._pushMessage = function (message) {
                if ($scope.data.length === MAX_MESSAGES) {
                    $scope.data.splice(0, 1);
                }
                console.log(
                    '[messages] Message pushed, message = ' +
                        JSON.stringify(message)
                );
                oArrays.insertSorted($scope.data, 'timestamp', message);
            };

            /**
             * Inserts into the data messages array all the messages from the
             * provided array. It uses the insertion algorithm driven by the
             * timestamp field and respects the limit for the maximum number of
             * messages.
             * @param messages Messages array
             * @private
             */
            $scope._pushMessages = function (messages) {
                var date, ts_in_ms;
                angular.forEach(messages, function (m) {
                    ts_in_ms = parseInt(m.timestamp, 10) / 1000;
                    date = new Date(ts_in_ms);
                    m.timestamp = date;
                    $scope._pushMessage(m);
                });
            };

            $scope._initListeners = function () {
                $scope.$on(
                    broadcaster.LEOP_FRAME_RX_EVENT,
                    function (event, data) {
                        console.log(
                            '[modalufo] ev = ' + event + ', id = ' + data
                        );
                        $scope._pushMessage(data);
                    }
                );
            };

            /**
             * Initializes this controller.
             */
            $scope.init = function () {
                var now = moment().utc(),
                    yesterday = now.subtract(7, 'days');

                satnetRPC.rCall(
                    'leop.messages',
                    [$rootScope.leop_id, yesterday]
                )
                    .then(function (data) {
                        $scope._pushMessages(data);
                        console.log(
                            '[@messagesCtrl.init(), $scope.data = ' +
                                JSON.stringify($scope.data)
                        );
                    });

                $scope._initListeners();

            };

            $scope.init();

        }
    ])
    .directive('messages', function () {
        'use strict';

        return {
            restrict: 'E',
            templateUrl: 'templates/messages/messages.html'
        };

    });