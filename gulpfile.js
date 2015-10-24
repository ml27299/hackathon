var gulp = require('gulp');
var $ = require('gulp-load-plugins')({lazy: true});

var browserSync = require('browser-sync');
var del = require('del');

var config = {
    bookie: {
        css: '.tmp/bookie.css',
        index: 'bookie/index.html',
        js: 'bookie/**/*.js',
        root: 'bookie/',
        sass: 'bookie/**/*.scss'
    },
    temp: '.tmp'
};

//{
//    files: [
//        config.src + ALL_FILES,
//        '!' + config.src + ALL_SASS,
//        config.temp + ALL_CSS
//    ],
//        startPath: '/',
//    server: {
//    baseDir: [temp, src, assets],
//        routes: {'/bower_components': 'bower_components'}
//}
//}

gulp.task('serve-bookie', ['inject-bookie'], function() {
    gulp.watch([config.bookie.sass], ['styles-bookie']);
    browserSync.init({
        files: [
            config.bookie.root + '**/*.*',
            '!' + config.bookie.sass,
            config.bookie.css
        ],
        startPath: '/',
        server: {
            baseDir: [config.temp, config.bookie.root],
            routes: {'/bower_components': 'bower_components'}
        }
    });
});

gulp.task('wiredep-bookie', [], function() {
    var wiredep = require('wiredep').stream;

    return gulp
        .src(config.bookie.index)
        .pipe(wiredep({
            bowerJson: require('./bower.json'),
            directory: 'bower_components',
            ignorePath: '../'
        }))
        .pipe($.inject(gulp.src([
            config.bookie.root + '**/*.module.js',
            config.bookie.js
        ]), {relative: true}))
        .pipe(gulp.dest(config.bookie.root));
});

gulp.task('inject-bookie', ['wiredep-bookie', 'styles-bookie'], function() {
    return gulp
        .src(config.bookie.index)
        .pipe($.inject(
            gulp.src(config.bookie.css),
            {ignorePath: '.tmp'}
        ))
        .pipe(gulp.dest(config.bookie.root));
});

gulp.task('styles-bookie', [], function() {
    return gulp
        .src(config.bookie.sass)
        .pipe($.sass())
        .pipe($.autoprefixer())
        .pipe(gulp.dest(config.temp));
});
