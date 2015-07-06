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

angular.module('snSplashDirective', []).directive('mAppLoading', ['$animate',

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

    }]);