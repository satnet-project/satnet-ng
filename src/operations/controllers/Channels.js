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

angular.module('snChannelControllers', [
    'ngMaterial',
    'snJRPCServices',
    'snControllers'
])
.constant('CH_LIST_TPL', 'operations/templates/channels/list.html')
.constant('CH_DLG_GS_TPL', 'operations/templates/channels/gs.dialog.html')
.constant('CH_DLG_SC_TPL', 'operations/templates/channels/sc.dialog.html')

.controller('channelListCtrl', [
    '$scope', '$log', '$mdDialog',
    'satnetRPC', 'snDialog',
    'RPC_GS_PREFIX', 'RPC_SC_PREFIX',
    'CH_DLG_GS_TPL', 'CH_DLG_SC_TPL',
    'segmentId', 'isSpacecraft',

    /**
     * Controller for the list of the channels for this given segment (either
     * a Ground Station or a Spacecraft).
     *
     * @param {Object}  $scope        $scope for the Angular controller
     * @param {Object}  $log          Angular JS $log service
     * @param {Object}  $mdDialog     Angular Material $mdDialog service
     * @param {Object}  satnetRPC     Satnet RPC service
     * @param {Object}  snDialog      Satnet Dialog service
     * @param {String}  RPC_GS_PREFIX Prefix for the Ground Station services
     * @param {String}  RPC_SC_PREFIX Prefix for the Spacecraft services
     * @param {String}  CH_LIST_TPL   URL to the Channels List
     * @param {String}  CH_DLG_GS_TPL URL to the GS Dialog
     * @param {String}  CH_DLG_SC_TPL URL to the SC Dialog
     * @param {String}  segmentId     Identifier of the segment
     * @param {Boolean} isSpacecraft  Flag that defines the type of segment
     */
    function (
        $scope, $log, $mdDialog,
        satnetRPC, snDialog,
        RPC_GS_PREFIX, RPC_SC_PREFIX,
        CH_DLG_GS_TPL, CH_DLG_SC_TPL,
        segmentId, isSpacecraft
    ) {

        $scope.channelList = [];

        $scope.uiCtrl = {
            segmentId: segmentId,
            isSpacecraft: isSpacecraft,
            rpcPrefix: RPC_GS_PREFIX,
            channelDlgTplUrl: CH_DLG_GS_TPL
        };

        /**
         * Function that triggers the opening of a window to add a new
         * channel associated with a given segment.
         */
        $scope.showAddDialog = function () {
            $mdDialog.hide();
            $mdDialog.show({
                templateUrl: $scope.uiCtrl.channelDlgTplUrl,
                controller: 'channelDialogCtrl',
                locals: {
                    segmentId: $scope.uiCtrl.segmentId,
                    channelId: '',
                    isSpacecraft: $scope.uiCtrl.isSpacecraft,
                    isEditing: false
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
            $mdDialog.hide();
            $mdDialog.show({
                templateUrl: $scope.uiCtrl.channelDlgTplUrl,
                controller: 'channelDialogCtrl',
                locals: {
                    segmentId: $scope.uiCtrl.segmentId,
                    channelId: channelId,
                    isSpacecraft: $scope.uiCtrl.isSpacecraft,
                    isEditing: true
                }
            });
        };

        /**
         * Function that handles the removal of the specific channel for
         * the given segment.
         *
         * @param {String} channelId Identifier of the channel
         */
        $scope.delete = function (channelId) {
            var rpc_service = $scope.uiCtrl.rpcPrefix + '.channel.delete';
            var confirm = $mdDialog.confirm()
                .title('Confirm')
                .content(
                    'This action will remove your channel from the system.'
                )
                .ariaLabel('channel removal confirmation')
                .ok('REMOVE')
                .cancel('CANCEL');

            $mdDialog.show(confirm).then(function() {

                satnetRPC.rCall(
                    rpc_service, [$scope.uiCtrl.segmentId, channelId]
                ).then(function (results) {
                    // TODO broadcaster.channelRemoved(gs_id, channelId);
                    snDialog.success(rpc_service, channelId, results, null);
                    $scope.refresh();
                }).catch(function (cause) {
                    snDialog.exception(rpc_service, channelId, cause);
                });

            }, function() {
                console.log('Channel removal canceled');
            });

        };

        /**
         * Function that refreshes the list of registered ground stations.
         */
        $scope.refresh = function () {
            var rpc_service = $scope.uiCtrl.rpcPrefix + '.channel.list';
            satnetRPC.rCall(
                rpc_service, [$scope.uiCtrl.segmentId]
            ).then(function (results) {
                if (results !== null) {
                    $scope.channelList = results.slice(0);
                }
            }).catch(function (c) { snDialog.exception(rpc_service, '-', c); });
        };

        /**
         * Function that initializes the list of ground stations that are
         * to be displayed. This initialization function checks whether the
         * Dialog is suppose to display the channel list for a Spacecraft
         * or a Ground Station in order to call the proper JRPC method.
         */
        $scope.init = function () {
            if ($scope.uiCtrl.isSpacecraft === true) {
                $scope.uiCtrl.rpcPrefix = RPC_SC_PREFIX;
                $scope.uiCtrl.channelDlgTplUrl = CH_DLG_SC_TPL;
            }
            $scope.refresh();
        };

        // INITIALIZATION: avoids using ng-init within the template
        $scope.init();

    }

]).controller('channelDialogCtrl', [
    '$log', '$scope', '$mdDialog', '$mdToast',
    'broadcaster', 'satnetRPC', 'snDialog',
    'RPC_GS_PREFIX', 'RPC_SC_PREFIX',
    'CH_LIST_TPL',
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
     * @param {String}  RPC_SC_PREFIX Prefix for the Spacecraft services
     * @param {String}  CH_LIST_TPL   URL to the Channels List
     * @param {String}  segmentId     Identifier of the segment
     * @param {String}  channelId     Identifier of the channel
     * @param {Boolean} isSpacecraft  Flag that indicates the type of segment
     * @param {Boolean} isEditing     Flag that indicates the type of dialog
     */
    function (
        $log, $scope, $mdDialog, $mdToast,
        broadcaster, satnetRPC, snDialog,
        RPC_GS_PREFIX, RPC_SC_PREFIX,
        CH_LIST_TPL,
        segmentId, channelId, isSpacecraft, isEditing
    ) {

        $scope.gsCfg = {
            channel_id: channelId,
            band: '',
            automated: false,
            modulations: [],
            polarizations: [],
            bitrates: [],
            bandwidths: []
        };
        $scope.scCfg = {
            channel_id: channelId,
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
            isEditing: isEditing,
            rpcPrefix: RPC_GS_PREFIX,
            listTplOptions: {
                tempalteUrl: CH_LIST_TPL,
                controller: 'channelListCtrl',
                locals: {
                    segmentId: segmentId,
                    isSpacecraft: isSpacecraft
                }
            },
            configuration: $scope.gsCfg,
            options: {
                bands: [],
                modulations: [],
                polarizations: [],
                bandwidths: []
            }
        };

        /**
         * Function that handles the creation of a new channel as part of the
         * selected segment.
         */
        $scope.add = function () {

            var rpcService = $scope.uiCtrl.rpcPrefix + '.channel.add';

            if ($scope.uiCtrl.isSpacecraft === true) {
                $scope.uiCtrl.configuration.frequency *= 1e6;
            }

            satnetRPC.rCall(rpcService, [
                $scope.uiCtrl.segmentId,
                $scope.uiCtrl.configuration.channel_id,
                $scope.uiCtrl.configuration
            ]).then(function (results) {
                // TODO broadcaster.channelAdded(segmentId, channelId);
                $mdDialog.hide();
                snDialog.success(
                    rpcService, $scope.uiCtrl.segmentId,
                    results, null //$scope.uiCtrl.listTplOptions
                );
            }).catch(function (cause) {
                snDialog.exception(rpcService, '-', cause);
            });
        };

        /**
         * Function that handles the update of the configuration for the
         * channel of the selected segment.
         */
        $scope.update = function () {

            var rpcService = $scope.uiCtrl.rpcPrefix + '.channel.set';
            if ($scope.uiCtrl.isSpacecraft === true) {
                $scope.uiCtrl.configuration.frequency *= 1e6;
            }

            satnetRPC.rCall(rpcService, [
                $scope.uiCtrl.segmentId,
                $scope.uiCtrl.configuration.channel_id,
                $scope.uiCtrl.configuration
            ]).then(function (results) {
                // TODO broadcaster.channelUpdated(segmentId, channelId);
                $mdDialog.hide();
                snDialog.success(
                    rpcService, $scope.uiCtrl.segmentId,
                    results, null
                );}
            ).catch(function (cause) {
                snDialog.exception(rpcService, '-', cause);
            });
        };

        /**
         * Function that closes the current dialog and goes back to the
         * original list.
         */
        $scope.cancel = function () {
            $mdDialog.hide();
            // FIXME ISSUE #10: Error while showing the $mdDialog
            // $mdDialog.show($scope.uiCtrl.listTplOptions);
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
            if ($scope.uiCtrl.isSpacecraft === true) {
                $scope.uiCtrl.rpcPrefix = RPC_SC_PREFIX;
                $scope.uiCtrl.configuration = $scope.scCfg;
            }
            if (isEditing === null) {
                throw '@channelDialogCtrl: no editing flag provided';
            }
            if ($scope.uiCtrl.isEditing === true) {
                if (!channelId) {
                    throw '@channelDialogCtrl: no channel id provided';
                }
                $scope.loadConfiguration();
            }
            $scope.loadOptions();
        };

        /**
         * Function that loads the configuration of the object to be edited.
         */
        $scope.loadConfiguration = function () {
            var rpcService = $scope.uiCtrl.rpcPrefix + '.channel.get';
            satnetRPC.rCall(rpcService, [
                $scope.uiCtrl.segmentId,
                $scope.uiCtrl.configuration.channel_id
            ]).then(function (results) {
                if ($scope.uiCtrl.isSpacecraft === true) {
                    results.frequency = parseFloat(results.frequency);
                    results.frequency /= 1e6;
                    $scope.scCfg = angular.copy(results);
                    $scope.uiCtrl.configuration = $scope.scCfg;
                } else {
                    $scope.gsCfg = angular.copy(results);
                    $scope.uiCtrl.configuration = $scope.gsCfg;
                }
            }).catch(function (cause) {
                snDialog.exception(rpcService, '-', cause);
            });
        };

        /**
         * Function that loads the options for creating the channels.
         */
        $scope.loadOptions = function () {
            var rpc_service = 'channels.options';
            satnetRPC.rCall(rpc_service, []).then(
                function (results) {
                    $scope.uiCtrl.options = angular.copy(results);
                }
            ).catch(function (cause) {
                snDialog.exception(rpc_service, '-', cause);
            });
        };

    }

]);