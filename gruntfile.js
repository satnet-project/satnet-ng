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
        clean: {
            dist: 'dist',
            libs: 'node_modules/libs'
        },
        jshint: {
            files: [
                '.jshintrc',
                'gruntfile.js',
                'src/common/**/*.js',
                'src/operations/**/*.js'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        concat: {
            options: {
                separator: ';'
            },
            operations: {
                src: [
                    'src/common/directives/Splash.js',
                    'src/common/directives/About.js',
                    'src/common/directives/Maps.js',
                    'src/common/services/Maps.js',
                    'src/common/services/Satnet.js',
                    'src/operations/directives/**/*.js',
                    'src/operations/controllers/**/*.js'
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
                    module: 'operationsDirective',
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
            }
        },
        'curl-dir': {
            'libs': {
                src: [
                    'https://rawgit.com/ajsd/angular-uuid/master/uuid.min.js',
                    'https://rawgit.com/ajsd/angular-jsonrpc/master/src/jsonrpc.js',
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
        express: {
            all: {
                options: {
                    bases: ['dist/', 'src/', 'lib/'],
                    port: 8080,
                    hostname: "0.0.0.0",
                    livereload: true
                }
            }
        },
        open: {
            all: {
                path: 'http://localhost:8080/operations/operations-index.html',
                app: 'chromium'
            }
        },
        watch: {
            build: {
                files: [
                    '<%= jshint.files %>',
                    'src/images/**/*',
                    'src/common/**/*',
                    'src/operations/**/*'
                ],
                tasks: ['build']
            },
            express: {
                files: [
                    'src/operations/operations-index.html',
                    'dist/**/*'
                ],
                options: {
                    livereload: true
                }
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
    grunt.loadNpmTasks('grunt-curl');
    grunt.loadNpmTasks('grunt-mkdir');

    // TASKS
    grunt.registerTask(
        'test', ['jshint', 'karma']
    );
    grunt.registerTask(
        'build', ['clean:dist', 'sass', 'ngtemplates', 'concat', 'copy', 'cssmin', 'uglify']
    );

    grunt.registerTask(
        'server', ['express', 'open', 'watch:express']
    );

    grunt.registerTask(
        'libs', ['clean:libs', 'mkdir:libs', 'curl-dir:libs']
    );

};