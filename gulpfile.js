var gulp = require('gulp'),
sass = require('gulp-ruby-sass'),
connect = require('gulp-connect'),
autoprefixer = require('gulp-autoprefixer'),
plumber = require('gulp-plumber'),
notify = require('gulp-notify'),
csslint = require('gulp-csslint'),
cssmin  = require('gulp-cssmin'),
header  = require('gulp-header'),
minifyCSS = require('gulp-minify-css');



gulp.task('minify-css', function() {
  gulp.src('./css/*.css')
  .pipe(minifyCSS({keepBreaks:true}))
  .pipe(gulp.dest('./dist/'));
});


gulp.task('styles',function(){
  gulp.src(['./sass/*.scss','./sass/fontawesome/*.scss'])
  .pipe(sass({
    // style: 'compressed',
    style: 'compact',
    sourcemap: true
  }))
  .pipe(csslint())
  // .pipe(csslint.reporter())
  .pipe(autoprefixer('last 2 version', 'ie 9', 'ie 8', 'Firefox ESR'))
  .pipe(header('@charset "utf-8";\n\n'))
  .pipe(gulp.dest('./css'))
  .pipe(connect.reload())
  .pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}));
});


//ローカルサーバー
gulp.task('connect',function(){
  // connect.server({
  //   root: './',   //ルートディレクトリ
  //   port: 8888,     //ポート番号
  //   livereload: true
  // });
});


//htmlタスク
gulp.task('html',function(){
  gulp.src('./*.html')            //実行するファイル
  .pipe(connect.reload());    //ブラウザの更新
});

//ファイルの監視
gulp.task('watch',function(){
  gulp.watch(['./*.html'],['html']);          //htmlファイルを監視
  gulp.watch(['./sass/*.scss','./sass/fontawesome/*.scss'],['styles']); //scssファイルを監視
});

gulp.task('default',['styles','watch','connect']);