/*
   Copyright 2015 Ricardo Tubio-Pardavila

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

angular.module('snAboutDirective', ['ngMaterial'])
    .controller('snAboutDlgCtrl', ['$scope', '$mdDialog',

        /**
         * Controller function for handling the SatNet about dialog itself.
         *
         * @param {Object} $scope $scope for the controller.
         */
        function ($scope, $mdDialog) {
            'use strict';

            /**
             * Function that closes the dialog.
             */
            $scope.closeDialog = function () {
                $mdDialog.hide();
            };

        }

    ])
    .controller('snAboutCtrl', ['$scope', '$mdDialog',

        /**
         * Controller function for opening the SatNet About dialog.
         *
         * @param {Object} $scope    $scope for the controller.
         * @param {Object} $mdDialog Angular material Dialog service.
         */
        function ($scope, $mdDialog) {
            'use strict';

            /**
             * Function that opens the dialog when the snAbout button is
             * clicked.
             */
            $scope.openSnAbout = function () {
                $mdDialog.show({
                    templateUrl: 'templates/sn-about-dialog.html'
                        /*
                        template: '' +
                            '<md-dialog>' +
                            '  <md-content>The SatNet Network</md-content>' +
                            '  <div class="md-actions">' +
                            '    <md-button ng-click="closeDialog()">' +
                            '      Close' +
                            '    </md-button>' +
                            '  </div>' +
                            '</md-dialog>',
                        controller: 'snAboutDlgCtrl'
                        */
                });
            };

        }
    ])
    .directive('snAbout',

        /**
         * Function that creates the directive itself returning the object
         * required by Angular.
         *
         * @returns {Object} Object directive required by Angular, with
         *                   restrict and templateUrl.
         */
        function () {
            'use strict';

            return {
                restrict: 'E',
                template: '' +
                    '<md-button id="menuAbout" ng-controller="snAboutCtrl" ng-click="openSnAbout()" aria-label="about" class="md-primary menu-button">' +
                    '   <div layout="row" layout-fill>' +
                    '       <i class="fa fa-question"></i>' +
                    '       <b>about</b>' +
                    '   </div>' +
                    '</md-button>'
            };

        }
    );