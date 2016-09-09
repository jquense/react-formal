
var marked = require('marked')
  , fs = require('fs')
  , handlebars = require('handlebars')
  , prism = require('prismjs')
  , path = require('path');


function escape(html) {
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

var template = handlebars.compile(fs.readFileSync(path.join(__dirname, '/../templates/page-wrapper.hbs')).toString())
var renderer = new marked.Renderer()

renderer.link = function(href, title, text){
  return href.indexOf('http') !== -1
    ? marked.Renderer.prototype.link.call(this, href, title, text)
    : '<Link to="' + href + '" title="' + (title || '') + '">' + text + '</Link>'
}

renderer.codespan = function(text) {
  return '<code>{`' + unescape(text) + '`}</code>';
};

renderer.code = function(code, lang, escaped) {
  if (lang === 'editable')
    return '<Playground mode="text/jsx" scope={this.props.scope} code={`'
      + code + '`} ' + (code.indexOf('render(') === -1 ? 'noRender' : '') + '/>\n\n'

  if( lang === 'console' )
    return '<Console scope={this.props.scope} code={`'+ code + '`} es6Console />\n\n'

  return '<Codeblock code={`' + code + '`} />\n\n';
};



module.exports = function(markdown) {
  if (this && this.cacheable)
    this.cacheable();

  return template({
    body: marked(markdown, { renderer: renderer })
  })
}
