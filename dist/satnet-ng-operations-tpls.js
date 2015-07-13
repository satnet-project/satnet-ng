angular.module('snOperationsDirective').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('common/templates/sn-about-dialog.html',
    "<md-dialog ng-controller=\"snAboutDlgCtrl\" aria-label=\"About Dialog\"><md-toolbar class=\"md-theme-light\"><h2 class=\"md-toolbar-tools\"><span>The SatNet Network</span></h2></md-toolbar><md-content><p>The SatNet Network is a cooperative Open Source project hosted at GitHub (github.com/satnet-project).</p></md-content><div class=\"md-actions\"><md-button id=\"closeAbout\" ng-click=\"closeDialog()\">Close</md-button></div></md-dialog>"
  );


  $templateCache.put('common/templates/sn-about.html',
    "<md-button id=\"menuAbout\" ng-controller=\"snAboutCtrl\" ng-click=\"openSnAbout()\" aria-label=\"about\" class=\"md-primary menu-button\"><div layout=\"row\" layout-fill><i class=\"fa fa-info\"></i> <b>about</b></div></md-button>"
  );


  $templateCache.put('operations/templates/app.html',
    "<div class=\"operations-main\" ng-controller=\"operationsAppCtrl\" layout=\"column\" layout-fill><section layout=\"row\" flex><md-sidenav class=\"md-sidenav-left md-whiteframe-z2\" md-component-id=\"menu\" md-is-locked-open=\"$mdMedia('gt-md')\"><md-content class=\"md-padding\" ng-controller=\"operationsMenuCtrl\"><md-button id=\"menuExit\" ng-click=\"close()\" aria-label=\"exit\" class=\"md-primary menu-button\"><div layout=\"row\" layout-fill><i class=\"fa fa-power-off\"></i> <b>exit</b></div></md-button><md-divider></md-divider><md-button id=\"menuGS\" ng-click=\"showGsMenu()\" aria-label=\"ground stations\" class=\"md-primary menu-button\"><div layout=\"row\" layout-fill><i class=\"fa fa-home\"></i> <b>ground stations</b></div></md-button><md-button id=\"menuSC\" ng-click=\"showScMenu()\" aria-label=\"spacecraft\" class=\"md-primary menu-button\"><div layout=\"row\" layout-fill><i class=\"fa fa-space-shuttle\"></i> <b>spacecraft</b></div></md-button><md-divider></md-divider><md-button id=\"menuCompatibility\" ng-click=\"showCompatibility()\" aria-label=\"compatibility\" class=\"md-primary menu-button\"><div layout=\"row\" layout-fill><i class=\"fa fa-puzzle-piece\"></i> <b>compatibility</b></div></md-button><md-button id=\"menuAvailability\" ng-click=\"showAvailability()\" aria-label=\"availability\" class=\"md-primary menu-button\"><div layout=\"row\" layout-fill><i class=\"fa fa-clock-o\"></i> <b>availability</b></div></md-button><md-divider></md-divider><sn-about></sn-about></md-content></md-sidenav><md-content flex class=\"md-padding\"><div layout=\"column\" layout-fill layout-align=\"center center\"><sn-map></sn-map><div><md-button id=\"toggleMenu\" class=\"md-primary\" aria-label=\"show menu\" ng-click=\"toggleMenu()\" hide-gt-md><p class=\"fa fa-bars\"></p><md-tooltip id=\"ttToggleMenu\">show menu</md-tooltip></md-button></div></div></md-content></section></div>"
  );


  $templateCache.put('operations/templates/channels/gs.dialog.html',
    "<md-dialog ng-init=\"init()\" aria-label=\"Channel Dialog\"><md-toolbar class=\"md-theme-light\"><h2 class=\"md-toolbar-tools\"><span ng-show=\"!uiCtrl.editing\">Add new Channel</span> <span ng-show=\"uiCtrl.editing\">Edit Channel</span></h2></md-toolbar><md-content class=\"add-gs-dialog menu-list\"><form name=\"configuration\"><div layout=\"row\"><md-input-container style=\"width: 25%\"><label>Identifier</label><input name=\"identifier\" ng-model=\"uiCtrl.configuration.channel_id\" ng-disabled=\"uiCtrl.editing\" ng-pattern=\"/^[a-zA-Z0-9.\\-_]{5,8}$/\" required></md-input-container><md-input-container style=\"width: 75%\"><md-select ng-model=\"uiCtrl.configuration.band\" required><md-select-label>{{ uiCtrl.configuration.band ? uiCtrl.configuration.band : 'Band' }}</md-select-label><md-option ng-value=\"m\" ng-repeat=\"m in uiCtrl.options.bands\">{{ m }}</md-option></md-select></md-input-container></div><div layout=\"row\"><md-input-container style=\"width: 50%\"><md-select ng-model=\"uiCtrl.configuration.modulations\" multiple required><md-select-label>{{ uiCtrl.configuration.modulations ? uiCtrl.configuration.modulations : 'Modulation(s)' }}</md-select-label><md-option ng-value=\"m\" ng-repeat=\"m in uiCtrl.options.modulations\">{{ m }}</md-option></md-select></md-input-container><md-input-container style=\"width: 50%\"><md-select ng-model=\"uiCtrl.configuration.polarizations\" multiple required><md-select-label>{{ uiCtrl.configuration.polarizations ? uiCtrl.configuration.polarizations : 'Polarization(s)' }}</md-select-label><md-option ng-value=\"p\" ng-repeat=\"p in uiCtrl.options.polarizations\">{{ p }}</md-option></md-select></md-input-container></div><div layout=\"row\"><md-input-container style=\"width: 50%\"><md-select ng-model=\"uiCtrl.configuration.bitrates\" multiple required><md-select-label>{{ uiCtrl.configuration.bitrates ? uiCtrl.configuration.bitrates : 'Bitrate(s)' }}</md-select-label><md-option ng-value=\"m\" ng-repeat=\"m in uiCtrl.options.bitrates\">{{ m }}</md-option></md-select></md-input-container><md-input-container style=\"width: 50%\"><md-select ng-model=\"uiCtrl.configuration.bandwidths\" multiple required><md-select-label>{{ uiCtrl.configuration.bandwidths ? uiCtrl.configuration.bandwidths : 'Bandwidth(s)' }}</md-select-label><md-option ng-value=\"p\" ng-repeat=\"p in uiCtrl.options.bandwidths\">{{ p }}</md-option></md-select></md-input-container></div></form><div layout=\"row\"><md-button id=\"add\" ng-click=\"add()\" ng-show=\"!uiCtrl.editing\" ng-disabled=\"uiCtrl.configuration.$pristine || uiCtrl.configuration.$invalid\" aria-label=\"Add Ground Station\" class=\"md-primary menu-button\"><div layout=\"row\"><i class=\"fa fa-plus\"></i> <b>add</b></div></md-button><md-button id=\"edit\" ng-click=\"update()\" ng-show=\"uiCtrl.editing\" ng-disabled=\"uiCtrl.configuration.$pristine || uiCtrl.configuration.$invalid\" aria-label=\"Edit Ground Station\" class=\"md-primary menu-button\"><div layout=\"row\"><i class=\"fa fa-floppy-o\"></i> <b>save</b></div></md-button><md-button id=\"cancel\" ng-click=\"cancel()\" aria-label=\"Cancel\" class=\"md-primary menu-button\"><div layout=\"row\"><i class=\"fa fa-times\"></i> <b>cancel</b></div></md-button></div></md-content></md-dialog>"
  );


  $templateCache.put('operations/templates/channels/list.html',
    "<md-dialog aria-label=\"Channel List\"><md-toolbar class=\"md-theme-light\"><h2 class=\"md-toolbar-tools\"><span>{{ uiCtrl.segmentId }} Channels</span></h2></md-toolbar><md-content class=\"menu-list\"><md-button id=\"addChannel\" ng-click=\"showAddDialog()\" aria-label=\"add channel\" class=\"md-primary menu-button\"><div layout=\"row\" layout-fill><i class=\"fa fa-plus\"></i> <b>channel</b></div></md-button><md-divider></md-divider><md-list><md-list-item ng-hide=\"channelList.length\" class=\"sn-no-item\">(no channels)</md-list-item><md-list-item ng-hide=\"!channelList.length\" ng-repeat=\"c in channelList\"><div layout=\"row\" layout-fill><md-button id=\"{{ c }}-edit\" ng-click=\"showEditDialog(c)\" aria-label=\"edit channel {{ c }}\" class=\"md-primary menu-button\" style=\"text-align:center; width: 80%\"><div layout=\"row\" layout-fill><b>{{ c }}</b></div></md-button><md-button id=\"{{ c }}-delete\" ng-click=\"delete(c)\" aria-label=\"delete channel {{ c }}\" class=\"md-primary menu-button\" flex><div layout=\"row\" layout-fill><i class=\"fa fa-close\"></i></div></md-button></div></md-list-item></md-list></md-content></md-dialog>"
  );


  $templateCache.put('operations/templates/channels/sc.dialog.html',
    "<md-dialog ng-init=\"init()\" aria-label=\"Channel Dialog\"><md-toolbar class=\"md-theme-light\"><h2 class=\"md-toolbar-tools\"><span ng-show=\"!uiCtrl.isEditing\">Add new Channel</span> <span ng-show=\"uiCtrl.isEditing\">Edit Channel</span></h2></md-toolbar><md-content class=\"add-gs-dialog menu-list\"><form name=\"configuration\"><div layout=\"row\"><md-input-container style=\"width: 40%\"><label>Identifier</label><input name=\"identifier\" ng-model=\"uiCtrl.configuration.channel_id\" ng-disabled=\"uiCtrl.isEditing\" ng-pattern=\"/^[a-zA-Z0-9.\\-_]{5,8}$/\" required></md-input-container><md-input-container style=\"width: 30%\"><label>Frequency (MHz)</label><input ng-model=\"uiCtrl.configuration.frequency\" name=\"frequency\" required type=\"number\" step=\"0.000001\" min=\"0\" max=\"999999\"></md-input-container><md-input-container style=\"width: 30%\"><md-select ng-model=\"uiCtrl.configuration.modulation\" required><md-select-label>{{ uiCtrl.configuration.modulation ? uiCtrl.configuration.modulation : 'Modulation' }}</md-select-label><md-option ng-value=\"m\" ng-repeat=\"m in uiCtrl.options.modulations\">{{ m }}</md-option></md-select></md-input-container></div><div layout=\"row\"><md-input-container style=\"width: 30%\"><md-select ng-model=\"uiCtrl.configuration.polarization\" required><md-select-label>{{ uiCtrl.configuration.polarization ? uiCtrl.configuration.polarization : 'Polarization' }}</md-select-label><md-option ng-value=\"p\" ng-repeat=\"p in uiCtrl.options.polarizations\">{{ p }}</md-option></md-select></md-input-container><md-input-container style=\"width: 50%\"><md-select ng-model=\"uiCtrl.configuration.bitrate\" required><md-select-label>{{ uiCtrl.configuration.bitrate ? uiCtrl.configuration.bitrate : 'Bitrate' }}</md-select-label><md-option ng-value=\"m\" ng-repeat=\"m in uiCtrl.options.bitrates\">{{ m }}</md-option></md-select></md-input-container><md-input-container style=\"width: 50%\"><md-select ng-model=\"uiCtrl.configuration.bandwidth\" required><md-select-label>{{ uiCtrl.configuration.bandwidth ? uiCtrl.configuration.bandwidth : 'Bandwidth' }}</md-select-label><md-option ng-value=\"p\" ng-repeat=\"p in uiCtrl.options.bandwidths\">{{ p }}</md-option></md-select></md-input-container></div></form><div layout=\"row\"><md-button id=\"add\" ng-click=\"add()\" ng-show=\"!uiCtrl.isEditing\" ng-disabled=\"configuration.$pristine || configuration.$invalid\" aria-label=\"Add Ground Station\" class=\"md-primary menu-button\"><div layout=\"row\"><i class=\"fa fa-plus\"></i> <b>add</b></div></md-button><md-button id=\"edit\" ng-click=\"update()\" ng-show=\"uiCtrl.isEditing\" ng-disabled=\"configuration.$pristine || configuration.$invalid\" aria-label=\"Edit Ground Station\" class=\"md-primary menu-button\"><div layout=\"row\"><i class=\"fa fa-floppy-o\"></i> <b>save</b></div></md-button><md-button id=\"cancel\" ng-click=\"cancel()\" aria-label=\"Cancel\" class=\"md-primary menu-button\"><div layout=\"row\"><i class=\"fa fa-times\"></i> <b>cancel</b></div></md-button></div></md-content></md-dialog>"
  );


  $templateCache.put('operations/templates/map.html',
    "<div ng-controller=\"mapCtrl\" ng-init=\"init()\"><leaflet id=\"mainMap\" defaults=\"defaults\" center=\"center\" markers=\"markers\" layers=\"layers\" paths=\"paths\" style=\"position: absolute; top: 0; left: 0; width: 100%; height: 100%\"></leaflet></div>"
  );


  $templateCache.put('operations/templates/rules/list.html',
    "<md-dialog ng-init=\"init()\" aria-label=\"Availability Rules Menu\"><md-content class=\"menu-list\"><md-button id=\"addRule\" ng-click=\"showRuleDialog()\" aria-label=\"add rule\" class=\"md-primary menu-button\"><div layout=\"row\" layout-fill><i class=\"fa fa-plus\"></i> <b>availability rule</b></div></md-button><md-divider></md-divider><md-list><md-list-item ng-repeat=\"r in ruleList\"><div layout=\"row\" layout-fill><md-content layout-padding><b>{{ r.key }}</b></md-content><md-button id=\"{{ r }}-edit\" ng-click=\"edit(r)\" aria-label=\"edit availability rule {{ r }}\" class=\"md-primary menu-button\" style=\"text-align:center; width: 58%\"><div layout=\"row\" layout-fill><b>{{ r | printRule }}</b></div></md-button><md-button id=\"{{ r }}-delete\" aria-label=\"delete rule {{ r }}\" class=\"md-primary menu-button\" flex ng-click=\"delete(r)\"><div layout=\"row\" layout-fill><i class=\"fa fa-close\"></i></div></md-button></div></md-list-item></md-list></md-content></md-dialog>"
  );


  $templateCache.put('operations/templates/segments/gs.dialog.html',
    "<md-dialog ng-init=\"init()\" aria-label=\"Ground Station Dialog\"><md-toolbar class=\"md-theme-light\"><h2 class=\"md-toolbar-tools\"><span ng-show=\"!uiCtrl.isEditing\">Add new Ground Station</span> <span ng-show=\"uiCtrl.isEditing\">Edit Ground Station</span></h2></md-toolbar><md-content class=\"add-gs-dialog menu-list\"><div><style>.leaflet-control-container {\n" +
    "                    display: none;\n" +
    "                }</style><leaflet id=\"addGsMap\" class=\"sn-select-gs-map\" center=\"center\" markers=\"markers\"></leaflet></div><form name=\"gsCfg\"><div layout=\"row\"><md-input-container style=\"width: 40%\"><label>Identifier</label><input name=\"identifier\" ng-remote-validate=\"/configuration/groundstations/valid_id\" ng-remote-throttle=\"200\" ng-remote-method=\"GET\" ng-disabled=\"uiCtrl.isEditing\" ng-pattern=\"/^[a-zA-Z0-9.\\-_]{5,8}$/\" ng-model=\"configuration.identifier\" required></md-input-container><md-input-container style=\"width: 30%\"><label>Callsign</label><input name=\"callsign\" ng-pattern=\"/^[a-zA-Z0-9]{3,8}$/\" ng-model=\"configuration.callsign\" required></md-input-container><md-input-container style=\"width: 30%\"><label>Contact (degrees)</label><input name=\"elevation\" required type=\"number\" step=\"0.1\" min=\"0\" max=\"90\" ng-model=\"configuration.elevation\"></md-input-container></div><div layout=\"row\"><md-input-container style=\"width: 50%\"><label>Latitude</label><input name=\"latitude\" required type=\"number\" ng-model=\"markers.gs.lat\"></md-input-container><md-input-container style=\"width: 50%\"><label>Longitude</label><input name=\"longitude\" required type=\"number\" ng-model=\"markers.gs.lng\"></md-input-container></div></form><div layout=\"row\"><md-button id=\"add\" ng-show=\"!uiCtrl.isEditing\" ng-click=\"add()\" ng-disabled=\"gsCfg.$pristine || gsCfg.$invalid\" aria-label=\"Add Ground Station\" class=\"md-primary menu-button\"><div layout=\"row\"><i class=\"fa fa-plus\"></i> <b>add</b></div></md-button><md-button id=\"edit\" ng-show=\"uiCtrl.isEditing\" ng-click=\"update()\" ng-disabled=\"gsCfg.$pristine || gsCfg.$invalid\" aria-label=\"Edit Ground Station\" class=\"md-primary menu-button\"><div layout=\"row\"><i class=\"fa fa-floppy-o\"></i> <b>save</b></div></md-button><md-button id=\"cancel\" ng-click=\"cancel()\" aria-label=\"Cancel\" class=\"md-primary menu-button\"><div layout=\"row\"><i class=\"fa fa-times\"></i> <b>cancel</b></div></md-button></div></md-content></md-dialog>"
  );


  $templateCache.put('operations/templates/segments/gs.list.html',
    "<md-dialog aria-label=\"Ground Stations Menu\"><md-toolbar class=\"md-theme-light\"><h2 class=\"md-toolbar-tools\"><span>Registered Ground Stations</span></h2></md-toolbar><md-content class=\"menu-list\"><md-button id=\"addGs\" ng-click=\"showAddDialog()\" aria-label=\"add ground station\" class=\"md-primary menu-button\"><div layout=\"row\" layout-fill><i class=\"fa fa-plus\"></i> <b>ground station</b></div></md-button><md-divider></md-divider><md-list><md-list-item ng-hide=\"gsList.length\" class=\"sn-no-item\">(no ground stations)</md-list-item><md-list-item ng-repeat=\"gs in gsList\"><div layout=\"row\" layout-fill><md-button id=\"{{ gs }}-edit\" ng-click=\"showEditDialog(gs)\" aria-label=\"edit ground station {{ gs }}\" class=\"md-primary menu-button\" style=\"text-align:center; width: 57%\"><div layout=\"row\" layout-fill><b>{{ gs }}</b></div></md-button><md-button id=\"{{ gs }}-rules\" ng-click=\"showRulesList(gs)\" aria-label=\"manage rules {{ gs }}\" class=\"md-primary menu-button\" flex><div layout=\"row\" layout-fill><i class=\"fa fa-clock-o\"></i></div></md-button><md-button id=\"{{ gs }}-channels\" ng-click=\"showChannelList(gs)\" aria-label=\"manage channels {{ gs }}\" class=\"md-primary menu-button\" flex><div layout=\"row\" layout-fill><i class=\"fa fa-rss\"></i></div></md-button><md-button id=\"{{ gs }}-delete\" ng-click=\"delete(gs)\" aria-label=\"delete ground station {{ gs }}\" class=\"md-primary menu-button\" flex><div layout=\"row\" layout-fill><i class=\"fa fa-close\"></i></div></md-button></div></md-list-item></md-list></md-content></md-dialog>"
  );


  $templateCache.put('operations/templates/segments/sc.dialog.html',
    "<md-dialog ng-init=\"init()\" aria-label=\"Spacecraft Dialog\" style=\"width: 350px\"><md-toolbar class=\"md-theme-light\"><h2 class=\"md-toolbar-tools\"><span ng-show=\"!uiCtrl.editing\">Add new Spacecraft</span> <span ng-show=\"uiCtrl.editing\">Edit Spacecraft</span></h2></md-toolbar><md-content class=\"add-sc-dialog menu-list\" style=\"width: 100%\"><form name=\"scCfg\"><div layout=\"row\"><md-input-container style=\"width: 50%\"><label>Identifier</label><input name=\"identifier\" ng-disabled=\"uiCtrl.editing\" ng-remote-validate=\"/configuration/spacecraft/valid_id\" ng-remote-throttle=\"200\" ng-remote-method=\"GET\" ng-pattern=\"/^[a-zA-Z0-9.\\-_]{5,8}$/\" ng-model=\"configuration.identifier\" required></md-input-container><md-input-container style=\"width: 50%\"><label>Callsign</label><input name=\"callsign\" ng-pattern=\"/^[a-zA-Z0-9]{3,8}$/\" ng-model=\"configuration.callsign\" required></md-input-container></div><div layout=\"row\"><md-input-container style=\"width: 50%\"><md-select ng-model=\"configuration.tle_group\" ng-change=\"updateTles()\" required><md-select-label>{{ configuration.tle_group ? configuration.tle_group.subsection : 'Select Group' }}</md-select-label><md-option ng-value=\"group\" ng-repeat=\"group in uiCtrl.tle_groups\">{{ group.subsection }}</md-option></md-select></md-input-container><md-input-container style=\"width: 50%\"><md-select ng-model=\"configuration.tle\" ng-change=\"updateTles()\" required><md-select-label>{{ configuration.tle ? configuration.tle.spacecraft_tle_id : 'Select TLE' }}</md-select-label><md-option ng-value=\"tle\" ng-repeat=\"tle in uiCtrl.tles\">{{ tle.spacecraft_tle_id }}</md-option></md-select></md-input-container></div></form><div layout=\"row\"><md-button id=\"add\" ng-show=\"!uiCtrl.editing\" ng-click=\"add()\" ng-disabled=\"scCfg.$pristine || scCfg.$invalid\" aria-label=\"Add Spacecraft\" class=\"md-primary menu-button\"><div layout=\"row\"><i class=\"fa fa-plus\"></i> <b>add</b></div></md-button><md-button id=\"edit\" ng-show=\"uiCtrl.editing\" ng-click=\"update()\" ng-disabled=\"scCfg.$pristine || scCfg.$invalid\" aria-label=\"Edit Spacecraft\" class=\"md-primary menu-button\"><div layout=\"row\"><i class=\"fa fa-floppy-o\"></i> <b>save</b></div></md-button><md-button id=\"cancel\" ng-click=\"cancel()\" aria-label=\"Cancel\" class=\"md-primary menu-button\"><div layout=\"row\"><i class=\"fa fa-times\"></i> <b>cancel</b></div></md-button></div></md-content></md-dialog>"
  );


  $templateCache.put('operations/templates/segments/sc.list.html',
    "<md-dialog aria-label=\"Spacecraft Menu\"><md-toolbar class=\"md-theme-light\"><h2 class=\"md-toolbar-tools\"><span>Registered Spacecraft</span></h2></md-toolbar><md-content class=\"menu-list\"><md-button id=\"addSc\" ng-click=\"showAddDialog()\" aria-label=\"add spacecraft\" class=\"md-primary menu-button\"><div layout=\"row\" layout-fill><i class=\"fa fa-plus\"></i> <b>spacecraft</b></div></md-button><md-divider></md-divider><md-list><li ng-hide=\"scList.length\" class=\"sn-no-item\">(no spacecraft)</li><md-list-item ng-repeat=\"sc in scList\"><div layout=\"row\" layout-fill><md-button id=\"{{ sc }}-edit\" ng-click=\"showEditDialog(sc)\" aria-label=\"edit spacecraft {{ sc }}\" class=\"md-primary menu-button\" style=\"text-align:center; width: 70%\"><div layout=\"row\" layout-fill><b>{{ sc }}</b></div></md-button><md-button id=\"{{ sc }}-channels\" ng-click=\"showChannelList(sc)\" aria-label=\"spacecraft channels {{ sc }}\" class=\"md-primary menu-button\" flex><div layout=\"row\" layout-fill><i class=\"fa fa-rss\"></i></div></md-button><md-button id=\"{{ sc }}-delete\" ng-click=\"delete(sc)\" aria-label=\"delete spacecraft {{ sc }}\" class=\"md-primary menu-button\" flex><div layout=\"row\" layout-fill><i class=\"fa fa-close\"></i></div></md-button></div></md-list-item></md-list></md-content></md-dialog>"
  );

}]);
