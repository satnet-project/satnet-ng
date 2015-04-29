module.exports = function (config) {
    'use strict';

    config.set({

        basePath: '.',
        frameworks: ['jasmine'],

        files: [
            'node_modules/jquery/dist/jquery.js',
            'node_modules/angular/angular.js',
            'node_modules/angular-mocks/angular-mocks.js',
            'node_modules/angular-material/angular-material.js',
            'src/scripts/services/celestrak.js',
            'src/scripts/services/broadcaster.js',
            'src/scripts/services/satnet.js',
            'src/scripts/services/maps.js',
            'src/scripts/services/push.js',
            'src/scripts/models/marker.js',
            'src/scripts/models/x.servers.js',
            'src/scripts/models/x.groundstation.js',
            'src/scripts/models/x.spacecraft.js',
            'src/scripts/controllers/**/*.js',
            'src/scripts/directives/**/*.js',
            'src/scripts/satnet.ui.js',
            'src/scripts/leop.ui.js',
            'src/templates/**/*.html',
            'specs/**/*.spec.js'
        ],

        exclude: [],
        preprocessors: {
            'src/scripts/**/*.js': ['coverage'],
            'src/templates/**/*.html': ['ng-html2js']
        },
        ngHtml2JsPreprocessor: {
            moduleName: 'templates'
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