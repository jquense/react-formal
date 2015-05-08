var marked = require('marked')
  , fs = require('fs')
  , handlebars = require('handlebars')
  , path = require('path')
  , through = require('through2')
  , mdToJsx = require('../util/md-to-jsx')


module.exports = through.obj(function transpile(file, enc, cb) {
    if (file.isNull()) return cb();

    if (file.isStream()) {
      this.emit('error', new Error('Streaming not supported'));
      return cb();
    }

    
    var name = path.basename(file.path, path.extname(file.path))
    console.log(name)
    this.push(mdToJsx(file, name, file.contents.toString()));
    cb()
  })

function replaceExtension(npath, ext) {
  if (typeof npath !== 'string') return npath;
  if (npath.length === 0) return npath;

  var nFileName = path.basename(npath, path.extname(npath))+ext;
  return path.join(path.dirname(npath), nFileName);
}