const gulp = require("gulp");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const tailwindcss = require("tailwindcss");
const cleanCSS = require("gulp-clean-css");
const htmlmin = require("gulp-htmlmin");
const browserSync = require("browser-sync").create(); 
const sourcemaps = require("gulp-sourcemaps"); // Maps code in a compressed file
var less        = require('gulp-less');
var minify      = require('gulp-minify-css');
var autoprefixer   = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
const lineec = require("gulp-line-ending-corrector");

const browsersync = (done) => {
	browserSync.init({
    target: 'http://localhost:3000',
    server: "./build",
		open: true,
		injectChanges: true,
		watchEvents: ["change", "add", "unlink", "addDir", "unlinkDir"],
	});
	done();
};

// Helper function to allow browser reload with Gulp 4.
const reload = (done) => {
	browserSync.reload();
	done();
};
gulp.task("style", function () {
  return gulp
    .src("style.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(
      postcss([
        tailwindcss("./tailwind.config.js"),
        require("tailwindcss"),
        require("autoprefixer"),
      ])
    )
    .pipe(sourcemaps.init())
		.pipe(
			sass({
				errLogToConsole: true,
				outputStyle: "compact",
				precision: 10,
			})
		)
		.on("error", sass.logError)
		.pipe(sourcemaps.write({ includeContent: false }))
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(autoprefixer([
      "last 2 version",
      "> 1%",
      "ie >= 11",
      "last 1 Android versions",
      "last 1 ChromeAndroid versions",
      "last 2 Chrome versions",
      "last 2 Firefox versions",
      "last 2 Safari versions",
      "last 2 iOS versions",
      "last 2 Edge versions",
      "last 2 Opera versions",
    ]))
		.pipe(sourcemaps.write(".",{ sourceRoot: 'style.scss' }))
    .pipe(gulp.dest('build/'))
    .pipe(minify())
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
    .pipe(concat('style.min.css'))
    .pipe(minify({ maxLineLen: 10 }))
		.pipe(lineec()) // Consistent Line Endings for non UNIX systems.
    .pipe(gulp.dest('build/'))
    
    .pipe(browserSync.stream());
});
gulp.task("minify-html", function () {
  return gulp
    .src("*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("build/"));
});

// sass watch file
gulp.task("watch", () => {
  gulp.watch("./*.*", gulp.series("style"));
});

gulp.task("default", gulp.series("style", "minify-html", 	browsersync,
() => {
  gulp.watch("*.html", reload); // Reload on PHP file changes.
  gulp.watch("*.scss", gulp.parallel("style")); }));
