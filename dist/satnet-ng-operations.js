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

/** Module definition (empty array is vital!). */
angular.module('snBroadcasterServices', [
    'snPushServices'
])
.service('broadcaster', [
    '$rootScope', '$log', 'satnetPush',

    /**
     * Broadcaster service that enables the sending and reception of messages
     * among all the modules of this Angular application.
     * 
     * @param {Object}   $rootScope Main Angular scope for this service
     * @param {[[Type]]} $log       $log Angular service
     * @param {Object}   satnetPush Pusher.com service access
     */
    function ($rootScope, $log, satnetPush) {

        /**********************************************************************/
        /************************************************* INTERNAL CALLBACKS */
        /**********************************************************************/

        this.GS_ADDED_EVENT = 'gs.added';
        this.GS_REMOVED_EVENT = 'gs.removed';
        this.GS_UPDATED_EVENT = 'gs.updated';
        this.GS_AVAILABLE_ADDED_EVENT = 'gs.available.added';
        this.GS_AVAILABLE_REMOVED_EVENT = 'gs.available.removed';
        this.GS_AVAILABLE_UPDATED_EVENT = 'gs.available.updated';
        this.PASSES_UPDATED = 'passes.updated';
        this.LEOP_GSS_UPDATED_EVENT = 'leop.gss.updated';
        this.LEOP_GS_ASSIGNED_EVENT = 'leop.gs.assigned';
        this.LEOP_GS_RELEASED_EVENT = 'leop.gs.released';
        this.LEOP_UPDATED_EVENT = 'leop.updated';
        this.LEOP_FRAME_RX_EVENT = 'leop.frame.rx';
        this.KEEP_ALIVE_EVENT = 'KEEP_ALIVE';

        /**
         * Function that broadcasts the event associated with the creation of a
         * new GroundStation available for the LEOP cluster.
         *
         * @param {String} identifier The identifier of the GroundStation.
         */
        this.gsAvailableAddedInternal = function (identifier) {
            $rootScope.$broadcast('gs.available.added', identifier);
        };

        /**
         * Function that broadcasts the event associated with the creation of a
         * new GroundStation.
         *
         * @param {String} identifier The identifier of the GroundStation.
         */
        this.gsAdded = function (identifier) {
            $rootScope.$broadcast(this.GS_ADDED_EVENT, identifier);
        };

        /**
         * Function that broadcasts the event associated with the removal of a
         * new GroundStation.
         *
         * @param {String} identifier The identifier of the GroundStation.
         */
        this.gsRemoved = function (identifier) {
            $rootScope.$broadcast(this.GS_REMOVED_EVENT, identifier);
        };

        /**
         * Function that broadcasts the event associated with the update of
         * new GroundStation.
         *
         * @param {String} identifier The identifier of the GroundStation.
         */
        this.gsUpdated = function (identifier) {
            $rootScope.$broadcast(this.GS_UPDATED_EVENT, identifier);
        };

        /**********************************************************************/
        /************************************************* INTERNAL CALLBACKS */
        /**********************************************************************/

        this.SC_ADDED_EVENT = 'sc.added';
        this.SC_REMOVED_EVENT = 'sc.removed';
        this.SC_UPDATED_EVENT = 'sc.updated';

        /**
         * Function that broadcasts the event associated with the creation of a
         * new Spacececraft.
         *
         * @param {String} identifier The identifier of the Spacececraft.
         */
        this.scAdded = function (identifier) {
            $rootScope.$broadcast(this.SC_ADDED_EVENT, identifier);
        };

        /**
         * Function that broadcasts the event associated with the removal of a
         * new Spacececraft.
         *
         * @param {String} identifier The identifier of the Spacececraft.
         */
        this.scRemoved = function (identifier) {
            $rootScope.$broadcast(this.SC_REMOVED_EVENT, identifier);
        };

        /**
         * Function that broadcasts the event associated with the update of
         * new Spacececraft.
         *
         * @param {String} identifier The identifier of the Spacececraft.
         */
        this.scUpdated = function (identifier) {
            $rootScope.$broadcast(this.SC_UPDATED_EVENT, identifier);
        };

        /**********************************************************************/
        /***************************************************** PUSH CALLBACKS */
        /**********************************************************************/

        /**
         * Broadcasts the event.
         */
        this.gsAvailableAdded = function (id_object) {
            $rootScope.$broadcast('gs.available.added', id_object.identifier);
        };

        /**
         * Broadcasts the event.
         */
        this.gsAvailableRemoved = function (id_object) {
            $rootScope.$broadcast('gs.available.removed', id_object.identifier);
            $rootScope.$broadcast('passes.updated', {});
        };

        /**
         * Broadcasts the event.
         */
        this.gsAvailableUpdated = function (id_object) {
            $rootScope.$broadcast('gs.available.updated', id_object.identifier);
            $rootScope.$broadcast('passes.updated', {});
        };

        /**
         * Broadcasts the event.
         */
        this.passesUpdated = function () {
            $rootScope.$broadcast('passes.updated', {});
        };

        /**
         * Broadcasts the event.
         */
        this.scGtUpdated = function (data) {
            $rootScope.$broadcast('sc.updated', data.identifier);
        };

        /**
         * Broadcasts the event.
         */
        this.leopGssUpdated = function (leop_id) {
            if ($rootScope.leop_id !== leop_id.identifier) {
                return;
            }
            $rootScope.$broadcast('leop.gss.updated', leop_id);
        };

        /**
         * Broadcasts the event.
         */
        this.leopGsAssigned = function (data) {
            if ($rootScope.leop_id !== data.launch_id) {
                return;
            }
            $rootScope.$broadcast('leop.gs.assigned', data.groundstation_id);
        };

        /**
         * Broadcasts the event.
         */
        this.leopGsReleased = function (data) {
            if ($rootScope.leop_id !== data.launch_id) {
                return;
            }
            $rootScope.$broadcast('leop.gs.released', data.groundstation_id);
        };

        /**
         * Broadcasts the event.
         */
        this.leopUpdated = function (leop_id) {
            if ($rootScope.leop_id !== leop_id.identifier) {
                return;
            }
            $rootScope.$broadcast('leop.updated', leop_id);
        };

        /**
         * Broadcasts the event.
         */
        this.leopUfoIdentified = function (data) {
            if ($rootScope.leop_id !== data.launch_id) {
                return;
            }
            $rootScope.$broadcast('sc.added', data.spacecraft_id);
            $rootScope.$broadcast('passes.updated', {});
        };

        /**
         * Broadcasts the event.
         */
        this.leopUfoUpdated = function (data) {
            if ($rootScope.leop_id !== data.launch_id) {
                return;
            }
            $rootScope.$broadcast('sc.updated', data.spacecraft_id);
            $rootScope.$broadcast('passes.updated', {});
        };

        /**
         * Broadcasts the event.
         */
        this.leopUfoForgot = function (data) {
            if ($rootScope.leop_id !== data.launch_id) {
                return;
            }
            $rootScope.$broadcast('sc.removed', data.spacecraft_id);
            $rootScope.$broadcast('passes.updated', {});
        };

        /**
         * Broadcasts the event.
         */
        this.leopSCUpdated = function (data) {
            if ($rootScope.leop_id !== data.launch_id) {
                return;
            }
            $rootScope.$broadcast('sc.updated', data.launch_sc_id);
            $rootScope.$broadcast('passes.updated', {});
        };

        /**
         * Broadcasts the event.
         */
        this.leopFrameReceived = function (data) {
            $rootScope.$broadcast('leop.frame.rx', data.frame);
        };

        /**
         * Broadcasts the event.
         */
        this.keepAliveReceived = function (data) {
            $rootScope.$broadcast('KEEP_ALIVE', {});
            $log.log('ALIVE! data = ' + JSON.stringify(data));
        };

        satnetPush.bind(
            satnetPush.EVENTS_CHANNEL,
            satnetPush.GS_ADDED_EVENT,
            this.gsAvailableAdded,
            this
        );
        satnetPush.bind(
            satnetPush.EVENTS_CHANNEL,
            satnetPush.GS_REMOVED_EVENT,
            this.gsAvailableRemoved,
            this
        );
        satnetPush.bind(
            satnetPush.EVENTS_CHANNEL,
            satnetPush.GS_UPDATED_EVENT,
            this.gsAvailableUpdated,
            this
        );
        satnetPush.bind(
            satnetPush.SIMULATION_CHANNEL,
            satnetPush.PASSES_UPDATED_EVENT,
            this.passesUpdated,
            this
        );
        satnetPush.bind(
            satnetPush.SIMULATION_CHANNEL,
            satnetPush.GT_UPDATED_EVENT,
            this.scGtUpdated,
            this
        );
        satnetPush.bind(
            satnetPush.LEOP_CHANNEL,
            satnetPush.LEOP_UPDATED_EVENT,
            this.leopUpdated,
            this
        );
        satnetPush.bind(
            satnetPush.LEOP_CHANNEL,
            satnetPush.LEOP_GSS_UPDATED_EVENT,
            this.leopGssUpdated,
            this
        );
        satnetPush.bind(
            satnetPush.LEOP_CHANNEL,
            satnetPush.LEOP_GS_ASSIGNED_EVENT,
            this.leopGsAssigned,
            this
        );
        satnetPush.bind(
            satnetPush.LEOP_CHANNEL,
            satnetPush.LEOP_GS_RELEASED_EVENT,
            this.leopGsReleased,
            this
        );
        satnetPush.bind(
            satnetPush.LEOP_CHANNEL,
            satnetPush.LEOP_UFO_IDENTIFIED_EVENT,
            this.leopUfoIdentified,
            this
        );
        satnetPush.bind(
            satnetPush.LEOP_CHANNEL,
            satnetPush.LEOP_UFO_UPDATED_EVENT,
            this.leopUfoUpdated,
            this
        );
        satnetPush.bind(
            satnetPush.LEOP_CHANNEL,
            satnetPush.LEOP_UFO_FORGOTTEN_EVENT,
            this.leopUfoForgot,
            this
        );
        satnetPush.bind(
            satnetPush.LEOP_CHANNEL,
            satnetPush.LEOP_SC_UPDATED_EVENT,
            this.leopSCUpdated,
            this
        );
        satnetPush.bind(
            satnetPush.LEOP_DOWNLINK_CHANNEL,
            satnetPush.FRAME_EVENT,
            this.leopFrameReceived,
            this
        );
        satnetPush.bind(
            satnetPush.NETWORK_EVENTS_CHANNEL,
            satnetPush.KEEP_ALIVE,
            this.keepAliveReceived,
            this
        );

    }
]);;/**
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

/** Module definition (empty array is vital!). */
angular.module('snCelestrakServices', [])
    .service('celestrak', [function () {

    // Base URL
    this.CELESTRAK_URL_BASE = 'http://celestrak.com/NORAD/elements/';
    //this.CELESTRAK_URL_BASE = 'https://satnet.aero.calpoly.edu/celestrak/';
    // Weather and Earth Resources
    this.CELESTRAK_SECTION_1 = 'Weather & Earth Resources';
    this.CELESTRAK_WEATHER = this.CELESTRAK_URL_BASE + 'weather.txt';
    this.CELESTRAK_NOAA = this.CELESTRAK_URL_BASE + 'noaa.txt';
    this.CELESTRAK_GOES = this.CELESTRAK_URL_BASE + 'goes.txt';
    this.CELESTRAK_EARTH_RESOURCES = this.CELESTRAK_URL_BASE + 'resource.txt';
    this.CELESTRAK_SARSAT = this.CELESTRAK_URL_BASE + 'sarsat.txt';
    this.CELESTRAK_DISASTER_MONITORING = this.CELESTRAK_URL_BASE + 'dmc.txt';
    this.CELESTRAK_TRACKING_DATA_RELAY = this.CELESTRAK_URL_BASE + 'tdrss.txt';
    this.CELESTRAK_ARGOS = this.CELESTRAK_URL_BASE + 'argos.txt';
    // Communications
    this.CELESTRAK_SECTION_2 = 'Communications';
    this.CELESTRAK_GEOSTATIONARY = this.CELESTRAK_URL_BASE + 'geo.txt';
    this.CELESTRAK_INTELSAT = this.CELESTRAK_URL_BASE + 'intelsat.txt';
    this.CELESTRAK_GORIZONT = this.CELESTRAK_URL_BASE + 'gorizont.txt';
    this.CELESTRAK_RADUGA = this.CELESTRAK_URL_BASE + 'raduga.txt';
    this.CELESTRAK_MOLNIYA = this.CELESTRAK_URL_BASE + 'molniya.txt';
    this.CELESTRAK_IRIDIUM = this.CELESTRAK_URL_BASE + 'iridium.txt';
    this.CELESTRAK_ORBCOMM = this.CELESTRAK_URL_BASE + 'orbcomm.txt';
    this.CELESTRAK_GLOBALSTAR = this.CELESTRAK_URL_BASE + 'globalstar.txt';
    this.CELESTRAK_AMATEUR_RADIO = this.CELESTRAK_URL_BASE + 'amateur.txt';
    this.CELESTRAK_EXPERIMENTAL = this.CELESTRAK_URL_BASE + 'x-comm.txt';
    this.CELESTRAK_COMMS_OTHER = this.CELESTRAK_URL_BASE + 'other-comm.txt';
    // Navigation
    this.CELESTRAK_SECTION_3 = 'Navigation';
    this.CELESTRAK_GPS_OPERATIONAL = this.CELESTRAK_URL_BASE + 'gps-ops.txt';
    this.CELESTRAK_GLONASS_OPERATIONAL = this.CELESTRAK_URL_BASE + 'glo-ops.txt';
    this.CELESTRAK_GALILEO = this.CELESTRAK_URL_BASE + 'galileo.txt';
    this.CELESTRAK_BEIDOU = this.CELESTRAK_URL_BASE + 'beidou.txt';
    this.CELESTRAK_SATELLITE_AUGMENTATION = this.CELESTRAK_URL_BASE + 'sbas.txt';
    this.CELESTRAK_NNSS = this.CELESTRAK_URL_BASE + 'nnss.txt';
    this.CELESTRAK_RUSSIAN_LEO_NAVIGATION = this.CELESTRAK_URL_BASE + 'musson.txt';
    // Scientific
    this.CELESTRAK_SECTION_4 = 'Scientific';
    this.CELESTRAK_SPACE_EARTH_SCIENCE = this.CELESTRAK_URL_BASE + 'science.txt';
    this.CELESTRAK_GEODETIC = this.CELESTRAK_URL_BASE + 'geodetic.txt';
    this.CELESTRAK_ENGINEERING = this.CELESTRAK_URL_BASE + 'engineering.txt';
    this.CELESTRAK_EDUCATION = this.CELESTRAK_URL_BASE + 'education.txt';
    // Miscellaneous
    this.CELESTRAK_SECTION_5 = 'Miscellaneous';
    this.CELESTRAK_MILITARY = this.CELESTRAK_URL_BASE + 'military.txt';
    this.CELESTRAK_RADAR_CALLIBRATION = this.CELESTRAK_URL_BASE + 'radar.txt';
    this.CELESTRAK_CUBESATS = this.CELESTRAK_URL_BASE + 'cubesat.txt';
    this.CELESTRAK_OTHER = this.CELESTRAK_URL_BASE + 'other.txt';
    // CELESTRAK resources within a structured data type...
    this.CELESTRAK_RESOURCES = {
        'Weather': this.CELESTRAK_WEATHER,
        'NOAA': this.CELESTRAK_NOAA,
        'GOES': this.CELESTRAK_GOES,
        'Earth Resources': this.CELESTRAK_EARTH_RESOURCES,
        'SARSAT': this.CELESTRAK_SARSAT,
        'Disaster Monitoring': this.CELESTRAK_DISASTER_MONITORING,
        'Tracking & Data Relay': this.CELESTRAK_TRACKING_DATA_RELAY,
        'ARGOS': this.CELESTRAK_ARGOS,
        'Geostationary': this.CELESTRAK_GEOSTATIONARY,
        'Intelsat': this.CELESTRAK_INTELSAT,
        'Gorizont': this.CELESTRAK_GORIZONT,
        'Raduga': this.CELESTRAK_RADUGA,
        'Molniya': this.CELESTRAK_MOLNIYA,
        'Iridium': this.CELESTRAK_IRIDIUM,
        'Orbcomm': this.CELESTRAK_ORBCOMM,
        'Globalstar': this.CELESTRAK_GLOBALSTAR,
        'Amateur Radio': this.CELESTRAK_AMATEUR_RADIO,
        'Experimental': this.CELESTRAK_EXPERIMENTAL,
        'Others': this.CELESTRAK_COMMS_OTHER,
        'GPS Operational': this.CELESTRAK_GPS_OPERATIONAL,
        'Glonass Operational': this.CELESTRAK_GLONASS_OPERATIONAL,
        'Galileo': this.CELESTRAK_GALILEO,
        'Beidou': this.CELESTRAK_BEIDOU,
        'Satellite-based Augmentation System': this.CELESTRAK_SATELLITE_AUGMENTATION,
        'Navy Navigation Satellite System': this.CELESTRAK_NNSS,
        'Russian LEO Navigation': this.CELESTRAK_RUSSIAN_LEO_NAVIGATION,
        'Space & Earth Science': this.CELESTRAK_SPACE_EARTH_SCIENCE,
        'Geodetic': this.CELESTRAK_GEODETIC,
        'Engineering': this.CELESTRAK_ENGINEERING,
        'Education': this.CELESTRAK_EDUCATION,
        'Military': this.CELESTRAK_MILITARY,
        'Radar Callibration': this.CELESTRAK_RADAR_CALLIBRATION,
        'CubeSats': this.CELESTRAK_CUBESATS,
        'Other': this.CELESTRAK_OTHER
    };

    this.CELESTRAK_SELECT_SECTIONS = [
        /////////////////////////////////////////////////////////////////  SECTION 1
        { 'section': this.CELESTRAK_SECTION_1, 'subsection': 'Weather' },
        { 'section': this.CELESTRAK_SECTION_1, 'subsection': 'NOAA' },
        { 'section': this.CELESTRAK_SECTION_1, 'subsection': 'GOES' },
        { 'section': this.CELESTRAK_SECTION_1, 'subsection': 'Earth Resources' },
        { 'section': this.CELESTRAK_SECTION_1, 'subsection': 'SARSAT' },
        { 'section': this.CELESTRAK_SECTION_1, 'subsection': 'Disaster Monitoring' },
        { 'section': this.CELESTRAK_SECTION_1, 'subsection': 'Tracking & Data Relay' },
        { 'section': this.CELESTRAK_SECTION_1, 'subsection': 'ARGOS' },
        /////////////////////////////////////////////////////////////////  SECTION 2
        { 'section': this.CELESTRAK_SECTION_2, 'subsection': 'Geostationary' },
        { 'section': this.CELESTRAK_SECTION_2, 'subsection': 'Intelsat' },
        { 'section': this.CELESTRAK_SECTION_2, 'subsection': 'Gorizont' },
        { 'section': this.CELESTRAK_SECTION_2, 'subsection': 'Raduga' },
        { 'section': this.CELESTRAK_SECTION_2, 'subsection': 'Molniya' },
        { 'section': this.CELESTRAK_SECTION_2, 'subsection': 'Iridium' },
        { 'section': this.CELESTRAK_SECTION_2, 'subsection': 'Orbcomm' },
        { 'section': this.CELESTRAK_SECTION_2, 'subsection': 'Globalstar' },
        { 'section': this.CELESTRAK_SECTION_2, 'subsection': 'Amateur Radio' },
        { 'section': this.CELESTRAK_SECTION_2, 'subsection': 'Experimental' },
        { 'section': this.CELESTRAK_SECTION_2, 'subsection': 'Others' },
        /////////////////////////////////////////////////////////////////  SECTION 3
        { 'section': this.CELESTRAK_SECTION_3, 'subsection': 'GPS Operational' },
        { 'section': this.CELESTRAK_SECTION_3, 'subsection': 'Glonass Operational' },
        { 'section': this.CELESTRAK_SECTION_3, 'subsection': 'Galileo' },
        { 'section': this.CELESTRAK_SECTION_3, 'subsection': 'Beidou' },
        { 'section': this.CELESTRAK_SECTION_3, 'subsection': 'Satellite-based Augmentation System' },
        { 'section': this.CELESTRAK_SECTION_3, 'subsection': 'Navy Navigation Satellite System' },
        { 'section': this.CELESTRAK_SECTION_3, 'subsection': 'Russian LEO Navigation' },
        /////////////////////////////////////////////////////////////////  SECTION 4
        { 'section': this.CELESTRAK_SECTION_4, 'subsection': 'Space & Earth Science' },
        { 'section': this.CELESTRAK_SECTION_4, 'subsection': 'Geodetic' },
        { 'section': this.CELESTRAK_SECTION_4, 'subsection': 'Engineering' },
        { 'section': this.CELESTRAK_SECTION_4, 'subsection': 'Education' },
        /////////////////////////////////////////////////////////////////  SECTION 5
        { 'section': this.CELESTRAK_SECTION_5, 'subsection': 'Military' },
        { 'section': this.CELESTRAK_SECTION_5, 'subsection': 'Radar Callibration' },
        { 'section': this.CELESTRAK_SECTION_5, 'subsection': 'CubeSats' },
        { 'section': this.CELESTRAK_SECTION_5, 'subsection': 'Other' }
    ];

}]);;/*
   Copyright 2015 Ricardo Tubio-Pardavila

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

angular
.module('snControllers', ['ngMaterial'])
.service('snDialog', [
    '$log', '$mdDialog', '$mdToast',

    /**
     * Set of helpers for the SatNet dialogs.
     *
     * @param {Object} $log      Angular JS $log service
     * @param {Object} $mdDialog Angular Material $mdDialog service
     * @param {Object} $mdToast  Angular Material $mdToast service
     */
    function ($log, $mdDialog, $mdToast) {

        /**
         * Function that is used to notify a success in an operation
         * within this Dialog. If no templateUrl is provided, then the original
         * dialog is not closed and no different dialog gets opened.
         *
         * @param {String} operation  Descriptive name of the operation
         * @param {String} identifier Identifier of the object
         * @param {Object} response    Response from the server
         * @param {String} templateUrl URL with the template to load after
         *                             closing the dialog.
         */
        this.success = function (operation, identifier, response, templateUrl) {

            var message = 'Succesfull operation <' + operation +
                '> over id = <' + identifier + '>';
            $log.info(
                '@success, message = ' + message +
                ', response = ' + JSON.stringify(response)
            );
            $mdToast.show($mdToast.simple().content(message));

            if (templateUrl) {
                $mdDialog.hide();
                $mdDialog.show({
                    templateUrl: templateUrl
                });
            }

        };

        /**
         * Function that displays an error associated to a given attempted
         * operation over the specified element. The cause thrown by the
         * underlaying service that could not complete the operation has to be
         * given as a paramter as well.
         *
         * @param {String} operation  Descriptive name of the operation
         * @param {String} identifier Identifier of the object
         * @param {Object} cause      Object with the cause of the exception
         */
        this.exception = function (operation, identifier, cause) {

            var message = 'Error while doing operation <' + operation +
                '> over id = <' + identifier + '>';
            $log.error('@exception, cause: ' + JSON.stringify(cause));
            $mdToast.show($mdToast.simple().content(message));
            $mdDialog.hide();

        };

    }

]);;/**
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

/** Module definition (empty array is vital!). */
angular
.module('snPushServices', [
    'pusher-angular'
])
.service('satnetPush', [
    '$log', '$pusher',
    function ($log, $pusher) {
        'use strict';

        this._API_KEY = '79bee37791b6c60f3e56';

        this._client = null;
        this._service = null;

        // Names of the channels for subscription
        this.LEOP_DOWNLINK_CHANNEL = 'leop.downlink.ch';
        this.EVENTS_CHANNEL = 'configuration.events.ch';
        this.NETWORK_EVENTS_CHANNEL = 'network.events.ch';
        this.SIMULATION_CHANNEL = 'simulation.events.ch';
        this.LEOP_CHANNEL = 'leop.events.ch';
        // List of events that an application can get bound to.
        this.KEEP_ALIVE = 'keep_alive';
        this.FRAME_EVENT = 'frameEv';
        this.GS_ADDED_EVENT = 'gsAddedEv';
        this.GS_REMOVED_EVENT = 'gsRemovedEv';
        this.GS_UPDATED_EVENT = 'gsUpdatedEv';
        this.PASSES_UPDATED_EVENT = 'passesUpdatedEv';
        this.GT_UPDATED_EVENT = 'groundtrackUpdatedEv';
        this.LEOP_GSS_UPDATED_EVENT = 'leopGSsUpdatedEv';
        this.LEOP_GS_ASSIGNED_EVENT = 'leopGSAssignedEv';
        this.LEOP_GS_RELEASED_EVENT = 'leopGSReleasedEv';
        this.LEOP_UPDATED_EVENT = 'leopUpdatedEv';
        this.LEOP_UFO_IDENTIFIED_EVENT = 'leopUFOIdentifiedEv';
        this.LEOP_UFO_FORGOTTEN_EVENT = 'leopUFOForgottenEv';
        this.LEOP_SC_UPDATED_EVENT = 'leopSCUpdatedEv';

        // List of channels that the service automatically subscribes to.
        this._channel_names = [
            this.LEOP_DOWNLINK_CHANNEL,
            this.EVENTS_CHANNEL,
            this.SIMULATION_CHANNEL,
            this.NETWORK_EVENTS_CHANNEL,
            this.LEOP_CHANNEL
        ];

        /**
         * Initializes the pusher service.
         */
        this._initData = function () {

            this._client = new Pusher(this._API_KEY, {
                encrypted: true
            });
            this._service = $pusher(this._client);
            this._service.connection.bind('state_change', this._logConnection);
            $log.info('[push] pusher.com service initialized!');

            this._subscribeChannels();

        };

        /**
         * Logs changes in the connection state for the pusher service.
         *
         * @param {Array} states Array with the former and current state of the
         *                       connection.
         */
        this._logConnection = function (states) {
            $log.info(
                '[push] State connection change, states = ' +
                JSON.stringify(states)
            );
        };

        /**
         * Subscribe this service to all the channels whose names are part of
         * the "_channel_names_ array.
         */
        this._subscribeChannels = function () {
            var self = this;
            angular.forEach(this._channel_names, function (name) {
                self._service.subscribe(name);
                $log.info('[push] Subscribed to channel <' + name + '>');
            });
        };

        /**
         * Method that binds the given function to the events triggered by
         * that channel.
         *
         * @param {String} channel_name Name of the channel
         * @param {String} event_name Name of the event
         * @param {Function} callback_fn Function to be executed when that
         *                               event happens
         */
        this.bind = function (channel_name, event_name, callback_fn) {
            if (!this._service.allChannels().hasOwnProperty(channel_name)) {
                throw 'Not subscribed to this channel, ' +
                'name = <' + channel_name + '>';
            }
            this._service.channel(channel_name).bind(event_name, callback_fn);
        };

        /**
         * Binds the given callback function to the reception of any event
         * frames on the downlink channel.
         *
         * @param {Object} callback_fn Callback function to be bound
         */
        this.bindFrameReceived = function (callback_fn) {
            this.bind(
                this.LEOP_DOWNLINK_CHANNEL,
                this.FRAME_EVENT,
                callback_fn,
                this
            );
        };

        this._initData();

    }

]);;/**
 * Copyright 2015 Ricardo Tubio-Pardavila
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

/** Module definition (empty array is vital!). */
angular
    .module('snJRPCServices', [
        'jsonrpc', 'ngCookies'
    ])
    .run([
        '$http', '$cookies',
        function ($http, $cookies) {
            // For CSRF token compatibility with Django
            $http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken;
        }
    ])
    .constant('TEST_PORT', 8000)
    .service('satnetRPC', [
        'jsonrpc', '$location', '$log', '$q', '$http', 'TEST_PORT',

        /**
         * Service that defines the basic calls to the services of the SATNET
         * network through JSON RPC. It defines a common error handler for all
         * the errors that can be overriden by users.
         *
         * @param   {Object} jsonrpc   JSON RPC service.
         * @param   {Object} $location $location service.
         * @param   {Object} $log      $log service.
         * @param   {Object} $q        $q service.
         * @param   {Object} $http     $http service.
         */
        function (jsonrpc, $location, $log, $q, $http, TEST_PORT) {
            'use strict';

            /**
             * PRIVATE METHOD
             *
             * Returns the complete address to connect to the sever where the
             * SatNet services are running. This can be use as the base for any
             * of the offered services, regardless of whether they are offered
             * over JRPC or over HTTP (AJAX requests).
             *
             * If the current connection address is "localhost", it assumes
             * debug mode and the URL that it returns has the port changed so
             * that it re-routes the calls to the port 8000. At that port, the
             * code for the SatNet server is supposed to be running.
             *
             * The latter policy for automatic test detection might incurr in
             * further Cross-Reference connection problems.
             *
             * @returns {String} Corrected address for the remote SatNet server.
             */
            this._getSatNetAddress = function () {

                var protocol = $location.protocol(),
                    hostname = $location.host(),
                    port = $location.port();

                if (hostname === 'localhost') {
                    port = TEST_PORT;
                }

                return '' + protocol + '://' + hostname + ':' + port;

            };

            /**
             * PRIVATE METHOD
             *
             * Returns the complete address to connect with the remote server
             * that implements the remote SATNET API over JRPC.
             *
             * If the current connection address is "localhost", it assumes
             * debug mode and the URL that it returns has the port changed so
             * that it re-routes the calls to the port 8000. At that port, the
             * code for the SatNet server is supposed to be running.
             *
             * The latter policy for automatic test detection might incurr in
             * further Cross-Reference connection problems.
             *
             * @returns {String} Corrected address for the remote SatNet server.
             */
            this._getRPCAddress = function () {
                return this._getSatNetAddress() + '/jrpc/';
            };

            var _rpc = this._getRPCAddress();

            this._configuration = jsonrpc.newService('configuration', _rpc);
            this._simulation = jsonrpc.newService('simulation', _rpc);
            this._leop = jsonrpc.newService('leop', _rpc);
            this._network = jsonrpc.newService('network', _rpc);

            this._services = {
                'channels.options': this._configuration
                    .createMethod('channels.getOptions'),
                // Configuration methods (Ground Stations)
                'gs.list': this._configuration
                    .createMethod('gs.list'),
                'gs.add': this
                    ._configuration.createMethod('gs.create'),
                'gs.get': this._configuration
                    .createMethod('gs.getConfiguration'),
                'gs.update': this._configuration
                    .createMethod('gs.setConfiguration'),
                'gs.delete': this._configuration
                    .createMethod('gs.delete'),
                'gs.channel.list': this._configuration
                    .createMethod('gs.channel.list'),
                'gs.channel.add': this._configuration
                    .createMethod('gs.channel.create'),
                // Configuration methods (Spacecraft)
                'sc.list': this._configuration
                    .createMethod('sc.list'),
                'sc.add': this._configuration
                    .createMethod('sc.create'),
                'sc.get': this._configuration
                    .createMethod('sc.getConfiguration'),
                'sc.update': this._configuration
                    .createMethod('sc.setConfiguration'),
                'sc.delete': this._configuration
                    .createMethod('sc.delete'),
                'sc.channel.list': this._configuration
                    .createMethod('sc.channel.list'),
                'sc.channel.add': this._configuration
                    .createMethod('sc.channel.create'),
                'sc.channel.get': this._configuration
                    .createMethod('sc.channel.getConfiguration'),
                'sc.channel.set': this._configuration
                    .createMethod('sc.channel.setConfiguration'),
                // User configuration
                'user.getLocation': this._configuration
                    .createMethod('user.getLocation'),
                // TLE methods
                'tle.celestrak.getSections': this._configuration
                    .createMethod('tle.celestrak.getSections'),
                'tle.celestrak.getResource': this._configuration
                    .createMethod('tle.celestrak.getResource'),
                'tle.celestrak.getTle': this._configuration
                    .createMethod('tle.celestrak.getTle'),
                // Simulation methods
                'sc.getGroundtrack': this._simulation
                    .createMethod('spacecraft.getGroundtrack'),
                'sc.getPasses': this._simulation
                    .createMethod('spacecraft.getPasses'),
                'gs.getPasses': this._simulation
                    .createMethod('groundstation.getPasses'),
                // LEOP services
                'leop.getCfg': this._leop
                    .createMethod('getConfiguration'),
                'leop.setCfg': this._leop
                    .createMethod('setConfiguration'),
                'leop.getPasses': this._leop
                    .createMethod('getPasses'),
                'leop.gs.list': this._leop
                    .createMethod('gs.list'),
                'leop.sc.list': this._leop
                    .createMethod('sc.list'),
                'leop.gs.add': this._leop
                    .createMethod('gs.add'),
                'leop.gs.remove': this._leop
                    .createMethod('gs.remove'),
                'leop.ufo.add': this._leop
                    .createMethod('launch.addUnknown'),
                'leop.ufo.remove': this._leop
                    .createMethod('launch.removeUnknown'),
                'leop.ufo.identify': this._leop
                    .createMethod('launch.identify'),
                'leop.ufo.forget': this._leop
                    .createMethod('launch.forget'),
                'leop.ufo.update': this._leop
                    .createMethod('launch.update'),
                'leop.getMessages': this._leop
                    .createMethod('getMessages'),
                // NETWORK services
                'net.alive': this._network
                    .createMethod('keepAlive'),
                'net.geoip': this._network
                    .createMethod('geoip')
            };

            /**
             * PRIVATE function that is used only by this service in order to
             * generate in the same way all possible errors produced by the
             * remote invokation of the SatNet services.
             *
             * @param {String} service Name of the SatNet JRPC service that
             *                         has just been invoked.
             * @param {Array}  params  Array with the parameters for the
             *                         service to be invoked.
             * @param {String} code    Error code.
             * @param {String} message Messsage description.
             */
            this._generateError = function (service, params, code, message) {

                var msg = 'Satnet.js@_generateError: invoking = <' + service +
                    '>, with params = <' + JSON.stringify(params) +
                    '>, code = <' + JSON.stringify(code) +
                    '>, description = <' + JSON.stringify(message) + '>';
                $log.warn(msg);
                throw msg;

            };

            /**
             * Method for calling the remote service through JSON-RPC.
             *
             * @param service The name of the service, as per the internal
             * services name definition.
             * @param params The parameters for the service (as an array).
             * @returns {*}
             */
            this.rCall = function (service, params) {
                var error_fn = this._generateError;

                if ((this._services.hasOwnProperty(service)) === false) {
                    throw '@rCall: service not found, id = <' + service + '>';
                }
                $log.info(
                    '@rCall: Invoked service = <' + service + '>' +
                    ', params = ' + JSON.stringify(params)
                );
                return this._services[service](params).then(

                    function (data) {

                        // TODO Workaround for the JSON-RPC library.
                        if (data.data.name === 'JSONRPCError') {
                            error_fn(service, params, data.code, data.message);
                        }

                        // NOTICE GroundTracks are not displayed completely...
                        var result_msg = ', result = <';
                        if (service === 'sc.getGroundtrack') {
                            result_msg += '$GT_TOO_LONG$';
                        } else {
                            result_msg += JSON.stringify(data) + '>';
                        }

                        $log.info(
                            '@rCall: Invoked service = <' + service + '>' +
                            ', params = <' + JSON.stringify(params) + '>, ' +
                            ', result = <' + result_msg
                        );

                        return data.data;

                    },
                    function (error) {
                        error_fn(service, params, 'NONE', error);
                    }

                );
            };

            /**
             * Simple convenience method for invoking the remote keep alive of the
             * network sevice.
             *
             * @returns {*} Promise that returns True.
             */
            this.alive = function () {
                return this.rCall('net.alive', []).then(function () {
                    return true;
                });
            };

            /**
             * Retrieves the user location using an available Internet service.
             *
             * @returns Promise that returns a { latitude, longitude } object.
             */
            this.getUserLocation = function () {
                var url = this._getSatNetAddress() +
                    '/configuration/user/geoip';
                return $http.get(url).then(function (data) {
                    $log.info('Satnet.js@getUserLocation: user@(' + JSON
                        .stringify(data.data) + ')');
                    return {
                        latitude: parseFloat(data.data.latitude),
                        longitude: parseFloat(data.data.longitude)
                    };
                });
            };

            /**
             * Retrieves the server location using an available Internet
             * service.
             *
             * @returns Promise that returns a { latitude, longitude } object.
             */
            this.getServerLocation = function (hostname) {
                return this.rCall('net.geoip', [hostname])
                    .then(function (location) {
                        return location;
                    });
            };

            /**
             * Reads the configuration for a given spacecraft, including the
             * estimated groundtrack.
             *
             * @param scId The identifier of the spacecraft.
             * @returns Promise that resturns the Spacecraft configuration
             * object.
             */
            this.readSCCfg = function (scId) {
                var cfg = {},
                    p = [
                    this.rCall('sc.get', [scId]),
                    this.rCall('sc.getGroundtrack', [scId]),
                    this.rCall('tle.celestrak.getTle', [scId])
                ];
                return $q.all(p).then(function (results) {
                    cfg = results[0];
                    cfg.groundtrack = results[1];
                    cfg.tle = results[2];
                    angular.extend(cfg, results[0]);
                    angular.extend(cfg.groundtrack, results[1]);
                    angular.extend(cfg.tle, results[2]);
                    return cfg;
                });
            };

            /**
             * Reads the configuration for all the GroundStations associated
             * with this LEOP cluster.
             *
             * @param leop_id Identifier of the LEOP cluster.
             * @returns Promise to be resolved with the result.
             */
            this.readAllLEOPGS = function (leop_id) {
                var self = this;
                return this.rCall('leop.gs.list', [leop_id])
                    .then(function (gss) {
                        var p = [];
                        angular.forEach(gss.leop_gs_available, function (gs) {
                            p.push(self.rCall('gs.get', [gs]));
                        });
                        angular.forEach(gss.leop_gs_inuse, function (gs) {
                            p.push(self.rCall('gs.get', [gs]));
                        });
                        return $q.all(p).then(function (results) {
                            var a_cfgs = [],
                                u_cfgs = [],
                                j, r_j, r_j_id;
                            for (j = 0; j < results.length; j += 1) {
                                r_j = results[j];
                                r_j_id = r_j.groundstation_id;
                                if (gss.leop_gs_available.indexOf(r_j_id) >= 0) {
                                    a_cfgs.push(r_j);
                                } else {
                                    u_cfgs.push(r_j);
                                }
                            }
                            return {
                                leop_gs_available: a_cfgs,
                                leop_gs_inuse: u_cfgs
                            };
                        });
                    });
            };

    }]);;/**
 * Copyright 2015 Ricardo Tubio-Pardavila
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
 * Created by rtubio on 15/05/15.
 */

/** Module definition (empty array is vital!). */
angular.module('snMapServices', [
    'snJRPCServices',
    'leaflet-directive'
])
    .constant('T_OPACITY', 0.125)
    .constant('LAT', 37.7833)
    .constant('LNG', -122.4167)
    .constant('MIN_ZOOM', 2)
    .constant('MAX_ZOOM', 12)
    .constant('ZOOM', 7)
    .constant('ZOOM_SELECT', 10)
    .service('mapServices', [
        '$q', 'leafletData', 'satnetRPC',
        'MIN_ZOOM', 'MAX_ZOOM', 'ZOOM', 'T_OPACITY', 'ZOOM_SELECT',

        /**
         * Function to construct the services provided by this module.
         *
         * @param   {Object}   $q          $q angular service.
         * @param   {Object}   leafletData Object to access to the Leaflet
         *                               map properties.
         * @param   {Object}   satnetRPC   Object with the RPC services
         *                               of the SatNet network.
         * @param   {Number}   MIN_ZOOM    Minimum value for the zoom.
         * @param   {Number}   MAX_ZOOM    Maximum value for the zoom.
         * @param   {Number}   ZOOM        Default value of the zoom over.
         * @param   {Number} T_OPACITY   Default opacity of the layer.
         */
        function (
            $q, leafletData, satnetRPC,
            MIN_ZOOM, MAX_ZOOM, ZOOM, T_OPACITY
        ) {

            'use strict';

            /**
             * Returns the mapInfo structure for the rest of the chained
             * promises.
             *
             * @returns {*} Promise that returns the mapInfo structure with
             *               a reference to the Leaflet map object.
             */
            this.getMainMap = function () {
                return leafletData.getMap('mainMap').then(function (m) {
                    return {
                        map: m
                    };
                });
            };

            /**
             * Redraws the Terminator to its new position.
             *
             * @returns {*} Promise that returns the updated Terminator object.
             * @private
             */
            this._updateTerminator = function (t) {
                var t2 = L.terminator();
                t.setLatLngs(t2.getLatLngs());
                t.redraw();
                return t;
            };

            /**
             * Creates the main map and adds a terminator for the illuminated
             * surface of the Earth.
             *
             * @returns {*} Promise that returns the mapInfo object
             *               {map, terminator}.
             */
            this.createTerminatorMap = function () {
                var update_function = this._updateTerminator;
                return this.getMainMap().then(function (mapInfo) {
                    var t = L.terminator({
                        fillOpacity: T_OPACITY
                    });
                    t.addTo(mapInfo.map);
                    mapInfo.terminator = t;
                    setInterval(function () {
                        update_function(t);
                    }, 500);
                    return mapInfo;
                });
            };

            /**
             * Creates a map centered at the estimated user position.
             *
             * @param scope $scope to be configured
             * @param zoom Zoom level
             * @returns {ng.IPromise<{empty}>|*}
             */
            this.autocenterMap = function (scope, zoom) {
                var self = this;
                return satnetRPC.getUserLocation().then(function (location) {
                    self.configureMap(
                        scope,
                        location.latitude,
                        location.longitude,
                        zoom
                    );
                });
            };

            /**
             * Creates a map centered at the position of the given Ground
             * Station.
             *
             * @param scope $scope to be configured
             * @param identifier Identifier of the GroundStation
             * @param zoom Zoom level
             * @returns {ng.IPromise<{}>|*}
             */
            this.centerAtGs = function (scope, identifier, zoom) {
                var self = this;
                return satnetRPC.rCall('gs.get', [identifier])
                    .then(function (cfg) {
                        self.configureMap(
                            scope,
                            cfg.groundstation_latlon[0],
                            cfg.groundstation_latlon[1],
                            zoom
                        );
                        return cfg;
                    });
            };

            /**
             * Configures the given scope variable to correctly hold a map. It
             * zooms with the provided level, at the center given through the
             * latitude and longitude parameters. It also adds a draggable
             * marker at the center of the map.
             *
             * @param scope Scope to be configured (main variables passed as
             *              instances to angular-leaflet should have been
             *              already created, at least, as empty objects before
             *              calling this function)
             * @param latitude Latitude of the map center
             * @param longitude Longitude of the map center
             * @param zoom Zoom level
             */
            this.configureMap = function (scope, latitude, longitude, zoom) {

                scope.center = {
                    lat: latitude,
                    lng: longitude,
                    zoom: zoom,
                };
                scope.markers = {
                    gs: {
                        lat: latitude,
                        lng: longitude,
                        focus: false,
                        draggable: false,
                        message: 'Estimated Location',
                        icon: {
                            iconUrl: '/images/user.png',
                            iconSize: [15, 15]
                        }
                    }
                };

                if ('layers' in scope) {
                    if ('baselayers' in scope.layers) {
                        scope.layers.baselayers = this.getBaseLayers();
                    }
                    if ('overlays' in scope.layers) {
                        scope.layers.overlays = this.getOverlays();
                    }
                }

            };

            /**
             * Returns the base layers in the format required by the Angular
             * Leaflet plugin.
             *
             * @returns Object with the baselayers indexed by their names.
             */
            this.getBaseLayers = function () {
                return {
                    esri_baselayer: {
                        name: 'ESRI Base Layer',
                        type: 'xyz',
                        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
                        layerOptions: {
                            noWrap: false,
                            continuousWorld: false,
                            minZoom: MIN_ZOOM,
                            maxZoom: MAX_ZOOM,
                            attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
                        }
                    },
                    osm_baselayer: {
                        name: 'OSM Base Layer',
                        type: 'xyz',
                        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        layerOptions: {
                            noWrap: false,
                            continuousWorld: false,
                            minZoom: MIN_ZOOM,
                            maxZoom: MAX_ZOOM,
                            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        }
                    }
                };
            };

            /**
             * Function that returns the base layer for the ESRI maps.
             *
             * @returns {Object} Object with a single element indexed with the
             *                   key 'esri_baselayer'.
             */
            this.getESRIBaseLayer = function () {
                return {
                    esri_baselayer: {
                        name: 'ESRI Base Layer',
                        type: 'xyz',
                        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
                        layerOptions: {
                            noWrap: false,
                            continuousWorld: false,
                            minZoom: MIN_ZOOM,
                            maxZoom: MAX_ZOOM,
                            attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
                        }
                    }
                };
            };

            /**
             * Returns the OSM baselayer for Angular Leaflet.
             *
             * @returns Object with the baselayers indexed by their names.
             */
            this.getOSMBaseLayer = function () {
                return {
                    osm_baselayer: {
                        name: 'OSM Base Layer',
                        type: 'xyz',
                        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        layerOptions: {
                            noWrap: true,
                            continuousWorld: false,
                            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        }
                    }
                };
            };

            /**
             * Returns the overlays in the format required by the Angular
             * Leaflet plugin.
             *
             * @returns Object with the overlays indexed by their names
             */
            this.getOverlays = function () {
                return {
                    oms_admin_overlay: {
                        name: 'Administrative Boundaries',
                        type: 'xyz',
                        url: 'http://openmapsurfer.uni-hd.de/tiles/adminb/x={x}&y={y}&z={z}',
                        visible: true,
                        layerOptions: {
                            noWrap: true,
                            continuousWorld: false,
                            minZoom: MIN_ZOOM,
                            maxZoom: MAX_ZOOM,
                            attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        }
                    },
                    hydda_roads_labels_overlay: {
                        name: 'Roads and Labels',
                        type: 'xyz',
                        url: 'http://{s}.tile.openstreetmap.se/hydda/roads_and_labels/{z}/{x}/{y}.png',
                        layerOptions: {
                            noWrap: true,
                            continuousWorld: false,
                            minZoom: MIN_ZOOM,
                            maxZoom: MAX_ZOOM,
                            attribution: 'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        }
                    },
                    stamen_toner_labels_overlay: {
                        name: 'Labels',
                        type: 'xyz',
                        url: 'http://{s}.tile.stamen.com/toner-labels/{z}/{x}/{y}.png',
                        layerOptions: {
                            noWrap: true,
                            continuousWorld: false,
                            minZoom: MIN_ZOOM,
                            maxZoom: MAX_ZOOM,
                            subdomains: 'abcd',
                            attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        }
                    },
                    owm_rain_overlay: {
                        name: 'Rain',
                        type: 'xyz',
                        url: 'http://{s}.tile.openweathermap.org/map/rain/{z}/{x}/{y}.png',
                        layerOptions: {
                            noWrap: true,
                            continuousWorld: false,
                            minZoom: MIN_ZOOM,
                            maxZoom: MAX_ZOOM,
                            opacity: 0.325,
                            attribution: 'Map data &copy; <a href="http://openweathermap.org">OpenWeatherMap</a>'
                        }
                    },
                    owm_temperature_overlay: {
                        name: 'Temperature',
                        type: 'xyz',
                        url: 'http://{s}.tile.openweathermap.org/map/temp/{z}/{x}/{y}.png',
                        layerOptions: {
                            noWrap: true,
                            continuousWorld: false,
                            minZoom: MIN_ZOOM,
                            maxZoom: MAX_ZOOM,
                            attribution: 'Map data &copy; <a href="http://openweathermap.org">OpenWeatherMap</a>'
                        }
                    },
                    network: {
                        name: 'Network',
                        type: 'markercluster',
                        visible: true
                    },
                    groundstations: {
                        name: 'Ground Stations',
                        type: 'markercluster',
                        visible: true
                    }
                };
            };

            /**
             * Returns a string with the data from a MapInfo like structure.
             *
             * @param   {Object} mapInfo The structure to be printed out.
             * @returns {String} Human-readable representation (string).
             */
            this.asString = function (mapInfo) {
                return 'mapInfo = {' +
                    '"center": ' + JSON.stringify(mapInfo.center) + ', ' +
                    '"terminator": ' + mapInfo.terminator + ', ' +
                    '"map": ' + mapInfo.map +
                    '}';
            };

    }
]);;/**
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

/** Module definition (empty array is vital!). */
angular.module('snMarkerModels', [
        'snMapServices'
    ])
    .constant('_RATE', 1)
    .constant('_SIM_DAYS', 1)
    .constant('_GEOLINE_STEPS', 1)
    .service('markers', [
        '$log',
        'mapServices', 'LAT', 'LNG', 'ZOOM',
        '_SIM_DAYS', '_GEOLINE_STEPS',

        /**
         * Service that provides the basic functions for handling the markers
         * over the Leaflet map. In order to add new markers, update or remove
         * the ones on the map, the functions provided by this service must be
         * used. They automatically handle additional features like the
         * addition of the connection lines among Ground Stations and Servers,
         * or the labels for each of the markers.
         *
         * @param   {Object}        $log           Angular logging service
         * @param   {Object}        mapServices    SatNet map services
         * @param   {Number}        _SIM_DAYS      Number of days for the
         *                                       simulation
         * @param   {Number}        _GEOLINE_STEPS Number of steps for each of
         *                                       the GeoLines
         * @returns {Object|String} Object that provides this service
         */
        function ($log, mapServices, LAT, LNG, ZOOM, _SIM_DAYS, _GEOLINE_STEPS) {

            /******************************************************************/
            /****************************************************** MAP SCOPE */
            /******************************************************************/

            // Structure that holds a reference to the map and to the
            // associated structures.
            this._mapInfo = {};
            // Scope where the leaflet angular pluing has its variables.
            this._mapScope = null;

            /**
             * Returns the current scope to which this markers service is bound
             * to.
             * @returns {null|*} The _mapScope object.
             */
            this.getScope = function () {
                if (this._mapScope === null) {
                    throw '<_mapScope> has not been set.';
                }
                return this._mapScope;
            };

            /**
             * Configures the scope of the Map controller to set the variables
             * for the angular-leaflet plugin.
             *
             * @param scope Scope ($scope) of the controller for the
             *              angular-leaflet plugin.
             */
            this.configureMapScope = function (scope) {

                this._mapScope = scope;

                angular.extend(
                    this._mapScope, {
                        center: {
                            lat: LAT,
                            lng: LNG,
                            zoom: ZOOM
                        },
                        layers: {
                            baselayers: {},
                            overlays: {}
                        },
                        markers: {},
                        paths: {},
                        maxbounds: {}
                    }
                );
                angular.extend(
                    this._mapScope.layers.baselayers,
                    mapServices.getBaseLayers()
                );
                angular.extend(
                    this._mapScope.layers.overlays,
                    mapServices.getOverlays()
                );

                var mapInfo = this._mapInfo;
                mapServices.createTerminatorMap(true).then(function (data) {
                    $log.log(
                        'markers.js@configureMapScope: Created map = <' +
                        mapServices.asString(data) + '>'
                    );
                    angular.extend(mapInfo, data);
                    return mapInfo;
                });

            };

            /******************************************************************/
            /**************************************************** MARKER KEYS */
            /******************************************************************/

            this._KEY_HEADER = 'MK'; // "MK" stands for "marker key"
            this._key_number = 0;

            /**
             * Dictionary that contains the relation between the identifiers
             * of the objects and the keys for the markers that represent those
             * objects.
             *
             * @type {{}}
             */
            this._ids2keys = {};

            /**
             * Creates a new key for the given identifier and adds it to the
             * dictionary of identifiers and keys.
             *
             * @param identifier Identifier of the marker.
             * @returns {string} Key for accessing to the marker.
             */
            this.createMarkerKey = function (identifier) {

                if (this._ids2keys[identifier] !== undefined) {
                    return this.getMarkerKey(identifier);
                }

                var key = this._KEY_HEADER + this._key_number;
                this._key_number += 1;
                this._ids2keys[identifier] = key;
                return key;

            };

            /**
             * Returns the key for the given object that holds a marker.
             *
             * @param identifier Identifier of the object
             * @returns {string} Key for accessing to the marker
             */
            this.getMarkerKey = function (identifier) {
                if (this._ids2keys.hasOwnProperty(identifier) === false) {
                    throw '@getMarkerKey: No key for <' + identifier + '>';
                }
                return this._ids2keys[identifier];
            };

            /**
             * Returns the marker for the server, in case it exists!
             *
             * @param gs_identifier Identifier of the GroundStation object that
             *                      is bound to the server
             * @returns {null|*} String with the key for the marker of the
             *                      server
             */
            this.getServerMarker = function (gs_id) {
                if (this._serverMarkerKey === null) {
                    throw '@getServerMarker: no server for <' + gs_id + '>';
                }
                return this.getScope().markers[this._serverMarkerKey];
            };

            /**
             * Returns the marker for the object with the given identifier.
             *
             * @param identifier Identifier of the object, which can be either
             *                      a GroundStation, a Spacecraft or a Server
             * @returns {*} Marker object
             */
            this.getMarker = function (identifier) {
                return this.getScope().markers[this.getMarkerKey(identifier)];
            };

            /**
             * This function pans the map to the point given by the provided
             * latitude and longitude.
             *
             * @param   {Object} latlng Leaflet LatLng object type
             * @returns {Object} $promise that returns the given Leaflet LatLNg
             *                   object where the map has been panned to, once
             *                   the panning process is over
             */
            this.panTo = function (latlng) {
                if (!latlng) {
                    throw '@panTo: no LatLng object provided';
                }
                return mapServices.getMainMap().then(function (mapInfo) {
                    mapInfo.map.panTo(latlng, {
                        animate: true
                    });
                    return latlng;
                });

            };

            /******************************************************************/
            /***************************************** NETWORK SERVER MARKERS */
            /******************************************************************/

            this._serverMarkerKey = null;

            /**
             * Creates a new marker for the given Network Server.
             * @param {String} id Identifier of the server.
             * @param {Number} latitude Server's estimated latitude.
             * @param {Number} longitude Server's estimated longitude.
             *
             * TODO Check possible bug: when 'noHide = false', once the layer
             * TODO is removed, the label does not appear again when the mouse
             * TODO is over the icon.
             */
            this.createServerMarker = function (id, latitude, longitude) {
                this._serverMarkerKey = this.createMarkerKey(id);
                this.getScope().markers[this._serverMarkerKey] = {
                    lat: latitude,
                    lng: longitude,
                    focus: true,
                    draggable: false,
                    layer: "network",
                    icon: {
                        iconUrl: '/images/server-icon-3.svg',
                        iconSize: [15, 15]
                    },
                    label: {
                        message: id,
                        options: {
                            noHide: true
                        }
                    },
                    groundstations: [],
                    identifier: id
                };
                return id;
            };

            /******************************************************************/
            /***************************************** GROUND STATION MARKERS */
            /******************************************************************/

            /**
             * Creates a unique identifier for the connector of this
             * GroundStation and the Standalone network server.
             *
             * @param gs_identifier Identifier of the GroundStation object.
             * @returns {string} Identifier for the connector.
             */
            this.createConnectorIdentifier = function (gs_identifier) {
                if (!gs_identifier) {
                    throw 'No identifier provided';
                }
                var server_marker = this.getServerMarker(gs_identifier);
                return 'connect:' + gs_identifier + '_2_' +
                    server_marker.identifier;
            };

            /* TODO The structure for modelling what server owns each
             * GroundStation has already started to be implemented. In the
             * 'this.servers' dictionary, each entry has a field called
             * 'groundstations' that enables the correct modelling of the
             * network. Right now, the first server is always chosen and all
             * the GroundStations are bound to it. In the future, each time a
             * GroundStation is added, the server that it belongs to should be
             * specified and used accordingly.
             */

            /**
             * This function creates a connection line object to be draw on the
             * map in between the provided Server and the Ground Station
             * objects.
             *
             * @param {Object} gs_identifier Identifier of the GroundStation
             *                                  object.
             * @returns {*} L.polyline object
             */
            this.createGSConnector = function (gs_identifier) {
                if (!gs_identifier) {
                    throw '@createGSConnector: no GS identifier provided';
                }

                var s_marker = this.getServerMarker(gs_identifier),
                    g_marker = this.getMarker(gs_identifier),
                    c_id = this.createConnectorIdentifier(gs_identifier),
                    c_key,
                    r = {};

                c_key = this.createMarkerKey(c_id);
                r[c_key] = {
                    // FIXME Path removal if added as a layer
                    // layer: 'network',
                    // color: '#A52A2A',
                    color: 'gray',
                    type: 'polyline',
                    weight: 3,
                    opacity: 0.5,
                    latlngs: [s_marker, g_marker],
                    identifier: c_id
                };

                angular.extend(this.getScope().paths, r);
                return c_id;

            };

            /**
             * Pans the current view of the map to the coordinates of the
             * marker for the given groundstation.
             *
             * @param groundstation_id Identifier of the groundstation
             */
            this.panToGSMarker = function (groundstation_id) {
                if (!groundstation_id) {
                    throw '@panToGSMarker: no GS identifier provided';
                }

                var marker = this.getMarker(groundstation_id),
                    m_ll = new L.LatLng(marker.lat, marker.lng);
                return this.panTo(m_ll);
            };

            /**
             * Creates a new marker object for the given GroundStation.
             *
             * @param cfg The configuration of the GroundStation.
             * @returns Angular leaflet marker.
             */
            this.createUnconnectedGSMarker = function (cfg) {
                var id = cfg.groundstation_id,
                    marker_key = this.createMarkerKey(id);

                this.getScope().markers[marker_key] = {
                    lat: cfg.groundstation_latlon[0],
                    lng: cfg.groundstation_latlon[1],
                    focus: true,
                    draggable: false,
                    layer: "groundstations",
                    icon: {
                        iconUrl: '/images/gs-icon.svg',
                        iconSize: [15, 15]
                    },
                    label: {
                        message: cfg.groundstation_id,
                        options: {
                            noHide: true
                        }
                    },
                    identifier: id
                };

                return id;

            };

            /**
             * Creates a new marker object for the given GroundStation, adding
             * the connector to the server.
             *
             * @param cfg The configuration of the GroundStation.
             * @returns Angular leaflet marker.
             */
            this.createGSMarker = function (cfg) {

                var id = cfg.groundstation_id;
                this.createUnconnectedGSMarker(cfg);
                this.createGSConnector(id);
                return id;

            };

            /**
             * Updates the configuration for the markers of the given
             * GroundStation object.
             *
             * @param cfg New configuration of the object.
             * @returns {cfg.groundstation_id|*} Identifier.
             */
            this.updateGSMarker = function (cfg) {
                if (cfg === null) {
                    throw '@updateGSMarker, wrong <cfg>';
                }

                var new_lat = cfg.groundstation_latlon[0],
                    new_lng = cfg.groundstation_latlon[1],
                    marker = this.getMarker(cfg.groundstation_id);

                if (marker.lat !== new_lat) {
                    marker.lat = new_lat;
                }
                if (marker.lng !== new_lng) {
                    marker.lng = new_lng;
                }

                return cfg.groundstation_id;

            };

            /**
             * Removes the connector for the given gs_marker (if it exists).
             *
             * @param identifier Identifier of the gs_marker
             */
            this.removeGSConnector = function (identifier) {
                var p_key = this.getMarkerKey(
                    this.createConnectorIdentifier(identifier)
                );
                if (this.getScope().paths.hasOwnProperty(p_key)) {
                    delete this.getScope().paths[p_key];
                }
            };

            /**
             * Removes a given GroundStation marker, together with its
             * associated connector path to the server and with the identifier
             * within the servers lists of bounded GroundStations.
             *
             * @param identifier Identifier of the GroundStation whose markers
             *                      are going to be removed
             */
            this.removeGSMarker = function (identifier) {
                var m_key = this.getMarkerKey(identifier);
                delete this.getScope().markers[m_key];
                this.removeGSConnector(identifier);
            };

            /******************************************************************/
            /********************************************* SPACECRAFT MARKERS */
            /******************************************************************/

            this.sc = {};
            this.scLayers = L.layerGroup();
            this.trackLayers = L.layerGroup();

            this.scStyle = {
                autostart: true,
                draggable: false,
                icon: L.icon({
                    iconUrl: '/images/sc-icon-2.svg',
                    iconSize: [15, 15]
                })
            };

            this.trackStyle = {
                weight: 1,
                opacity: 0.725,
                steps: _GEOLINE_STEPS
            };

            this.colors = [
                //'#57EF1E', '#47DE2D', '#37CD3C', '#27BC4B', '#17AB5A'
                //'#00DFFC', '#00B4CC', '#008C9E', '#005F6B',
                //'#00ABAF', '#74FF60', '#499F3C', '#2C6024'
                '#003366'
                /*
                '#000033', '#003333', '#006633', '#009933', '#00CC33',
                '#00FF33', '#000066', '#003366', '#006666', '#009966',
                '#00CC66' '#00FF66'
                */
            ];
            this.color_n = 0;

            /**
             * Pans the current view of the map to the coordinates of the marker
             * for the given spacecraft.
             * 
             * @param spacecraft_id Identifier of the spacecraft
             */
            this.panToSCMarker = function (sc_id) {

                if (!sc_id) {
                    throw '@panToSCMarker: no SC identifier provided';
                }
                if (!(sc_id in this.sc)) {
                    throw '@panToSCMarker: no SC marker for <' + sc_id + '>';
                }

                var sc_marker = this.sc[sc_id],
                    m_ll = sc_marker.marker.getLatLng();
                return this.panTo(m_ll);

            };


            /**
             * Function that reads the RAW groundtrack from the server and
             * transforms it into a usable one for the JS client.
             *
             * @param groundtrack RAW groundtrack from the server
             * @returns {{durations: Array, positions: Array, geopoints: Array}}
             */
            this.readTrack = function (groundtrack) {

                var i, gt_i,
                    positions = [],
                    durations = [],
                    geopoints = [],
                    first = true,
                    valid = false,
                    t0 = Date.now() * 1000,
                    tf = moment().add(
                        _SIM_DAYS,
                        "days"
                    ).toDate().getTime() * 1000;

                if ((groundtrack === null) || (groundtrack.length === 0)) {
                    throw '@readTrack: empty groundtrack';
                }

                for (i = 0; i < groundtrack.length; i += 1) {

                    gt_i = groundtrack[i];

                    if (gt_i.timestamp < t0) {
                        continue;
                    }
                    if (gt_i.timestamp > tf) {
                        break;
                    }

                    positions.push([gt_i.latitude, gt_i.longitude]);
                    geopoints.push(new L.LatLng(gt_i.latitude, gt_i.longitude));

                    if (first === true) {
                        first = false;
                        continue;
                    }

                    durations.push(
                        (gt_i.timestamp - groundtrack[i - 1].timestamp) / 1000
                    );
                    valid = true;

                }

                if (valid === false) {
                    throw '@readTrack: invalid groundtrack';
                }

                return {
                    durations: durations,
                    positions: positions,
                    geopoints: geopoints
                };

            };

            /**
             * For a given Spacecraft configuration object, it creates the
             * marker for the spacecraft, its associated label and the
             * groundtrack.
             *
             * @param cfg Configuration object
             * @returns {{marker: L.Marker, track: L.polyline}}
             */
            this.createSCMarkers = function (cfg) {

                if (!cfg || !Object.keys(cfg).length) {
                    throw '@createSCMarkers: wrong cfg, no <spacecraft_id>';
                }

                var id = cfg.spacecraft_id,
                    gt,
                    mo = this.scStyle,
                    color = this.colors[this.color_n % this.colors.length];
                this.color_n += 1;
                this.trackStyle.color = color;
                gt = this.readTrack(cfg.groundtrack);

                return {
                    marker: L.Marker.movingMarker(
                        gt.positions,
                        gt.durations,
                        mo
                    ).bindLabel(id, {
                        noHide: true
                    }),
                    track: L.geodesic([gt.geopoints], this.trackStyle)
                };

            };

            /**
             * Adds the markers for the new Spacecraft, this is: the marker for
             * the Spacecraft itself (together with its associated label) and
             * associated groundtrack geoline.
             *
             * @param id Identifier of the Spacecraft
             * @param cfg Configuration for the Spacecraft
             * @returns {{
             *              id: String,
             *              cfg: Object,
             *              marker: m.L.Marker,
             *              track: m.L
             *          }}
             */
            this.addSC = function (id, cfg) {
                if (!id) {
                    throw '@addSC: wrong id';
                }
                if (this.sc.hasOwnProperty(id)) {
                    throw '@addSC: SC Marker already exists, id = ' + id;
                }

                var m = this.createSCMarkers(cfg);
                this.sc[id] = m;
                this.scLayers.addLayer(m.marker);
                this.trackLayers.addLayer(m.track);

                return mapServices.getMainMap().then(function (mapInfo) {
                    m.track.addTo(mapInfo.map);
                    m.marker.addTo(mapInfo.map);
                    return id;
                });

            };

            /**
             * Updates the configuration for a given Spacecraft object.
             *
             * @param id Identifier of the spacecraft.
             * @param cfg Object with the new configuration for the Spacecraft.
             * @returns {String} Identifier of the just-updated Spacecraft.
             */
            this.updateSC = function (id, cfg) {
                if (!id) {
                    throw '@updateSC: no id provided';
                }
                if (!this.sc.hasOwnProperty(id)) {
                    throw '@updateSC: marker <' + id + '> does not exist';
                }

                var self = this;
                this.removeSC(id).then(function (data) {
                    $log.log('@updateSC: marker <' + data + '> removed');
                    self.addSC(id, cfg).then(function (data) {
                        $log.log('@updateSC: marker <' + data + '> added');
                    });
                });

                return id;

            };

            /**
             * Removes all the markers associated with this Spacecraft object.
             *
             * @param id Identifier of the Spacecraft.
             * @returns {String} Spacecraft identifier.
             */
            this.removeSC = function (id) {
                if (!id) {
                    throw '@removeSC: no id provided';
                }
                if (!this.sc.hasOwnProperty(id)) {
                    throw '@removeSC: marker <' + id + '> does not exist';
                }

                var m = this.sc[id];
                this.scLayers.removeLayer(m.marker);
                this.trackLayers.removeLayer(m.track);
                delete this.sc[id];

                return mapServices.getMainMap().then(function (mapInfo) {
                    mapInfo.map.removeLayer(m.marker);
                    mapInfo.map.removeLayer(m.track);
                    return id;
                });

            };

        }
    ]);;/**
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
 * Created by rtubio on 10/28/14.
 */

/** Module definition (empty array is vital!). */
angular.module('snNetworkModels', [
    'snJRPCServices',
    'snMarkerModels'
]).service('serverModels', [
    '$rootScope', '$log', '$location', 'broadcaster', 'satnetRPC',  'markers',

    /**
     * Function that provides the services for handling the markers related to
     * the elements of the network that must be shown on the map.
     * 
     * @param   {Object} $rootScope  Main Angular scope where the map is
     * @param   {Object} Angular     $log service
     * @param   {Object} $location   Angular location service
     * @param   {Object} broadcaster SatNet service to broadcast events
     * @param   {Object} satnetRPC   SatNet service to access RPC methods
     * @param   {Object} markers     SatNet service to handle map markers
     * @returns {Object} Object that offers this service
     */
    function ($rootScope, $log, $location, broadcaster, satnetRPC, markers) {

        /**
         * Function that initializes the listeners that connect this service
         * with the events happening in other places of the application.
         */
        this._initListeners = function () {
            $rootScope.$on(
                broadcaster.KEEP_ALIVE_EVENT,
                function (event, message) {
                    $log.log('ev = ' + event + ', msg = ' + message);
                    satnetRPC.alive().then(function (data) {
                        $log.log('alive! data = ' + JSON.stringify(data));
                    });
                }
            );
        };

        /**
         * Function that initializes a marker for a standalone server on the
         * map.
         * 
         * @returns {Object} Returns the object with the just created marker
         */
        this.initStandalone = function () {
            this._initListeners();
            var identifier = $location.host();
            return satnetRPC.getServerLocation(identifier).then(
                function (data) {
                    return markers.createServerMarker(
                        identifier, data.latitude, data.longitude
                    );
                }
            );
        };

    }
]);;/**
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

/** Module definition . */
angular
    .module('snGroundStationModels', [
        'snBroadcasterServices',
        'snPushServices',
        'snJRPCServices',
        'snMarkerModels'
    ])
    .service('gsModels', [
        '$rootScope', '$q', '$log', 'broadcaster', 'satnetRPC', 'markers',

    /**
     * Service that handles the models for the Ground Stations. All the
     * information concerning the Ground Stations is temporary stored here in
     * this models and should be updated regularly after any change in the
     * network. The reason is that the main storage for the information is the
     * database in the central server.
     *
     * @param   {Object} $rootScope  Main Angular scope for the module
     * @param   {Object} $q          Promises service
     * @param   {Object} broadcaster Application service for broadcasting
     *                             events to other modules of the application
     * @param   {Object} satnetRPC Application service for accessing the RPC
     *                             methods of the central server
     * @param   {Object} markers   Service that handles the markers over the map
     */
    function ($rootScope, $q, $log, broadcaster, satnetRPC, markers) {

            /**
             * Initializes all the GroundStations reading the information from
             * the server. Markers are indirectly initialized.
             * @returns {ng.IPromise<[String]>} Identifier of the read GS.
             */
            this.initAll = function () {
                var self = this;
                return satnetRPC.rCall('gs.list', []).then(function (gss) {
                    return self._initAll(gss);
                });
            };

            /**
             * Initializes all the GroundStations reading the information from
             * the server, for all those that are registered for this LEOP cluster.
             * Markers are indirectly initialized.
             *
             * @returns {Object} Promise that returns the identifier of the Ground
             *                   Station
             */
            this.initAllLEOP = function (leop_id) {
                var self = this,
                    p = [];
                return satnetRPC.rCall('leop.gs.list', [leop_id])
                    .then(function (gss) {
                        angular.forEach(gss.leop_gs_inuse, function (gs) {
                            p.push(self.addGS(gs));
                        });
                        angular.forEach(gss.leop_gs_available, function (gs) {
                            p.push(self.addUnconnectedGS(gs));
                        });
                        return $q.all(p).then(function (gs_ids) {
                            var ids = [];
                            angular.forEach(gs_ids, function (id) {
                                ids.push(id);
                            });
                            return ids;
                        });
                    });
            };

            /**
             * Common and private method for GroundStation initializers.
             *
             * @param list The list of identifiers of the GroundStation objects.
             * @returns {ng.IPromise<[String]>} Identifier of the read GS.
             * @private
             */
            this._initAll = function (list) {
                var self = this,
                    p = [];
                angular.forEach(list, function (gs) {
                    p.push(self.addGS(gs));
                });
                return $q.all(p).then(function (gs_ids) {
                    var ids = [];
                    angular.forEach(gs_ids, function (id) {
                        ids.push(id);
                    });
                    return ids;
                });
            };

            /**
             * Adds a new GroundStation together with its marker, using the
             * configuration object that it retrieves from the server.
             *
             * @param identifier Identififer of the GroundStation to be added.
             * @returns String Identifier of the just-created object.
             */
            this.addGS = function (identifier) {
                return satnetRPC.rCall('gs.get', [identifier]).then(function (data) {
                    return markers.createGSMarker(data);
                });
            };

            /**
             * Adds a new GroundStation together with its marker, using the
             * configuration object that it retrieves from the server. It does not
             * include the connection line with the server.
             *
             * @param identifier Identififer of the GroundStation to be added.
             * @returns String Identifier of the just-created object.
             */
            this.addUnconnectedGS = function (identifier) {
                return satnetRPC.rCall('gs.get', [identifier]).then(
                    function (data) {
                        return markers.createUnconnectedGSMarker(data);
                    }
                );
            };

            /**
             * "Connects" the given groundstation to the server by adding the
             * necessary line.
             * @param identifier Identifier of the gs
             */
            this.connectGS = function (identifier) {
                markers.createGSConnector(identifier);
            };

            /**
             * "Disconnects" the GS marker by removing the line that binds it to
             * the server marker.
             * @param identifier Identifier of the gs
             */
            this.disconnectGS = function (identifier) {
                markers.removeGSConnector(identifier);
            };

            /**
             * Updates the markers for the given GroundStation object.
             * @param identifier Identifier of the GroundStation object.
             */
            this.updateGS = function (identifier) {
                satnetRPC.rCall('gs.get', [identifier]).then(function (data) {
                    return markers.updateGSMarker(data);
                });
            };

            /**
             * Removes the markers for the given GroundStation object.
             * @param identifier Identifier of the GroundStation object.
             */
            this.removeGS = function (identifier) {
                return markers.removeGSMarker(identifier);
            };

            /**
             * Private method that creates the event listeners for this service.
             */
            this.initListeners = function () {

                var self = this;
                $rootScope.$on(broadcaster.GS_ADDED_EVENT, function (event, id) {
                    $log.log(
                        '@on-gs-added-event, event = ' + event + ', id = ' + id
                    );
                    self.addGS(id);
                });
                $rootScope.$on(broadcaster.GS_REMOVED_EVENT, function (event, id) {
                    $log.log(
                        '@on-gs-removed-event, event = ' + event + ', id = ' + id
                    );
                    self.removeGS(id);
                });
                $rootScope.$on(broadcaster.GS_UPDATED_EVENT, function (event, id) {
                    $log.log(
                        '@on-gs-updated-event, event = ' + event + ', id = ' + id
                    );
                    self.updateGS(id);
                });
                $rootScope.$on(broadcaster.LEOP_GS_ASSIGNED_EVENT, function (event, id) {
                    $log.log(
                        '@on-gs-assigned-event, event = ' + event + ', id = ' + id
                    );
                    self.connectGS(id);
                });
                $rootScope.$on(broadcaster.LEOP_GS_RELEASED_EVENT, function (event, id) {
                    $log.log(
                        '@on-gs-released-event, event = ' + event + ', id = ' + id
                    );
                    self.disconnectGS(id);
                });
                $rootScope.$on(broadcaster.GS_AVAILABLE_ADDED_EVENT, function (event, id) {
                    $log.log(
                        '@on-gs-added-event, event = ' + event + ', id = ' + id
                    );
                    self.addUnconnectedGS(id);
                });
                $rootScope.$on(broadcaster.GS_AVAILABLE_REMOVED_EVENT, function (event, id) {
                    $log.log(
                        '@on-gs-removed-event, event = ' + event + ', id = ' + id
                    );
                    self.removeGS(id);
                });
                $rootScope.$on(broadcaster.GS_AVAILABLE_UPDATED_EVENT, function (event, id) {
                    $log.log(
                        '@on-gs-updated-event, event = ' + event + ', id = ' + id
                    );
                    self.updateGS(id);
                });

            };

    }
]);;/**
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
 * Created by rtubio on 10/28/14.
 */

/** Module definition (empty array is vital!). */
angular.module('snSpacecraftModels', [
    'snBroadcasterServices',
    'snJRPCServices',
    'snMarkerModels'
])
.service('scModels', [
    '$rootScope', '$log', '$q', 'broadcaster', 'satnetRPC', 'markers',
    function ($rootScope, $log, $q, broadcaster, satnetRPC, markers) {

        /**
         * Initializes all the configuration objects for the available
         * spacecraft.
         * @returns {ng.IPromise<[String]>} Identifier of the read SC.
         */
        this.initAll = function () {
            var self = this;
            return satnetRPC.rCall('sc.list', []).then(function (scs) {
                var p = [];
                angular.forEach(scs, function (sc) { p.push(self.addSC(sc)); });
                return $q.all(p).then(function (sc_ids) {
                    return sc_ids;
                });
            });
        };

        /**
         * Initializes all the configuration objects for the available
         * spacecraft.
         * @returns {ng.IPromise<[String]>} Identifier of the read SC.
         */
        this.initAllLEOP = function () {
            var self = this;
            return satnetRPC.rCall('leop.sc.list', [$rootScope.leop_id])
                .then(function (scs) {
                    var p = [];
                    angular.forEach(scs, function (sc) {
                        p.push(self.addSC(sc));
                    });
                    return $q.all(p).then(function (sc_ids) {
                        return sc_ids;
                    });
                });
        };

        /**
         * Adds a new Spacecraft together with its marker, using the
         * configuration object that it retrieves from the server.
         * @param identifier Identififer of the Spacecraft to be added.
         */
        this.addSC = function (identifier) {
            return satnetRPC.readSCCfg(identifier).then(function (data) {
                return markers.addSC(identifier, data);
            });
        };

        /**
         * Updates the configuration for a given Spacecraft.
         * @param identifier The identifier of the Spacecraft.
         */
        this.updateSC = function (identifier) {
            return satnetRPC.readSCCfg(identifier).then(function (data) {
                return markers.updateSC(identifier, data);
            });
        };

        /**
         * Removes the markers for the given Spacecraft.
         * @param identifier The identifier of the Spacecraft.
         */
        this.removeSC = function (identifier) {
            return markers.removeSC(identifier).then(function (data) {
                return data;
            });
        };

        /**
         * Private method that inits the event listeners for this service.
         */
        this.initListeners = function () {
            var self = this;
            $rootScope.$on(broadcaster.SC_ADDED_EVENT, function (event, id) {
                $log.log(
                    '@on-sc-added-event, event = ' + event + ', id = ' + id
                );
                self.addSC(id);
            });
            $rootScope.$on(broadcaster.SC_UPDATED_EVENT, function (event, id) {
                $log.log(
                    '@on-sc-updated-event, event = ' + event + ', id = ' + id
                );
                self.updateSC(id);
            });
            $rootScope.$on(broadcaster.SC_REMOVED_EVENT, function (event, id) {
                $log.log(
                    '@on-sc-removed-event, event = ' + event + ', id = ' + id
                );
                self.removeSC(id);
            });
        };

    }
]);;/*
   Copyright 2015 Ricardo Tubio-Pardavila

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

angular.module('snAboutDirective', [
    'ngMaterial'
])
    .controller('snAboutDlgCtrl', ['$scope', '$mdDialog',

        /**
         * Controller function for handling the SatNet about dialog itself.
         *
         * @param {Object} $scope $scope for the controller.
         */
        function ($scope, $mdDialog) {

            /**
             * Function that closes the dialog.
             */
            $scope.closeDialog = function () {
                $mdDialog.hide();
            };

        }

    ])
    .controller('snAboutCtrl', ['$scope', '$mdDialog',

        /**
         * Controller function for opening the SatNet About dialog.
         *
         * @param {Object} $scope    $scope for the controller.
         * @param {Object} $mdDialog Angular material Dialog service.
         */
        function ($scope, $mdDialog) {

            /**
             * Function that opens the dialog when the snAbout button is
             * clicked.
             */
            $scope.openSnAbout = function () {
                $mdDialog.show({
                    templateUrl: 'common/templates/sn-about-dialog.html'
                });
            };

        }

    ])
    .directive('snAbout',

        /**
         * Function that creates the directive itself returning the object
         * required by Angular.
         *
         * @returns {Object} Object directive required by Angular, with
         *                   restrict and templateUrl.
         */
        function () {
            return {
                restrict: 'E',
                templateUrl: 'common/templates/sn-about.html'
            };
        }

    );;/*
   Copyright 2014 Ricardo Tubio-Pardavila

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

angular.module('snSplashDirective', []).directive('mAppLoading', ['$animate',

    /**
     * This function implements the controller.
     *
     * This CSS class-based directive controls the pre-bootstrap loading screen.
     * By default, it is visible on the screen; but, once the application loads,
     * we'll fade it out and remove it from the DOM.
     *
     * @param   {Object} $animate $animate service.
     * @returns {Object} Object with the description of the directive.
     */
    function ($animate) {

        /**
         * This function links the just created CSS class-like directive in
         * order to control the end of the animation. Once the animation is
         * over, it removes itself from the DOM tree.
         *
         * Due to the way AngularJS prevents animation during the bootstrap
         * of the application, we can't animate the top-level container;
         * but, since we added "ngAnimateChildren", we can animated the
         * inner container during this phase.
         * --
         * NOTE: Am using .eq(1) so that we don't animate the Style block.
         *
         * @param {Object} scope      The scope for this directive.
         * @param {Object} element    The parent element from the DOM tree.
         * @param {Object} attributes Object with the attributes of the
         *                            element.
         */
         var link = function (scope, element, attributes) {

            $animate.leave(element.children().eq(1)).then(
                function cleanupAfterAnimation() {
                    element.remove();
                    scope = element = attributes = null;
                }
            );

        };

        return ({
            link: link,
            restrict: "C"
        });

    }]);;/*
   Copyright 2014 Ricardo Tubio-Pardavila

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

angular.module(
        'snChannelControllers', [
        'ngMaterial',
        'snJRPCServices',
        'snControllers'
    ]
)
.constant('RPC_GS_PREFIX', 'gs')
.constant('RPC_SC_PREFIX', 'sc')
.controller('channelListCtrl', [
    '$scope', '$log', '$mdDialog',
    'satnetRPC', 'snDialog',
    'RPC_GS_PREFIX', 'RPC_SC_PREFIX',
    'segmentId', 'isSpacecraft',

    /**
     * Controller for the list of the channels for this given segment (either
     * a Ground Station or a Spacecraft).
     *
     * @param {Object}  $scope          $scope for the Angular controller
     * @param {Object}  $log            Angular JS $log service
     * @param {Object}  $mdDialog       Angular Material $mdDialog service
     * @param {Object}  satnetRPC       Satnet RPC service
     * @param {Object}  snDialog        Satnet Dialog service
     * @param {String}  RPC_GS_PREFIX   Prefix for the Ground Station services
     * @param {String}  RPC_SC_PREFIX   Prefix for the Spacecraft services
     * @param {String}  segmentId       Identifier of the segment
     * @param {Boolean} isSpacecraft    Flag that defines the type of segment
     */
    function (
            $scope, $log, $mdDialog,
            satnetRPC, snDialog,
            RPC_GS_PREFIX, RPC_SC_PREFIX,
            segmentId, isSpacecraft
        ) {

            $scope.channelList = [];

            $scope.uiCtrl = {
                segmentId: segmentId,
                isSpacecraft: isSpacecraft,
                rpc_prefix: RPC_GS_PREFIX,
                channelDlgTplUrl: 'operations/templates/channels/dialog.html'
            };

            /**
             * Function that triggers the opening of a window to add a new
             * channel associated with a given segment.
             */
            $scope.showAddDialog = function () {
                $mdDialog.show({
                    templateUrl: $scope.uiCtrl.channelDlgTplUrl,
                    controller: 'channelDialogCtrl',
                    locals: {
                        segmentId: $scope.uiCtrl.segmentId,
                        channelId: '',
                        isSpacecraft: $scope.uiCtrl.isSpacecraft,
                        isEditing: false
                    }
                });
            };

            /**
             * Function that handles the display of the Dialog that permits the
             * edition of the channels.
             *
             * @param {String} channelId Identifier of the channel
             */
            $scope.showEditDialog = function (channelId) {
                $mdDialog.show({
                    templateUrl: $scope.uiCtrl.channelDlgTplUrl,
                    controller: 'channelDialogCtrl',
                    locals: {
                        segmentId: $scope.uiCtrl.segmentId,
                        channelId: channelId,
                        isSpacecraft: $scope.uiCtrl.isSpacecraft,
                        isEditing: true
                    }
                });
            };

            /**
             * Function that handles the removal of the specific channel for the
             * given segment.
             *
             * @param {String} channelId Identifier of the channel
             */
            $scope.delete = function (channelId) {
                var rpc_service = $scope.uiCtrl.rpc_prefix + '.channel.delete';
                satnetRPC.rCall(
                    rpc_service, [$scope.uiCtrl.segmentId, channelId]
                ).then(
                    function (results) {
                        // TODO broadcaster.channelRemoved(gs_id, channelId);
                        snDialog.success(rpc_service, channelId, results, null);
                        $scope.refresh();
                    }
                ).catch(
                    function (cause) {
                        snDialog.exception(rpc_service, channelId, cause);
                    }
                );
            };

            /**
             * Function that refreshes the list of registered ground stations.
             */
            $scope.refresh = function () {
                var rpc_service = $scope.uiCtrl.rpc_prefix + '.channel.list';
                satnetRPC.rCall(rpc_service, [$scope.uiCtrl.segmentId]).then(
                    function (results) {
                        if (results !== null) {
                            $scope.channelList = results.slice(0);
                        }
                    }
                ).catch(
                    function (cause) {
                        snDialog.exception(rpc_service, '-', cause);
                    }
                );
            };

            /**
             * Function that initializes the list of ground stations that are to be
             * displayed. This initialization function checks whether the Dialog is
             * suppose to display the channel list for a Spacecraft or a Ground
             * Station in order to call the proper JRPC method.
             */
            $scope.init = function () {
                if ($scope.uiCtrl.isSpacecraft === true) {
                    $scope.uiCtrl.rpc_prefix = RPC_SC_PREFIX;
                }
                $scope.refresh();
            };

    }

]).controller('channelDialogCtrl', [
    '$log', '$scope', '$mdDialog', '$mdToast',
    'broadcaster', 'satnetRPC', 'snDialog',
    'RPC_GS_PREFIX', 'RPC_SC_PREFIX',
    'segmentId', 'channelId', 'isSpacecraft', 'isEditing',

    /**
     * Controller for the dialog that allows users to create and edit the
     * configuration for a given channel.
     *
     * @param {Object}  $log          Angular JS $log service
     * @param {Object}  $scope        Angular JS $scope service
     * @param {Object}  $mdDialog     Angular Material $mdDialog service
     * @param {Object}  $mdToast      Angular Material $mdToast service
     * @param {Object}  broadcaster   SatNet event broadcaster
     * @param {Object}  satnetRPC     SatNet RPC service
     * @param {Object}  snDialog      SatNet Dialog service
     * @param {String}  RPC_GS_PREFIX Prefix for the GS RPC services
     * @param {String}  RPC_SC_PREFIX Prefix for the SC RPC services
     * @param {String}  segmentId     Identifier of the segment
     * @param {String}  channelId     Identifier of the channel
     * @param {Boolean} isSpacecraft  Flag that indicates the type of segment
     * @param {Boolean} isEditing     Flag that indicates the type of dialog
     */
    function (
        $log, $scope, $mdDialog, $mdToast,
        broadcaster, satnetRPC, snDialog,
        RPC_GS_PREFIX, RPC_SC_PREFIX,
        segmentId, channelId, isSpacecraft, isEditing
    ) {

        $scope.gsCfg = {
            identifier: channelId,
            band: '',
            automated: false,
            modulations: [],
            polarizations: [],
            bitrates: [],
            bandwidths: []
        };
        $scope.scCfg = {
            identifier: channelId,
            frequency: 0.0,
            modulation: '',
            polarization: '',
            bitrate: '',
            bandwidth: ''
        };

        $scope.uiCtrl = {
            add: {
                disabled: true
            },
            segmentId: segmentId,
            isSpacecraft: isSpacecraft,
            editing: isEditing,
            rpcPrefix: RPC_GS_PREFIX,
            listTplUrl: 'operations/templates/channels/list.html',
            configuration: $scope.gsCfg,
            options: {
                bands: [],
                modulations: [],
                polarizations: [],
                bandwidths: []
            }
        };

        /**
         * Function that handles the creation of a new channel as part of the
         * selected segment.
         */
        $scope.add = function () {
            var rpc_service = $scope.uiCtrl.rpcPrefix + '.channel.add';
            satnetRPC.rCall(rpc_service, [
                $scope.uiCtrl.segmentId,
                $scope.configuration.identifier,
                $scope.configuration
            ]).then(
                function (results) {
                    // TODO broadcaster.channelAdded(segmentId, channelId);
                    snDialog.success(
                        $scope.uiCtrl.segmentId, results, $scope.listTplUrl
                    );
                }
            ).catch(
                function (cause) {
                    snDialog.exception(rpc_service, '-', cause);
                }
            );
        };

        /**
         * Function that handles the update of the configuration for the channel
         * of the selected segment.
         */
        $scope.update = function () {
            var rpc_service = $scope.uiCtrl.rpcPrefix + '.channel.update';
            satnetRPC.rCall(rpc_service, [
                $scope.uiCtrl.segmentId,
                $scope.configuration.identifier,
                $scope.configuration
            ]).then(
                function (results) {
                    // TODO broadcaster.channelAdded(segmentId, channelId);
                    snDialog.success(
                        $scope.uiCtrl.segmentId, results, $scope.listTplUrl
                    );
                }
            ).catch(
                function (cause) {
                    snDialog.exception(rpc_service, '-', cause);
                }
            );
        };

        /**
         * Function that closes the current dialog and goes back to the
         * original list.
         */
        $scope.cancel = function () {
            $mdDialog.hide();
            $mdDialog.show({
                templateUrl: $scope.listTplUrl
            });
        };

        /**
         * Initializes the Dialog with the correct values. It handles the self
         * configuration and detection of the mode in which the Dialog should
         * operate, either for adding a new channel to any segment or to update
         * the configuration of that given channel.
         */
        $scope.init = function () {
            if (!segmentId) {
                throw '@channelDialogCtrl: no segment identifier provided';
            }
            if ($scope.uiCtrl.isSpacecraft === true) {
                $scope.uiCtrl.rpcPrefix = RPC_SC_PREFIX;
                $scope.uiCtrl.configuration = $scope.scCfg;
            }
            if (isEditing === null) {
                throw '@channelDialogCtrl: no editing flag provided';
            }
            if ($scope.uiCtrl.isEditing === true) {
                if (!channelId) {
                    throw '@channelDialogCtrl: no channel identifier provided';
                }
                $scope.loadConfiguration();
            }
            $scope.loadOptions();
        };

        /**
         * Function that loads the configuration of the object to be edited.
         */
        $scope.loadConfiguration = function () {
            var rpc_service = $scope.uiCtrl.rpcPrefix + 'channel.get';
            satnetRPC.rCall(rpc_service, []).then(
                function (results) {
                    if ($scope.uiCtrl.isSpacecraft === true) {
                        $scope.scCfg = angular.copy(results);
                    } else {
                        $scope.gsCfg = angular.copy(results);
                    }
                }
            ).catch(
                function (cause) {
                    snDialog.exception(rpc_service, '-', cause);
                }
            );
        };

        /**
         * Function that loads the options for creating the channels.
         */
        $scope.loadOptions =  function () {
            var rpc_service = 'channels.options';
            satnetRPC.rCall(rpc_service, []).then(
                function (results) {
                    $scope.uiCtrl.options = angular.copy(results);
                }
            ).catch(
                function (cause) {
                    snDialog.exception(rpc_service, '-', cause);
                }
            );
        };
            
    }

]);;/*
   Copyright 2014 Ricardo Tubio-Pardavila

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

angular.module(
    'snGsControllers', [
        'ngMaterial',
        'remoteValidation',
        'leaflet-directive',
        'snBroadcasterServices',
        'snJRPCServices',
        'snControllers',
        'snChannelControllers',
        'snMapServices'
    ]
).controller('gsListCtrl', [
    '$log', '$scope', '$mdDialog', '$mdToast',
    'broadcaster', 'satnetRPC', 'snDialog',

    /**
     * Controller of the list with the Ground Stations registered for a given
     * user. This controller takes care of initializing the list and of
     * updating it whenever it is necessary through the SatNet RPC available
     * service.
     *
     * @param {Object} $scope Controller execution scope.
     */
    function (
        $log, $scope, $mdDialog, $mdToast, broadcaster, satnetRPC, snDialog
    ) {

        $scope.gsList = [];

        /**
         * Function that triggers the opening of a window to add a new ground
         * station into the system.
         */
        $scope.showAddDialog = function () {
            $mdDialog.show({
                templateUrl: 'operations/templates/gs/dialog.html',
                controller: 'gsDialogCtrl',
                locals: {
                    identifier: '',
                    isEditing: false
                }
            });
        };

        /**
         * Controller function that shows the dialog for editing the properties
         * of a given Ground Station.
         *
         * @param {String} identifier Identifier of the Ground Station
         */
        $scope.showEditDialog = function (identifier) {
            $mdDialog.show({
                templateUrl: 'operations/templates/gs/dialog.html',
                controller: 'gsDialogCtrl',
                locals: {
                    identifier: identifier,
                    isEditing: true
                }
            });
        };

        /**
         * Function that triggers the opening of a window to add a new
         * Availability Rule to this Ground Station.
         * 
         * @param {String} identifier Identifier of the Ground Station
         */
        $scope.showChannelList = function (identifier) {
            $mdDialog.show({
                templateUrl: 'operations/templates/channels/list.html',
                controller: 'channelListCtrl',
                locals: {
                    segmentId: identifier,
                    isSpacecraft: false
                }
            });
        };

        /**
         * Controller function that removes the given Ground Station from the
         * database in the remote server upon user request. It first asks for
         * confirmation before executing this removal.
         *
         * @param {String} identifier Identifier of the Ground Station
         */
        $scope.delete = function (identifier) {
            satnetRPC.rCall('gs.delete', [identifier]).then(function (results) {
                broadcaster.gsRemoved(identifier);
                snDialog.success('gs.delete', identifier, results, null);
                $scope.refresh();
            }).catch(function (cause) {
                snDialog.exception('gs.delete', identifier, cause);
            });
        };

        /**
         * Function that refreshes the list of registered ground stations.
         */
        $scope.refresh = function () {
            satnetRPC.rCall('gs.list', []).then(function (results) {
                if (results !== null) {
                    $scope.gsList = results.slice(0);
                }
            }).catch(function (cause) {
                snDialog.exception('gs.list', '-', cause);
            });
        };

        /**
         * Function that initializes the list of ground stations that are to be
         * displayed.
         */
        $scope.init = function () {
            $scope.refresh();
        };

    }

]).controller('gsDialogCtrl', [
    '$log', '$scope', '$mdDialog', '$mdToast',
    'broadcaster', 'satnetRPC', 'snDialog',
    'mapServices', 'LAT', 'LNG', 'ZOOM_SELECT',
    'identifier', 'editing',

    /**
     * Controller of the dialog used to add a new Ground Station. This dialog
     * provides all the required controls as for gathering all the information
     * about the new element for the database.
     *
     * @param {Object} $scope Controller execution scope.
     */
    function (
        $log, $scope, $mdDialog, $mdToast,
        broadcaster, satnetRPC, snDialog,
        mapServices, LAT, LNG, ZOOM_SELECT,
        identifier, editing
    ) {

        if (!identifier) {
            identifier = '';
        }
        if (!editing) {
            editing = false;
        }

        $scope.configuration = {
            identifier: identifier,
            callsign: '',
            elevation: 0.0
        };
        $scope.uiCtrl = {
            add: {
                disabled: true
            },
            editing: editing
        };

        $scope.center = {};
        $scope.markers = {
            gs: {
                lat: 0,
                lng: 0,
                message: "Drag me to your GS!",
                draggable: true,
                focus: false
            }
        };
        $scope.events = {};

        $scope.listTplUrl = 'operations/templates/gs/list.html';

        /**
         * Function that triggers the opening of a window to add a new Ground
         * Station into the system.
         */
        $scope.add = function () {

            var gs_cfg = [
                $scope.configuration.identifier,
                $scope.configuration.callsign,
                $scope.configuration.elevation.toFixed(2),
                $scope.markers.gs.lat.toFixed(6),
                $scope.markers.gs.lng.toFixed(6)
            ];

            satnetRPC.rCall('gs.add', gs_cfg).then(
                function (results) {
                    var gs_id = results.groundstation_id;
                    broadcaster.gsAdded(gs_id);
                    snDialog.success(gs_id, results, $scope.listTplUrl);
                },
                function (cause) {
                    snDialog.exception('gs.add', '-', cause);
                }
            );

        };

        /**
         * Function that saves the just edited ground station object within
         * the remote server.
         */
        $scope.update = function () {

            var cfg = {
                groundstation_id: identifier,
                groundstation_callsign: $scope.configuration.callsign,
                groundstation_elevation: $scope.configuration.elevation.toFixed(2),
                groundstation_latlon: [
                    $scope.markers.gs.lat.toFixed(6),
                    $scope.markers.gs.lng.toFixed(6)
                ]
            };

            satnetRPC.rCall('gs.update', [identifier, cfg]).then(
                function (gs_id) {
                    broadcaster.gsUpdated(gs_id);
                    snDialog.success(gs_id, gs_id, $scope.listTplUrl);
                },
                function (cause) {
                    snDialog.exception('gs.update', '-', cause);
                }
            );

        };

        /**
         * Function that handles the behavior of the modal dialog once the user
         * cancels the operation of adding a new Ground Station.
         */
        $scope.cancel = function () {
            $mdDialog.hide();
            $mdDialog.show({
                templateUrl: $scope.listTplUrl
            });
        };

        /**
         * Generic method that initializes the Ground Station dialog discerning
         * whether this is going to be used either for adding a new Ground
         * Station or for editing an existing one. It also carries out all the
         * common initialization tasks that have to be executed for both.
         */
        $scope.init = function () {

            angular.extend($scope.events, {
                markers: ['dragend']
            });

            $scope.$on("leafletDirectiveMarker.dragend",
                function (event, args) {
                    $scope.markers.gs.lat = args.model.lat;
                    $scope.markers.gs.lng = args.model.lng;
                }
            );

            if (editing) {
                $scope.loadConfiguration();
            } else {
                $scope.initConfiguration();
            }

        };

        /**
         * Function that initializes this controller by correctly setting up
         * the markers and the position (lat, lng, zoom) of the map. This init
         * method must be invoked only when creating a dialog that requires the
         * user to input all the information about the Ground Station; this is,
         * a dialog for adding a "new" Ground Station.
         */
        $scope.initConfiguration = function () {

            satnetRPC.getUserLocation().then(function (location) {

                angular.extend($scope.center, {
                    lat: location.latitude,
                    lng: location.longitude,
                    zoom: ZOOM_SELECT
                });

                $scope.markers.gs.lat = location.latitude;
                $scope.markers.gs.lng = location.longitude;
                $scope.markers.gs.focus = true;

            });

        };

        /**
         * Function that initializes this controller by correctly setting up
         * the markers and the position (lat, lng, zoom) of the map. It loads
         * all the configuration for the Ground Station from the remote server.
         * Therefore, this initialization function must be used to initialize a
         * Ground Station dialog for editing the configuration of an existant
         * Ground Station.
         */
        $scope.loadConfiguration = function () {

            mapServices.centerAtGs($scope, identifier, 8).then(function (gs) {

                $scope.configuration.identifier = gs.groundstation_id;
                $scope.configuration.callsign = gs.groundstation_callsign;
                $scope.configuration.elevation = gs.groundstation_elevation;

                $scope.markers.gs.focus = true;
                $scope.markers.gs.message = "Drag me to your GS!";
                $scope.markers.gs.draggable = true;

            });

        };

    }

]);;/*
   Copyright 2014 Ricardo Tubio-Pardavila

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

angular.module('snOperationsMenuControllers', [
    'ngMaterial'
])
.controller('operationsMenuCtrl', [
    '$scope', '$mdSidenav', '$mdDialog',

    /**
     * Controller of the menu for the Operations application. It creates a
     * function bound to the event of closing the menu that it controls and
     * a flag with the state (open or closed) of that menu.
     *
     * @param   {Object} $scope Controller execution scope.
     * @param   {Object} $mdSidenav Side mane service from Angular Material.
     */
    function ($scope, $mdSidenav, $mdDialog) {

        /**
         * Handler to close the menu that actually takes the user out of the
         * application.
         */
        $scope.close = function () {
            $mdSidenav("menu").close();
        };

        /**
         * Handler to open the dialog for managing the ground stations.
         */
        $scope.showGsMenu = function () {
            $mdDialog.show({
                templateUrl: 'operations/templates/gs/list.html'
            });
        };

        /**
         * Handler to open the dialog for managing the spacecraft.
         */
        $scope.showScMenu = function () {
            $mdDialog.show({
                templateUrl: 'operations/templates/sc/list.html'
            });
        };
        
    }

]);;/*
   Copyright 2014 Ricardo Tubio-Pardavila

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

angular.module(
    'snRuleControllers', [
        'ngMaterial',
        'snJRPCServices',
        'snControllers'
    ]
).controller('ruleListCtrl', [
    '$scope', '$log', '$mdDialog', 'satnetRPC', 'snDialog', 'identifier',
    
    function($scope, $log, $mdDialog, satnetRPC, snDialog, identifier) {

        $scope.gsId = identifier;
        $scope.ruleList = [];
        $scope.ruleDlgTplUrl = 'operations/templates/rules/dialog.html';

        /**
         * Function that refreshes the list of registered ground stations.
         */
        $scope.refresh = function () {
            satnetRPC.rCall('rules.list', [$scope.gsId]).then(
                function (results) {
                    if (results !== null) {
                        $scope.ruleList = results.slice(0);
                    }
                }
            ).catch(
                function (cause) {
                    snDialog.exception('rules.list', '-', cause);
                }
            );
        };

        /**
         * Function that initializes the list of ground stations that are to be
         * displayed.
         */
        $scope.init = function () {
            $scope.refresh();
        };

    }

]);;/*
   Copyright 2015 Ricardo Tubio-Pardavila

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

angular.module(
    'snScControllers', [
        'ngMaterial',
        'remoteValidation',
        'leaflet-directive',
        'snBroadcasterServices',
        'snMapServices',
        'snControllers',
        'snCelestrakServices'
    ]
).controller('scListCtrl', [
    '$log', '$scope', '$mdDialog', '$mdToast',
    'broadcaster', 'satnetRPC', 'snDialog',

    /**
     * Controller of the list with the Ground Stations registered for a given
     * user. This controller takes care of initializing the list and of
     * updating it whenever it is necessary through the SatNet RPC available
     * service.
     *
     * @param {Object} $scope Controller execution scope.
     */
    function (
        $log, $scope, $mdDialog, $mdToast, broadcaster, satnetRPC, snDialog
    ) {

        $scope.scList = [];

        /**
         * Function that triggers the opening of a window to add a new ground
         * station into the system.
         */
        $scope.showAddDialog = function () {
            $mdDialog.show({
                templateUrl: 'operations/templates/sc/dialog.html',
                controller: 'scDialogCtrl',
                locals: {
                    identifier: '',
                    editing: false
                }
            });
        };

        /**
         * Controller function that shows the dialog for editing the properties
         * of a given Spacecraft.
         *
         * @param {String} identifier Identifier of the Spacecraft
         */
        $scope.showEditDialog = function (identifier) {
            $mdDialog.show({
                templateUrl: 'operations/templates/sc/dialog.html',
                controller: 'scDialogCtrl',
                locals: {
                    identifier: identifier,
                    editing: true
                }
            });
        };

        /**
         * Function that triggers the opening of a window to add a new
         * Availability Rule to this Spacecraft.
         * 
         * @param {String} identifier Identifier of the Spacecraft
         */
        $scope.showChannelList = function (identifier) {
            $mdDialog.show({
                templateUrl: 'operations/templates/channels/list.html',
                controller: 'channelListCtrl',
                locals: {
                    segmentId: identifier,
                    isSpacecraft: true
                }
            });
        };

        /**
         * Controller function that removes the given Spacecraft from the
         * database in the remote server upon user request. It first asks for
         * confirmation before executing this removal.
         *
         * @param {String} identifier Identifier of the Spacecraft
         */
        $scope.delete = function (identifier) {

            satnetRPC.rCall('sc.delete', [identifier]).then(function (results) {
                broadcaster.scRemoved(identifier);
                snDialog.success('sc.delete', identifier, results, null);
                $scope.refresh();
            }).catch(function (cause) {
                snDialog.exception('sc.delete', identifier, cause);
            });

        };

        /**
         * Function that refreshes the list of registered spacecraft.
         */
        $scope.refresh = function () {
            satnetRPC.rCall('sc.list', []).then(function (results) {
                if (results !== null) {
                    $scope.scList = results.slice(0);
                }
            }).catch(function (cause) {
                snDialog.exception('sc.list', '-', cause);
            });
        };

        /**
         * Function that initializes the list of ground stations that are to be
         * displayed.
         */
        $scope.init = function () {
            $scope.refresh();
        };

    }

]).controller('scDialogCtrl', [
    '$log', '$scope', '$mdDialog', '$mdToast',
    'broadcaster', 'satnetRPC', 'celestrak', 'snDialog',
    'mapServices', 'LAT', 'LNG', 'ZOOM_SELECT',
    'identifier', 'editing',

    /**
     * Controller of the dialog used to add a new Ground Station. This dialog
     * provides all the required controls as for gathering all the information
     * about the new element for the database.
     *
     * @param {Object} $scope Controller execution scope.
     */
    function (
        $log, $scope, $mdDialog, $mdToast,
        broadcaster, satnetRPC, celestrak, snDialog,
        mapServices, LAT, LNG, ZOOM_SELECT,
        identifier, editing
    ) {

        if (!identifier) {
            identifier = '';
        }
        if (!editing) {
            editing = false;
        }

        $scope.configuration = {
            identifier: identifier,
            callsign: '',
            tle_group: '',
            tle: ''
        };
        $scope.uiCtrl = {
            add: {
                disabled: true
            },
            editing: editing,
            tle_groups: celestrak.CELESTRAK_SELECT_SECTIONS,
            tles: []
        };

        $scope.listTemplateUrl = 'operations/templates/sc/list.html';

        /**
         * Function that updates the list of selectable TLE's once the group
         * has changed in the other select control.
         */
        $scope.updateTles = function () {
            if (!$scope.configuration.tle_group) {
                return;
            }
            satnetRPC.rCall('tle.celestrak.getResource', [
                $scope.configuration.tle_group.subsection
            ]).then(function (tles) {
                $scope.uiCtrl.tles = tles.tle_list.slice(0);
            });
        };

        /**
         * Function that triggers the opening of a window to add a new
         * Spacecraft into the system.
         */
        $scope.add = function () {

            var cfg = [
                $scope.configuration.identifier,
                $scope.configuration.callsign,
                $scope.configuration.tle.spacecraft_tle_id
            ];

            satnetRPC.rCall('sc.add', cfg).then(
                function (response) {
                    var id = response.spacecraft_id;
                    broadcaster.scAdded(id);
                    snDialog.success(
                        'sc.add', id, response, $scope.listTemplateUrl
                    );
                },
                function (cause) {
                    snDialog.exception('sc.add', '-', cause);
                }
            );

        };

        /**
         * Function that saves the just edited spacecraft object in the remote
         * server.
         */
        $scope.update = function () {

            var cfg = {
                'spacecraft_id': identifier,
                'spacecraft_callsign': $scope.configuration.callsign,
                'spacecraft_tle_id': $scope.configuration.tle.spacecraft_tle_id
            };

            satnetRPC.rCall('sc.update', [identifier, cfg]).then(
                function (response) {
                    broadcaster.scUpdated(response);
                    snDialog.success(
                        'sc.update', response, response, $scope.listTemplateUrl
                    );
                },
                function (cause) {
                    snDialog.exception('sc.update', '-', cause);
                }
            );

        };

        /**
         * Function that handles the behavior of the modal dialog once the user
         * cancels the operation of adding a new Ground Station.
         */
        $scope.cancel = function () {
            $mdDialog.hide();
            $mdDialog.show({
                templateUrl: $scope.listTemplateUrl
            });
        };

        /**
         * Generic method that initializes the Spacecraft dialog discerning
         * whether this is going to be used either for adding a new Spacecraft
         * or for editing an existing one. It also carries out all the common
         * initialization tasks that have to be executed for both.
         */
        $scope.init = function () {

            if (editing) {
                satnetRPC.rCall('sc.get', [identifier]).then(function (data) {
                    $scope.configuration.identifier = identifier;
                    $scope.configuration.callsign = data.spacecraft_callsign;
                    $scope.configuration.savedTleId = data.spacecraft_tle_id;
                });
            }

        };

    }

]);;/**
 * Copyright 2015 Ricardo Tubio-Pardavila
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
 * Created by rtubio on 15/05/15.
 */

angular.module('snOperationsMap', [
    'snMapServices',
    'snMarkerModels',
    'snGroundStationModels',
    'snSpacecraftModels',
    'snNetworkModels'
])
    .controller('mapCtrl', [
        '$log', '$scope',
        'mapServices', 'markers', 'gsModels', 'scModels', 'serverModels',
        'ZOOM',

        /**
         * Main controller for the map directive. It should be in charge of all
         * the additional controls and/or objects that are overlayed over the
         * original map. The main control of the map should be written in
         * re-usable functions within the 'mapServices' object.
         *
         * @param {Object} $scope      $scope for the controller.
         * @param {Object} mapServices Service with the custom functions to
         *                             control the maps object.
         */
        function (
            $log, $scope,
            mapServices, markers, gsModels, scModels, serverModels,
            ZOOM
        ) {

            $scope.defaults = {
                zoomControlPosition: 'bottomright'
            };
            $scope.center = {
                zoom: ZOOM
            };
            $scope.markers = {};
            $scope.layers = {
                baselayers: {},
                overlays: {}
            };

            /**
             * Function that handles the initialization of the map:
             * 1) first, a map with the animated terminator is created;
             * 2) later, the just created map is centered at the estimated
             *      location for the user's IP address;
             * 3) finally, the events generated by the map are linked to the
             *    required callbacks that will handle them.
             */
            $scope.init = function () {

                $scope.map = markers.configureMapScope($scope);
                mapServices.autocenterMap($scope, ZOOM).then(function () {
                    serverModels.initStandalone().then(function (server) {
                        $log.log(
                            'maps.js@init: Server =' + JSON.stringify(server)
                        );
                        gsModels.initAll().then(function (gss) {
                            $log.log(
                                'maps.js@init: Ground Station(s) = ' +
                                JSON.stringify(gss)
                            );
                        });
                    });
                });
                scModels.initAll().then(function (scs) {
                    $log.log(
                        'maps.js@init: Spacecraft = ' + JSON.stringify(scs)
                    );
                });
                gsModels.initListeners();
                scModels.initListeners();

            };

        }
    ])
    .directive('snMap',

        /**
         * Function that creates the directive itself returning the object
         * required by Angular.
         *
         * @returns {Object} Object directive required by Angular, with
         *                   restrict and templateUrl.
         */
        function () {
            return {
                restrict: 'E',
                templateUrl: 'operations/templates/map.html'
            };
        }

    );;/*
   Copyright 2015 Ricardo Tubio-Pardavila

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

angular.module('snOperationsDirective', [
        'ngMaterial',
        'ngAnimate',
        'leaflet-directive',
        'snSplashDirective',
        'snAboutDirective',
        'snOperationsMap',
        'snOperationsMenuControllers',
        'snGsControllers',
        'snScControllers'
    ]).config(function ($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('blue-grey')
            .accentPalette('grey');
    })
    .controller('operationsAppCtrl',

        /**
         * Main controller for the Operations application.
         *
         * @param   {Object}   $scope       Controller execution scope.
         * @param   {Object}   $mdSidenav   Side mane service from Angular
         *                                  Material.
         */
        function ($scope, $mdSidenav) {

            /**
             * Handler to toggle the menu on and off. It is based on the
             * $mdSidenav service provided by Angular Material. Its main
             * objective is to provide a button overlayed over the map so that
             * in case the menu is hidden (due to the small size of the screen),
             * the menu can still be shown.
             */
            $scope.toggleMenu = function () {
                $mdSidenav("menu").toggle();
            };

        })
    .directive('operationsApp',

        /**
         * Function that creates the directive itself returning the
         * object required by Angular.
         *
         * @returns {Object} Object directive required by Angular,
         *                   with restrict and templateUrl.
         */
        function () {

            return {
                restrict: 'E',
                templateUrl: 'operations/templates/app.html'
            };

        }

    );