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
    '$scope', '$log', '$mdDialog',
    'satnetRPC', 'snDialog',
    'segmentId', 'isSpacecraft',

    /**
     * Controller for the list of the channels for this given segment (either
     * a Ground Station or a Spacecraft).
     * 
     * @param {Object}  $scope       $scope for the Angular controller
     * @param {Object}  $log         Angular JS $log service
     * @param {Object}  $mdDialog    Angular Material $mdDialog service
     * @param {Object}  satnetRPC    Satnet RPC service
     * @param {Object}  snDialog     Satnet Dialog service
     * @param {String}  segmentId    Identifier of the segment
     * @param {Boolean} isSpacecraft Flag that defines the type of segment
     */
    function(
        $scope, $log, $mdDialog,
         satnetRPC, snDialog,
         segmentId, isSpacecraft
    ) {

        $scope.segmentId = segmentId;
        $scope.isSpacecraft = isSpacecraft;

        $scope._rpc_gs_prefix = 'gs';
        $scope._rpc_sc_prefix = 'sc';
        $scope._rpc_actual_prefix = $scope._rpc_gs_prefix;

        $scope.channelList = [];

        $scope.channelDlgTplUrl = 'operations/templates/channels/dialog.html';

        /**
         * Function that triggers the opening of a window to add a new ground
         * station into the system.
         */
        $scope.showAddDialog = function () {
            $mdDialog.show({
                templateUrl: $scope.channelDlgTplUrl,
                controller: 'channelDialogCtrl',
                locals: {
                    segmentId: $scope.segmentId,
                    isSpacecraft: $scope.isSpacecraft,
                    channelId: '',
                    editing: false
                }
            });
        };

        /**
         * Function that handles the display of the Dialog that permits the
         * edition of the channels.
         * 
         * @param {String} channelId Identifier of the channel
         */
        $scope.showEditDialog = function (channelId) {
            $mdDialog.show({
                templateUrl: $scope.channelDlgTplUrl,
                controller: 'channelDialogCtrl',
                locals: {
                    segmentId: $scope.segmentId,
                    isSpacecraft: $scope.isSpacecraft,
                    channelId: channelId,
                    editing: true
                }
            });
        };

        /**
         * Function that handles the removal of the specific channel for the
         * given segment.
         * 
         * @param {String} channelId Identifier of the channel
         */
        $scope.delete = function (channelId) {
            var _rpc_service = $scope._rpc_actual_prefix + '.channel.delete';
            satnetRPC.rCall(_rpc_service, [$scope.segmentId, channelId]).then(
                function (results) {
                    // TODO broadcaster.channelRemoved(gs_id, channelId);
                    snDialog.success(_rpc_service, channelId, results, null);
                    $scope.refresh();
                }
            ).catch(
                function (cause) {
                    snDialog.exception(_rpc_service, channelId, cause);
                }
            );
        };
            
        /**
         * Function that refreshes the list of registered ground stations.
         */
        $scope.refresh = function () {
            var _rpc_service = $scope._rpc_actual_prefix + '.channel.list';
            satnetRPC.rCall(_rpc_service, [$scope.segmentId]).then(
                function (results) {
                    if (results !== null) {
                        $scope.channelList = results.slice(0);
                    }
                }
            ).catch(
                function (cause) {
                    snDialog.exception(_rpc_service, '-', cause);
                }
            );
        };

        /**
         * Function that initializes the list of ground stations that are to be
         * displayed. This initialization function checks whether the Dialog is
         * suppose to display the channel list for a Spacecraft or a Ground
         * Station in order to call the proper JRPC method.
         */
        $scope.init = function () {
            if ($scope.isSpacecraft) {
                $scope._rpc_actual_prefix = $scope._rpc_sc_prefix;
            }
            $scope.refresh();
        };

    }

]);