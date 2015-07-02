angular.module('operationsDirective').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('common/templates/sn-about-dialog.html',
    "<md-dialog ng-controller=\"snAboutDlgCtrl\" aria-label=\"About Dialog\"><md-content>The SatNet Network</md-content><div class=\"md-actions\"><md-button id=\"closeAbout\" ng-click=\"closeDialog()\">Close</md-button></div></md-dialog>"
  );


  $templateCache.put('common/templates/sn-about.html',
    "<md-button id=\"menuAbout\" ng-controller=\"snAboutCtrl\" ng-click=\"openSnAbout()\" aria-label=\"about\" class=\"md-primary menu-button\"><div layout=\"row\" layout-fill><i class=\"fa fa-info\"></i> <b>about</b></div></md-button>"
  );


  $templateCache.put('operations/templates/app.html',
    "<div class=\"operations-main\" ng-controller=\"operationsAppCtrl\" layout=\"column\" layout-fill><section layout=\"row\" flex><md-sidenav class=\"md-sidenav-left md-whiteframe-z2\" md-component-id=\"menu\" md-is-locked-open=\"$mdMedia('gt-md')\"><md-content class=\"md-padding\" ng-controller=\"operationsMenuCtrl\"><md-button id=\"menuExit\" ng-click=\"close()\" aria-label=\"exit\" class=\"md-primary menu-button\"><div layout=\"row\" layout-fill><i class=\"fa fa-power-off\"></i> <b>exit</b></div></md-button><md-divider></md-divider><md-button id=\"menuGS\" ng-click=\"showGsMenu()\" aria-label=\"ground stations\" class=\"md-primary menu-button\"><div layout=\"row\" layout-fill><i class=\"fa fa-home\"></i> <b>ground stations</b></div></md-button><md-button id=\"menuSC\" ng-click=\"close()\" aria-label=\"spacecraft\" class=\"md-primary menu-button\"><div layout=\"row\" layout-fill><i class=\"fa fa-space-shuttle\"></i> <b>spacecraft</b></div></md-button><md-divider></md-divider><sn-about></sn-about></md-content></md-sidenav><md-content flex class=\"md-padding\"><div layout=\"column\" layout-fill layout-align=\"center center\"><sn-map></sn-map><div><md-button id=\"toggleMenu\" class=\"md-primary\" aria-label=\"show menu\" ng-click=\"toggleMenu()\" hide-gt-md><p class=\"fa fa-bars\"></p><md-tooltip id=\"ttToggleMenu\">show menu</md-tooltip></md-button></div></div></md-content></section></div>"
  );


  $templateCache.put('operations/templates/gs/dialog.html',
    "<md-dialog ng-init=\"init()\" aria-label=\"Add Ground Station\"><md-toolbar class=\"md-theme-light\"><h2 class=\"md-toolbar-tools\"><span ng-show=\"!uiCtrl.editing\">Add new Ground Station</span> <span ng-show=\"uiCtrl.editing\">Edit Ground Station</span></h2></md-toolbar><md-content class=\"add-gs-dialog menu-list\"><div><style>.leaflet-control-container {\n" +
    "                    display: none;\n" +
    "                }</style><leaflet id=\"addGsMap\" class=\"sn-select-gs-map\" center=\"center\" markers=\"markers\"></leaflet></div><form name=\"gsCfg\"><div layout=\"row\"><md-input-container style=\"width: 40%\"><label>Identifier</label><input name=\"identifier\" ng-disabled=\"uiCtrl.editing\" ng-remote-validate=\"/configuration/groundstations/valid_id\" ng-remote-throttle=\"200\" ng-remote-method=\"GET\" ng-pattern=\"/^[a-zA-Z0-9.\\-_]{5,8}$/\" ng-model=\"configuration.identifier\" required></md-input-container><md-input-container style=\"width: 30%\"><label>Callsign</label><input name=\"callsign\" ng-pattern=\"/^[a-zA-Z0-9]{3,8}$/\" ng-model=\"configuration.callsign\" required></md-input-container><md-input-container style=\"width: 30%\"><label>Contact (degrees)</label><input name=\"elevation\" required type=\"number\" step=\"0.1\" min=\"0\" max=\"90\" ng-model=\"configuration.elevation\"></md-input-container></div><div layout=\"row\"><md-input-container style=\"width: 50%\"><label>Latitude</label><input name=\"latitude\" required type=\"number\" ng-model=\"markers.gs.lat\"></md-input-container><md-input-container style=\"width: 50%\"><label>Longitude</label><input name=\"longitude\" required type=\"number\" ng-model=\"markers.gs.lng\"></md-input-container></div></form><div layout=\"row\"><md-button id=\"add\" ng-show=\"!uiCtrl.editing\" ng-click=\"add()\" ng-disabled=\"gsCfg.$pristine || gsCfg.$invalid\" aria-label=\"Add Ground Station\" class=\"md-primary menu-button\"><div layout=\"row\"><i class=\"fa fa-plus\"></i> <b>add</b></div></md-button><md-button id=\"edit\" ng-show=\"uiCtrl.editing\" ng-click=\"update()\" ng-disabled=\"gsCfg.$pristine || gsCfg.$invalid\" aria-label=\"Edit Ground Station\" class=\"md-primary menu-button\"><div layout=\"row\"><i class=\"fa fa-floppy-o\"></i> <b>save</b></div></md-button><md-button id=\"cancel\" ng-click=\"cancel()\" aria-label=\"Cancel\" class=\"md-primary menu-button\"><div layout=\"row\"><i class=\"fa fa-times\"></i> <b>cancel</b></div></md-button></div></md-content></md-dialog>"
  );


  $templateCache.put('operations/templates/gs/list.html',
    "<md-dialog ng-controller=\"gsListCtrl\" aria-label=\"Ground Stations Menu\"><md-content class=\"menu-list\"><md-button id=\"addGs\" ng-click=\"addGsMenu()\" aria-label=\"add ground station\" class=\"md-primary menu-button\"><div layout=\"row\" layout-fill><i class=\"fa fa-plus\"></i> <b>ground station</b></div></md-button><md-divider></md-divider><md-list ng-controller=\"gsListCtrl\" ng-init=\"init()\"><md-list-item ng-repeat=\"gs in gsList\"><div layout=\"row\" layout-fill><md-button id=\"{{ gs }}-edit\" ng-click=\"editGs(gs)\" aria-label=\"edit ground station {{ gs }}\" class=\"md-primary menu-button\" style=\"text-align:center; width: 83%\"><div layout=\"row\" layout-fill><b>{{ gs }}</b></div></md-button><md-button id=\"{{ gs }}-remove\" aria-label=\"remove ground station {{ gs }}\" class=\"md-primary menu-button\" flex ng-click=\"removeGs(gs)\"><div layout=\"row\" layout-fill><i class=\"fa fa-close\"></i></div></md-button></div></md-list-item></md-list></md-content></md-dialog>"
  );


  $templateCache.put('operations/templates/map.html',
    "<div ng-controller=\"mapCtrl\" ng-init=\"init()\"><leaflet id=\"mainMap\" defaults=\"defaults\" center=\"center\" markers=\"markers\" layers=\"layers\" paths=\"paths\" style=\"position: absolute; top: 0; left: 0; width: 100%; height: 100%\"></leaflet></div>"
  );

}]);
