var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var imageResize = require('gulp-image-resize');

function processImg (filesrc) {
    return gulp.src(filesrc)
    // compress and save
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest('public/uploads/comp'))
    // save 160 x 160
    .pipe(imageResize({
        width: 160,
        height: 160,
        crop: true
    }))
    .pipe(gulp.dest('public/uploads/160'))

    // save 80 x 80
    .pipe(imageResize({
        width: 80,
        height: 80,
        crop: true
    }))
    .pipe(gulp.dest('public/uploads/80'));
}
process.on('message', function (images) {
  console.log('Image processing started...');
  var stream = processImg(images);
  stream.on('end', function () {
    process.send('Image processing complete');
    process.exit();
  });
  stream.on('error', function (err) {
    process.send(err);
    process.exit(1);
  });
});
module.exports = {};