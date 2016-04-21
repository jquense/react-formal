
var marked = require('marked')
  , fs = require('fs')
  , handlebars = require('handlebars')
  , prism = require('prismjs')
  , path = require('path');

require('../vendor/jsx-prism')


marked.setOptions({
  xhtml: true,
  highlight: function(code) {
    return prism.highlight(code, prism.languages.jsx);
  }
})


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

  if ( lang === 'editable' )
    return '<Playground mode="text/jsx" theme="base16-oceanicnext-dark" scope={this.props.scope} codeText={`'
      + code + '`} ' + (code.indexOf('ReactDOM.render(') === -1 ? 'noRender' : '') + '/>\n\n'

  if( lang === 'console' )
    return '<Playground mode="text/jsx" theme="base16-oceanicnext-dark" scope={this.props.scope} codeText={`'
      + code + '`} es6Console />\n\n'


  if (this.options.highlight) {
    var out = this.options.highlight(code);
    if (out != null && out !== code) {
      return '<pre className="language-jsx"><code dangerouslySetInnerHTML={{ __html: `'
        + out.replace(/"/g, '\\"') + '` }}/></pre>\n';
    }
  }

  return '<pre><code className="' + (lang || '') + '">'
         + (escaped ? code : '{`' + escape(code, true) + '`}')
       + '\n</code></pre>\n';
};



module.exports = function(markdown) {
  if (this && this.cacheable)
    this.cacheable();

  return template({
    body: marked(markdown, { renderer: renderer })
  })
}
