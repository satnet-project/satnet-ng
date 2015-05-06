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
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: ['dist'],
        jshint: {
            files: [
                '.jshintrc',
                'gruntfile.js',
                'src/scripts/**/*.js',
                'specs/**/*.js'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        concat: {
            options: {
                separator: ';'
            },
            main: {
                src: [
                    'src/scripts/services/push.js',
                    'src/scripts/services/celestrak.js',
                    'src/scripts/services/broadcaster.js',
                    'src/scripts/services/satnet.js',
                    'src/scripts/services/x.satnet.js',
                    'src/scripts/services/maps.js',
                    'src/scripts/models/marker.js',
                    'src/scripts/models/x.servers.js',
                    'src/scripts/models/x.groundstation.js',
                    'src/scripts/models/x.spacecraft.js',
                    'src/scripts/controllers/**/*.js',
                    'src/scripts/directives/**/*.js',
                    'src/leop/directives/**/*.js',
                    'src/leop/controllers/**/*.js',
                    'src/scripts/satnet.ui.js',
                    'src/scripts/leop.ui.js'
                ],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                autoWatch: true
            }
        },
        sass: {
            main: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/css/sass',
                        src: ['*.scss'],
                        dest: 'dist',
                        ext: '.css'
                    }
                ]
            }
        },
        ngtemplates: {
            satnet: {
                cwd: 'src',
                src: [
                    'leop/templates/**/*.html',
                    'templates/**/*.html'
                ],
                dest: 'dist/<%= pkg.name %>-tpls.js',
                options: {
                    module: 'satnet-ui',
                    htmlmin: {
                        collapseWhitespace: true,
                        collapseBooleanAttributes: true
                    }
                }
            },
            leop: {
                cwd: 'src',
                src: 'templates/**/*.html',
                dest: 'dist/<%= pkg.name %>-leop-tpls.js',
                options: {
                    module: 'leop-ui',
                    htmlmin: {
                        collapseWhitespace: true,
                        collapseBooleanAttributes: true
                    }
                }
            },
            idle: {
                cwd: 'src',
                src: 'templates/idle/*.html',
                dest: 'dist/<%= pkg.name %>-idle-tpls.js',
                options: {
                    module: 'idle',
                    htmlmin: {
                        collapseWhitespace: true,
                        collapseBooleanAttributes: true
                    }
                }
            }
        },
        copy: {
            bootup: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/splash',
                        src: [
                            'splash.css', 'splash.js'
                        ],
                        dest: 'dist/splash',
                        filter: 'isFile'
                    }
                ]
            },
            images: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/images',
                        src: ['*'],
                        dest: 'dist/images',
                        filter: 'isFile'
                    }
                ]
            },
            lib: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        filter: 'isFile',
                        cwd: 'lib',
                        src: [
                            '*.js',
                            '*.css',
                            'bower/angular-ui-bootstrap-bower/ui-bootstrap-tpls.min.js',
                            'bower/nya-bootstrap-select/dist/css/nya-bs-select.min.css',
                            'bower/nya-bootstrap-select/dist/js/nya-bs-select.min.js',
                            'bower/angular-bootstrap-datetimepicker/src/css/datetimepicker.css',
                            'bower/angular-bootstrap-datetimepicker/src/js/datetimepicker.js',
                            'bower/ng-remote-validate/release/ngRemoteValidate.js',
                            'bower/angular-uuid/uuid.min.js',
                            'bower/Leaflet.label/dist/leaflet.label.js',
                            'bower/Leaflet.label/dist/leaflet.label.css',
                            'bower/ng-idle/angular-idle.min.js',
                            'bower/ng-idle/angular-idle.map',
                            'bower/angular-timer/dist/angular-timer.min.js'
                        ],
                        dest: 'dist/lib'
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
                        src: [
                            '<%= pkg.name %>.css',
                            'splash/splash.css'
                        ],
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
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            splash: {
                files: {
                    'dist/splash/splash.min.js': ['dist/splash/splash.js']
                }
            },
            dist: {
                files: {
                    'dist/<%= pkg.name %>.min.js': ['<%= concat.main.dest %>']
                }
            },
            templates: {
                files: {
                    'dist/<%= pkg.name %>-tpls.min.js': [
                        '<%= ngtemplates.satnet.dest %>'
                    ],
                    'dist/<%= pkg.name %>-leop-tpls.min.js': [
                        '<%= ngtemplates.leop.dest %>'
                    ]
                }
            }
        },
        express: {
            all: {
                options: {
                    bases: [
                        'src/',
                        'dist/'
                    ],
                    port: 8080,
                    hostname: "0.0.0.0",
                    livereload: true
                }
            }
        },
        open: {
            all: {
                path: 'http://localhost:8080/leop/leop-index.html',
                app: 'chromium'
            }
        },
        watch: {
            build: {
                files: [
                    '<%= jshint.files %>',
                    'src/css/**/*',
                    'src/images/**/*',
                    'src/templates/**/*',
                    'src/leop/**/*',
                    'src/splash/**/*'
                ],
                tasks: ['build']
            },
            express: {
                files: [
                    'src/leop-index.html',
                    'dist/**/*.*'
                ],
                options: {
                    livereload: true
                }
            },
            test: {
                files: [
                    '<%= jshint.files %>',
                    'src/scripts/**/*',
                    'src/templates/**/*',
                    'src/splash/**/*.js',
                    'src/leop/**/*.js',
                    'src/specs/**/*'
                ],
                tasks: ['test']
            }
        }
    });

    // PLUGINS
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-express');

    // TASKS
    grunt.registerTask(
        'test', ['jshint', 'karma']
    );
    grunt.registerTask(
        'build', ['clean', 'sass', 'ngtemplates', 'concat', 'copy', 'cssmin', 'uglify']
    );

    grunt.registerTask(
        'server', ['express', 'open', 'watch:express']
    );

};