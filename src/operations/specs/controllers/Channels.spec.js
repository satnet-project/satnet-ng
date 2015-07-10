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
        __mock__satnetRPC = {
            rCall: function () {}
        },
        test_channel_id = 'channel-test',
        channel_list = ['channel_1', 'channel_2'],
        __fn_channel_list = function () {
            return $q.when().then(function () {
                return channel_list;
            });
        },
        __fn_channel_delete = function () {
            return $q.when().then(function () {
                return test_channel_id;
            });
        },
        __fn_exception = function () {
            return $q.reject(function () {
                return {data: {message: 'Simulated Exception'}};
            });
        },
        satnetRPC, snDialog;

    beforeEach(function () {

        module('snChannelControllers', 'snControllers');
        module(function ($provide) {
            $provide.value('$cookies', __mock__cookies);
            $provide.value('satnetRPC', __mock__satnetRPC);
        });

        inject(function ($injector) {

            $rootScope = $injector.get('$rootScope');
            $controller = $injector.get('$controller');
            $mdDialog = $injector.get('$mdDialog');
            $q = $injector.get('$q');

            satnetRPC = $injector.get('satnetRPC');
            snDialog = $injector.get('snDialog');

        });

    });

    it('should create the List Controller', function () {

        var $scope_sc = $rootScope.$new(),
            $scope_gs = $rootScope.$new();

        __mock__satnetRPC.rCall =
            jasmine.createSpy('rCall').and.callFake(__fn_channel_list);
        $controller('channelListCtrl', {
            $scope: $scope_sc,
            $mdDialog: $mdDialog,
            satnetRPC: satnetRPC,
            segmentId: 'sc-test',
            isSpacecraft: true
        });

        $scope_sc.init();
        $rootScope.$digest();

        expect($scope_sc.uiCtrl.channelDlgTplUrl).toEqual(
            'operations/templates/channels/dialog.html'
        );
        expect($scope_sc.uiCtrl.segmentId).toEqual('sc-test');
        expect($scope_sc.uiCtrl.isSpacecraft).toEqual(true);
        expect($scope_sc.uiCtrl.rpc_prefix).toEqual('sc');

        expect($scope_sc.channelList).toEqual(channel_list);

        __mock__satnetRPC.rCall =
            jasmine.createSpy('rCall').and.callFake(__fn_exception);
        spyOn(snDialog, 'exception');

        $scope_sc.init();
        $rootScope.$digest();

        expect(snDialog.exception).toHaveBeenCalled();

        __mock__satnetRPC.rCall =
            jasmine.createSpy('rCall').and.callFake(__fn_channel_list);
        $controller('channelListCtrl', {
            $scope: $scope_gs, $mdDialog: $mdDialog,
            satnetRPC: satnetRPC, snDialog: snDialog,
            segmentId: 'gs-test', isSpacecraft: false
        });

        $scope_gs.init();
        $rootScope.$digest();
        expect($scope_gs.channelList).toEqual(channel_list);

        __mock__satnetRPC.rCall =
            jasmine.createSpy('rCall').and.callFake(__fn_exception);

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
                templateUrl: 'operations/templates/channels/dialog.html',
                controller: 'channelDialogCtrl',
                locals: {
                    segmentId: sc_id,
                    channelId: '',
                    isSpacecraft: true,
                    isEditing: false
                }
            },
            x_param_gs = {
                templateUrl: 'operations/templates/channels/dialog.html',
                controller: 'channelDialogCtrl',
                locals: {
                    segmentId: gs_id,
                    channelId: '',
                    isSpacecraft: false,
                    isEditing: false
                }
            };

        __mock__satnetRPC.rCall =
            jasmine.createSpy('rCall').and.callFake(__fn_channel_list);
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
                templateUrl: 'operations/templates/channels/dialog.html',
                controller: 'channelDialogCtrl',
                locals: {
                    segmentId: sc_id,
                    channelId: channel_id,
                    isSpacecraft: true,
                    isEditing: true
                }
            },
            x_param_gs = {
                templateUrl: 'operations/templates/channels/dialog.html',
                controller: 'channelDialogCtrl',
                locals: {
                    segmentId: gs_id,
                    channelId: channel_id,
                    isSpacecraft: false,
                    isEditing: true
                }
            };

        __mock__satnetRPC.rCall =
            jasmine.createSpy('rCall').and.callFake(__fn_channel_list);
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

        __mock__satnetRPC.rCall =
            jasmine.createSpy('rCall').and.callFake(__fn_channel_list);

        $scope_sc.init();
        $rootScope.$digest();

        __mock__satnetRPC.rCall =
            jasmine.createSpy('rCall').and.callFake(__fn_channel_delete);

        $scope_sc.delete(test_channel_id);
        $rootScope.$digest();

        expect($scope_sc.refresh).toHaveBeenCalled();
        expect(snDialog.success).toHaveBeenCalledWith(
            'sc.channel.delete', test_channel_id, test_channel_id, null
        );

        __mock__satnetRPC.rCall =
            jasmine.createSpy('rCall').and.callFake(__fn_exception);

        $scope_sc.delete(test_channel_id);
        $rootScope.$digest();

        expect(snDialog.exception).toHaveBeenCalled();
        snDialog.exception.calls.reset();

        $controller("channelListCtrl", {
            $scope: $scope_gs, $mdDialog: $mdDialog,
            satnetRPC: satnetRPC, snDialog: snDialog,
            segmentId: gs_id, isSpacecraft: false
        });
        spyOn($scope_gs, 'refresh');

        __mock__satnetRPC.rCall =
            jasmine.createSpy('rCall').and.callFake(__fn_channel_list);

        $scope_gs.init();
        $rootScope.$digest();

        __mock__satnetRPC.rCall =
            jasmine.createSpy('rCall').and.callFake(__fn_channel_delete);

        $scope_gs.delete(test_channel_id);
        $rootScope.$digest();

        expect($scope_gs.refresh).toHaveBeenCalled();
        expect(snDialog.success).toHaveBeenCalledWith(
            'gs.channel.delete', test_channel_id, test_channel_id, null
        );

        __mock__satnetRPC.rCall =
            jasmine.createSpy('rCall').and.callFake(__fn_exception);

        $scope_sc.delete(test_channel_id);
        $rootScope.$digest();

        expect(snDialog.exception).toHaveBeenCalled();

    });
    
});