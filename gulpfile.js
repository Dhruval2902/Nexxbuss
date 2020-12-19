const {src, dest, series} = require('gulp');


function htmlTask() {
  return src('src/*.html')
  .pipe(dest('dist'))
}

function stylesTask() {
  return src('src/*.css')
  .pipe(dest('dist'))
}

function scriptsTask() {
  return src('src/*.js')
 .pipe(dest('dist'))
}

exports.default = series(htmlTask, stylesTask, scriptsTask)
