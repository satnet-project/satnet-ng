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
.controller('ruleDialogCtrl', [
    '$scope', '$mdDialog',
    'CREATE_OPERATION', 'ERASE_OPERATION',
    'ONCE_PERIODICITY', 'DAILY_PERIODICITY', 'WEEKLY_PERIODICITY',
    'identifier', 'isEditing',

    function (
        $scope, $mdDialog,
        CREATE_OPERATION, ERASE_OPERATION,
        ONCE_PERIODICITY, DAILY_PERIODICITY, WEEKLY_PERIODICITY,
        identifier, isEditing
    ) {

        $scope.rule = {
            operation: CREATE_OPERATION,
            periodicity: ONCE_PERIODICITY,
            start_date: '',
            end_date: ''
        };
        $scope.uiCtrl = {
            activeTab: 0,
            endDateDisabled: true,
            identifier: identifier,
            isEditing: isEditing
        };

        $scope.enableEndDate = function () {
            if ($scope.rule.periodicity === ONCE_PERIODICITY ) {
                return false;
            }
            return true;
        };

        $scope.periodicityChanged = function () {

            if ($scope.rule.periodicity === ONCE_PERIODICITY) {
                $scope.uiCtrl.activeTab = 0;
                $scope.uiCtrl.endDateDisabled = true;
                return;
            }
            if ($scope.rule.periodicity === DAILY_PERIODICITY) {
                $scope.uiCtrl.activeTab = 1;
                $scope.uiCtrl.endDateDisabled = false;
                return;
            }
            if ($scope.rule.periodicity === WEEKLY_PERIODICITY) {
                $scope.uiCtrl.activeTab = 2;
                $scope.uiCtrl.endDateDisabled = false;
                return;
            }

        };

        $scope.tabSelected = function (periodicity) {

            if (periodicity === ONCE_PERIODICITY) {
                $scope.rule.periodicity = ONCE_PERIODICITY;
                $scope.uiCtrl.endDateDisabled = true;
                return;
            }
            if (periodicity === DAILY_PERIODICITY) {
                $scope.rule.periodicity = DAILY_PERIODICITY;
                $scope.uiCtrl.endDateDisabled = false;
                return;
            }
            if (periodicity === WEEKLY_PERIODICITY) {
                $scope.rule.periodicity = WEEKLY_PERIODICITY;
                $scope.uiCtrl.endDateDisabled = false;
                return;
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
         * Function that initializes the list of Ground Stations that are to be
         * displayed.
         */
        $scope.init = function () {
            //var today = moment().format();
            $scope.rule.start_date = new Date();
            $scope.rule.end_date = new Date();
        };

        $scope.init();
    }

]);