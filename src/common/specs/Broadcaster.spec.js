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

describe('Testing Broadcaster Service', function () {

    var broadcaster, $rootScope;

    beforeEach(function () {
        module('broadcaster');

        module(function ($provide) {
            $provide.value('satnetPush', {
                bind: function () {
                    return 'mockBind';
                }
            });
        });

        inject(function ($injector) {
            broadcaster = $injector.get('broadcaster');
            $rootScope = $injector.get('$rootScope');
        });

        spyOn($rootScope, '$broadcast');

    });

    it('should return a non-null broadcaster object', function () {
        expect(broadcaster).not.toBeNull();
    });

    it('should implement the expected API', function () {

        expect(broadcaster.GS_ADDED_EVENT).toBe('gs.added');
        expect(broadcaster.GS_REMOVED_EVENT).toBe('gs.removed');
        expect(broadcaster.GS_UPDATED_EVENT).toBe('gs.updated');

        expect(broadcaster.GS_AVAILABLE_ADDED_EVENT).toBe('gs.available.added');
        expect(broadcaster.GS_AVAILABLE_REMOVED_EVENT).toBe('gs.available.removed');
        expect(broadcaster.GS_AVAILABLE_UPDATED_EVENT).toBe('gs.available.updated');

        expect(broadcaster.PASSES_UPDATED).toBe('passes.updated');

        expect(broadcaster.LEOP_GSS_UPDATED_EVENT).toBe('leop.gss.updated');
        expect(broadcaster.LEOP_GS_ASSIGNED_EVENT).toBe('leop.gs.assigned');
        expect(broadcaster.LEOP_GS_RELEASED_EVENT).toBe('leop.gs.released');

        expect(broadcaster.LEOP_UPDATED_EVENT).toBe('leop.updated');
        expect(broadcaster.LEOP_FRAME_RX_EVENT).toBe('leop.frame.rx');

        expect(broadcaster.KEEP_ALIVE_EVENT).toBe('KEEP_ALIVE');

        expect(broadcaster.SC_ADDED_EVENT).toBe('sc.added');
        expect(broadcaster.SC_REMOVED_EVENT).toBe('sc.removed');
        expect(broadcaster.SC_UPDATED_EVENT).toBe('sc.updated');

    });

    it('should broadcast the KEEP ALIVE event', function () {

        broadcaster.keepAliveReceived({
            data: 'TEST_DATA_TEST'
        });
        expect($rootScope.$broadcast).toHaveBeenCalledWith('KEEP_ALIVE', {});

    });

    it('should broadcast the events about GS configuration', function () {

        var id = 'test_id';

        broadcaster.gsAvailableAddedInternal(id);
        expect($rootScope.$broadcast)
            .toHaveBeenCalledWith('gs.available.added', id);

        broadcaster.gsAdded(id);
        expect($rootScope.$broadcast).toHaveBeenCalledWith('gs.added', id);
        broadcaster.gsRemoved(id);
        expect($rootScope.$broadcast).toHaveBeenCalledWith('gs.removed', id);
        broadcaster.gsUpdated(id);
        expect($rootScope.$broadcast).toHaveBeenCalledWith('gs.updated', id);

    });

    it('should broadcast the events about SC configuration', function () {

        var id = 'test_id';

        broadcaster.scAdded(id);
        expect($rootScope.$broadcast).toHaveBeenCalledWith('sc.added', id);
        broadcaster.scUpdated(id);
        expect($rootScope.$broadcast).toHaveBeenCalledWith('sc.updated', id);
        broadcaster.scRemoved(id);
        expect($rootScope.$broadcast).toHaveBeenCalledWith('sc.removed', id);

    });

    it('should broadcast the LEOP events concerning SC', function () {

        var __sc_object_id__ = {
            launch_id: 'available_test_id',
            launch_sc_id: 'launch_sc_test_id',
            spacecraft_id: 'sc_test_id'
        };

        $rootScope.leop_id = __sc_object_id__.launch_id;
        broadcaster.leopUfoIdentified(__sc_object_id__);
        expect($rootScope.$broadcast).toHaveBeenCalledWith('sc.added', __sc_object_id__.spacecraft_id);
        expect($rootScope.$broadcast).toHaveBeenCalledWith('passes.updated', {});
        $rootScope.$broadcast.calls.reset();
        $rootScope.leop_id = 'FAKE-ID';
        broadcaster.leopUfoIdentified(__sc_object_id__);
        expect($rootScope.$broadcast)
            .not.toHaveBeenCalledWith('sc.added', __sc_object_id__.spacecraft_id);
        expect($rootScope.$broadcast)
            .not.toHaveBeenCalledWith('passes.updated', {});
        $rootScope.$broadcast.calls.reset();

        $rootScope.leop_id = __sc_object_id__.launch_id;
        broadcaster.leopUfoUpdated(__sc_object_id__);
        expect($rootScope.$broadcast)
            .toHaveBeenCalledWith('sc.updated', __sc_object_id__.spacecraft_id);
        expect($rootScope.$broadcast)
            .toHaveBeenCalledWith('passes.updated', {});
        $rootScope.$broadcast.calls.reset();
        $rootScope.leop_id = 'FAKE-ID';
        broadcaster.leopUfoUpdated(__sc_object_id__);
        expect($rootScope.$broadcast)
            .not.toHaveBeenCalledWith('sc.updated', __sc_object_id__.spacecraft_id);
        expect($rootScope.$broadcast)
            .not.toHaveBeenCalledWith('passes.updated', {});
        $rootScope.$broadcast.calls.reset();
        $rootScope.leop_id = __sc_object_id__.launch_id;

        broadcaster.leopUfoForgot(__sc_object_id__);
        expect($rootScope.$broadcast).toHaveBeenCalledWith('sc.removed', __sc_object_id__.spacecraft_id);
        expect($rootScope.$broadcast).toHaveBeenCalledWith('passes.updated', {});
        $rootScope.$broadcast.calls.reset();
        $rootScope.leop_id = 'FAKE-ID';
        broadcaster.leopUfoForgot(__sc_object_id__);
        expect($rootScope.$broadcast)
            .not.toHaveBeenCalledWith('sc.removed', __sc_object_id__.spacecraft_id);
        expect($rootScope.$broadcast)
            .not.toHaveBeenCalledWith('passes.updated', {});
        $rootScope.$broadcast.calls.reset();
        $rootScope.leop_id = __sc_object_id__.launch_id;

        broadcaster.leopSCUpdated(__sc_object_id__);
        expect($rootScope.$broadcast).toHaveBeenCalledWith('sc.updated', __sc_object_id__.launch_sc_id);
        expect($rootScope.$broadcast).toHaveBeenCalledWith('passes.updated', {});
        $rootScope.$broadcast.calls.reset();
        $rootScope.leop_id = 'FAKE-ID';
        broadcaster.leopSCUpdated(__sc_object_id__);
        expect($rootScope.$broadcast)
            .not.toHaveBeenCalledWith('sc.updated', __sc_object_id__.spacecraft_id);
        expect($rootScope.$broadcast)
            .not.toHaveBeenCalledWith('passes.updated', {});
        $rootScope.$broadcast.calls.reset();
        $rootScope.leop_id = __sc_object_id__.launch_id;

    });

    it('should broadcast the LEOP events concerning GS', function () {

        var __gs_object_id__ = {
            groundstation_id: 'gs_test_id',
            launch_id: 'test_launch_id'
        };

        $rootScope.leop_id = 'test_launch_id';
        broadcaster.leopGsAssigned(__gs_object_id__);
        expect($rootScope.$broadcast)
            .toHaveBeenCalledWith('leop.gs.assigned', __gs_object_id__.groundstation_id);
        $rootScope.$broadcast.calls.reset();
        broadcaster.leopGsAssigned('FAKE-ID');
        expect($rootScope.$broadcast)
            .not.toHaveBeenCalledWith('leop.gs.assigned', __gs_object_id__.groundstation_id);
        $rootScope.$broadcast.calls.reset();

        $rootScope.leop_id = 'test_launch_id';
        broadcaster.leopGsReleased(__gs_object_id__);
        expect($rootScope.$broadcast)
            .toHaveBeenCalledWith('leop.gs.released', __gs_object_id__.groundstation_id);
        $rootScope.$broadcast.calls.reset();
        broadcaster.leopGsReleased('FAKE-ID');
        expect($rootScope.$broadcast)
            .not.toHaveBeenCalledWith('leop.gs.released', __gs_object_id__.groundstation_id);
        $rootScope.$broadcast.calls.reset();

    });

    it('should broadcast the events concerning frames', function () {

        var __data_frame__ = {
            frame: 'TEST_FRAME_TEST_FRAME'
        };

        broadcaster.leopFrameReceived(__data_frame__);
        expect($rootScope.$broadcast).toHaveBeenCalledWith('leop.frame.rx', __data_frame__.frame);

    });

    it('should broadcast the pushed events properly', function () {

        var __object_id__ = {
            identifier: 'available_test_id'
        };

        broadcaster.gsAvailableAdded(__object_id__);
        expect($rootScope.$broadcast).toHaveBeenCalledWith('gs.available.added', __object_id__.identifier);
        broadcaster.gsAvailableRemoved(__object_id__);
        expect($rootScope.$broadcast).toHaveBeenCalledWith('gs.available.removed', __object_id__.identifier);
        broadcaster.gsAvailableUpdated(__object_id__);
        expect($rootScope.$broadcast).toHaveBeenCalledWith('gs.available.updated', __object_id__.identifier);

        broadcaster.passesUpdated();
        expect($rootScope.$broadcast).toHaveBeenCalledWith('passes.updated', {});

        broadcaster.scGtUpdated(__object_id__);
        expect($rootScope.$broadcast).toHaveBeenCalledWith('sc.updated', __object_id__.identifier);

        $rootScope.leop_id = 'available_test_id';
        broadcaster.leopGssUpdated(__object_id__);
        expect($rootScope.$broadcast)
            .toHaveBeenCalledWith('leop.gss.updated', __object_id__);
        $rootScope.$broadcast.calls.reset();
        broadcaster.leopGssUpdated('FAKE-ID');
        expect($rootScope.$broadcast).not.toHaveBeenCalledWith('leop.gss.updated', 'FAKE-ID');
        $rootScope.$broadcast.calls.reset();

        $rootScope.leop_id = __object_id__.identifier;
        broadcaster.leopUpdated(__object_id__);
        expect($rootScope.$broadcast)
            .toHaveBeenCalledWith('leop.updated', __object_id__);
        $rootScope.$broadcast.calls.reset();
        var fake_object_id = __object_id__;
        fake_object_id.identifier = 'FAKE-ID';
        broadcaster.leopUpdated(fake_object_id);
        expect($rootScope.$broadcast)
            .not.toHaveBeenCalledWith('leop.updated', fake_object_id);
        $rootScope.$broadcast.calls.reset();

    });

});