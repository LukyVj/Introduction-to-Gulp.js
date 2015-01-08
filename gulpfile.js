'use strict';
var gulp = require('gulp');

// Load the packages
// Here we load all the package we'll need to 
// Minify, compile and compress our JS / SASS Files
var sass = require('gulp-ruby-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifycss = require('gulp-minify-css');
var uglify = require('gulp-uglifyjs');
var liveReload = require('gulp-livereload');
var size = require('gulp-size');
var uncss = require('gulp-uncss');  
var imageResize = require('gulp-image-resize');  
var pako = require('gulp-pako');
var $ = require('gulp-load-plugins')();


// The default task 
// This task will run if you just type : $ gulp
gulp.task('default', function () {
    gulp.start('build'); // As defined below, we call the build task
});

// Build task
// The build task will be used by the Default task
// You can pass as much tasks in it. 
// Here, we will fire the scripts & styles tasks.
gulp.task('build', ['scripts', 'styles'] );


// Style task
gulp.task('styles', function () {
 return gulp.src('app/styles/main.scss') // The scss file location
 .pipe(sass({                            // Will compile the SASS
    style: 'expanded',                   // The sourcemap=none is a fix to 
    "sourcemap=none": true               // A problem that have Autoprefixer 
 }))                                     // https://github.com/sindresorhus/gulp-ruby-sass/issues/156

 .pipe(autoprefixer({                    // Will autoprefix the css
     browser: ['last 2 version']
 }))                                     
 .pipe(gulp.dest('app/styles'));         // The final destination
});


// Script task
gulp.task('scripts', function () {
 return gulp.src('app/scripts/main.js')  // The js files location
 .pipe(uglify())                         // Will minify the Javascript
 .pipe(gulp.dest('app/dist/scripts/'));  // The final destination
});


// Connect task
gulp.task('connect', function () {
    var connect = require('connect');
    var app = connect()
    .use(require('connect-livereload')({ port: 35729 }))
    .use(connect.static('app'))
    .use(connect.static('.tmp'))
    .use(connect.directory('app'));

    require('http').createServer(app)
    .listen(9000)
    .on('listening', function () {
        console.log('Started connect web server on http://localhost:9000');
    });
});

// Serve task
gulp.task('serve', ['connect', 'styles', 'scripts', 'uncss'], function () {
    require('opn')('http://localhost:9000');
});


// Watch task 
gulp.task('watch', ['connect', 'serve'], function () {
    var server = $.livereload();

    // watch for changes
    gulp.watch([
        'app/*.html',
        'app/scripts/**/*.js',
        'app/styles/**/*.scss',
        'app/dist/styles/**/*.css',
        'app/images/**/*'
        ]).on('change', function (file) {
            server.changed(file.path);
        });
    

    // Watch the final css file, to reload the page if changed.
    gulp.watch('app/styles/**/*.scss', ['styles']);
    gulp.watch('app/styles/**/*.css', ['uncss']);
});

// Infos tasks
// This task is used along with gulp-size, to give us an idication 
// About the size of our project
gulp.task('infos', function(){
    // You can pass as many relative urls as you want
    return gulp.src([
        'app/scripts/**/*',
        'app/styles/**/*'
    ])    
    .pipe(size());
    
})

// UnCss task
gulp.task('uncss', function() {
    gulp.src('app/styles/main.css')
        .pipe(uncss({
            html: [
                'app/index.html'
            ]
        }))
    .pipe(gulp.dest('app/dist/styles'));
});


// Image resize task
gulp.task('image-resize', function(){
    return gulp.src('app/images/*.png')
    .pipe(imageResize({ 
      width : 200
  }))
    .pipe(gulp.dest('app/images/min'))
})

// Gzip files
gulp.task('css-gzip', function(){
    return gulp.src('app/styles/main.css')
    .pipe(pako.gzip())
    .pipe(gulp.dest('app/dist/styles/'))
});

gulp.task('js-gzip', function(){
    return gulp.src('app/scripts/**/*.js')
    .pipe(pako.gzip())
.pipe(gulp.dest('app/dist/scripts/'))
});

gulp.task('gzip', ['css-gzip', 'js-gzip']);
