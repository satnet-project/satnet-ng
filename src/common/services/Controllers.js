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

angular
.module('snControllers', ['ngMaterial'])
.service('snDialog', [
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
         * Function that is used to notify a success in an action with a given
         * slot.
         *
         * @param {String} action Human-readable action description
         * @param {Number} identifier Identifier of the slot
         */
        this.toastAction = function(action, identifier) {
            $mdToast.show($mdToast.simple()
                .content(action + ' ' + identifier)
                .hideDelay(2000)
            );
        };

        /**
         * Function that is used to notify a success in an operation
         * within this Dialog. If no templateUrl is provided, then the original
         * dialog is not closed and no different dialog gets opened.
         *
         * @param {String} operation  Descriptive name of the operation
         * @param {String} identifier Identifier of the object
         * @param {Object} response    Response from the server
         * @param {Object} templateOptions Options for the $mdDialog template
         */
        this.success = function (
            operation, identifier, response, templateOptions
        ) {

            var message = 'Succesfull operation <' + operation +
                '> over id = <' + identifier + '>';
            $log.info(
                '@success, message = ' + message +
                ', response = ' + JSON.stringify(response)
            );
            $mdToast.show($mdToast.simple().content(message));

            if (templateOptions) {
                $mdDialog.show(templateOptions);
            }

        };

        /**
         * Function that displays an error associated to a given attempted
         * operation over the specified element. The cause thrown by the
         * underlaying service that could not complete the operation has to be
         * given as a paramter as well.
         *
         * @param {String} operation  Descriptive name of the operation
         * @param {String} identifier Identifier of the object
         * @param {Object} cause      Object with the cause of the exception
         */
        this.exception = function (operation, identifier, cause) {

            var message = 'Error while doing operation <' + operation +
                '> over id = <' + identifier + '>';
            $log.error('@exception, cause: ' + JSON.stringify(cause));
            $mdToast.show($mdToast.simple().content(message));
            $mdDialog.hide();

        };

    }

]);
