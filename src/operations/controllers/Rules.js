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
     * @param {Object} $scope     Angular JS $scope for the controller
     * @param {Object} $log       Angular JS $log service
     * @param {Object} $mdDialog  Angular Material $mdDialog service
     * @param {Object} satnetRPC  SatNet RPC service
     * @param {Object} snDialog   SatNet Dialog service
     * @param {String} identifier Identifier of the Ground Station
     */
    function($scope, $log, $mdDialog, satnetRPC, snDialog, identifier) {

        $scope.identifier = identifier;
        $scope.ruleList = [];
        $scope.ruleDlgTplUrl = 'operations/templates/rules/dialog.html';

        /**
         * Functiont hat handles the creation of a Dialog to add a new rule.
         */
        $scope.showAddDialog = function () {
            $mdDialog.show({
                templateUrl: $scope.ruleDlgTplUrl,
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
                templateUrl: $scope.ruleDlgTplUrl,
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
.controller('ruleDialogCtrl', [
    '$scope', 'identifier', 'isEditing',

    function ($scope, identifier, isEditing) {

        $scope.uiCtrl = {
            identifier: identifier,
            isEditing: isEditing
        };

        /**
         * Function that initializes the list of Ground Stations that are to be
         * displayed.
         */
        $scope.init = function () {
        };

        // INITIALIZATION: avoids using ng-init within the template
        $scope.init();

    }

]);