var gulp = require('gulp'),
sass = require('gulp-ruby-sass'),
connect = require('gulp-connect'),
// spritesmith = require('gulp.spritesmith'),
autoprefixer = require('gulp-autoprefixer'),
plumber = require('gulp-plumber'),
notify = require('gulp-notify');
// compass = require('gulp-compass'),
// minifyCSS = require('gulp-minify-css');



// gulp.task('minify-css', function() {
//   gulp.src('./css/*.css')
//   .pipe(minifyCSS({keepBreaks:true}))
//   .pipe(gulp.dest('./dist/'))
// });

//
gulp.task('styles',function(){
  gulp.src('./sass/*.scss','./sass/fontawesome/*.scss')
  .pipe(sass({
    // style: 'compressed',
    style: 'compact',
    sourcemap: true
  }))
  .pipe(autoprefixer('last 2 version', 'ie 9', 'ie 8', 'Firefox ESR'))
  .pipe(gulp.dest('./css'))
  .pipe(connect.reload())
  .pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}));
});

//スプライド画像生成
// gulp.task('sprite', function () {
//   var spriteData = gulp.src('./img/sprite/*.png') //スプライトにする愉快な画像達
//   .pipe(spritesmith({
//     imgName: 'sprite.png', //スプライトの画像
//     cssName: '_sprite.scss', //生成されるscss
//     imgPath: '../img/sprite.png', //生成されるscssに記載されるパス
//     cssFormat: 'scss', //フォーマット
//     cssVarMap: function (sprite) {
//       // sprite.name = 'sprite-' + sprite.name; //VarMap(生成されるScssにいろいろな変数の一覧を生成)
//     }
//   }));
//   spriteData.img.pipe(gulp.dest('./img/')); //imgNameで指定したスプライト画像の保存先
//   spriteData.css.pipe(gulp.dest('./sass/')); //cssNameで指定したcssの保存先
// });

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