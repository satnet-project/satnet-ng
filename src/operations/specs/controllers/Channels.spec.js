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
        satnetRPC, snDialog, broadcaster,
        CH_LIST_TPL, CH_DLG_GS_TPL, CH_DLG_SC_TPL,
        CHANNELS_OPTIONS_MOCK, SC_CHANNEL_MOCK, GS_CHANNEL_MOCK;

    beforeEach(function () {

        module(
            'snChannelControllers',
            'snControllers',
            'snBroadcasterServices',
            'snJRPCMock'
        );
        module(function ($provide) {
            $provide.value('$cookies', __mock__cookies);
        });

        inject(function ($injector) {

            $rootScope = $injector.get('$rootScope');
            $controller = $injector.get('$controller');
            $mdDialog = $injector.get('$mdDialog');
            $q = $injector.get('$q');

            satnetRPC = $injector.get('satnetRPC');
            CHANNELS_OPTIONS_MOCK = $injector.get('CHANNELS_OPTIONS_MOCK');
            SC_CHANNEL_MOCK = $injector.get('SC_CHANNEL_MOCK');
            GS_CHANNEL_MOCK = $injector.get('GS_CHANNEL_MOCK');
            CH_LIST_TPL = $injector.get('CH_LIST_TPL');
            CH_DLG_GS_TPL = $injector.get('CH_DLG_GS_TPL');
            CH_DLG_SC_TPL = $injector.get('CH_DLG_SC_TPL');

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
            channelDlgTplUrl: CH_DLG_SC_TPL,
            segmentId: 'sc-test',
            isSpacecraft: true,
            rpcPrefix: 'sc'
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
                templateUrl: CH_DLG_SC_TPL,
                controller: 'channelDialogCtrl',
                locals: {
                    segmentId: sc_id,
                    channelId: '',
                    isSpacecraft: true,
                    isEditing: false
                }
            },
            x_param_gs = {
                templateUrl: CH_DLG_GS_TPL,
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
                templateUrl: CH_DLG_SC_TPL,
                controller: 'channelDialogCtrl',
                locals: {
                    segmentId: sc_id,
                    channelId: channel_id,
                    isSpacecraft: true,
                    isEditing: true
                }
            },
            x_param_gs = {
                templateUrl: CH_DLG_GS_TPL,
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

    it('should check the parameters for the constructor', function () {

        var $scope_sc = $rootScope.$new(),
            sc_id = 'sc-test';

        $controller('channelDialogCtrl', {
            $scope: $scope_sc, $mdDialog: $mdDialog,
            satnetRPC: satnetRPC, snDialog: snDialog,
            segmentId: sc_id, channelId: test_channel_id,
            isSpacecraft: true, isEditing: null
        });
        expect(function () {
            $scope_sc.init();
        }).toThrow('@channelDialogCtrl: no editing flag provided');
 
        $controller('channelDialogCtrl', {
            $scope: $scope_sc, $mdDialog: $mdDialog,
            satnetRPC: satnetRPC, snDialog: snDialog,
            segmentId: null, channelId: test_channel_id,
            isSpacecraft: true, isEditing: true
        });
        expect(function () {
            $scope_sc.init();
        }).toThrow('@channelDialogCtrl: no segment identifier provided');

        $controller('channelDialogCtrl', {
            $scope: $scope_sc, $mdDialog: $mdDialog,
            satnetRPC: satnetRPC, snDialog: snDialog,
            segmentId: sc_id, channelId: null,
            isSpacecraft: true, isEditing: true
        });
        expect(function () {
            $scope_sc.init();
        }).toThrow('@channelDialogCtrl: no channel identifier provided');

    });

    it('should manage exceptios during while option loading', function () {

        var $scope_sc = $rootScope.$new(),
            sc_id = 'sc-test';

        $controller('channelDialogCtrl', {
            $scope: $scope_sc, $mdDialog: $mdDialog,
            satnetRPC: satnetRPC, snDialog: snDialog,
            segmentId: sc_id, channelId: test_channel_id,
            isSpacecraft: true, isEditing: true
        });
        $scope_sc.init();

        // Only the exception case is checked 
        spyOn(snDialog, 'exception').and.callThrough();
        spyOn(satnetRPC, 'rCall').and.callFake(__fn_exception);

        $scope_sc.loadConfiguration();
        $rootScope.$digest();

        expect(satnetRPC.rCall).toHaveBeenCalledWith(
            'sc.channel.get', [sc_id, test_channel_id]
        );
        expect(snDialog.exception).toHaveBeenCalledWith(
            'sc.channel.get', '-', jasmine.any(Function)
        );

    });

    it('should cancel the dialog and show the list', function () {

        var $scope_sc = $rootScope.$new(),
            sc_id = 'sc-test';

        $controller('channelDialogCtrl', {
            $scope: $scope_sc, $mdDialog: $mdDialog,
            satnetRPC: satnetRPC, snDialog: snDialog,
            segmentId: sc_id, channelId: test_channel_id,
            isSpacecraft: true, isEditing: true
        });

        spyOn($mdDialog, 'show').and.callThrough();
        spyOn($mdDialog, 'hide').and.callThrough();

        $scope_sc.cancel();

        expect($mdDialog.hide).toHaveBeenCalled();
        expect($mdDialog.show).toHaveBeenCalledWith({
            templateUrl: CH_LIST_TPL
        });

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
            isEditing: false,
            rpcPrefix: 'sc',
            listTplUrl: CH_LIST_TPL,
            configuration: $scope_sc.scCfg,
            options: CHANNELS_OPTIONS_MOCK
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
            isEditing: false,
            rpcPrefix: 'gs',
            listTplUrl: CH_LIST_TPL,
            configuration: $scope_gs.gsCfg,
            options: CHANNELS_OPTIONS_MOCK
        });

    });

    it('should create the Dialog controller for editing channels', function () {

        var $scope_sc = $rootScope.$new(),
            $scope_gs = $rootScope.$new(),
            sc_id = 'sc-test', gs_id = 'gs-test';

        $controller('channelDialogCtrl', {
            $scope: $scope_sc, $mdDialog: $mdDialog,
            satnetRPC: satnetRPC, snDialog: snDialog,
            segmentId: sc_id, channelId: test_channel_id,
            isSpacecraft: true, isEditing: true
        });

        $scope_sc.init();
        $rootScope.$digest();

        expect($scope_sc.scCfg).toEqual(SC_CHANNEL_MOCK);
        expect($scope_sc.uiCtrl).toEqual({
            add: {
                disabled: true
            },
            segmentId: sc_id,
            isSpacecraft: true,
            isEditing: true,
            rpcPrefix: 'sc',
            listTplUrl: CH_LIST_TPL,
            configuration: $scope_sc.scCfg,
            options: CHANNELS_OPTIONS_MOCK
        });

        $controller('channelDialogCtrl', {
            $scope: $scope_gs, $mdDialog: $mdDialog,
            satnetRPC: satnetRPC, snDialog: snDialog,
            segmentId: gs_id, channelId: test_channel_id,
            isSpacecraft: false, isEditing: true
        });

        $scope_gs.init();
        $rootScope.$digest();

        expect($scope_gs.gsCfg).toEqual(GS_CHANNEL_MOCK);
        expect($scope_gs.uiCtrl).toEqual({
            add: {
                disabled: true
            },
            segmentId: gs_id,
            isSpacecraft: false,
            isEditing: true,
            rpcPrefix: 'gs',
            listTplUrl: CH_LIST_TPL,
            configuration: $scope_gs.gsCfg,
            options: CHANNELS_OPTIONS_MOCK
        });

    });

    it('should add a new channel to the given segment', function () {

        var $scope_sc = $rootScope.$new(),
            $scope_gs = $rootScope.$new(),
            sc_id = 'sc-test', gs_id = 'gs-test',
            x_gs_ch_cfg = {
                identifier: test_channel_id,
                band: '',
                automated: false,
                modulations: [],
                polarizations: [],
                bitrates: [],
                bandwidths: []
            },
            x_sc_ch_cfg = {
                identifier: test_channel_id,
                frequency: 437.265,
                modulation: 'FM',
                polarization: 'LHCP',
                bitrate: 2400,
                bandwidth: 25.000
            };

        spyOn(snDialog, 'success').and.callThrough();
        spyOn(snDialog, 'exception').and.callThrough();

        // ********************************************************* SC TESTING
        $controller('channelDialogCtrl', {
            $scope: $scope_sc, $mdDialog: $mdDialog,
            satnetRPC: satnetRPC, snDialog: snDialog,
            segmentId: sc_id, channelId: test_channel_id,
            isSpacecraft: true, isEditing: false
        });

        // A1) add test
        $scope_sc.init();
        $rootScope.$digest();
        $scope_sc.scCfg = angular.copy(x_sc_ch_cfg);
        $scope_sc.uiCtrl.configuration = $scope_sc.scCfg;
        spyOn(satnetRPC, 'rCall').and.callThrough();

        $scope_sc.add();
        $rootScope.$digest();

        expect(satnetRPC.rCall).toHaveBeenCalledWith(
            'sc.channel.add', [
                sc_id, test_channel_id, x_sc_ch_cfg
            ]
        );
        expect(snDialog.success).toHaveBeenCalledWith(
            sc_id, true, undefined
        );
        snDialog.success.calls.reset();

        // A2) exception during add test
        satnetRPC.rCall.and.callFake(__fn_exception);
        $scope_sc.add();
        $rootScope.$digest();
        expect(satnetRPC.rCall).toHaveBeenCalledWith(
            'sc.channel.add', [
                sc_id, test_channel_id, x_sc_ch_cfg
            ]
        );
        expect(snDialog.exception).toHaveBeenCalledWith(
            'sc.channel.add', '-', jasmine.any(Function)
        );
        snDialog.exception.calls.reset();

        //********************************************************** GS TESTING
        $controller('channelDialogCtrl', {
            $scope: $scope_gs, $mdDialog: $mdDialog,
            satnetRPC: satnetRPC, snDialog: snDialog,
            segmentId: gs_id, channelId: test_channel_id,
            isSpacecraft: false, isEditing: false
        });

        // B1) add test
        $scope_gs.init();
        $rootScope.$digest();
        $scope_gs.scCfg = angular.copy(x_gs_ch_cfg);
        $scope_gs.uiCtrl.configuration = $scope_gs.gsCfg;
        satnetRPC.rCall.and.callThrough();

        $scope_gs.add();
        $rootScope.$digest();

        expect(satnetRPC.rCall).toHaveBeenCalledWith(
            'gs.channel.add', [
                gs_id, test_channel_id, x_gs_ch_cfg
            ]
        );
        expect(snDialog.success).toHaveBeenCalledWith(
            gs_id, true, undefined
        );
        snDialog.success.calls.reset();

        // B2) exception during add test
        satnetRPC.rCall.and.callFake(__fn_exception);
        $scope_gs.add();
        $rootScope.$digest();
        expect(satnetRPC.rCall).toHaveBeenCalledWith(
            'gs.channel.add', [
                gs_id, test_channel_id, x_gs_ch_cfg
            ]
        );
        expect(snDialog.exception).toHaveBeenCalledWith(
            'gs.channel.add', '-', jasmine.any(Function)
        );
        snDialog.exception.calls.reset();

    });
    
});