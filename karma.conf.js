module.exports = function (config) {
    'use strict';

    config.set({

        basePath: '.',
        frameworks: ['jasmine'],

        files: [
            'lib/bower/angular/angular.js',
            'node_modules/angular-mocks/angular-mocks.js',
            'src/scripts/services/celestrak.js',
            'src/scripts/services/broadcaster.js',
            'src/scripts/services/satnet.js',
            'src/scripts/services/x.satnet.js',
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
            'specs/**/*.spec.js'
        ],

        exclude: [],
        preprocessors: {
            'src/scripts/**/*.js': ['coverage']
        },
        reporters: ['progress', 'coverage'],
        coverageReporter: {
            type: 'html',
            dir: '.coverage/'
        },
        port: 9876,
        colors: true,
        logLevel: config.LOG_DEBUG,
        autoWatch: true,
        browsers: ['PhantomJS'],
        singleRun: false

    });
};