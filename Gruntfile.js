module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        //Get some details from the package.json
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*!\n' +
        ' * <%= pkg.config.name %> - version <%= pkg.version %> \n' +
        ' * <%= pkg.description %>\n' +
        ' *\n' +
        ' * <%= pkg.author %>\n' +
        ' * Build at <%= grunt.template.today("dd-mm-yyyy") %>\n' +
        ' * Released under MIT License \n' +
        ' */\n',
        usebanner: {
            dist: {
                options: {
                    position: 'top',
                    banner: '<%= banner %>'
                },
                files: {
                    src: [ 'build/*.js' ]
                }
            }
        },
        //Typescript settings per build
        ts: {
            dist: {
                tsconfig: './config/tsconfig.json',
                src: ['ts/**/*.ts', '!ts/Utils/Helper.ts'],
                dest: 'build/<%= pkg.config.name %>.js'
            },
            helper: {
                tsconfig: './config/tsconfig.json',
                src: ['ts/Utils/Storage.ts', 'ts/StorageAdapters/LocalStorage.ts', 'ts/StorageAdapters/IStorage.ts', 'ts/Utils/Helper.ts'],
                dest: 'build/phaser-storage-helper.js'
            }
        },
        watch: {
            files: ['ts/**/*.ts'],
            tasks: ['ts'],
            options: {
                livereload: true
            }
        },
        connect: {
            server: {
                options: {
                    port: 8080
                }
            }
        },
        uglify: {
            options: {
                compress: {
                    sequences: true,
                    dead_code: true,
                    conditionals: true,
                    booleans: true,
                    unused: true,
                    if_return: true,
                    join_vars: true,
                    drop_console: false
                },
                mangle: true,
                beautify: false
            },
            dist: {
                files: {
                    'build/<%= pkg.config.name %>.min.js': [
                        'build/<%= pkg.config.name %>.js'
                    ],
                    'build/phaser-storage-helper.min.js': [
                        'build/phaser-storage-helper.js'
                    ]
                }
            }
        },
        clean: {
            dist: ['build']
        },
        tslint: {
            options: {
                // can be a configuration object or a filepath to tslint.json
                configuration: "./config/tslint.json"
            },
            dist: {
                src: [
                    'ts/**/*.ts'
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-banner');
    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-tslint');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');

    //dist Build
    grunt.registerTask('dist', [
        'tslint',
        'clean:dist',     //Clean the dist folder
        'ts:dist',//Run typescript on the preprocessed files, for dist (client)
        'ts:helper',
        'uglify:dist',    //Minify everything
        'usebanner:dist'    //Minify everything
    ]);

    grunt.registerTask('dev', [
        'ts',
        'connect',
        'watch'
    ]);

};
