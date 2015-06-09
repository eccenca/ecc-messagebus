var gulp = require('ecc-gulp-tasks')([
    'build',
    'test',
    'cover',
], require('./config.js'));

gulp.task('default', ['build']);
