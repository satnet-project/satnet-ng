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

describe('Testing Rules controllers', function () {

    var $rootScope, $controller, $mdDialog, $q,
        __mock__cookies = {},
        __fn_exception = function () {
            return $q.reject(function () {
                return {data: {message: 'Simulated Exception'}};
            });
        },
        satnetRPC, snDialog,
        GS_RULES_MOCK;

    beforeEach(function () {

        module('snRuleControllers', 'snControllers', 'snJRPCMock');
        module(function ($provide) {
            $provide.value('$cookies', __mock__cookies);
        });

        inject(function ($injector) {

            $rootScope = $injector.get('$rootScope');
            $controller = $injector.get('$controller');
            $mdDialog = $injector.get('$mdDialog');
            $q = $injector.get('$q');

            snDialog = $injector.get('snDialog');
            satnetRPC = $injector.get('satnetRPC');

            GS_RULES_MOCK = $injector.get('GS_RULES_MOCK');

        });

    });

    it('should create the List Controller', function () {

        var $scope_list = $rootScope.$new(),
            gs_identifier = 'test-gs';

        $controller('ruleListCtrl', {
            $scope: $scope_list,
            $mdDialog: $mdDialog,
            identifier: gs_identifier
        });

        $scope_list.init();
        $rootScope.$digest();

        expect($scope_list.ruleList).toEqual(GS_RULES_MOCK);

        spyOn(satnetRPC, 'rCall').and.callFake(__fn_exception);
        spyOn(snDialog, 'exception');

        $scope_list.init();
        $rootScope.$digest();

        expect(snDialog.exception).toHaveBeenCalled();

    });

    it('should launch the dialog to create a new rule', function () {

        var $scope_list = $rootScope.$new(),
            gs_identifier = 'test-gs';

        $controller('ruleListCtrl', {
            $scope: $scope_list,
            $mdDialog: $mdDialog,
            identifier: gs_identifier
        });

        spyOn($mdDialog, 'show');

        $scope_list.showAddDialog();
        $rootScope.$digest();

        expect($mdDialog.show).toHaveBeenCalledWith({
            templateUrl: 'operations/templates/rules/dialog.html',
            controller: 'ruleDialogCtrl',
            locals: {
                identifier: gs_identifier,
                isEditing: false
            }
        });

    });

    it('should launch the dialog to edit an existing rule', function () {

        var $scope_list = $rootScope.$new(),
            gs_identifier = 'test-gs',
            rule_key = 1,
            rule = {
                key: rule_key
            };

        $controller('ruleListCtrl', {
            $scope: $scope_list,
            $mdDialog: $mdDialog,
            identifier: gs_identifier
        });

        spyOn($mdDialog, 'show');

        $scope_list.showEditDialog(rule);
        $rootScope.$digest();

        expect($mdDialog.show).toHaveBeenCalledWith({
            templateUrl: 'operations/templates/rules/dialog.html',
            controller: 'ruleDialogCtrl',
            locals: {
                identifier: gs_identifier,
                isEditing: true,
                ruleKey: rule_key
            }
        });

    });

    it('should allow users to delete existing rules', function () {

        var $scope_list = $rootScope.$new(),
            gs_identifier = 'test-gs',
            rule_key = 1,
            rule = {
                key: rule_key
            };

        $controller('ruleListCtrl', {
            $scope: $scope_list,
            $mdDialog: $mdDialog,
            snDialog: snDialog,
            identifier: gs_identifier
        });

        spyOn(snDialog, 'success');
        spyOn(snDialog, 'exception');

        $scope_list.delete(rule);
        $rootScope.$digest();

        expect(snDialog.success).toHaveBeenCalledWith(
            'rules.delete', gs_identifier, true, null
        );

        spyOn(satnetRPC, 'rCall').and.callFake(__fn_exception);

        $scope_list.delete(rule_key);
        $rootScope.$digest();

        expect(snDialog.exception).toHaveBeenCalledWith(
            'rules.delete', gs_identifier, jasmine.any(Function)
        );

    });
    
});