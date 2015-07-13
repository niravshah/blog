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
    fs = require('fs');


// Gulp tasks
gulp.task('default', function (cb) {
    runSequence('clean', ['copyStatic','watch'], cb);    
});

gulp.task('connect', function() {
    connect.server({
        root: './build',
        port: 4000,
        livereload: false
    });
});

gulp.task('watch', ['connect'], function() {
    gulp.watch(['./src/**/*', './templates/**/*','./assets/**/*'], ['copyStatic']);    
});

gulp.task('metalsmith', ['clean'], function() {
    gulp.src("./src/**/*")
        .pipe(gulp_front_matter()).on("data", function(file) {
            assign(file, file.frontMatter);
            delete file.frontMatter;
        }).pipe(
            gulpsmith()
                .use(collections({                   
                    sp: {
                        pattern: 'pages/*.md'
                    },
                    post: {
                        pattern: 'posts/*.md',
                        sortBy: 'datetime',
                        reverse: true
                    }
                }))
                .use(markdown())
                .use(templates('swig'))
                .use(permalinks(':collection/:link'))
        ).pipe(gulp.dest("./build"))
        .pipe(connect.reload());
});


gulp.task('copyStatic', ['metalsmith'], function() {
    gulp.src("./assets/**")
        .pipe(gulp.dest("./build/assets"))
        .pipe(connect.reload());
});


gulp.task('clean', function() {
    return gulp.src('./build', {read: false})
        .pipe(clean());
});