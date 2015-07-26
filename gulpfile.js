var gulp = require('gulp');
var g = require('gulp-load-plugins')(gulp);
var jscs = require('gulp-jscs-with-reporter');
var fs = require('fs');
var bs = require('./test/config/browserstack.js');

gulp.task('compile-stylesheets', function() {
    return gulp
        .src('sass/*.scss')
        .pipe(g.plumber())
        .pipe(g.sourcemaps.init())
        .pipe(g.sass({
            outputStyle: 'expanded'
        }))
        .pipe(g.autoprefixer())
        .pipe(g.sourcemaps.write('.'))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('compile', function() {
    return gulp
        .src([
            'src/header.txt',
            'src/helpers.js',
            'src/core.js',
            'src/footer.txt'
        ])
        .pipe(g.sourcemaps.init())
        .pipe(g.concat('dijalog.js'))
        .pipe(g.sourcemaps.write('.'))
        .pipe(gulp.dest('dist'));
});

gulp.task('compress', function() {
    return gulp
        .src('dist/dijalog.min.js')
        .pipe(g.gzip({
            append: true
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('minify', function() {
    return gulp
        .src('dist/dijalog.js')
        .pipe(g.sourcemaps.init())
        .pipe(g.uglify({
            drop_debugger: true,
            drop_console: true
        }))
        .pipe(g.rename({
            suffix: ".min"
        }))
        .pipe(g.sourcemaps.write('.'))
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', ['compile'], function() {
    gulp.watch('src/*.js', ['compile']);
    gulp.watch('sass/*.scss', ['compile-stylesheets']);
});

gulp.task('serve', ['default'], function(){
    g.connect.server({
        hostname: '0.0.0.0',
        port: 8088,
        root: ['test', '.']
    });
});

gulp.task('webdriver-update', g.protractor.webdriver_update);

gulp.task('webdriver-standalone', g.protractor.webdriver_standalone);

gulp.task('test', ['webdriver-update', 'build'], function(done) {
    var remote = process.argv.indexOf('--remote') > -1;

    g.connect.server({
        port: 8089,
        root: ['test', '.']
    });

    gulp
        .src('./test/*-test.js')
        .pipe(g.protractor.protractor({
            configFile: remote ? './test/config/protractor-browserstack-config.js' : './test/config/protractor-config.js'
        }))
        .on('error', function (err) {
            g.connect.serverClose();

            throw err;
        })
        .on('end', function () {
            g.connect.serverClose();

            done();
        });

});

gulp.task('jshint', function () {
    return gulp.src('src/**/*.js')
        .pipe(g.jshint('.jshintrc'))
        .pipe(g.jshint.reporter('gulp-jshint-html-reporter', {
            filename: __dirname + '/dist/jshint.html'
        }));
});

gulp.task('jscs', function () {
    return gulp.src('src/**/*.js')
        .pipe(jscs(
            JSON.parse(fs.readFileSync('.jscsrc'))
        ))
        .pipe(jscs.reporter('gulp-jscs-html-reporter', {
            filename: __dirname + '/dist/jscs.html'
        }))
});

gulp.task('build', ['compile', 'compile-stylesheets']);
gulp.task('dist', ['compile', 'compile-stylesheets', 'minify', 'compress']);
gulp.task('default', ['build']);
