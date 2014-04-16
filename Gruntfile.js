/*
 * bridgejs
 * http://bridgejs.com/
 *
 * Copyright (c) 2014 Cubesoft
 * Authors Pascal Bayer, Sebastian Wahn
 * Licensed under the MIT license.
 * https://github.com/pascalbayer/bridgejs/blob/master/LICENSE
 */

module.exports = function(grunt) {

    grunt.initConfig({
        //karma: {
        //    unit: {
        //        configFile: 'karma.conf.js',
        //        background: true
        //    }
        //},
        //watch: {
        //    karma: {
        //        files: [
        //            'src/client/lib/*.js',
        //            'test/**/*Spec.js',
        //            'test/test-main.js'
        //        ],
        //        tasks: ['karma:unit:run']
        //    }
        //}
        ngdocs: {
            options: {
                dest: 'docs',
//                scripts: [
//                    '../node_modules/requirejs/require.js',
//                    'src/client/index.js'
//                ],
                html5Mode: true,
                startPage: '/api',
                title: "BridgeJS",
                //image: "path/to/my/image.png",
                //imageLink: "http://my-domain.com",
                titleLink: "/api",
                bestMatch: true
                /*analytics: {
                    account: 'UA-08150815-0',
                    domainName: 'my-domain.com'
                },
                discussions: {
                    shortName: 'my',
                    url: 'http://my-domain.com',
                    dev: false
                }*/
            },
            tutorial: {
                src: ['content/tutorial/*.ngdoc'],
                title: 'Tutorial'
            },
            api: {
                src: ['src/**/*.js', '!src/**/*.spec.js'],
                title: 'API Documentation'
            }
        }
    });

    //grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-ngdocs');

    //grunt.registerTask('test', ['karma:unit', 'watch']);
};