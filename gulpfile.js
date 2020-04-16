const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const minifyCSS = require('gulp-clean-css');
const minifyImg = require('gulp-imagemin');
const minifyJS = require('gulp-uglify');
const minifyHTML = require('gulp-htmlmin');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const del = require('del');

gulp.task('browser-sync', () => {
   browserSync.init({
      server: {
         baseDir: 'dist',
      },
   });
});

gulp.task('css', () => {
   return gulp
      .src('src/scss/**/*.scss')
      .pipe(
         sass({
            outputStyle: 'nested',
            precision: 10,
            includePaths: ['.'],
         }).on('error', sass.logError)
      )
      .pipe(minifyCSS())
      .pipe(autoprefixer())
      .pipe(concat('app.min.css'))
      .pipe(gulp.dest('dist/css'))
      .pipe(browserSync.stream());
});

gulp.task('js', () => {
   return gulp
      .src('src/js/**/*.js')
      .pipe(concat('app.min.js'))
      .pipe(minifyJS())
      .pipe(gulp.dest('dist/js'))
      .pipe(browserSync.stream());
});

gulp.task('html', () => {
   return gulp
      .src('./src/*.html')
      .pipe(
         minifyHTML({
            collapseWhitespace: true,
         })
      )
      .pipe(gulp.dest('dist'))
      .pipe(browserSync.stream());
});

gulp.task('img', () => {
   gulp.src('src/img/**/*').pipe(minifyImg()).pipe(gulp.dest('dist/img'));
});

gulp.task('delete', () =>
   del(['dist/css', 'dist/js', 'dist/img', 'dist/**/*.html'])
);

gulp.task('watch', () => {
   gulp.watch('src/assets/scss/**/*.scss', gulp.series('css'));
   gulp.watch('src/assets/js/**/*.js', gulp.series('js'));
   gulp.watch('src/images/**/*.jpg', gulp.series('img'));
   gulp.watch('src/**/*.html', gulp.series('html'));
});

gulp.task(
   'default',
   gulp.series(
      'delete',
      gulp.parallel('html', 'css', 'js', 'img', 'browser-sync', 'watch')
   )
);
