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

const homeDirectory="src"
const resultDirectory="front"

gulp.task('browser-sync', () => {
    browserSync.init({
        server: {
            baseDir: homeDirectory
        }
    });
});

gulp.task('css', () => {
    return gulp.src(resultDirectory+'/scss/**/*.scss')
        .pipe(sass({
            outputStyle: 'nested',
            precision: 10,
            includePaths: ['.']
        }).on('error', sass.logError))
        .pipe(minifyCSS())
        .pipe(autoprefixer())
        .pipe(concat('app.min.css'))
        .pipe(gulp.dest(homeDirectory+'/css'))
        .pipe(browserSync.stream());
});

gulp.task('js', () => {
    return gulp.src(resultDirectory+'/js/**/*.js')
        .pipe(concat('app.min.js'))
        .pipe(minifyJS())
        .pipe(gulp.dest(homeDirectory+'/js'))
        .pipe(browserSync.stream());
});

gulp.task('html', () => {
    gulp.src(resultDirectory+'/**/*.html')
        .pipe(gulp.dest(homeDirectory))
        .pipe(browserSync.stream());
});

gulp.task('img', () => {
    gulp.src(resultDirectory+'/img/**/*')
        .pipe(minifyImg())
        .pipe(gulp.dest(homeDirectory+'/img'));
});

gulp.task('copy:libs', function() {
    gulp.src(npmDist(), {base:'./node_modules'})
      .pipe(gulp.dest('./'+homeDirectory+'/libs'));
});

gulp.task('delete', () => del([homeDirectory+'/css', homeDirectory+'/js', homeDirectory+'/img', homeDirectory+'/**/*.html']));

gulp.task('watch', () => {
    gulp.watch(resultDirectory+"/scss/**/*.scss", ['css']);
    gulp.watch(resultDirectory+"/js/**/*.js", ['js']);
    gulp.watch(resultDirectory+"/img/**/*", ['img']);
    gulp.watch(resultDirectory+"/**/*.html", ['html']);
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