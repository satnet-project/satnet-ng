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
 * Created by rtubio on 15/05/15.
 */

angular.module('snMapDirective', ['leaflet-directive', 'snMapServices'])
    .controller('MapCtrl', [ '$scope', 'mapServices',

        /**
         * Main controller for the map directive. It should be in charge of all
         * the additional controls and/or objects that are overlayed over the
         * original map. The main control of the map should be written in
         * re-usable functions within the 'mapServices' object.
         * 
         * @param {Object} $scope      $scope for the controller.
         * @param {Object} mapServices Service with the custom functions to
         *                             control the maps object.
         */
        function($scope, mapServices) {
            'use strict';

            /**
             * Function that handles the initialization of the map.
             */
            $scope.init = function () {
                mapServices.createMainMap();
            };

            $scope.init();

        }
    ])
    .directive('snMap',

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
                templateUrl: 'common/templates/sn-map.html'
            };

        }

    );