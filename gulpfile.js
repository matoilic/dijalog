var gulp = require('gulp');
var g = require('gulp-load-plugins')(gulp);

gulp.task('compile-stylesheets', function() {
    return gulp
        .src('sass/*.scss')
        .pipe(g.plumber())
        .pipe(g.sourcemaps.init())
        .pipe(g.sass({
            outputStyle: 'expanded'
        }))
        .pipe(g.sourcemaps.write('.'))
        .pipe(gulp.dest('css'));
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
        port: 8088,
        root: ['.']
    });
});

gulp.task('default', ['compile', 'compile-stylesheets']);
gulp.task('dist', ['compile', 'compile-stylesheets', 'minify', 'compress']);
