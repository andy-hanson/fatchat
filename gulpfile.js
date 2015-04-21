'use strict'
require('source-map-support').install()
const
	babel = require('gulp-babel'),
	eslint = require('gulp-eslint'),
	gulp = require('gulp'),
	jade = require('gulp-jade'),
	plumber = require('gulp-plumber'),
	sourceMaps = require('gulp-sourcemaps'),
	stylus = require('gulp-stylus'),
	watch = require('gulp-watch')

gulp.task('default', [ 'watch-compile-client', 'serve' ])
gulp.task('watch-compile-client', [ 'watch-view', 'watch-style', 'watch-script' ])
gulp.task('compile-client', [ 'lib', 'view', 'style', 'script' ])
gulp.task('heroku:production', [ 'compile-client', 'compile-server' ], serve)

function task(name, src, dest, pipe) {
	gulp.task(name, function() {
		return pipe(gulp.src(src))
		.pipe(gulp.dest(dest))
	})
	gulp.task('watch-' + name, function() {
		return pipe(
			gulp.src(src)
			.pipe(watch(src, { verbose: true}))
			.pipe(plumber()))
			.pipe(gulp.dest(dest))
	})
}

function simple(name, pipe, outName) {
	if (outName === undefined)
		outName = name
	task(name, 'assets/' + name + '/**/*', 'public/' + outName, function(stream) {
		return stream.pipe(pipe)
	})
}

simple('view', jade(), '')
simple('style', stylus())
gulp.task('lib', function() {
	return gulp.src('bower_components/**/*', { base: 'bower_components' })
	.pipe(gulp.dest('public/lib'))
})

task('script', 'assets/script/**/*', 'public/script', function(stream) {
	return stream
	.pipe(sourceMaps.init())
	.pipe(babel({ modules: 'amd' }))
	.pipe(sourceMaps.write('.'))
})

task('compile-server', './server-src/**/*.js', 'server-js', function(stream) {
	return stream
	.pipe(sourceMaps.init())
	.pipe(babel())
	.pipe(sourceMaps.write('.'))
	.pipe(gulp.dest('server-js'))
})

function serve() {
	require('./server-js/server')()
}

gulp.task('serve', [ 'compile-server' ], serve)

gulp.task('lint', function() {
	return gulp.src([ 'assets/script/**/*.js', './server-src/**/*.js', './*.js' ])
	.pipe(eslint())
	.pipe(eslint.format())
})
