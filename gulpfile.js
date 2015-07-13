// gulp related
var gulp = require('gulp'),
    gulp_front_matter = require('gulp-front-matter'),
    assign = require('lodash').assign,
    clean = require('gulp-clean'),
    connect = require('gulp-connect'),
    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    runSequence = require('run-sequence'),
    s3 = require('gulp-s3-upload'),
    path = require('path');

// Metalsmith related
var gulpsmith = require('gulpsmith'),
    markdown = require('metalsmith-markdown'),
    templates = require('metalsmith-templates'),
    permalinks = require('metalsmith-permalinks'),
    collections = require('metalsmith-collections'),
    Handlebars = require('handlebars'),
    fs = require('fs');

// Handlebars
Handlebars.registerPartial('header', fs.readFileSync(__dirname + '/templates/partials/header.hbt').toString());
Handlebars.registerPartial('footer', fs.readFileSync(__dirname + '/templates/partials/footer.hbt').toString());
Handlebars.registerHelper("log", function(something) {
  console.log(something);
});

// Gulp tasks
gulp.task('default', function (cb) {
    runSequence('clean', ['metalsmith','connect'], cb);    
});

gulp.task('connect', function() {
    connect.server({
        root: './build',
        port: 4000,
        livereload: true
    });
});

gulp.task('metalsmith', function() {
    gulp.src("./src/**/*")
        .pipe(gulp_front_matter()).on("data", function(file) {
            assign(file, file.frontMatter);
            delete file.frontMatter;
        }).pipe(
            gulpsmith()
                .use(collections({
                    page: {
                        pattern: 'pages/*.md'
                    },
                    post: {
                        pattern: 'posts/*.md',
                        sortBy: 'datetime',
                        reverse: true
                    }
                }))
                .use(markdown())
                .use(templates('handlebars'))
                .use(permalinks(':collection/:link'))
        ).pipe(gulp.dest("./build"))
        .pipe(connect.reload());
});

gulp.task('clean', function() {
    return gulp.src('./build', {read: false})
        .pipe(clean());
});