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
            'node_modules/leaflet/dist/leaflet.js',
            'node_modules/angular-leaflet-directive/dist/angular-leaflet-directive.js',
            'src/common/**/*.js',
            'src/common/**/*.html',
            'src/operations/**/*.js',
            'src/operations/templates/**/*.html'
        ],

        exclude: [],
        preprocessors: {
            'src/operations/**/*.js': ['coverage'],
            'src/operations/templates/**/*.html': ['ng-html2js']
        },
        ngHtml2JsPreprocessor: {
            moduleName: 'templates',
            // The following function removes the first two directories from the
            // given path for a template since those are omitted within the distributable
            // template packages and, therefore, they are also omitted within the
            // <templateUrl> parameter of the definition of the directive.
            cacheIdFromPath: function (filepath) {
                var regex = /^(\w+\/)(\w+\/)/;
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