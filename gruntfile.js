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

module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            dist: 'dist/',
            reports: ['.coverage', '.complexity'],
            libs: 'node_modules/libs'
        },
        jshint: {
            files: [
                '.jshintrc', 'gruntfile.js',
                'src/**/*.js'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        complexity: {
            generic: {
                src: ['src/**/*.js'],
                exclude: ['src/**/*.spec.js'],
                options: {
                    breakOnErrors: true,
                    jsLintXML: '.complexity/report.xml',
                    checkstyleXML: '.complexity/style.xml',
                    pmdXML: '.complexity/pmd.xml',
                    errorsOnly: false,
                    cyclomatic: [20], //[3, 7, 12],
                    halstead: [20], //[8, 13, 20],
                    maintainability: 100,
                    hideComplexFunctions: false,
                    broadcast: false
                }
            }
        },
        concat: {
            options: {
                separator: ';'
            },
            operations: {
                src: [
                    'src/common/services/Broadcaster.js',
                    'src/common/services/Celestrak.js',
                    'src/common/services/Controllers.js',
                    'src/common/services/Pusher.js',
                    'src/common/services/Satnet.js',
                    'src/common/services/Maps.js',
                    'src/common/filters/Logger.js',
                    'src/common/filters/Rules.js',
                    'src/common/models/Markers.js',
                    'src/common/models/Network.js',
                    'src/common/models/GroundStations.js',
                    'src/common/models/Spacecraft.js',
                    'src/common/directives/*.js',
                    'src/operations/controllers/*.js',
                    'src/operations/directives/*.js'
                ],
                dest: 'dist/<%= pkg.name %>-operations.js'
            }
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                autoWatch: true
            }
        },
        sass: {
            operations: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/operations/templates/sass',
                        src: ['*.scss'],
                        dest: 'dist',
                        ext: '.css'
                    }
                ]
            }
        },
        ngtemplates: {
            operations: {
                cwd: 'src',
                src: [
                    'common/templates/**/*.html',
                    'operations/templates/**/*.html'
                ],
                dest: 'dist/<%= pkg.name %>-operations-tpls.js',
                options: {
                    module: 'snOperationsDirective',
                    htmlmin: {
                        collapseWhitespace: true,
                        collapseBooleanAttributes: true
                    }
                }
            }
        },
        mkdir: {
            libs: {
                options: {
                    create: ['node_modules/libs']
                }
            },
            reports: {
                options: {
                    create: ['.coverage', '.complexity']
                }
            }
        },
        'curl-dir': {
            'libs': {
                src: [
                    'https://rawgit.com/joergdietrich/Leaflet.Terminator/master/L.Terminator.js',
                    'https://rawgit.com/ajsd/angular-uuid/master/uuid.min.js',
                    'https://rawgit.com/ajsd/angular-jsonrpc/master/src/jsonrpc.js',
                    'https://rawgit.com/pusher/pusher-angular/master/lib/pusher-angular.js',
                    'https://rawgit.com/webadvanced/ng-remote-validate/master/release/ngRemoteValidate.0.6.1.min.js',
                    'https://rawgit.com/Leaflet/Leaflet.label/master/dist/leaflet.label.js',
                    'https://rawgit.com/ewoken/Leaflet.MovingMarker/master/MovingMarker.js',
                    'https://rawgit.com/henrythasler/Leaflet.Geodesic/master/Leaflet.Geodesic.min.js',
                    'https://cdn.rawgit.com/g00fy-/angular-datepicker/master/dist/angular-datepicker.min.js',
                    'https://rawgit.com/pusher/pusher-js-test-stub/master/build/bin/pusher-test-stub.js'
                ],
                dest: 'node_modules/libs'
            }
        },
        copy: {
            images: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/images',
                        src: '*',
                        dest: 'dist/images',
                        filter: 'isFile'
                    }
                ]
            }
        },
        cssmin: {
            main: {
                files: [
                    {
                        expand: true,
                        cwd: 'dist',
                        src: '<%= pkg.name %>-operations.css',
                        dest: 'dist',
                        ext: '.min.css'
                    }
                ]
            },
            lib: {
                files: [
                    {
                        expand: true,
                        cwd: 'lib',
                        src: ['*.css'],
                        dest: 'dist/lib',
                        ext: '.min.css'
                    }
                ]
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> <%= pkg.author %> <%= pkg.license %>*/\n'
            },
            operations: {
                files: {
                    'dist/<%= pkg.name %>-operations.min.js': [
                        '<%= concat.operations.dest %>'
                    ],
                    'dist/<%= pkg.name %>-operations-tpls.min.js': [
                        '<%= ngtemplates.operations.dest %>'
                    ]
                }
            },
        },
        connect: {
            server: {
                options: {
                    base: ['dist/', 'lib/', 'src/'],
                    port: 8081,
                    hostname: 'localhost',
                    keepalive: true,
                    livereload: true,
                    debug: true,
                    middleware: function (connect, options, defaultMiddleware) {
                        var proxy = require('grunt-connect-proxy/lib/utils').proxyRequest,
                            live = require('connect-livereload')();
                        // Serve static files.
                        defaultMiddleware.push(live);
                        defaultMiddleware.push(proxy);
                        options.base.forEach(function (base) {
                            defaultMiddleware.push(connect.static(base));
                        });
                        // Make directory browse-able.
                        var directory = options.directory ||
                            options.base[options.base.length - 1];
                        defaultMiddleware.push(connect.directory(directory));
                        return defaultMiddleware;
                    },
                    open: {
                        target: 'http://localhost:8081/operations/operations-index.html',
                        appName: 'chromium'
                    }
                },
                proxies: [
                    {
                        context: '/configuration',
                        host: 'localhost',
                        port: 8000,
                        changeOrigin: true,
                        https: false,
                        xforward: false,
                        hideHeaders: ['x-removed-header']
                    }
                ]
            }
        },
        watch: {
            build: {
                files: [
                    '<%= jshint.files %>',
                    'lib/dist/angular-leaflet-directive.js',
                    'src/images/**/*',
                    'src/common/**/*',
                    'src/operations/**/*'
                ],
                options: {
                    livereload: true,
                    reload: true
                },
                tasks: ['build']
            },
            test: {
                files: [
                    'karma.conf.js',
                    'src/common/**/*.js',
                    'src/common/templates/**/*.html',
                    'src/operations/**/*.js',
                    'src/operations/templates/**/*.html'
                ],
                tasks: ['test']
            }
        }
    });

    // PLUGINS
    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-complexity');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-connect-proxy');
    grunt.loadNpmTasks('grunt-curl');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-mkdir');
    grunt.loadNpmTasks('grunt-reload');

    // TASKS
    grunt.registerTask(
        'test', [
            'jshint',
            'karma'
        ]
    );

    grunt.registerTask(
        'build', [
            'clean:dist',
            'clean:reports',
            'jshint',
            'sass',
            'ngtemplates',
            'concat',
            'copy',
            'cssmin',
            'uglify',
            'complexity'
        ]
    );

    grunt.registerTask(
        'libs', [
            'clean:libs',
            'mkdir:libs',
            'curl-dir:libs'
        ]
    );

    grunt.registerTask(
        'server', [
            'configureProxies:server',
            'connect:server'
        ]
    );

};