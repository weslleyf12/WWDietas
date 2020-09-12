const { series } = require('gulp')
const gulp = require('gulp')
const concat = require('gulp-concat')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')

function javascript(cb) {
	gulp.src('index.js')
	 .pipe(babel({
	 	comments: false,
	 	presets: ["env"]
	 }))
	 .pipe(uglify())
	 .pipe(gulp.dest('build'))
	return cb()
}

function css(cb) {
	gulp.src('../css/style.css')
	.pipe(concat('style.css'))
	.pipe(babel({
		comments: false,
		presets: ["env"]
	}))
	.pipe(uglify())
	.pipe(gulp.dest('build'))
   return cb()
}

module.exports.default = series(javascript, css)