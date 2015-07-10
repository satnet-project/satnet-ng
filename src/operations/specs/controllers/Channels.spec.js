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

describe('Testing Channel controllers', function () {

    var $rootScope, $controller, $mdDialog, $q,
        __mock__cookies = {},
        test_channel_id = 'channel-test',
        channel_list = ['channel_1', 'channel_2'],
        __fn_exception = function () {
            return $q.reject(function () {
                return {data: {message: 'Simulated Exception'}};
            });
        },
        listTplUrl = 'operations/templates/channels/list.html',
        dialogTplUrl = 'operations/templates/channels/dialog.html',
        satnetRPC, snDialog, broadcaster;

    beforeEach(function () {

        module(
            'snChannelControllers',
            'snControllers',
            'snBroadcasterServices',
            'snJRPCMock'
        );
        module(function ($provide) {
            $provide.value('$cookies', __mock__cookies);
            //$provide.value('satnetRPC', __mock__satnetRPC);
        });

        inject(function ($injector) {

            $rootScope = $injector.get('$rootScope');
            $controller = $injector.get('$controller');
            $mdDialog = $injector.get('$mdDialog');
            $q = $injector.get('$q');

            satnetRPC = $injector.get('satnetRPC');
            snDialog = $injector.get('snDialog');
            broadcaster = $injector.get('broadcaster');

        });

    });

    it('should create the List Controller', function () {

        var $scope_sc = $rootScope.$new(),
            $scope_gs = $rootScope.$new();

        $controller('channelListCtrl', {
            $scope: $scope_sc,
            $mdDialog: $mdDialog,
            satnetRPC: satnetRPC,
            segmentId: 'sc-test',
            isSpacecraft: true
        });

        $scope_sc.init();
        $rootScope.$digest();

        expect($scope_sc.uiCtrl).toEqual({
            channelDlgTplUrl: dialogTplUrl,
            segmentId: 'sc-test',
            isSpacecraft: true,
            rpc_prefix: 'sc'
        });

        expect($scope_sc.channelList).toEqual(channel_list);

        spyOn(satnetRPC, 'rCall').and.callFake(__fn_exception);
        spyOn(snDialog, 'exception');

        $scope_sc.init();
        $rootScope.$digest();

        expect(snDialog.exception).toHaveBeenCalled();

        satnetRPC.rCall.and.callThrough();
        $controller('channelListCtrl', {
            $scope: $scope_gs, $mdDialog: $mdDialog,
            satnetRPC: satnetRPC, snDialog: snDialog,
            segmentId: 'gs-test', isSpacecraft: false
        });

        $scope_gs.init();
        $rootScope.$digest();
        expect($scope_gs.channelList).toEqual(channel_list);

        satnetRPC.rCall.and.callFake(__fn_exception);

        $scope_gs.init();
        $rootScope.$digest();

        expect(snDialog.exception).toHaveBeenCalled();

    });

    it('should launch the associated add dialogs', function () {

        var $scope_sc = $rootScope.$new(),
            $scope_gs = $rootScope.$new(),
            sc_id = 'sc-test',
            gs_id = 'gs-test',
            x_param_sc = {
                templateUrl: dialogTplUrl,
                controller: 'channelDialogCtrl',
                locals: {
                    segmentId: sc_id,
                    channelId: '',
                    isSpacecraft: true,
                    isEditing: false
                }
            },
            x_param_gs = {
                templateUrl: dialogTplUrl,
                controller: 'channelDialogCtrl',
                locals: {
                    segmentId: gs_id,
                    channelId: '',
                    isSpacecraft: false,
                    isEditing: false
                }
            };

        spyOn($mdDialog, 'show');

        $controller("channelListCtrl", {
            $scope: $scope_sc,
            $mdDialog: $mdDialog,
            satnetRPC: satnetRPC,
            segmentId: 'sc-test',
            isSpacecraft: true
        });

        $scope_sc.init();
        $rootScope.$digest();

        $scope_sc.showAddDialog();
        expect($mdDialog.show).toHaveBeenCalledWith(x_param_sc);

        $controller("channelListCtrl", {
            $scope: $scope_gs,
            $mdDialog: $mdDialog,
            satnetRPC: satnetRPC,
            segmentId: 'gs-test',
            isSpacecraft: false
        });

        $scope_gs.init();
        $rootScope.$digest();

        $scope_gs.showAddDialog();
        expect($mdDialog.show).toHaveBeenCalledWith(x_param_gs);

    });

    it('should launch the associated edit dialogs', function () {

        var $scope_sc = $rootScope.$new(),
            $scope_gs = $rootScope.$new(),
            sc_id = 'sc-test',
            gs_id = 'gs-test',
            channel_id = 'channel-test',
            x_param_sc = {
                templateUrl: dialogTplUrl,
                controller: 'channelDialogCtrl',
                locals: {
                    segmentId: sc_id,
                    channelId: channel_id,
                    isSpacecraft: true,
                    isEditing: true
                }
            },
            x_param_gs = {
                templateUrl: dialogTplUrl,
                controller: 'channelDialogCtrl',
                locals: {
                    segmentId: gs_id,
                    channelId: channel_id,
                    isSpacecraft: false,
                    isEditing: true
                }
            };

        spyOn($mdDialog, 'show');

        $controller("channelListCtrl", {
            $scope: $scope_sc,
            $mdDialog: $mdDialog,
            satnetRPC: satnetRPC,
            segmentId: 'sc-test',
            isSpacecraft: true
        });

        $scope_sc.init();
        $rootScope.$digest();

        $scope_sc.showEditDialog(channel_id);
        expect($mdDialog.show).toHaveBeenCalledWith(x_param_sc);

        $controller("channelListCtrl", {
            $scope: $scope_gs,
            $mdDialog: $mdDialog,
            satnetRPC: satnetRPC,
            segmentId: 'gs-test',
            isSpacecraft: false
        });

        $scope_gs.init();
        $rootScope.$digest();

        $scope_gs.showEditDialog(channel_id);
        expect($mdDialog.show).toHaveBeenCalledWith(x_param_gs);

    });

    it('should delete channels', function () {

        var $scope_sc = $rootScope.$new(),
            $scope_gs = $rootScope.$new(),
            sc_id = 'sc-test',
            gs_id = 'gs-test';

        spyOn($mdDialog, 'show');
        spyOn(snDialog, 'success');
        spyOn(snDialog, 'exception');

        $controller("channelListCtrl", {
            $scope: $scope_sc, $mdDialog: $mdDialog,
            satnetRPC: satnetRPC, snDialog: snDialog,
            segmentId: sc_id, isSpacecraft: true
        });
        spyOn($scope_sc, 'refresh');

        $scope_sc.init();
        $rootScope.$digest();

        $scope_sc.delete(test_channel_id);
        $rootScope.$digest();

        expect($scope_sc.refresh).toHaveBeenCalled();
        expect(snDialog.success).toHaveBeenCalledWith(
            'sc.channel.delete', test_channel_id, test_channel_id, null
        );
        snDialog.success.calls.reset();

        spyOn(satnetRPC, 'rCall').and.callFake(__fn_exception);

        $scope_sc.delete(test_channel_id);
        $rootScope.$digest();

        expect(snDialog.exception).toHaveBeenCalledWith(
            'sc.channel.delete', test_channel_id, jasmine.any(Function)
        );
        snDialog.exception.calls.reset();

        $controller("channelListCtrl", {
            $scope: $scope_gs, $mdDialog: $mdDialog,
            satnetRPC: satnetRPC, snDialog: snDialog,
            segmentId: gs_id, isSpacecraft: false
        });
        spyOn($scope_gs, 'refresh');

        satnetRPC.rCall.and.callThrough();

        $scope_gs.init();
        $rootScope.$digest();

        $scope_gs.delete(test_channel_id);
        $rootScope.$digest();

        expect($scope_gs.refresh).toHaveBeenCalled();
        expect(snDialog.success).toHaveBeenCalledWith(
            'gs.channel.delete', test_channel_id, test_channel_id, null
        );

        satnetRPC.rCall.and.callFake(__fn_exception);

        $scope_gs.delete(test_channel_id);
        $rootScope.$digest();

        expect(snDialog.exception).toHaveBeenCalledWith(
            'gs.channel.delete', test_channel_id, jasmine.any(Function)
        );

    });

    it('should create the Dialog controller for adding channels', function () {

        var $scope_sc = $rootScope.$new(),
            $scope_gs = $rootScope.$new(),
            sc_id = 'sc-test', gs_id = 'gs-test';

        $controller('channelDialogCtrl', {
            $scope: $scope_sc, $mdDialog: $mdDialog,
            satnetRPC: satnetRPC, snDialog: snDialog,
            segmentId: sc_id, channelId: test_channel_id,
            isSpacecraft: true, isEditing: false
        });

        $scope_sc.init();
        $rootScope.$digest();

        expect($scope_sc.scCfg).toEqual({
            identifier: test_channel_id,
            frequency: 0.0,
            modulation: '',
            polarization: '',
            bitrate: '',
            bandwidth: ''
        });
        expect($scope_sc.uiCtrl).toEqual({
            add: {
                disabled: true
            },
            segmentId: sc_id,
            isSpacecraft: true,
            editing: false,
            rpcPrefix: 'sc',
            listTplUrl: listTplUrl,
            configuration: $scope_sc.scCfg,
            options: {
                bands: [],
                modulations: [],
                polarizations: [],
                bandwidths: [],
                bitrates: []
            }
        });

        $controller('channelDialogCtrl', {
            $scope: $scope_gs, $mdDialog: $mdDialog,
            satnetRPC: satnetRPC, snDialog: snDialog,
            segmentId: gs_id, channelId: test_channel_id,
            isSpacecraft: false, isEditing: false
        });

        $scope_gs.init();
        $rootScope.$digest();

        expect($scope_gs.gsCfg).toEqual({
            identifier: test_channel_id,
            band: '',
            automated: false,
            modulations: [],
            polarizations: [],
            bitrates: [],
            bandwidths: []
        });
        expect($scope_gs.uiCtrl).toEqual({
            add: {
                disabled: true
            },
            segmentId: gs_id,
            isSpacecraft: false,
            editing: false,
            rpcPrefix: 'gs',
            listTplUrl: listTplUrl,
            configuration: $scope_gs.gsCfg,
            options: {
                bands: [],
                modulations: [],
                polarizations: [],
                bandwidths: [],
                bitrates: []
            }
        });

    });

    /*
    it('should create the Dialog controller for editing channels', function () {

        // TODO Real configuration loading

        var $scope_sc = $rootScope.$new(),
            $scope_gs = $rootScope.$new(),
            sc_id = 'sc-test', gs_id = 'gs-test';

        __mock__satnetRPC.rCall =
            jasmine.createSpy('rCall').and.callFake(__fn_channel_get_sc_cfg);

        $controller('channelDialogCtrl', {
            $scope: $scope_sc, $mdDialog: $mdDialog,
            satnetRPC: satnetRPC, snDialog: snDialog,
            segmentId: sc_id, channelId: test_channel_id,
            isSpacecraft: true, isEditing: true
        });

        $scope_sc.init();
        $rootScope.$digest();

        expect($scope_sc.scCfg).toEqual({
            identifier: test_channel_id,
            frequency: 0.0,
            modulation: '',
            polarization: '',
            bitrate: '',
            bandwidth: ''
        });
        expect($scope_sc.uiCtrl).toEqual({
            add: {
                disabled: true
            },
            segmentId: sc_id,
            isSpacecraft: true,
            editing: true,
            rpcPrefix: 'sc',
            listTplUrl: listTplUrl,
            configuration: $scope_sc.scCfg,
            modulations: [],
            bands: [],
            polarizations: [],
            bandwidths: []
        });

        $controller('channelDialogCtrl', {
            $scope: $scope_gs, $mdDialog: $mdDialog,
            satnetRPC: satnetRPC, snDialog: snDialog,
            segmentId: gs_id, channelId: test_channel_id,
            isSpacecraft: false, isEditing: true
        });

        $scope_gs.init();
        $rootScope.$digest();

        expect($scope_gs.gsCfg).toEqual({
            identifier: test_channel_id,
            band: '',
            automated: false,
            modulations: [],
            polarizations: [],
            bitrates: [],
            bandwidths: []
        });
        expect($scope_gs.uiCtrl).toEqual({
            add: {
                disabled: true
            },
            segmentId: gs_id,
            isSpacecraft: false,
            editing: true,
            rpcPrefix: 'gs',
            listTplUrl: listTplUrl,
            configuration: $scope_gs.gsCfg,
            modulations: [],
            bands: [],
            polarizations: [],
            bandwidths: []
        });

    });
    */

});