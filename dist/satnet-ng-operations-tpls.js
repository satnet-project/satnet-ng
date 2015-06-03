angular.module('operationsDirective').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('common/templates/sn-about-dialog.html',
    "<md-dialog ng-controller=\"snAboutDlgCtrl\" aria-label=\"About Dialog\"><md-content>The SatNet Network</md-content><div class=\"md-actions\"><md-button id=\"closeAbout\" ng-click=\"closeDialog()\">Close</md-button></div></md-dialog>"
  );


  $templateCache.put('common/templates/sn-about.html',
    "<md-button id=\"menuAbout\" ng-controller=\"snAboutCtrl\" ng-click=\"openSnAbout()\" aria-label=\"about\" class=\"md-primary menu-button\"><div layout=\"row\" layout-fill><i class=\"fa fa-info\"></i> <b>about</b></div></md-button>"
  );


  $templateCache.put('common/templates/sn-map.html',
    "<div ng-controller=\"MapCtrl\" ng-init=\"init()\"><leaflet id=\"mainMap\" center=\"center\" markers=\"markers\" layers=\"layers\" style=\"position: absolute; top: 0; left: 0; width: 100%; height: 100%\"></leaflet></div>"
  );


  $templateCache.put('operations/templates/gslist-dialog.html',
    "<md-dialog ng-controller=\"GsListCtrl\" aria-label=\"Ground Stations Menu\"><md-content class=\"menu-list\"><md-button id=\"addGs\" ng-click=\"addGsMenu()\" aria-label=\"add ground station\" class=\"md-primary menu-button\"><div layout=\"row\" layout-fill><i class=\"fa fa-plus\"></i> <b>ground station</b></div></md-button><md-divider></md-divider><md-list ng-controller=\"GsListCtrl\" ng-init=\"init()\"><md-list-item ng-repeat=\"gs in groundStations\" ng-click=\"manageGs(gs.id, $event)\"><img alt=\"{{ gs.id }}\" ng-src=\"{{ person.img }}\" class=\"md-avatar\"><p>{{ gs.id }}</p><md-icon md-svg-icon=\"communication:messenger\" ng-click=\"doSecondaryAction($event)\" aria-label=\"Open Chat\" class=\"md-secondary md-hue-3\" ng-class=\"{'md-primary': person.newMessage}\"></md-icon></md-list-item></md-list></md-content></md-dialog>"
  );


  $templateCache.put('operations/templates/operations-app.html',
    "<div class=\"operations-main\" ng-controller=\"OperationsAppCtrl\" layout=\"column\" layout-fill><section layout=\"row\" flex><md-sidenav class=\"md-sidenav-left md-whiteframe-z2\" md-component-id=\"menu\" md-is-locked-open=\"$mdMedia('gt-md')\"><md-content class=\"md-padding\" ng-controller=\"OperationsMenuCtrl\"><md-button id=\"menuExit\" ng-click=\"close()\" aria-label=\"exit\" class=\"md-primary menu-button\"><div layout=\"row\" layout-fill><i class=\"fa fa-power-off\"></i> <b>exit</b></div></md-button><md-divider></md-divider><md-button id=\"menuGS\" ng-click=\"showGsMenu()\" aria-label=\"ground stations\" class=\"md-primary menu-button\"><div layout=\"row\" layout-fill><i class=\"fa fa-home\"></i> <b>ground stations</b></div></md-button><md-button id=\"menuSC\" ng-click=\"close()\" aria-label=\"spacecraft\" class=\"md-primary menu-button\"><div layout=\"row\" layout-fill><i class=\"fa fa-space-shuttle\"></i> <b>spacecraft</b></div></md-button><md-divider></md-divider><sn-about></sn-about></md-content></md-sidenav><md-content flex class=\"md-padding\"><div layout=\"column\" layout-fill layout-align=\"center center\"><sn-map></sn-map><div><md-button id=\"toggleMenu\" class=\"md-primary\" aria-label=\"show menu\" ng-click=\"toggleMenu()\" hide-gt-md><p class=\"fa fa-bars\"></p><md-tooltip id=\"ttToggleMenu\">show menu</md-tooltip></md-button></div></div></md-content></section></div>"
  );

}]);
