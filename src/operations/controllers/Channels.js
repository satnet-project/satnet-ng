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
)
.constant('RPC_GS_PREFIX', 'gs')
.constant('RPC_SC_PREFIX', 'sc')
.controller('channelListCtrl', [
    '$scope', '$log', '$mdDialog',
    'satnetRPC', 'snDialog',
    'RPC_GS_PREFIX', 'RPC_SC_PREFIX',
    'segmentId', 'isSpacecraft',

    /**
     * Controller for the list of the channels for this given segment (either
     * a Ground Station or a Spacecraft).
     * 
     * @param {Object}  $scope          $scope for the Angular controller
     * @param {Object}  $log            Angular JS $log service
     * @param {Object}  $mdDialog       Angular Material $mdDialog service
     * @param {Object}  satnetRPC       Satnet RPC service
     * @param {Object}  snDialog        Satnet Dialog service
     * @param {String}  RPC_GS_PREFIX   Prefix for the Ground Station services
     * @param {String}  RPC_SC_PREFIX   Prefix for the Spacecraft services
     * @param {String}  segmentId       Identifier of the segment
     * @param {Boolean} isSpacecraft    Flag that defines the type of segment
     */
    function(
        $scope, $log, $mdDialog,
        satnetRPC, snDialog,
        RPC_GS_PREFIX, RPC_SC_PREFIX,
        segmentId, isSpacecraft
    ) {

        $scope.channelList = [];

        $scope.uiCtrl = {
            segmentId: segmentId,
            isSpacecraft: isSpacecraft,
            rpc_prefix: RPC_GS_PREFIX,
            channelDlgTplUrl: 'operations/templates/channels/dialog.html'
        };

        /**
         * Function that triggers the opening of a window to add a new ground
         * station into the system.
         */
        $scope.showAddDialog = function () {
            $mdDialog.show({
                templateUrl: $scope.uiCtrl.channelDlgTplUrl,
                controller: 'channelDialogCtrl',
                locals: {
                    segmentId: $scope.uiCtrl.segmentId,
                    isSpacecraft: $scope.uiCtrl.isSpacecraft,
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
                templateUrl: $scope.uiCtrl.channelDlgTplUrl,
                controller: 'channelDialogCtrl',
                locals: {
                    segmentId: $scope.uiCtrl.segmentId,
                    isSpacecraft: $scope.uiCtrl.isSpacecraft,
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
            var rpc_service = $scope.uiCtrl.rpc_prefix + '.channel.delete';
            satnetRPC.rCall(
                rpc_service, [$scope.uiCtrl.segmentId, channelId]
            ).then(
                function (results) {
                    // TODO broadcaster.channelRemoved(gs_id, channelId);
                    snDialog.success(rpc_service, channelId, results, null);
                    $scope.refresh();
                }
            ).catch(
                function (cause) {
                    snDialog.exception(rpc_service, channelId, cause);
                }
            );
        };

        /**
         * Function that refreshes the list of registered ground stations.
         */
        $scope.refresh = function () {
            var rpc_service = $scope.uiCtrl.rpc_prefix + '.channel.list';
            satnetRPC.rCall(rpc_service, [$scope.uiCtrl.segmentId]).then(
                function (results) {
                    if (results !== null) {
                        $scope.channelList = results.slice(0);
                    }
                }
            ).catch(
                function (cause) {
                    snDialog.exception(rpc_service, '-', cause);
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
                $scope.uiCtrl.rpc_prefix = RPC_SC_PREFIX;
            }
            $scope.refresh();
        };

    }

]).controller('channelDialogCtrl', [
    '$log', '$scope', '$mdDialog', '$mdToast',
    'broadcaster', 'satnetRPC', 'snDialog',
    'RPC_GS_PREFIX', 'RPC_SC_PREFIX',
    'segmentId', 'channelId', 'isSpacecraft', 'isEditing',

    /**
     * Controller for the dialog that allows users to create and edit the
     * configuration for a given channel.
     * 
     * @param {Object}  $log          Angular JS $log service
     * @param {Object}  $scope        Angular JS $scope service
     * @param {Object}  $mdDialog     Angular Material $mdDialog service
     * @param {Object}  $mdToast      Angular Material $mdToast service
     * @param {Object}  broadcaster   SatNet event broadcaster
     * @param {Object}  satnetRPC     SatNet RPC service
     * @param {Object}  snDialog      SatNet Dialog service
     * @param {String}  RPC_GS_PREFIX Prefix for the GS RPC services
     * @param {String}  RPC_SC_PREFIX Prefix for the SC RPC services
     * @param {String}  segmentId     Identifier of the segment
     * @param {String}  channelId     Identifier of the channel
     * @param {Boolean} isSpacecraft  Flag that indicates the type of segment
     * @param {Boolean} isEditing     Flag that indicates the type of dialog
     */
    function (
        $log, $scope, $mdDialog, $mdToast,
        broadcaster, satnetRPC, snDialog,
        RPC_GS_PREFIX, RPC_SC_PREFIX,
        segmentId, channelId, isSpacecraft, isEditing
    ) {

        $scope.gsCfg = {
            identifier: channelId,
            band: '',
            automated: false,
            modulations: [],
            polarizations: [],
            bitrates: [],
            bandwidths: []
        };
        $scope.scCfg = {
            identifier: channelId,
            frequency: 0.0,
            modulation: '',
            polarization: '',
            bitrate: '',
            bandwidth: ''
        };

        $scope.uiCtrl = {
            add: {
                disabled: true
            },
            segmentId: segmentId,
            isSpacecraft: isSpacecraft,
            editing: isEditing,
            rpcPrefix: RPC_GS_PREFIX,
            listTplUrl: 'operations/templates/channels/list.html',
            configuration: $scope.gsCfg,
            modulations: [],
            bands: [],
            polarizations: [],
            bandwidths: []
        };

        /**
         * Function that handles the creation of a new channel as part of the
         * selected segment.
         */
        $scope.add = function () {
            var rpc_service = $scope.uiCtrl.rpcPrefix + '.channel.add';
            satnetRPC.rCall(rpc_service, [
                $scope.uiCtrl.segmentId,
                $scope.configuration.identifier,
                $scope.configuration
            ]).then(
                function (results) {
                    // TODO broadcaster.channelAdded(segmentId, channelId);
                    snDialog.success(
                        $scope.uiCtrl.segmentId, results, $scope.listTplUrl
                    );
                }
            ).catch(
                function (cause) {
                    snDialog.exception(rpc_service, '-', cause);
                }
            );
        };

        /**
         * Function that handles the update of the configuration for the channel
         * of the selected segment.
         */
        $scope.update = function () {
            var rpc_service = $scope.uiCtrl.rpcPrefix + '.channel.update';
            satnetRPC.rCall(rpc_service, [
                $scope.uiCtrl.segmentId,
                $scope.configuration.identifier,
                $scope.configuration
            ]).then(
                function (results) {
                    // TODO broadcaster.channelAdded(segmentId, channelId);
                    snDialog.success(
                        $scope.uiCtrl.segmentId, results, $scope.listTplUrl
                    );
                }
            ).catch(
                function (cause) {
                    snDialog.exception(rpc_service, '-', cause);
                }
            );
        };

        /**
         * Function that closes the current dialog and goes back to the
         * original list.
         */
        $scope.cancel = function () {
            $mdDialog.hide();
            $mdDialog.show({
                templateUrl: $scope.listTplUrl
            });
        };

        /**
         * Initializes the Dialog with the correct values. It handles the self
         * configuration and detection of the mode in which the Dialog should
         * operate, either for adding a new channel to any segment or to update
         * the configuration of that given channel.
         */
        $scope.init = function () {

            if (!segmentId) {
                throw '@channelDialogCtrl: no segment identifier provided';
            }
            if (isSpacecraft) {
                $scope.uiCtrl.rpcPrefix = RPC_SC_PREFIX;
                $scope.uiCtrl.configuration = $scope.scCfg;
            }
            if (!isEditing) {
                throw '@channelDialogCtrl: no editing flag provided';
            } else {
                if (!channelId) {
                    throw '@channelDialogCtrl: no channel identifier provided';
                }
                $scope.loadConfiguration();
            }

        };

        /**
         * Function that loads the configuration of the object to be edited.
         */
        $scope.loadConfiguration = function () {


        };

    }

]);