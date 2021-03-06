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

var scp = require('gulp-scp2');
var sitemap = require('gulp-sitemap');
var git = require('gulp-git');

var handlebars = require('handlebars'),
    layouts = require('handlebars-layouts');

handlebars.registerHelper(layouts(handlebars));
handlebars.registerPartial('layout', fs.readFileSync(__dirname + '/templates/layout/default.hbt').toString());
handlebars.registerPartial('responseCalc', fs.readFileSync(__dirname + '/templates/layout/responseCalc.hbt').toString());
handlebars.registerPartial('blogRight', fs.readFileSync(__dirname + '/templates/layout/blogRight.hbt').toString());

handlebars.registerHelper("log", function(something) {
    console.log(something);
});

gulp.task('server', function(cb){
    runSequence('critical','watch',cb);    
})
gulp.task('default', function(cb) {
   runSequence('clean', ['metalsmith', 'copyStatic','sitemap'], ['minify-js','minify-css'],'minify-html','sitemap','connect',cb);
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
        blog: {
            pattern: 'blog/*post.md',
            sortBy: 'datetime',
            reverse: true
        },
        resources: {
            pattern: 'resources/*.md'
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
gulp.task('minify-js', function() {
    return gulp.src('./jssrc/*.js').pipe(uglify()).pipe(gulp.dest('./build/assets/js'));
    //return gulp.src('./jssrc/*.js').pipe(gulp.dest('./build/assets/js'));
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
gulp.task('jpg', function() {
    return gulp.src('./img/**/*.jpg').pipe(imageminJpegtran({
        progressive: true
    })()).pipe(gulp.dest('./assets/img'));
});
gulp.task('png', function() {
    return gulp.src('./img/**/*.png').pipe(imagemin({
        progressive: true,
        svgoPlugins: [{
            removeViewBox: false
        }],
        use: [pngquant()]
    })).pipe(gulp.dest('./assets/img'));
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

gulp.task('sitemap', function () {
  gulp.src('build/**/*.html')
    .pipe(sitemap({
    siteUrl: 'http://www.specky.co',
    changefreq: 'weekly',
    pages: ['build/index.html', 'build/blog/**/*.html', 'build/register/*.html','!build/assets/**/*.html']
  }))
    .pipe(gulp.dest('./build'));
});


gulp.task('git', function(cb){
  runSequence('git-add-commit','git-push',cb)
});

gulp.task('git-add-commit', function(){
  return gulp.src('.')
    .pipe(git.add())
    .pipe(git.commit('Updates'));    
});

gulp.task('git-push', function(){
  git.push('origin', 'master', function (err) {
    if (err) throw err;
  });
});

gulp.task('scp', function() {
  return gulp.src('build/**/*.*')
  .pipe(scp({
    host: '160.153.57.100',
    username: 'niravshah',
    password:'Alpha6383',
    dest: '/home/niravshah/public_html/'
  }))
  .on('error', function(err) {
    console.log(err);
  });
});

gulp.task('deploy', function(){
  runSequence('git','scp');
});


