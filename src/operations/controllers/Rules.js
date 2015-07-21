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
    'snRuleControllers', [
        'ngMaterial',
        'snJRPCServices',
        'snControllers',
        'snRuleFilters'
    ]
)
.controller('ruleListCtrl', [
    '$scope', '$log', '$mdDialog', 'satnetRPC', 'snDialog', 'identifier',

    /**
     * Controller for the list with the Availability Rules for a given Ground
     * Station.
     * 
     * @param {Object} $scope        Angular JS $scope for the controller
     * @param {Object} $log          Angular JS $log service
     * @param {Object} $mdDialog     Angular Material $mdDialog service
     * @param {Object} $mdDatePicker $mdDatePicker component
     * @param {Object} satnetRPC     SatNet RPC service
     * @param {Object} snDialog      SatNet Dialog service
     * @param {String} identifier    Identifier of the Ground Station
     */
    function(
        $scope, $log, $mdDialog, satnetRPC, snDialog, identifier) {

        $scope.identifier = identifier;
        $scope.ruleList = [];
        $scope.dlgTplUrl = 'operations/templates/rules/dialog.html';

        /**
         * Functiont hat handles the creation of a Dialog to add a new rule.
         */
        $scope.showAddDialog = function () {
            $mdDialog.show({
                templateUrl: $scope.dlgTplUrl,
                controller: 'ruleDialogCtrl',
                locals: {
                    identifier: $scope.identifier,
                    isEditing: false
                }
            });
        };

        /**
         * Function that handles the creation of a Dialog to edit an existing
         * rule.
         */
        $scope.showEditDialog = function (rule) {
            $mdDialog.show({
                templateUrl: $scope.dlgTplUrl,
                controller: 'ruleDialogCtrl',
                locals: {
                    identifier: $scope.identifier,
                    isEditing: true,
                    ruleKey: rule.key
                }
            });
        };

        /**
         * Controller function that removes the given Ground Station from the
         * database in the remote server upon user request. It first asks for
         * confirmation before executing this removal.
         *
         * @param {String} identifier Identifier of the Ground Station
         */
        $scope.delete = function (rule) {
            satnetRPC.rCall('rules.delete', [
                $scope.identifier, rule.key
            ]).then(function (results) {
                // TODO broadcaster.ruleRemoved(identifier);
                snDialog.success('rules.delete', identifier, results, null);
                $scope.refresh();
            }).catch(function (cause) {
                snDialog.exception('rules.delete', identifier, cause);
            });
        };
        
        
        /**
         * Function that refreshes the list of registered Ground Stations.
         */
        $scope.refresh = function () {
            satnetRPC.rCall('rules.list', [
                $scope.identifier
            ]).then(
                function (results) {
                    if (results !== null) {
                        $scope.ruleList = results.slice(0);
                    }
                }
            ).catch(
                function (cause) {
                    snDialog.exception('rules.list', '-', cause);
                }
            );
        };

        /**
         * Function that initializes the list of Ground Stations that are to be
         * displayed.
         */
        $scope.init = function () {
            $scope.refresh();
        };

        // INITIALIZATION: avoids using ng-init within the template
        $scope.init();

    }

])
.constant('CREATE_OPERATION', '+')
.constant('ERASE_OPERATION', '-')
.constant('ONCE_PERIODICITY', 'O')
.constant('DAILY_PERIODICITY', 'D')
.constant('WEEKLY_PERIODICITY', 'W')
.constant('NG_DATE_FORMAT', 'YYYY-MM-DD')
.controller('ruleDialogCtrl', [
    '$scope', '$mdDialog',
    'satnetRPC', 'snDialog',
    'CREATE_OPERATION', 'ERASE_OPERATION',
    'ONCE_PERIODICITY', 'DAILY_PERIODICITY', 'WEEKLY_PERIODICITY',
    'NG_DATE_FORMAT',
    'identifier', 'isEditing',

    function (
        $scope, $mdDialog,
        satnetRPC, snDialog,
        CREATE_OPERATION, ERASE_OPERATION,
        ONCE_PERIODICITY, DAILY_PERIODICITY, WEEKLY_PERIODICITY,
        NG_DATE_FORMAT,
        identifier, isEditing
    ) {

        $scope.rule = {
            operation: CREATE_OPERATION,
            periodicity: ONCE_PERIODICITY,
            start_date: '',
            end_date: '',
            onceCfg: {
                start_time: '',
                end_time: ''
            },
            dailyCfg: {
                start_time: '',
                end_time: ''
            },
            weeklyCfg: {}
        };

        $scope.uiCtrl = {
            activeTab: 0,
            endDateDisabled: true,
            invalidDate: false,
            invalidOnceTime: false,
            invalidDailyTime: false,
            invalidWeeklyTime: false,
            minDate: null,
            identifier: identifier,
            isEditing: isEditing
        };

        /**
         * Function that resets all the flags that control the validation state
         * of the ONCE-type rule.
         */
        $scope.resetOnceFlags = function () {
            $scope.uiCtrl.endDateDisabled = false;
            $scope.uiCtrl.invalidOnceTime = false;
            // TODO Weekly rule not implemented yet
        };

        /**
         * Function that resets all the flags that control the validation state
         * of the DAILY-type rule.
         */
        $scope.resetDailyFlags = function () {
            $scope.uiCtrl.endDateDisabled = true;
            $scope.uiCtrl.invalidDailyTime = false;
            // TODO Weekly rule not implemented yet
        };

        /**
         * Function that resets all the flags that control the validation state
         * of the WEEKLY-type rule.
         */
        $scope.resetWeeklyFlags = function () {
            $scope.uiCtrl.endDateDisabled = false;
            // TODO Weekly rule not implemented yet
        };

        /**
         * Function that handles the transition to the ONCE state.
         */
        $scope.switch2Once = function () {
            $scope.uiCtrl.activeTab = 0;
            $scope.rule.periodicity = ONCE_PERIODICITY;
            $scope.resetDailyFlags();
            $scope.resetWeeklyFlags();
        };

        /**
         * Function that handles the transition to the DAILY state.
         */
        $scope.switch2Daily = function () {
            $scope.uiCtrl.activeTab = 1;
            $scope.rule.periodicity = DAILY_PERIODICITY;
            $scope.resetOnceFlags();
            $scope.resetWeeklyFlags();
        };

        /**
         * Function that handles the transition to the WEEKLY state.
         */
        $scope.switch2Weekly = function () {
            $scope.uiCtrl.activeTab = 2;
            $scope.rule.periodicity = WEEKLY_PERIODICITY;
            $scope.resetOnceFlags();
            $scope.resetDailyFlags();
        };

        /**
         * Function that handles the change in the periodicity.
         */
        $scope.periodicityChanged = function () {

            if ($scope.rule.periodicity === ONCE_PERIODICITY) {
                $scope.switch2Once();
                return;
            }
            if ($scope.rule.periodicity === DAILY_PERIODICITY) {
                $scope.switch2Daily();
                return;
            }
            if ($scope.rule.periodicity === WEEKLY_PERIODICITY) {
                $scope.switch2Weekly();
                return;
            }

        };

        /**
         * Function that handles the change in the active tab.
         * 
         * @param {String} periodicity String with the type of periodicity
         */
        $scope.tabSelected = function (periodicity) {

            if (periodicity === ONCE_PERIODICITY) {
                $scope.switch2Once();
                return;
            }
            if (periodicity === DAILY_PERIODICITY) {
                $scope.switch2Daily();
                return;
            }
            if (periodicity === WEEKLY_PERIODICITY) {
                $scope.switch2Weekly();
                return;
            }

        };

        /**
         * Function that handles the change in the time input fields,
         * validating them while the user inputs the hours.
         */
        $scope.onceTimeChanged = function () {

            $scope.uiCtrl.invalidOnceTime =
                $scope.rule.onceCfg.start_time.getTime() >
                    $scope.rule.onceCfg.end_time.getTime() ?
                true : false;

        };

        /**
         * Function that handles the change in the time input fields,
         * validating them while the user inputs the hours.
         */
        $scope.dailyTimeChanged = function () {

            $scope.uiCtrl.invalidDailyTime =
                $scope.rule.dailyCfg.start_time.getTime() >
                    $scope.rule.dailyCfg.end_time.getTime() ?
                true : false;

        };

        /**
         * Function that handles the change in the starting date of the rule.
         */
        $scope.startDateChanged = function () {
            if ( $scope.rule.periodicity === ONCE_PERIODICITY ) {
                return;
            }
            $scope.validateDates();
            $scope.minDate = $scope.rule.start_date.toISOString().split('T')[0];
        };

        /**
         * Function that handles the change in the ending date of the rule.
         */
        $scope.endDateChanged = function () {
            $scope.validateDates();
        };

        /**
         * Function that validates whether the dates that the user has just
         * input in the system are valid or not. For this, the starting date
         * of the rule has to be earlier (strictly speaking) than the ending
         * date. If it is the same, then it should be changed from a daily or
         * weekly rule to a ONCE rule.
         */
        $scope.validateDates = function () {
            if ( $scope.rule.start_date.getTime() >=
                $scope.rule.end_date.getTime() ) {
                $scope.uiCtrl.invalidDate = true;
            } else {
                $scope.uiCtrl.invalidDate = false;
            }
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
         * Function that handles the creation of the rule in the remote server.
         * Its main responsibilities are the serialization of the configuration
         * that has been input by the user into an object that can be properly
         * serialized and transmitted to the remote end.
         */
        $scope.add = function () {

            var cfg = {
                rule_operation: $scope.rule.operation,
                rule_periodicity: $scope.rule.periodicity
            };
    
            if ($scope.rule.periodicity === ONCE_PERIODICITY) {
                cfg.rule_once_date =
                    $scope.rule.start_date.toISOString();
                cfg.rule_once_starting_time =
                    $scope.rule.onceCfg.start_time
                        .toISOString().split('T')[1];
                cfg.rule_once_ending_time =
                    $scope.rule.onceCfg.end_time
                        .toISOString().split('T')[1];
            } else {
                cfg.rule_daily_initial_date =
                    $scope.rule.start_date.toISOString();
                cfg.rule_daily_final_date =
                    $scope.rule.end_date.toISOString();
                cfg.rule_daily_starting_time =
                    $scope.rule.dailyCfg.start_time
                        .toISOString().split('T')[1];
                cfg.rule_daily_ending_time =
                    $scope.rule.dailyCfg.end_time
                        .toISOString().split('T')[1];
            }

            satnetRPC.rCall('rules.add', [identifier, cfg]).then(
                function (response) {
                    var id = response.spacecraft_id;
                    // TODO broadcaster.scAdded(id);
                    // FIXME ISSUE #10: Error while showing the $mdDialog
                    $mdDialog.hide();
                    snDialog.success('sc.add', id, response, null);
                },
                function (cause) {
                    snDialog.exception('sc.add', '-', cause);
                }
            );

        };
            
        /**
         * Function that initializes the list of Ground Stations that are to be
         * displayed.
         */
        $scope.init = function () {

            var today = new Date(
                    moment().utc().format(NG_DATE_FORMAT)
                ),
                tomorrow = new Date(
                    moment().utc().add(1, 'days').format(NG_DATE_FORMAT)
                ),
                today_1h = new Date(
                    moment().utc().add(1, 'hours').format(NG_DATE_FORMAT)
                ),
                minDate = new Date(
                    moment().utc().subtract(1, 'days').format(NG_DATE_FORMAT)
                ).toISOString().split('T')[0],
                maxDate = new Date(
                    moment().utc().add(1, 'years').format(NG_DATE_FORMAT)
                ).toISOString().split('T')[0];

            $scope.rule.start_date = today;
            $scope.rule.end_date = tomorrow;
            $scope.rule.onceCfg.start_time = today;
            $scope.rule.onceCfg.end_time = today_1h;
            $scope.rule.dailyCfg.start_time = today;
            $scope.rule.dailyCfg.end_time = today_1h;
            $scope.uiCtrl.minDate = minDate;
            $scope.uiCtrl.maxDate = maxDate;

        };

        // INITIALIZATION: avoids using ng-init within the template
        $scope.init();

    }

]);