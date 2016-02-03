/**
 * Copyright 2014 Ricardo Tubio-Pardavila
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
 * Created by rtubio on 10/24/14.
 */

describe("Testing Common Filters", function () {

    var isEmptyFilter;

    beforeEach(function () {
        module('snCommonFilters');

        inject(function ($injector) {
            isEmptyFilter = $injector.get('isEmptyFilter');
        });

    });

    describe('isEmpty', function () {

        it('should return that the object is empty', function () {
            expect(isEmptyFilter({})).toBeTruthy();
        });
        it('should return that the object is empty', function () {
            expect(isEmptyFilter({test: 'test'})).toBeFalsy();
        });

    });

});
