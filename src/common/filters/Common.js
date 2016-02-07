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

angular.module('snCommonFilters', [])
.filter('isEmpty', function () {
    return function (object) {
        return angular.equals({}, object);
    };
})
.filter('findProperty', function() {
    return function(propertyName, propertyValue, collection) {
        for (var i = 0, len = collection.length; i < len; i++) {
            if (collection[i][propertyName] === propertyValue) {
                return {
                    index: i,
                    value: collection[i]
                };
            }
        }
        return {
            index: -1,
            value: null
        };
    };
});
