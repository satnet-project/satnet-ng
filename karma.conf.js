/*
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

module.exports = function (config) {
    'use strict';

    config.set({

        basePath: '.',
        frameworks: ['jasmine'],

        files: [
            'node_modules/jquery/dist/jquery.js',
            'node_modules/angular/angular.js',
            'node_modules/angular-mocks/angular-mocks.js',
            'node_modules/angular-animate/angular-animate.js',
            'node_modules/angular-aria/angular-aria.js',
            'node_modules/angular-material/angular-material.js',
            'node_modules/pusher-stubs/pusher-test-stub.js',
            'node_modules/pusher-angular/lib/pusher-angular.js',
            'node_modules/leaflet/dist/leaflet.js',
            'node_modules/angular-leaflet-directive/dist/angular-leaflet-directive.js',
            'src/common/**/*.js',
            'src/common/templates/**/*.html',
            'src/operations/**/*.js',
            'src/operations/templates/**/*.html'
        ],

        exclude: [],
        preprocessors: {
            'src/common/directives/**/*.js': ['coverage'],
            'src/common/services/**/*.js': ['coverage'],
            'src/operations/controllers/**/*.js': ['coverage'],
            'src/operations/directives/**/*.js': ['coverage'],
            'src/common/templates/**/*.html': ['ng-html2js'],
            'src/operations/templates/**/*.html': ['ng-html2js']
        },
        ngHtml2JsPreprocessor: {
            moduleName: 'templates',
            // The following function removes the first directory from the
            // given path for a template since those are omitted within the
            // distributable template packages and, therefore, they are also
            // omitted within the <templateUrl> parameter of the definition of
            // the directive.
            cacheIdFromPath: function (filepath) {
                var regex = /^(\w+\/)/;
                return filepath.replace(regex, '');
            },
        },

        reporters: ['progress', 'coverage', 'coveralls'],
        coverageReporter: {
            type: 'lcov',
            repoToken: '',
            dir: '.coverage/'
        },

        port: 9876,
        colors: true,
        logLevel: config.LOG_DEBUG,
        autoWatch: true,
        browsers: ['PhantomJS'],
        singleRun: true

    });
};