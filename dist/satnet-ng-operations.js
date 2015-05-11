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

angular.module('splashDirective', [])
    .directive('mAppLoading', ['$animate',

    /**
     * This function implements the controller.
     *
     * This CSS class-based directive controls the pre-bootstrap loading screen.
     * By default, it is visible on the screen; but, once the application loads,
     * we'll fade it out and remove it from the DOM.
     *
     * @param   {Object} $animate $animate service.
     * @returns {Object} Object with the description of the directive.
     */
    function ($animate) {
            'use strict';

            /**
             * This function links the just created CSS class-like directive in
             * order to control the end of the animation. Once the animation is
             * over, it removes itself from the DOM tree.
             *
             * Due to the way AngularJS prevents animation during the bootstrap
             * of the application, we can't animate the top-level container;
             * but, since we added "ngAnimateChildren", we can animated the
             * inner container during this phase.
             * --
             * NOTE: Am using .eq(1) so that we don't animate the Style block.
             *
             * @param {Object} scope      The scope for this directive.
             * @param {Object} element    The parent element from the DOM tree.
             * @param {Object} attributes Object with the attributes of the
             *                            element.
             */
            var link = function (scope, element, attributes) {

                $animate.leave(element.children().eq(1)).then(
                    function cleanupAfterAnimation() {
                        element.remove();
                        scope = element = attributes = null;
                    }
                );

            };

            return ({
                link: link,
                restrict: "C"
            });

    }]);;/*
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
    );;/*
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

angular.module('operationsDirective', [
        'ngMaterial',
        'ngAnimate',
        'leaflet-directive',
        'splashDirective',
        'snAboutDirective',
        'operationsMenuControllers'
    ]).config(function ($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('blue-grey')
            .accentPalette('grey');
    })
    .directive('operationsApp',

        /**
         * Function that creates the directive itself returning the
         * object required by Angular.
         *
         * @returns {Object} Object directive required by Angular,
         *                   with restrict and templateUrl.
         */
        function () {
            'use strict';
            return {
                restrict: 'E',
                templateUrl: 'templates/operations-app.html'
            };

        }

    );;/*
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

var opsMenuCtrlModule = angular.module(
    'operationsMenuControllers', [
        'ngMaterial',
        'ngAnimate',
        'leaflet-directive',
        'splashDirective'
    ]
);

opsMenuCtrlModule.controller('OperationsAppCtrl',

    /**
     * Main controller for the Operations application.
     * @param   {Object}   $scope               Controller execution scope.
     * @param   {Object}   $mdSidenav           Side mane service from Angular
     *                                          Material.
     */
    function ($scope, $mdSidenav) {
        'use strict';

        $scope.toggle = angular.noop;

        /**
         * Handler to toggle the menu on and off. It is based on the $mdSidenav
         * service provided by Angular Material. Its main objective is to
         * provide a button overlayed over the map so that in case the menu is
         * hidden (due to the small size of the screen), the menu can still be
         * shown.
         */
        $scope.toggleMenu = function () {
            $mdSidenav('menu').toggle().then(function () {});
        };

    });

opsMenuCtrlModule.controller('OperationsMenuCtrl',

    /**
     * Controller of the menu for the Operations application. It creates a
     * function bound to the event of closing the menu that it controls and
     * a flag with the state (open or closed) of that menu.
     * @param   {Object} $scope               Controller execution scope.
     * @param   {Object} $mdSidenav           Side mane service from Angular
     *                                        Material.
     */
    function ($scope, $mdSidenav) {
        'use strict';

        $scope.closed = false;

        /**
         * Handler to close the menu that actually takes the user out of
         * the application.
         */
        $scope.close = function () {
            $mdSidenav("menu").close().then(function () {
                $scope.closed = true;
            });
        };

    });