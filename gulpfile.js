//Starting Gulp Project
// npm init
// npm install gulp gulp-sass gulp-autoprefixer browser-sync gulp-useref gulp-uglify gulp-cssnano gulp-imagemin gulp-cache del run-sequence gulp-plumber --save-dev


var gulp = require('gulp'), // npm install gulp --save-dev
    sass = require('gulp-sass'), // npm install gulp-sass --save-dev
	 autoprefixer = require('gulp-autoprefixer'), // npm install gulp-autoprefixer --save-dev
    browserSync = require('browser-sync').create(), // npm install browser-sync --save-dev
    useref = require('gulp-useref'), // npm install gulp-useref --save-dev
    uglify = require('gulp-uglify'), // npm install gulp-uglify --save-dev
    cssnano = require('gulp-cssnano'), // npm install gulp-cssnano
    gulpIf = require('gulp-if'),
    imagemin = require('gulp-imagemin'), // npm install gulp-imagemin --save-dev
    cache = require('gulp-cache'), // npm install gulp-cache --save-dev
    del = require('del'), // npm install del --save-dev
    runSequence = require('run-sequence'), // npm install run-sequence --save-dev
    plumber = require('gulp-plumber'); // npm install gulp-plumber --save-dev

// Gulp tasks

// Gulp Plumber Variable for errors
var onError = function(err) {
   console.log(err.toString());
   this.emit('end');
};

// Sass - Compiles Sass or SCSS files
gulp.task('sass', function () {
   return gulp.src('app/sass/**/*.sass')
      .pipe(plumber({
         errorHandler: onError
      }))
      .pipe(sass())
      .pipe(gulp.dest('app/css'))
      .pipe(browserSync.reload({
         stream: true
   }))
});

// Autoprefixer - Uses prefixes for CSS rules
gulp.task('auto', function() {
	return gulp.src('app/*.css')
		.pipe(autoprefixer({
			browers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(gulp.dest('app/css'));
});

// Browser Sync - Makes a local host to preview site changes
gulp.task('browserSync', function() {
   browserSync.init ({
      server: {
         baseDir: 'app'
      },
   })
});

// Useref - Minifies CSS and JS files
gulp.task('useref', function() {
   return gulp.src('app/*.html')
      .pipe(useref())
      // Only minifies JS files
      .pipe(gulpIf('*.js', uglify()))
      // Only minfies CSS files
      .pipe(gulpIf('*.css', cssnano()))
      .pipe(gulp.dest('app/dist'))
});

// ImageMin - Minifies images
gulp.task('images', function() {
   return gulp.src('app/img/**/*.+(png|jpg|gif|svg)')
      // Caches images that run through imagemin
      .pipe(cache(imagemin({
         interlaced: true
   })))
      .pipe(gulp.dest('app/dist/img'))
});

// Fonts - Copies fonts to dist
gulp.task('fonts', function() {
   return gulp.src('app/fonts/**/*')
      .pipe(gulp.dest('app/dist/fonts'))
});

// Delete - Cleans up generated files
gulp.task('clean:dist', function() {
   return del.sync('app/dist');
});

// Run Sequence - Runs a sequence of tasks
gulp.task('build', function(callback) {
   runSequence('clean:dist', ['sass', 'auto', 'useref', 'images', 'fonts'],
              callback
   )
});

// Run Sequence 2 - Runs sequence
gulp.task('default', function(callback) {
   runSequence(['sass', 'browserSync', 'watch'],
      callback
   )
});

//This lets Gulp watch and update any Sass and JS files
gulp.task('watch', ['browserSync', 'sass'], function () {
   gulp.watch('app/sass/**/*.sass', ['sass']);
   gulp.watch('app/*.html', browserSync.reload);
   gulp.watch('app/js/**/*.js', browserSync.reload)
})
