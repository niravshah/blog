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
    path = require('path'),
    imageminJpegtran = require('imagemin-jpegtran');
uglify = require('gulp-uglify'),
minifyCss = require('gulp-minify-css'),
minifyHTML = require('gulp-minify-html'),
imagemin = require('gulp-imagemin'),
pngquant = require('imagemin-pngquant'),
wait = require('gulp-wait'),
critical = require('critical');
// Metalsmith related
var gulpsmith = require('gulpsmith'),
    markdown = require('metalsmith-markdown'),
    templates = require('metalsmith-templates'),
    permalinks = require('metalsmith-permalinks'),
    collections = require('metalsmith-collections'),
    fs = require('fs');
var handlebars = require('handlebars'),
    layouts = require('handlebars-layouts');
handlebars.registerHelper(layouts(handlebars));
handlebars.registerPartial('layout', fs.readFileSync(__dirname + '/templates/layout/default.hbt').toString());
handlebars.registerHelper("log", function(something) {
    console.log(something);
});

gulp.task('server', function(cb){
    runSequence('critical','watch',cb);    
})
gulp.task('default', function(cb) {
    runSequence('clean', ['metalsmith', 'copyStatic'], ['javascript-compress', 'minify-css'],'minify-html','watch',cb);
});
gulp.task('connect', function() {
    connect.server({
        root: './build',
        port: 5000,
        livereload: false
    });
});
gulp.task('wait', function() {
    wait(1000);
})
gulp.task('watch', ['connect'], function() {
    gulp.watch(['./src/**/*', './templates/**/*', './assets/**/*'], ['copyStatic']);
});
gulp.task('metalsmith', function() {
    gulp.src("./src/**/*").pipe(gulp_front_matter()).on("data", function(file) {
        assign(file, file.frontMatter);
        delete file.frontMatter;
    }).pipe(gulpsmith().use(collections({
        sp: {
            pattern: 'pages/*.md'
        },
        post: {
            pattern: 'posts/*.md',
            sortBy: 'datetime',
            reverse: true
        }
    })).use(markdown()).use(templates('handlebars')).use(permalinks(':collection/:link'))).pipe(gulp.dest("./build"));
});
gulp.task('copyStatic', function() {
    gulp.src("./assets/**").pipe(gulp.dest("./build/assets")).pipe(connect.reload());
});
gulp.task('clean', function() {
    return gulp.src('./build', {
        read: false
    }).pipe(clean());
});
gulp.task('javascript-compress', function() {
    return gulp.src('./jssrc/*.js').pipe(uglify()).pipe(gulp.dest('./build/assets/js'));
});
gulp.task('minify-css', function() {
    return gulp.src('./csssrc/*.css').pipe(minifyCss({
        compatibility: 'ie8'
    })).pipe(gulp.dest('./build/assets/css'));
});
gulp.task('minify-html', function() {
    var opts = {
        conditionals: true,
        spare: true
    };
    return gulp.src('./build/**/*.html').pipe(minifyHTML(opts)).pipe(gulp.dest('./build/'));
});
gulp.task('jpegtran', function() {
    return gulp.src('./img/**/*.jpg').pipe(imageminJpegtran({
        progressive: true
    })()).pipe(gulp.dest('./build/assets/img'));
});
gulp.task('pngquant', function() {
    return gulp.src('./img/**/*.png').pipe(imagemin({
        progressive: true,
        svgoPlugins: [{
            removeViewBox: false
        }],
        use: [pngquant()]
    })).pipe(gulp.dest('./build/assets/img'));
});
gulp.task('critical', function() {
    critical.generate({
        base: 'build/',
        src: 'index.html',
        dest: './build/index.html',
        inline:true,
        minfy:true,
        dimensions: [{
            height: 200,
            width: 500  
        }, {
            height: 900,
            width: 1200
        }]
    });
});