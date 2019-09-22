const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const minifyCSS = require('gulp-csso');
const minifyImg = require('gulp-imagemin');
const minifyJS = require('gulp-uglify');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const del = require('del');
const runSequence = require('run-sequence');
const npmDist = require('gulp-npm-dist');

const homeDirectory = "src";
const resultDirectory = "front";

gulp.task('browser-sync', () => {
    browserSync.init({
        server: {
            baseDir: resultDirectory
        }
    });
});

gulp.task('css', () => {
    return gulp.src(homeDirectory + '/scss/**/*.scss')
        .pipe(sass({
            outputStyle: 'nested',
            precision: 10,
            includePaths: ['.']
        }).on('error', sass.logError))
        .pipe(minifyCSS())
        .pipe(autoprefixer({ browsers: ['last 2 versions'], cascade: false }))
        .pipe(concat('app.min.css'))
        .pipe(gulp.dest(resultDirectory + '/css'))
        .pipe(browserSync.stream());
});

gulp.task('js', () => {
    return gulp.src(homeDirectory + '/js/**/*.js')
        .pipe(concat('app.min.js'))
        .pipe(minifyJS())
        .pipe(gulp.dest(resultDirectory + '/js'))
        .pipe(browserSync.stream());
});

gulp.task('html', () => {
    gulp.src(homeDirectory + '/**/*.html')
        .pipe(gulp.dest(resultDirectory))
        .pipe(browserSync.stream());
});

gulp.task('img', () => {
    gulp.src(homeDirectory + '/img/**/*')
        .pipe(minifyImg())
        .pipe(gulp.dest(resultDirectory + '/img'));
});

gulp.task('copy:libs', function () {
    gulp.src(npmDist(), { base: './node_modules' })
        .pipe(gulp.dest('./' + resultDirectory + '/libs'));
});

gulp.task('delete', () => del([resultDirectory + '/css', resultDirectory + '/js', resultDirectory + '/img', resultDirectory + '/**/*.html']));

gulp.task('watch', () => {
    gulp.watch(homeDirectory + "/scss/**/*.scss", ['css']);
    gulp.watch(homeDirectory + "/js/**/*.js", ['js']);
    gulp.watch(homeDirectory + "/img/**/*", ['img']);
    gulp.watch(homeDirectory + "/**/*.html", ['html']);
});

gulp.task('default', () => {
    runSequence(
        'delete',
        'html',
        'css',
        'js',
        'img',
        'browser-sync',
        'watch'
    );
});