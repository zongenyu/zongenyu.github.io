import gulp from 'gulp';

import sass from 'gulp-ruby-sass';

import browserSync from 'browser-sync';

import del from 'del';

import fileinclude from 'gulp-file-include';

import sourcemaps from 'gulp-sourcemaps';

import postcss from 'gulp-postcss';

import autoprefixer from 'gulp-autoprefixer';

import cleanCSS from 'gulp-clean-css';

import optimizejs from 'gulp-optimize-js';

gulp.task('fileinclude', () => {
    runFileinclude();
});

function runFileinclude() {
    gulp.src(['rawHtml/**/*.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file',
            indent: true
        }))
        .pipe(gulp.dest('./'));
    console.log('finish fileinclude');
}

gulp.task('sass', () =>
    sass('sass/main.scss', { sourcemap: true })
    .on('error', sass.logError)
    .pipe(sourcemaps.write())
    // .pipe(sourcemaps.write('maps', {
    // 	includeContent: false,
    // 	sourceRoot: 'source'
    // }))
    .pipe(autoprefixer(['last 2 versions']))
    .pipe(gulp.dest('styles'))
    .pipe(browserSync.stream({ match: '**/*.css' }))
);

gulp.task('autoprefixer', () =>
    gulp.src('./styles/*.css')
    .pipe(sourcemaps.init())
    .pipe(postcss([autoprefixer({ browsers: ['last 2 versions'] })]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist'))
);

gulp.task('serve', ['sass', 'fileinclude'], () => {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });

    gulp.watch('sass/**/*', ['sass']);
    gulp.watch('rawHtml/**/**').on('change', function() {
        runFileinclude();
    });
    gulp.watch('*.html').on('change', browserSync.reload);
    gulp.watch('scripts/main.js').on('change', browserSync.reload);
});

gulp.task('cleanDist', () => {
    return del([
        'dist/**/*'
    ]);
});

gulp.task('minifycss', () => {
    gulp.src('./styles/main.css').pipe(cleanCSS({ compatibility: 'ie8' })).pipe(gulp.dest('./dist/styles/'));
});

gulp.task('optimize', () => {
    gulp.src('./scripts/**/*.js').pipe(optimizejs()).pipe(gulp.dest('./dist/scripts'));
});

gulp.task('build', ['sass', 'cleanDist', 'minifycss'], () => {
    gulp.src('*.html').pipe(gulp.dest('./dist/'));
    gulp.src('./styles/**/*').pipe(gulp.dest('./dist/styles/'));
    gulp.src(['./scripts/**/*', '!./scripts/**/*.docs.js']).pipe(gulp.dest('./dist/scripts/'));
    gulp.src('./images/**/*').pipe(gulp.dest('./dist/images/'));
    gulp.src('./fonts/*').pipe(gulp.dest('./dist/fonts/'));
    // gulp.src('./vendors/bootstrap-sass-master/assets/**/**/*').pipe(gulp.dest('./dist/vendors/bootstrap-sass-master/assets/'));
    // gulp.src('./vendors/font-awesome-4.4.0/**/*').pipe(gulp.dest('./dist/vendors/font-awesome-4.4.0/'));
});

gulp.task('default', ['serve']);