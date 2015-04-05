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

describe('Test Broadcaster Service', function () {

    var broadcaster, rootScope;

    beforeEach(function() {
        module('broadcaster');

        module(function ($provide) {
            $provide.value('satnetPush', {
                bind: function () { return 'mockBind'; }
            });
        });

        inject(function($injector) {
            broadcaster = $injector.get('broadcaster');
            rootScope = $injector.get('$rootScope');
            spyOn(rootScope, '$broadcast');
        });

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
    
    it('should broadcast the pushed events properly', function () {
        var __id__ = 'test_id',
            __object__ = {
                identifier: 'available_test_id'
            },
            __gs_object_id__ = {
                groundstation_id: 'gs_test_id'
            };

        broadcaster.gsAdded(__id__);
        expect(rootScope.$broadcast).toHaveBeenCalledWith('gs.added', __id__);
        broadcaster.gsRemoved(__id__);
        expect(rootScope.$broadcast).toHaveBeenCalledWith('gs.removed', __id__);
        broadcaster.gsUpdated(__id__);
        expect(rootScope.$broadcast).toHaveBeenCalledWith('gs.updated', __id__);

        broadcaster.gsAvailableAdded(__object__);
        expect(rootScope.$broadcast).toHaveBeenCalledWith('gs.available.added', __object__.identifier);
        broadcaster.gsAvailableRemoved(__object__);
        expect(rootScope.$broadcast).toHaveBeenCalledWith('gs.available.removed', __object__.identifier);
        broadcaster.gsAvailableUpdated(__object__);
        expect(rootScope.$broadcast).toHaveBeenCalledWith('gs.available.updated', __object__.identifier);

        broadcaster.passesUpdated();
        expect(rootScope.$broadcast).toHaveBeenCalledWith('passes.updated', {});

        broadcaster.scGtUpdated(__object__);
        expect(rootScope.$broadcast).toHaveBeenCalledWith('sc.updated', __object__.identifier);

        broadcaster.leopGssUpdated(__id__);
        expect(rootScope.$broadcast).toHaveBeenCalledWith('leop.gss.updated', __id__);
        broadcaster.leopGsAssigned(__gs_object_id__);
        expect(rootScope.$broadcast).toHaveBeenCalledWith('leop.gs.assigned', __gs_object_id__.groundstation_id);
        broadcaster.leopGsReleased(__gs_object_id__);
        expect(rootScope.$broadcast).toHaveBeenCalledWith('leop.gs.released', __gs_object_id__.groundstation_id);

        // TODO: start testing the more complex events left, with multiple events triggered
        // TODO: reset the calls made to the Jasmine spy object for $rootScope.$brodacast()
        
        broadcaster.scAdded(__id__);
        expect(rootScope.$broadcast).toHaveBeenCalledWith('sc.added', __id__);
        broadcaster.scUpdated(__id__);
        expect(rootScope.$broadcast).toHaveBeenCalledWith('sc.updated', __id__);
        broadcaster.scRemoved(__id__);
        expect(rootScope.$broadcast).toHaveBeenCalledWith('sc.removed', __id__);

    });

});