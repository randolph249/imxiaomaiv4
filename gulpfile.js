var gulp = require('gulp');
var autoprefix = require('gulp-autoprefixer');
var sass = require('gulp-sass');
//错误通知
var notify = require('gulp-notify');

var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var cssmin = require('gulp-cssmin');


var handlerError = function() {
  var args = Array.prototype.slice.call(arguments);

  notify.onError({
    title: 'compile error',
    message: '<%=error.message %>'
  }).apply(this, args); //替换为当前对象

  this.emit(); //提交
}


var templateCache = require('gulp-angular-templatecache');

gulp.task('html2string', function() {
  return gulp.src(['assets/**/*.html'])
    .pipe(templateCache({
      module: 'xiaomaiApp',
      transformUrl: function(url) {
        return '../assets/' + url;
      }
    }))
    .pipe(gulp.dest('assets/template'));
});



//将sass文件转移成
gulp.task('transfersass', function() {
  return gulp.src(['assets/**/*.scss'])
    .pipe(sass().on('error', handlerError))
    .pipe(gulp.dest('assets/'))

});

gulp.task('sass:watch', function() {
  gulp.watch('assets/**/*.scss', ['transfersass']);
});

gulp.task('JsIndexBuild', function() {
  return gulp.src(['assets/**/*.js', '!assets/main.js', '!assets/lib/*.js'])
    .pipe(concat('index.all.js'))
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('build'));
});

gulp.task('JsLibBuild', function() {
  return gulp.src(['assets/lib/angular.min.js', 'assets/lib/**.js',
      '!assets/lib/ocLazyLoad.min.js'
    ])
    .pipe(concat('index.base.js'))
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('build'));
});
gulp.task('cssBuild', function() {
  return gulp.src(['assets/**/*.css'])
    .pipe(concat('index.all.css'))
    .pipe(cssmin())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('build'));
})
gulp.task('build', ['JsIndexBuild', 'JsLibBuild', 'cssBuild']);

gulp.task('autoprefixer', function() {
  gulp.src('assets/**/*.css')
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('./'))
});

gulp.task('localtask', ['sass:watch']);
