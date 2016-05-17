var gulp = require('gulp');
var inject = require('gulp-inject');
var connect = require('gulp-connect');
var debug = require('gulp-debug');
var path = require('path');
var fs = require('fs');
const data = require('gulp-data');
const nunjucks = require('gulp-nunjucks');
var express = require('express');
var browserSync = require('browser-sync');
var minimist = require('minimist');
var plugins = require('gulp-load-plugins')();

// Plugins
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');

var server;
var buildEnv = plugins.util.env.environment || 'development';
var config = require('./config/'+buildEnv+'.json');

// Shared error handler
function handleError(err) {
    console.log(err.toString());
    this.emit('end');
}

// Browsersync reload
function reload() {
    if (server) {
        return browserSync.reload({ stream: true });
    }
    return plugins.util.noop();
}

gulp.task('fa-install-fonts', function() {
    return gulp
        .src('src/static/scss/libs/font-awesome/fonts/*')
        .pipe(gulp.dest('dist/static/css/fonts'));
});

gulp.task('sass-build', function() {
    return gulp
        .src(['src/static/scss/**/*.scss', '!src/static/scss/libs/bootstrap/*.scss'])
        .pipe(sass({
            sourceComments: config.srcmap ? 'map' : false
        }).on('error', sass.logError)).on('error', handleError)
        .pipe(config.minify ? minifyCss() : plugins.util.noop())
        .pipe(gulp.dest('dist/static/css'))
        .pipe(reload());
});

gulp.task('copy-css', function() {
    return gulp
        .src(['src/static/css/**/*'])
        .pipe(gulp.dest('dist/static/css'));
});

gulp.task('copy-js', function() {
    return gulp
        .src(['src/static/js/**/*'])
        .pipe(gulp.dest('dist/static/js'));
});

gulp.task('images', function() {
    return gulp
        .src(['assets/img/**/*', 'src/static/img/**/*'])
        .pipe(gulp.dest('dist/static/img'));
});

gulp.task('webfonts', function() {
    return gulp
        .src(['assets/fonts/*/*.{woff,woff2,eot,ttf}', 'assets/fonts/*.css'])
        .pipe(gulp.dest('dist/static/css'));
});

gulp.task('compile-templates', function() {
    gulp.src(['src/templates/**/*.html','!src/templates/base.html'])
        .pipe(debug({title:'compile:'}))
        .pipe(data(function(file) {
            var relpath = path.relative(path.join(__dirname, 'src/templates'), file.path);
            var ctxpath = path.dirname(relpath);
            var jsonfile = path.join('src/context', ctxpath, path.basename(file.path, '.html') + '.json');
            if (fs.existsSync(jsonfile)) {
                return JSON.parse(fs.readFileSync(jsonfile));
            }
            return {};
        })).on('error', handleError)
        .pipe(nunjucks.compile()).on('error', handleError)
        .pipe(gulp.dest('dist/html'))
        .pipe(reload());
});

gulp.task('server', function() {
    server = express();
    server.use(express.static('dist'));
    server.use(express.static('dist/html'));
    server.listen(config.server.port, config.server.url)
    browserSync({ proxy: config.server.url + ':' + config.server.port});
});

gulp.task('reload', function() {
    return gulp
        .src('./src/**/*.html')
        .pipe(reload());
});

gulp.task('build', ['fa-install-fonts', 'copy-css', 'copy-js', 'webfonts', 'images', 'sass-build', 'compile-templates']);

gulp.task('watch', ['build'], function() {
    gulp.watch('src/static/scss/**/*.scss', ['sass-build']);
    gulp.watch('src/context/**/*.json', ['compile-templates']);
    gulp.watch('src/templates/**/*.html', ['compile-templates']);
    gulp.watch('src/**/*.html', ['reload']);
});

gulp.task('default', ['build', 'watch', 'server']);

