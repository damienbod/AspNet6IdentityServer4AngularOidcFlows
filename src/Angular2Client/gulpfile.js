
var gulp = require('gulp');
var del = require('del');

var paths = {
    npmSrc: "./node_modules/",
    libTarget: "./wwwroot/libs/"
};

var packagesToMove = [
   paths.npmSrc + '/systemjs/dist/system-polyfills.js',
   paths.npmSrc + '/systemjs/dist/system.src.js',
   paths.npmSrc + '/zone.js/dist/*.js',
   paths.npmSrc + '/es6-shim/es6-shim.js',
   paths.npmSrc + '/reflect-metadata/*.js',
   paths.npmSrc + '/rxjs/**/*.js',
   paths.npmSrc + '/@angular/**/*.js',
   paths.npmSrc + '/jquery/dist/jquery.min.js',
   paths.npmSrc + '/angular2localization/bundles/*.js'
];

gulp.task('clean', function () {
    return del(paths.libTarget);
});

gulp.task('copyNpmTo_wwwrootLibs', ['clean'], function () {
    gulp.src(packagesToMove[0]).pipe(gulp.dest(paths.libTarget + 'systemjs/dist'));
    gulp.src(packagesToMove[1]).pipe(gulp.dest(paths.libTarget + 'systemjs/dist'));
    gulp.src(packagesToMove[2]).pipe(gulp.dest(paths.libTarget + 'zone.js/dist'));
    gulp.src(packagesToMove[3]).pipe(gulp.dest(paths.libTarget + 'es6-shim'));
    gulp.src(packagesToMove[4]).pipe(gulp.dest(paths.libTarget + 'reflect-metadata'));
    gulp.src(packagesToMove[5]).pipe(gulp.dest(paths.libTarget + 'rxjs'));
    gulp.src(packagesToMove[6]).pipe(gulp.dest(paths.libTarget + '@angular'));
    gulp.src(packagesToMove[7]).pipe(gulp.dest(paths.libTarget));
    gulp.src(packagesToMove[8]).pipe(gulp.dest(paths.libTarget + 'angular2localization/bundles'));
});

+gulp.task('default', ['copyNpmTo_wwwrootLibs']);
