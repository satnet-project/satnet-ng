angular.module('satnet-operations-tpls').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('common/templates/sn-about-dialog.html',
    "<md-dialog><md-content>The SatNet NetworXXX</md-content><div class=\"md-actions\"><md-button ng-click=\"closeDialog()\">Close</md-button></div></md-dialog>"
  );


  $templateCache.put('common/templates/sn-about.html',
    "<md-button id=\"menuAbout\" ng-controller=\"snAboutCtrl\" ng-click=\"openSnAbout()\" aria-label=\"about\" class=\"md-primary menu-button\"><div layout=\"row\" layout-fill><i class=\"fa fa-question\"></i> <b>about</b></div></md-button>"
  );


  $templateCache.put('operations/templates/operations-app.html',
    "<!--\n" +
    "Copyright 2015 Ricardo Tubio-Pardavila\n" +
    "\n" +
    "Licensed under the Apache License, Version 2.0 (the \"License\");\n" +
    "you may not use this file except in compliance with the License.\n" +
    "You may obtain a copy of the License at\n" +
    "\n" +
    "    http://www.apache.org/licenses/LICENSE-2.0\n" +
    "\n" +
    "Unless required by applicable law or agreed to in writing, software\n" +
    "distributed under the License is distributed on an \"AS IS\" BASIS,\n" +
    "WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n" +
    "See the License for the specific language governing permissions and\n" +
    "limitations under the License.\n" +
    "--><div class=\"operations-main\" layout=\"column\" layout-fill><section layout=\"row\" flex><md-sidenav class=\"md-sidenav-left md-whiteframe-z2\" md-component-id=\"menu\" md-is-locked-open=\"$mdMedia('gt-md')\"><md-content class=\"md-padding\" ng-controller=\"OperationsMenuCtrl\"><md-button id=\"menuExit\" ng-click=\"close()\" aria-label=\"exit\" class=\"md-primary menu-button\"><div layout=\"row\" layout-fill><i class=\"fa fa-power-off\"></i> <b>exit</b></div></md-button><md-divider></md-divider><md-button id=\"menuGS\" ng-click=\"close()\" aria-label=\"ground stations\" class=\"md-primary menu-button\"><div layout=\"row\" layout-fill><i class=\"fa fa-home\"></i> <b>ground stations</b></div></md-button><md-button id=\"menuSC\" ng-click=\"close()\" aria-label=\"spacecraft\" class=\"md-primary menu-button\"><div layout=\"row\" layout-fill><i class=\"fa fa-space-shuttle\"></i> <b>spacecraft</b></div></md-button><md-divider></md-divider><md-divider></md-divider><sn-about></sn-about></md-content></md-sidenav><md-content flex class=\"md-padding\"><div layout=\"column\" layout-fill layout-align=\"center center\"><div><leaflet id=\"mainMap\" style=\"position: absolute; top: 0; left: 0; width: 100%; height: 100%\"></leaflet></div><div><md-button id=\"toggleMenu\" class=\"md-primary\" aria-label=\"show menu\" ng-click=\"toggleMenu()\" hide-gt-md><p class=\"fa fa-bars\"></p><md-tooltip id=\"ttToggleMenu\">show menu</md-tooltip></md-button></div></div></md-content></section></div>"
  );

}]);
