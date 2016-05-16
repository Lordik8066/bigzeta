var gulp = require('gulp');
var sass = require('gulp-sass');
var inject = require('gulp-inject');
var connect = require('gulp-connect');

gulp.task('fa-install-fonts', function() {
    return gulp
        .src('src/static/scss/libs/font-awesome/fonts/*')
        .pipe(gulp.dest('src/static/css/fonts'));
});

gulp.task('sass-build', function() {
    return gulp
        .src('src/static/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('src/static/css'))
});

gulp.task('connectDev', function() {
    connect.server({
        root: 'src',
        livereload: true,
        port: 3001
    });
});

gulp.task('html', function() {
    return gulp
        .src('./src/*.html')
        .pipe(connect.reload());
});

gulp.task('build', ['fa-install-fonts', 'sass-build']);

gulp.task('watch', ['build'], function() {
    gulp.watch('src/static/scss/**/*.scss', ['sass-build']);
    gulp.watch('src/**/*.html', ['html']);
});

gulp.task('default', ['build', 'connectDev', 'watch']);

