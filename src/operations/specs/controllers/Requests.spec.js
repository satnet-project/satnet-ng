/**
 * Copyright 2016 Ricardo Tubio-Pardavila
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
 * Created by rtubio on 02/06/16.
 */

describe('Testing Requests controllers', function () {

    var $rootScope, $controller, $mdDialog, $q,
        __mock__cookies = {},
        satnetRPC;

    beforeEach(function () {

        module(
            'snRequestsDirective', 'snJRPCMock', 'snPusherMock'
        );
        module(function ($provide) {
            $provide.value('$cookies', __mock__cookies);
        });

        inject(function ($injector) {

            $rootScope = $injector.get('$rootScope');
            $controller = $injector.get('$controller');
            $mdDialog = $injector.get('$mdDialog');
            $q = $injector.get('$q');

            satnetRPC = $injector.get('satnetRPC');

        });

    });

    it('should create the List Controller', function () {

        var $scope = $rootScope.$new();

        $controller('snRequestsDlgCtrl', {
            $scope: $scope,
            $mdDialog: $mdDialog,
            satnetRPC: satnetRPC
        });

        $scope.init();
        $rootScope.$digest();

        expect($scope.gui.gss).toEqual(['gs-1', 'gs-2', 'gs-3']);
        expect($scope.gui.scs).toEqual(['sc-test-1', 'sc-test-2']);

        console.log('>>> $scope.gui = ' + JSON.stringify($scope.gui, null, 4));

    });

    /*
    it('should create the Dialog Controller for creation', function () {

        var $scope = $rootScope.$new(),
            test_id = 'gs-id-1';

        $controller("gsDialogCtrl", {
            $scope: $scope,
            $mdDialog: $mdDialog,
            satnetRPC: satnetRPC,
            identifier: test_id,
            isEditing: true
        });

        $scope.init();
        $rootScope.$digest();

        expect($scope.center).toEqual({
            lat: '40.0', lng: '50.0', zoom: 8
        });

    });

    it('should create the Dialog Controller for edition', function () {

        var $scope = $rootScope.$new(),
            test_id = 'gs-id-1',
            test_lat = '40.0', test_lng = '50.0',
            x_cfg = {
                callsign: "asfdasd",
                elevation: 12,
                identifier: test_id
            };

        $controller("gsDialogCtrl", {
            $scope: $scope,
            $mdDialog: $mdDialog,
            satnetRPC: satnetRPC,
            identifier: test_id,
            isEditing: true
        });

        $scope.init();
        $rootScope.$digest();

        expect($scope.center).toEqual({
            lat: test_lat, lng: test_lng, zoom: 8
        });
        // TODO Understand how 'mapServices' loads the GS...
        // expect($scope.configuration).toEqual(x_cfg);

    });
    */

});
