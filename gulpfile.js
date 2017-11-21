/**
 * Created by lomo on 2017/9/26.
 */
var gulp = require('gulp');
var webpack = require('gulp-webpack');
var less = require('gulp-less');
var cssmin = require('gulp-minify-css');
var named = require('vinyl-named');
var webserver = require('gulp-webserver');
var clean = require('gulp-clean');
var babel = require("gulp-babel");
var es2015 = require("babel-preset-es2015");
gulp.task('webpack', function() {
    return gulp.src(['src/app.js','src/index.js'])
        .pipe(named())
        .pipe(webpack({
            module: {
                loaders: [
                    { test: /\.(html|tpl)$/, loader: 'html-loader' },
                    { test: /\.vue$/, loader: 'vue' },

                ],
            },
            //watch: true
        }))
        .pipe(babel({presets:[es2015]}))
        .pipe(gulp.dest('dist/'));
});


gulp.task('less', function () {
    gulp.src(['src/less/index.less','src/less/edit.less'])
        .pipe(less())
        //.pipe(cssmin())
        .pipe(gulp.dest('dist/css'));
});

gulp.task('webserver', function() {
    gulp.src('./')
        .pipe(webserver({
            livereload: false,
            directoryListing: false,
            open: true,
            port:8080
        }));
});

gulp.task('clean', function () {
    return gulp.src('dist', {read: false})
        .pipe(clean());
});
gulp.task('default',['webpack','less','webserver'],function(){

    gulp.watch(['src/*.js','src/**/*.js','src/***/**/*.js','src/**/*.tpl'], ['webpack']);
    gulp.watch('src/less/*.less', ['less']);

});