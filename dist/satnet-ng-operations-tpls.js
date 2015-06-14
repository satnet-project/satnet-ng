angular.module('operationsDirective').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('common/templates/sn-about-dialog.html',
    "<md-dialog ng-controller=\"snAboutDlgCtrl\" aria-label=\"About Dialog\"><md-content>The SatNet Network</md-content><div class=\"md-actions\"><md-button id=\"closeAbout\" ng-click=\"closeDialog()\">Close</md-button></div></md-dialog>"
  );


  $templateCache.put('common/templates/sn-about.html',
    "<md-button id=\"menuAbout\" ng-controller=\"snAboutCtrl\" ng-click=\"openSnAbout()\" aria-label=\"about\" class=\"md-primary menu-button\"><div layout=\"row\" layout-fill><i class=\"fa fa-info\"></i> <b>about</b></div></md-button>"
  );


  $templateCache.put('common/templates/sn-error-toast.html',
    "<md-toast><span flex>Error: {{ message }}</span><md-button ng-click=\"hide()\" aria-label=\"Close Toast\"><i class=\"fa fa-close\"></i></md-button></md-toast>"
  );


  $templateCache.put('common/templates/sn-map.html',
    "<div ng-controller=\"MapCtrl\" ng-init=\"init()\"><leaflet id=\"mainMap\" center=\"center\" markers=\"markers\" layers=\"layers\" style=\"position: absolute; top: 0; left: 0; width: 100%; height: 100%\"></leaflet></div>"
  );


  $templateCache.put('operations/templates/gs-add-dialog.html',
    "<md-dialog ng-controller=\"GsAddCtrl\" ng-init=\"init()\" aria-label=\"Add Ground Station\"><md-toolbar class=\"md-theme-light\"><h2 class=\"md-toolbar-tools\"><span>Add new Ground Station</span></h2></md-toolbar><md-content class=\"add-gs-dialog menu-list\"><div><style>.leaflet-control-container { display: none; }</style><leaflet id=\"selectMap\" class=\"sn-select-gs-map\" center=\"center\" markers=\"markers\"></leaflet></div><form name=\"gsCfg\"><div layout=\"row\"><md-input-container style=\"width: 50%\"><label>Identifier</label><input name=\"identifier\" ng-remote-validate=\"/configuration/groundstations/valid_id\" ng-remote-throttle=\"200\" ng-remote-method=\"GET\" ng-pattern=\"/^[a-zA-Z0-9.\\-_]{5,8}$/\" ng-model=\"gs.identifier\" required></md-input-container><md-input-container style=\"width: 50%\"><label>Callsign</label><input name=\"callsign\" ng-pattern=\"/^[a-zA-Z0-9]{3,8}$/\" ng-model=\"gs.callsign\" required></md-input-container></div><div layout=\"row\"><md-input-container style=\"width: 50%\"><label>Latitude</label><input ng-model=\"markers.gs.lat\" required></md-input-container><md-input-container style=\"width: 50%\"><label>Longitude</label><input ng-model=\"markers.gs.lng\" required></md-input-container></div></form><div layout=\"row\"><md-button id=\"add\" ng-click=\"add()\" ng-disabled=\"gsCfg.$pristine|| gsCfg.$invalid\" aria-label=\"Add Ground Station\" class=\"md-primary menu-button\"><div layout=\"row\"><i class=\"fa fa-plus\"></i> <b>add</b></div></md-button><md-button id=\"cancel\" ng-click=\"cancel()\" aria-label=\"Cancel\" class=\"md-primary menu-button\"><div layout=\"row\"><i class=\"fa fa-times\"></i> <b>cancel</b></div></md-button></div></md-content></md-dialog>"
  );


  $templateCache.put('operations/templates/gs-list-dialog.html',
    "<md-dialog ng-controller=\"GsListCtrl\" aria-label=\"Ground Stations Menu\"><md-content class=\"menu-list\"><md-button id=\"addGs\" ng-click=\"addGsMenu()\" aria-label=\"add ground station\" class=\"md-primary menu-button\"><div layout=\"row\" layout-fill><i class=\"fa fa-plus\"></i> <b>ground station</b></div></md-button><md-divider></md-divider><md-list ng-controller=\"GsListCtrl\" ng-init=\"init()\"><md-list-item ng-repeat=\"gs in gsList\"><md-button id=\"{{ gs }}\" ng-click=\"editGs({{ gs }})\" aria-label=\"edit ground station {{ gs }}\" class=\"md-primary menu-button\"><div layout=\"row\" layout-fill><i class=\"fa fa-wrench\"></i> <b>{{ gs }}</b></div></md-button><!--\n" +
    "                <img alt=\"{{ gs.id }}\" ng-src=\"{{ person.img }}\" class=\"md-avatar\" />\n" +
    "                <p>{{ gs.id }}</p>\n" +
    "                <md-icon md-svg-icon=\"communication:messenger\" ng-click=\"doSecondaryAction($event)\" aria-label=\"Open Chat\" class=\"md-secondary md-hue-3\" ng-class=\"{'md-primary': person.newMessage}\"></md-icon>\n" +
    "                --></md-list-item></md-list></md-content></md-dialog>"
  );


  $templateCache.put('operations/templates/operations-app.html',
    "<div class=\"operations-main\" ng-controller=\"OperationsAppCtrl\" layout=\"column\" layout-fill><section layout=\"row\" flex><md-sidenav class=\"md-sidenav-left md-whiteframe-z2\" md-component-id=\"menu\" md-is-locked-open=\"$mdMedia('gt-md')\"><md-content class=\"md-padding\" ng-controller=\"OperationsMenuCtrl\"><md-button id=\"menuExit\" ng-click=\"close()\" aria-label=\"exit\" class=\"md-primary menu-button\"><div layout=\"row\" layout-fill><i class=\"fa fa-power-off\"></i> <b>exit</b></div></md-button><md-divider></md-divider><md-button id=\"menuGS\" ng-click=\"showGsMenu()\" aria-label=\"ground stations\" class=\"md-primary menu-button\"><div layout=\"row\" layout-fill><i class=\"fa fa-home\"></i> <b>ground stations</b></div></md-button><md-button id=\"menuSC\" ng-click=\"close()\" aria-label=\"spacecraft\" class=\"md-primary menu-button\"><div layout=\"row\" layout-fill><i class=\"fa fa-space-shuttle\"></i> <b>spacecraft</b></div></md-button><md-divider></md-divider><sn-about></sn-about></md-content></md-sidenav><md-content flex class=\"md-padding\"><div layout=\"column\" layout-fill layout-align=\"center center\"><sn-map></sn-map><div><md-button id=\"toggleMenu\" class=\"md-primary\" aria-label=\"show menu\" ng-click=\"toggleMenu()\" hide-gt-md><p class=\"fa fa-bars\"></p><md-tooltip id=\"ttToggleMenu\">show menu</md-tooltip></md-button></div></div></md-content></section></div>"
  );

}]);
