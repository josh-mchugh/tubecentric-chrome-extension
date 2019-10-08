var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var del = require('del');

var $ = gulpLoadPlugins();

gulp.task('dist:clean', del.bind(null, ['dist']));

gulp.task('dist:locales', function() {
    return gulp.src('app/_locales/**/*')
        .pipe(gulp.dest('dist/_locales'));
});

gulp.task('dist:images', function() {
    return gulp.src('app/images/**/*')
        .pipe($.if($.if.isFile, $.cache($.imagemin({
            progressive: true,
            interlaced: true,
            // don't remove IDs from SVGs, they are often used
            // as hooks for embedding and styling
            svgoPlugins: [{cleanupIDs: false}]
        }))
        .on('error', function (err) {
            console.log(err);
            this.end();
        })))
        .pipe(gulp.dest('dist/images'));
});

gulp.task('dist:background', function() {
    return gulp.src('app/components/background/**/*.js')
        .pipe($.plumber())
        .pipe($.babel({presets: ['env']}))
        .pipe($.if('*.js', $.sourcemaps.init()))
        .pipe($.if('*.js', $.uglify()))
        .pipe($.if('*.js', $.sourcemaps.write('.')))
        .pipe(gulp.dest('dist/background'));
});

gulp.task('dist:popover', function() {
    return gulp.src('app/components/popup', {read: false})
        .pipe($.shell("npx vue-cli-service build .\\app\\components\\popup\\src\\main.js --dest dist/popup --mode popup --no-clean"))
});

gulp.task('dist:options', function() {
    return gulp.src('app/components/options', {read: false})
        .pipe($.shell("npx vue-cli-service build .\\app\\components\\options\\src\\main.js --dest dist/options --mode options --no-clean"))
});

gulp.task('dist:content-scripts', function() {
    return gulp.src('app/components/content-scripts', {read: false})
        .pipe($.shell("npx vue-cli-service build .\\app\\components\\content-scripts\\src\\main.js --dest dist/content-scripts --mode content-scripts --no-clean"))
});

gulp.task('dist:manifest', function() {
    return gulp.src('app/manifest.json')
        .pipe(gulp.dest('dist'));
});

gulp.task('dist:size', function() {
    return gulp.src('dist/**/*')
        .pipe($.size( { title: 'build', gzip: true} ));
});

gulp.task('build', gulp.series(
    'dist:clean',
    'dist:locales',
    'dist:images',
    'dist:manifest',
    'dist:background',
    'dist:popover', 
    'dist:options',
    'dist:content-scripts',
    'dist:size'
));