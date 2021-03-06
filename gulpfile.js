var gulp = require("gulp");
var bs = require("browser-sync").create();
var concat = require('gulp-concat');

gulp.task('browser-sync', function() {
    bs.init({
      server: {
        baseDir: "./dist/"
      }
    });
});

gulp.task('scripts', function() {
  return gulp.src('./js/*')
    .pipe(concat('script.js'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('styles', function() {
  return gulp.src('./css/*')
    .pipe(concat('style.css'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('index', function(){
  return gulp.src("./index.html")
    .pipe(gulp.dest("./dist/"));
});

gulp.task('watch', function(){
  gulp.watch("./js/*", ["scripts"]);
  gulp.watch("./css/*", ["styles"]);
  gulp.watch("./index.html", ["index"]);
  gulp.watch('./dist/*', bs.reload);
});

gulp.task('default', ['browser-sync', 'scripts', 'styles', 'index', 'watch']);
