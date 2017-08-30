require('shelljs/global')
const path = require('path');
const gulp = require('gulp');
const source = require('vinyl-source-stream');
const browserify = require('browserify');
const babelify = require('babelify');
const minifycss = require('gulp-minify-css');
const uglify = require('gulp-uglify');
const buffer = require('vinyl-buffer');
const plugins = require('gulp-load-plugins')({ camelize: true})
const config = require('./config/index');

const fileConfigs = [
  {
    entry: [
      path.resolve(__dirname, './src/client/entry.js'),
    ],
    output: 'main.js',
    option: {},
  },
];

const assetsRootPath = config.build.root;
const assetsPath = path.join(config.build.root, config.build.subDirectory);

rm('-rf', assetsRootPath);
mkdir('-p', assetsPath);
// static
cp('-R', 'static/*', assetsPath);
// css
// cp('-R', 'src/client/main.css', assetsRootPath);
// cp('-R', 'src/client/ios.css', assetsRootPath);
// html
cp('-R', 'src/client/test.html', assetsRootPath);

gulp.task('minifycss', function() {
  return gulp.src('src/client/*.css')
        .pipe(plugins.minifyCss({processImport: false}))
        .pipe(gulp.dest(assetsRootPath))
});

gulp.task('browserify', ['minifycss'], function () {
  const browserifies = [];

  for (let i = 0; i < fileConfigs.length; i++) {
    browserifies.push(browserify(fileConfigs[i].entry, fileConfigs[i].option)
      .transform(babelify,{
        presets:['es2015']
      })
      .bundle()
      //Pass desired output filename to vinyl-source-stream
      .pipe(source(fileConfigs[i].output))
      .pipe(buffer())
      // 压缩
      .pipe(uglify())
      // Start piping stream to tasks!
      .pipe(gulp.dest(path.join(assetsRootPath, '/')))

      // .pipe(gulp.dest(path.join('dist/')))
    );
  }

  return browserifies;
});
