/*
This file in the main entry point for defining Gulp tasks and using Gulp plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkId=518007
*/

var gulp = require('gulp');

var paths = {
    npmSrc: "./node_modules/",
    libTarget: "./wwwroot/libs/"
};

var packagesToMove = [
   paths.npmSrc + '/angular2/bundles/angular2-polyfills.js',
   paths.npmSrc + '/angular2/bundles/router.dev.js',
   paths.npmSrc + '/angular2/bundles/http.dev.js',
   paths.npmSrc + '/angular2/bundles/angular2.dev.js',
   paths.npmSrc + '/angular2/es6/dev/src/testing/shims_for_IE.js',
   

   paths.npmSrc + '/systemjs/dist/system.js',
   paths.npmSrc + '/systemjs/dist/system-polyfills.js',

   paths.npmSrc + '/rxjs/bundles/Rx.js',
   paths.npmSrc + '/es6-shim/es6-shim.min.js',
   paths.npmSrc + '/reflect-metadata/Reflect.js',
   paths.npmSrc + '/zone.js/dist/zone.js',
   paths.npmSrc + '/jquery/dist/jquery.min.js',
   paths.npmSrc + '/angular2-localstorage/LocalStorage.ts',
   paths.npmSrc + '/angular2-localstorage/LocalStorageEmitter.ts'
   
];
gulp.task('copyNpmTo_wwwrootLibs', function () {
    return gulp.src(packagesToMove).pipe(gulp.dest(paths.libTarget));
});

