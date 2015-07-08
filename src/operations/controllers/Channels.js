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

angular.module(
    'snChannelControllers', [
        'ngMaterial',
        'snJRPCServices',
        'snControllers'
    ]
).controller('channelListCtrl', [
    '$scope', '$log', '$mdDialog', 'satnetRPC', 'snDialog', 'gsId',
    
    function($scope, $log, $mdDialog, satnetRPC, snDialog, gsId) {

        $scope.gsId = gsId;
        $scope.ruleList = [];
        $scope.ruleDlgTplUrl = 'operations/templates/channels/dialog.html';

        /**
         * Function that refreshes the list of registered ground stations.
         */
        $scope.refresh = function () {
            satnetRPC.rCall('channels.list', [$scope.gsId]).then(
                function (results) {
                    if (results !== null) {
                        $scope.ruleList = results.slice(0);
                    }
                }
            ).catch(
                function (cause) {
                    snDialog.exception('channels.list', '-', cause);
                }
            );
        };

        /**
         * Function that initializes the list of ground stations that are to be
         * displayed.
         */
        $scope.init = function () {
            $scope.refresh();
        };

    }

]);