const { series } = require('gulp')
const gulp = require('gulp')
const concat = require('gulp-concat')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')

function padrao(cb) {
	gulp.src('index.js')
	 .pipe(babel({
	 	comments: false,
	 	presets: ["env"]
	 }))
	 .pipe(uglify())
	 .pipe(gulp.dest('build'))
	return cb()
}

module.exports.default = series(padrao)