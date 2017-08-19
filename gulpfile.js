require('shelljs/global')
const path = require('path');
const gulp = require('gulp');
const source = require('vinyl-source-stream');
const browserify = require('browserify');

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
cp('-R', 'src/client/main.css', assetsRootPath);
// html
cp('-R', 'src/client/test.html', assetsRootPath);

gulp.task('browserify', function () {
  const browserifies = [];

  for (let i = 0; i < fileConfigs.length; i += 1) {
    browserifies.push(browserify(fileConfigs[i].entry, fileConfigs[i].option)
      .bundle()
      //Pass desired output filename to vinyl-source-stream
      .pipe(source(fileConfigs[i].output))
      // Start piping stream to tasks!
      .pipe(gulp.dest(path.join(assetsRootPath, '/'))));
  }

  return browserifies;
});
