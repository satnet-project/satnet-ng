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

describe('Testing ApplicationBus Service', function () {

    var snMessageBus, $rootScope;

    beforeEach(function () {
        module('snApplicationBus');

        inject(function ($injector) {
            snMessageBus = $injector.get('snMessageBus');
            $rootScope = $injector.get('$rootScope');
        });

        spyOn($rootScope, '$broadcast');

    });

    it('should return a non-null snMessageBus object', function () {
        expect(snMessageBus).not.toBeNull();
    });

    it('should notify request messages', function () {

        var message = {
            test_data: 'data'
        };

        snMessageBus.send(
            snMessageBus.CHANNELS.requests.id,
            snMessageBus.EVENTS.created.id,
            message
        );
        expect($rootScope.$broadcast).toHaveBeenCalledWith(
            snMessageBus.CHANNELS.requests.id,
            snMessageBus.EVENTS.created.id,
            message
        );
        $rootScope.$broadcast.calls.reset();

        snMessageBus.send(
            snMessageBus.CHANNELS.requests.id,
            snMessageBus.EVENTS.updated.id,
            message
        );
        expect($rootScope.$broadcast).toHaveBeenCalledWith(
            snMessageBus.CHANNELS.requests.id,
            snMessageBus.EVENTS.updated.id,
            message
        );
        $rootScope.$broadcast.calls.reset();

        snMessageBus.send(
            snMessageBus.CHANNELS.requests.id,
            snMessageBus.EVENTS.deleted.id,
            message
        );
        expect($rootScope.$broadcast).toHaveBeenCalledWith(
            snMessageBus.CHANNELS.requests.id,
            snMessageBus.EVENTS.deleted.id,
            message
        );
        $rootScope.$broadcast.calls.reset();

    });

});
