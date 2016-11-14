'use strict';


var watchify    = require('watchify'),
    browserify  = require('browserify'),
    gulp        = require('gulp'),
    sass        = require('gulp-sass'),
    connect     = require('gulp-connect'),
    open        = require('gulp-open'),
    gutil       = require('gulp-util'),
    sourcemaps  = require('gulp-sourcemaps'),
    assign      = require('lodash.assign'),
    buffer      = require('vinyl-buffer'),
    source      = require('vinyl-source-stream');

// add custom browserify options here
var customOpts = {
    entries: ['./public/js/app.js'],
    debug: true
};
var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts));

// add transformations here
// i.e. b.transform(coffeeify);

gulp.task('js', bundle); // so you can run `gulp js` to build the file
b.on('update', bundle); // on any dep update, runs the bundler
b.on('log', gutil.log); // output build logs to terminal

function bundle() {
    return b.bundle()
        // log errors if they happen
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source('bundle.js'))
        // optional, remove if you don't need to buffer file contents
        .pipe(buffer())
        // optional, remove if you dont want sourcemaps
        .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
        // Add transformation tasks to the pipeline here.
        .pipe(sourcemaps.write('./')) // writes .map file
        .pipe(gulp.dest('./dist'));
}




var devServer = {
    host: '0.0.0.0',
    port: 4444,
    file: 'test.html',
    livereloadPort: 35729

};

// Local HTTP Server
gulp.task('server', function() {
    connect.server({
        port: devServer.port,
        livereload: {
            port: devServer.livereloadPort
        },
        host: devServer.host,
        fallback: devServer.file
    });
});

// Open app in browser
gulp.task('open', ['server'], function() {
    var options = {
        uri: 'http://' + devServer.host + ':' + devServer.port
    };
    gulp.src('./' + devServer.file)
        .pipe(open(options));
});
