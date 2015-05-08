
var marked = require('marked')
  , fs = require('fs')
  , handlebars = require('handlebars')
  , path = require('path')
  , through = require('through2')

function escape(html, encode) {
  return html
    .replace(/`/g, '&quot;');
}

function unescape(html) {
  return html
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

var template = handlebars.compile(fs.readFileSync(__dirname + '/../templates/page-wrapper.hbs').toString())
var renderer = new marked.Renderer()

renderer.codespan = function(text) {
  return '<code>{`' + unescape(text) + '`}</code>';
};

renderer.code = function(code, lang, escaped) {

  if( lang === 'console' )
    return '<Playground lang="js" theme="neo" scope={this.props.scope} codeText={`'+ code +'`} es6Console />\n\n'

  return lang === 'editable' 
    ? '<Playground lang="js" theme="neo" scope={this.props.scope} codeText={`'+ code +'`} ' 
        + (code.indexOf('React.render(') === -1 ? 'noRender' :'') + '/>\n\n'
    : '<pre><code>'
    + "{`" + (escaped ? code : escape(code, true)) + "`}"
    + '\n</code></pre>\n';
};

module.exports = function(file, filename, md) {
  var html = file.clone({ contents: false });
  var body =  marked(md, { renderer: renderer })

  html.path = replaceExtension(
    path.join(file.base, filename), '.jsx')

  html.contents = new Buffer(template({ body: body }))

  return html
}

function replaceExtension(npath, ext) {
  if (typeof npath !== 'string') return npath;
  if (npath.length === 0) return npath;

  var nFileName = path.basename(npath, path.extname(npath))+ext;
  return path.join(path.dirname(npath), nFileName);
}