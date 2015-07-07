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

angular.module('snControllers', ['ngMaterial']).service('snDialogs', [
    '$log', '$mdDialog', '$mdToast',

    /**
     * Set of helpers for the SatNet dialogs.
     *
     * @param {Object} $log      Angular JS $log service
     * @param {Object} $mdDialog Angular Material $mdDialog service
     * @param {Object} $mdToast  Angular Material $mdToast service
     */
    function ($log, $mdDialog, $mdToast) {

        /**
         * Function that is used to notify a success in an operation
         * within this Dialog.
         *
         * @param {String} identifier Identifier of the spacecraft
         * @param {Object} results    Response from the server
         * @param {String} templateUrl URL with the template to load after
         *                             closing the dialog.
         */
        this.success = function (identifier, results, templateUrl) {
            var message = '<' + identifier + '> succesfully updated!';
            $log.info(message, ', response = ' + JSON.stringify(results));
            console.log('>>> templateUrl = ' + templateUrl);
            $mdToast.show($mdToast.simple().content(message));
            $mdDialog.hide();
            $mdDialog.show({
                templateUrl: templateUrl
            });
        };

    }

]);