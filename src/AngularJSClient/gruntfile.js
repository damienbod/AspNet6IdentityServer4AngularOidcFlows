module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks("grunt-bower-task");

    grunt.initConfig({
        bower: {
            install: {
                options: {
                    targetDir: "wwwroot/lib",
                    layout: "byComponent",
                    cleanTargetDir: false
                }
            }
        },
        sass: {
            dist: {
                files: {
                    'wwwroot/default_theme.css': 'app/content/default_theme.scss'
                }
            }
        },
        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            dist: {
                files: {
                    'wwwroot/default_theme.min.css': ["wwwroot/default_theme.css"]
                }
            }
        },
        uglify: {
            my_target: {
                files: { 'wwwroot/app.js': ['app/app.js', 'app/**/*.js'] }
            }
        },
        watch: {
            scripts: {
                files: ['app/**/*.js'],
                tasks: ['uglify']
            },
            appFolderCss: {
                files: ['app/content/**/*.scss'],
                tasks: ['sass', 'cssmin']
            }
        }
    });

    grunt.registerTask("bowertask", ["bower:install"]);
    grunt.registerTask('default', ['sass', 'cssmin', 'uglify', 'watch']);

};