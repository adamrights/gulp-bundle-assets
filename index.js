var through = require('through2'),
  gutil = require('gulp-util'),
  readableStream = require('readable-stream'),
  duplexer = require('duplexer2'),
  mergeStream = require('merge-stream'),
  streamBundles = require('./lib/stream-bundles'),
  results = require('./lib/results'),
  ConfigModel = require('./lib/model/config');

var gulpBundleAssets = function (options) {
  options = options || {};

  var writable = new readableStream.Writable({objectMode: true});
  var readable = through.obj(function (file, enc, cb) { // noop
    this.push(file);
    cb();
  });

  writable._write = function _write(file, encoding, done) {

    var config;

    if (file.isNull()) {
      this.push(file);
      return done();
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError('gulp-bundle-assets', 'Streaming not supported'));
      return done();
    }

    try {
      config = new ConfigModel(file, options);
    } catch (e) {
      gutil.log(gutil.colors.red('Failed to parse config file'));
      this.emit('error', new gutil.PluginError('gulp-bundle-assets', e));
      return done();
    }

    mergeStream.apply(mergeStream, streamBundles(config))
      .pipe(readable);
    return done();
  };

  return duplexer(writable, readable);
};

gulpBundleAssets.results = results;

module.exports = gulpBundleAssets;