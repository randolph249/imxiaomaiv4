var gulp = require('gulp');
var autoprefix = require('gulp-autoprefixer');
var sass = require('gulp-sass');

//将sass文件转移成
gulp.task('transfersass', function() {
  return gulp.src(['assets/**/*.scss'])
    .pipe(sass())
    .pipe(gulp.dest('assets/'))

});

gulp.task('sass:watch', function() {
  gulp.watch('assets/**/*.scss', ['transfersass']);
});

gulp.task('autoprefixer', function() {
  gulp.src('assets/**/*.css')
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('./'))
});

gulp.task('css:watch', function() {
  gulp.watch('assets/**/*.css', ['autoprefixer']);
});

gulp.task('localtask', ['sass:watch']);
