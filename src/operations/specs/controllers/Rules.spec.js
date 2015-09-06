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
                return {
                    data: {
                        message: 'Simulated Exception'
                    }
                };
            });
        },
        satnetRPC, snDialog,
        GS_RULES_MOCK,
        CREATE_OPERATION, ERASE_OPERATION,
        DATES_SERIAL,
        ONCE_PERIODICITY, DAILY_PERIODICITY, WEEKLY_PERIODICITY,
        NG_DATE_FORMAT;

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

            CREATE_OPERATION = $injector.get('CREATE_OPERATION');
            ERASE_OPERATION = $injector.get('ERASE_OPERATION');

            DATES_SERIAL = $injector.get('DATES_SERIAL');
            ONCE_PERIODICITY = $injector.get('ONCE_PERIODICITY');
            DAILY_PERIODICITY = $injector.get('DAILY_PERIODICITY');
            WEEKLY_PERIODICITY = $injector.get('WEEKLY_PERIODICITY');

            NG_DATE_FORMAT = $injector.get('NG_DATE_FORMAT');

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

    it('should initialize the scope of the controler', function () {

        var $scope = $rootScope.$new(),
            gs_id = 'gs-test',
            today_array = new Date().toISOString().split('T')[0].split('-'),
            min_day_i = parseInt(today_array[2]) - 1,
            min_day_s = (min_day_i < 10) ? '0' + min_day_i : '' + min_day_i,
            x_min_date = '' + today_array[0] + '-' + today_array[1] + '-' + min_day_s,
            x_max_date = '' + (parseInt(today_array[0]) + 1) + '-' + today_array[1] + '-' + today_array[2];

        $controller('ruleDialogCtrl', {
            $scope: $scope,
            $mdDialog: $mdDialog,
            identifier: gs_id,
            isEditing: true
        });

        expect($scope.uiCtrl).toEqual({
            activeTab: 0,
            endDateDisabled: true,
            invalidDate: false,
            invalidOnceTime: false,
            invalidDailyTime: false,
            invalidWeeklyTime: false,
            identifier: gs_id,
            isEditing: true,
            minDate: x_min_date,
            maxDate: x_max_date
        });

        expect($scope.rule.operation).toEqual(CREATE_OPERATION);
        expect($scope.rule.periodicity).toEqual(ONCE_PERIODICITY);
        expect($scope.rule.weeklyCfg).toEqual({});

    });

    it('should add a new rule to the system', function () {

        var $scope = $rootScope.$new(),
            gs_id = 'gs-test',
            today = new Date(
                moment().utc().format(NG_DATE_FORMAT)
            ),
            tomorrow = new Date(
                moment().utc().add(1, 'days').format(NG_DATE_FORMAT)
            ),
            time = today.toISOString().split('T')[1],
            x_once_cfg = {
                rule_operation: CREATE_OPERATION,
                rule_periodicity: 'rule_periodicity_once',
                rule_dates: {
                    rule_once_date: today.toISOString(),
                    rule_once_starting_time: time,
                    rule_once_ending_time: time
                }
            },
            x_daily_cfg = {
                rule_operation: CREATE_OPERATION,
                rule_periodicity: 'rule_periodicity_daily',
                rule_dates: {
                    rule_daily_initial_date: today.toISOString(),
                    rule_daily_final_date: tomorrow.toISOString(),
                    rule_starting_time: today.toISOString().split('T')[1],
                    rule_ending_time: today.toISOString().split('T')[1]
                }
            };

        $controller('ruleDialogCtrl', {
            $scope: $scope,
            $mdDialog: $mdDialog,
            satnetRPC: satnetRPC,
            identifier: gs_id,
            isEditing: true
        });
        spyOn(satnetRPC, 'rCall').and.callThrough();

        // 1) ONCE-type rule
        $scope.add();
        expect(satnetRPC.rCall).toHaveBeenCalledWith(
            'rules.add', [gs_id, x_once_cfg]
        );
        satnetRPC.rCall.calls.reset();

        // 2) DAILY-type rule
        $scope.periodicity = DAILY_PERIODICITY;
        $scope.rule.periodicity = DAILY_PERIODICITY;
        $scope.add();
        expect(satnetRPC.rCall).toHaveBeenCalledWith(
            'rules.add', [gs_id, x_daily_cfg]
        );

    });

    it('should cancel the dialog and show the list', function () {

        var $scope = $rootScope.$new(),
            gs_id = 'gs-test';

        $controller('ruleDialogCtrl', {
            $scope: $scope,
            $mdDialog: $mdDialog,
            identifier: gs_id,
            isEditing: true
        });

        spyOn($mdDialog, 'hide').and.callThrough();
        $scope.cancel();
        expect($mdDialog.hide).toHaveBeenCalled();

    });

});