angular.module('operationsDirective').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('common/templates/sn-about-dialog.html',
    "<md-dialog ng-controller=\"snAboutDlgCtrl\"><md-content>The SatNet Network</md-content><div class=\"md-actions\"><md-button id=\"closeAbout\" ng-click=\"closeDialog()\">Close</md-button></div></md-dialog>"
  );


  $templateCache.put('common/templates/sn-about.html',
    "<md-button id=\"menuAbout\" ng-controller=\"snAboutCtrl\" ng-click=\"openSnAbout()\" aria-label=\"about\" class=\"md-primary menu-button\"><div layout=\"row\" layout-fill><i class=\"fa fa-question\"></i> <b>about</b></div></md-button>"
  );


  $templateCache.put('operations/templates/operations-app.html',
    "<div class=\"operations-main\" ng-controller=\"OperationsAppCtrl\" layout=\"column\" layout-fill><section layout=\"row\" flex><md-sidenav class=\"md-sidenav-left md-whiteframe-z2\" md-component-id=\"menu\" md-is-locked-open=\"$mdMedia('gt-md')\"><md-content class=\"md-padding\" ng-controller=\"OperationsMenuCtrl\"><md-button id=\"menuExit\" ng-click=\"close()\" aria-label=\"exit\" class=\"md-primary menu-button\"><div layout=\"row\" layout-fill><i class=\"fa fa-power-off\"></i> <b>exit</b></div></md-button><md-divider></md-divider><md-divider></md-divider><md-button id=\"menuGS\" ng-click=\"close()\" aria-label=\"ground stations\" class=\"md-primary menu-button\"><div layout=\"row\" layout-fill><i class=\"fa fa-home\"></i> <b>ground stations</b></div></md-button><md-button id=\"menuSC\" ng-click=\"close()\" aria-label=\"spacecraft\" class=\"md-primary menu-button\"><div layout=\"row\" layout-fill><i class=\"fa fa-space-shuttle\"></i> <b>spacecraft</b></div></md-button><md-divider></md-divider><md-divider></md-divider><sn-about></sn-about></md-content></md-sidenav><md-content flex class=\"md-padding\"><div layout=\"column\" layout-fill layout-align=\"center center\"><div><leaflet id=\"mainMap\" style=\"position: absolute; top: 0; left: 0; width: 100%; height: 100%\"></leaflet></div><div><md-button id=\"toggleMenu\" class=\"md-primary\" aria-label=\"show menu\" ng-click=\"toggleMenu()\" hide-gt-md><p class=\"fa fa-bars\"></p><md-tooltip id=\"ttToggleMenu\">show menu</md-tooltip></md-button></div></div></md-content></section></div>"
  );

}]);
