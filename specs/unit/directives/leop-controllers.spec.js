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

describe('Controller: MenuCtrl', function() {

  var $rootScope, $scope, $controller, $q,
      menuCtrl,
      mock__mdSidenav = {
        isMock: true,
        close: function () {}
      };

  beforeEach(function () {

    module('leopDirective', function($provide) {
      $provide.value('$mdSidenav', mock__mdSidenav);
    });

    inject(function ($injector) {

      $rootScope = $injector.get('$rootScope');
      $controller = $injector.get('$controller');
      $q = $injector.get('$q');

      $scope = $rootScope.$new();

    });

    menuCtrl = $controller("MenuCtrl", { $scope: $scope });

  });

  it('should create the $mdSidenav object', function () {
    expect($scope.mdSidenav).toBeDefined();
    expect($scope.mdSidenav.isMock).toBeTruthy();
  });

  /*
  describe('managing $mdSidenav', function () {

    it('should close the menu', function () {

      var data,
          deferred = $q.defer(),
          promise = deferred.promise;

      // set up promise resolve callback
      mock__mdSidenav.close = promise.then(function (response) {
        data = response.success;
      });
      // force `$digest` to resolve/reject deferreds
      $rootScope.$digest();

      $scope.close();

    });
  
  });
  */

});