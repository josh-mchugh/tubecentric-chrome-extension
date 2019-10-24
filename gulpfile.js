var gulp = require("gulp");
var gulpLoadPlugins = require("gulp-load-plugins");
var del = require("del");
var webpack = require('webpack-stream');
var $ = gulpLoadPlugins();
var args = require('minimist')(process.argv.slice(2));

gulp.task("init:fomantic", function() {
  return gulp.src("fomantic/", { read: false })
    .pipe($.shell("cd fomantic && gulp build"));
});

gulp.task("init:fomantic:copy", function() {
  return gulp.src("fomantic/dist/**/*")
    .pipe(gulp.dest("app/components/popup/src/vendor/fomantic"))
    .pipe(gulp.dest("app/components/options/src/vendor/fomantic"))
    .pipe(gulp.dest("app/components/content-scripts/src/vendor/fomantic"));
});

gulp.task("init", gulp.series(
    "init:fomantic",
    "init:fomantic:copy"
));

gulp.task("build:clean", del.bind(null, ["dist", "package"]));

gulp.task("build:locales", function() {
  return gulp.src("app/_locales/**/*")
    .pipe(gulp.dest("dist/_locales"));
});

gulp.task("build:images", function() {
  return gulp
    .src("app/images/**/*")
    .pipe(
      $.if($.if.isFile,$.cache(
          $.imagemin({
            progressive: true,
            interlaced: true,
            // don't remove IDs from SVGs, they are often used
            // as hooks for embedding and styling
            svgoPlugins: [{ cleanupIDs: false }]
          })
        ).on("error", function(err) {
          console.log(err);
          this.end();
        })
      )
    )
    .pipe(gulp.dest("dist/images"));
});

gulp.task("build:background", function() {
  return gulp.src("app/components/background/main.js")
    .pipe(webpack({
      output: {
        filename: "main.js"
      }
    }))
    .pipe(gulp.dest("dist/background"))
});

gulp.task("build:popup", function() {
  return gulp.src("app/components/popup", { read: false })
    .pipe($.shell("npx vue-cli-service build app/components/popup/src/main.js --dest dist/popup --mode popup --no-clean"));
});

gulp.task("build:options", function() {
  return gulp.src("app/components/options", { read: false })
    .pipe($.shell("npx vue-cli-service build app/components/options/src/main.js --dest dist/options --mode options --no-clean"));
});

gulp.task("build:content-scripts", function() {
  return gulp
    .src("app/components/content-scripts", { read: false })
    .pipe($.shell("npx vue-cli-service build app/components/content-scripts/src/main.js --dest dist/content-scripts --mode content-scripts --no-clean"));
});

gulp.task("build:manifest", function() {
  return gulp.src("app/manifest.json")
    .pipe(gulp.dest("dist"));
});

gulp.task("build:size", function() {
  return gulp.src("dist/**/*")
    .pipe($.size({ title: "build", gzip: true }));
});

gulp.task("build", gulp.series(
    "build:clean",
    gulp.parallel(
      "build:locales",
      "build:images",
      "build:manifest",
      "build:background",
      "build:popup",
      "build:options",
      "build:content-scripts",
    ),
    "build:size"
  )
);

gulp.task("package:zip", function() {
  var manifest = require("./dist/manifest.json");
  return gulp.src("dist/**/*")
    .pipe($.zip("tubecentic-" + manifest.version + ".zip"))
    .pipe(gulp.dest("package"));
});

gulp.task("package:size", function() {
  return gulp.src("package/**/*")
    .pipe($.size({ title: "package", gzip: true }));
});

gulp.task("package", gulp.series(
    "build", 
    "package:zip",
    "package:size"
));