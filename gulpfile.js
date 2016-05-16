var gulp = require('gulp');
var sass = require('gulp-sass');
var inject = require('gulp-inject');
var connect = require('gulp-connect');
var debug = require('gulp-debug');
var gutil = require('gulp-util');
var path = require('path');
var fs = require('fs');
const data = require('gulp-data');
const nunjucks = require('gulp-nunjucks');

gulp.task('fa-install-fonts', function() {
    return gulp
        .src('src/static/scss/libs/font-awesome/fonts/*')
        .pipe(gulp.dest('dist/static/css/fonts'));
});

gulp.task('sass-build', function() {
    return gulp
        .src('src/static/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('dist/static/css'))
});

gulp.task('connectDev', function() {
    connect.server({
        root: ['dist/html', 'dist', 'src'],
        livereload: true,
        port: 3001
    });
});

gulp.task('compile-templates', function() {
    gulp.src('src/templates/**/*.html')
        .pipe(debug({title:'compile:'}))
        .pipe(data(function(file) {
            var relpath = path.relative(path.join(__dirname, 'src/templates'), file.path);
            var ctxpath = path.dirname(relpath);
            var jsonfile = path.join('src/context', ctxpath, path.basename(file.path, '.html') + '.json');
            return JSON.parse(fs.readFileSync(jsonfile));
        }))
        .pipe(nunjucks.compile())
        .pipe(gulp.dest('dist/html'));
});

gulp.task('html', function() {
    return gulp
        .src('./src/**/*.html')
        .pipe(connect.reload());
});

gulp.task('build', ['fa-install-fonts', 'sass-build', 'compile-templates']);

gulp.task('watch', ['build'], function() {
    gulp.watch('src/static/scss/**/*.scss', ['sass-build', 'html']);
    gulp.watch('src/context/**/*.json', ['compile-templates', 'html']);
    gulp.watch('src/templates/**/*.html', ['compile-templates', 'html']);
    gulp.watch('src/**/*.html', ['html']);
});

gulp.task('default', ['build', 'connectDev', 'watch']);

