// gulp@3.9.1
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var autoprefixer = require('autoprefixer');

gulp.task('jade', function() {
 
  gulp.src('./source/*.jade')
    // plumber 使程式出錯時，terminal 不會停止，置於第一個 pipe
    .pipe($.plumber())
    .pipe($.jade({
      pretty: true
    }))
    .pipe(gulp.dest('./public/'))
})

gulp.task('sass', function () {
 
  var plugins = [
    // tailwindcss(),
    autoprefixer({overrideBrowserslist: ['last 3 version']})
  ];
 
  return gulp.src('./source/scss/**/*.scss')
    .pipe($.plumber())
    .pipe($.sass().on('error', $.sass.logError))
    // 已編譯完成 CSS
    // postcss 為 CSS 後處理器，再搭配 autoprefixer 一起使用為 CSS 屬性自動加入 vendor prefix
    // postcss 可以載入大量插件，autoprefixer 為其中之一
    .pipe($.postcss(plugins))
    .pipe(gulp.dest('./public/css'))
});
 
gulp.task('babel', function () {
    return gulp.src('./source/js/**/*.js')
        // .pipe($.sourcemaps.init())
        .pipe($.babel({
            presets: ['@babel/env']
        }))
        // .pipe($.concat('all.js'))
        // .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('./public/js'))
})

gulp.task('watch', function () {
  gulp.watch('./source/*.jade', ['jade']);
  gulp.watch('./source/scss/**/*.scss', ['sass']);
  gulp.watch('./source/js/**/*.js', ['babel']);
})

gulp.task('default', ['jade', 'sass', 'babel', 'watch']);