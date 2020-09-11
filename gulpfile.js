const gulp = require("gulp");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const tailwindcss = require("tailwindcss");
const cleanCSS = require("gulp-clean-css");
const htmlmin = require("gulp-htmlmin");

gulp.task("style", function () {
  return gulp
    .src("tailwind.css")
    .pipe(sass().on("error", sass.logError))
    .pipe(
      postcss([
        tailwindcss("./tailwind.config.js"),
        require("tailwindcss"),
        require("autoprefixer"),
      ])
    )
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(gulp.dest("build/"));
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

gulp.task("default", gulp.series("style", "minify-html", "watch"));
