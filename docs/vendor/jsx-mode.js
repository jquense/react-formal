/*global CodeMirror */

var OPEN = '{'
  , CLOSE = '}';

function indexOf(string, pattern, from) {
  if (typeof pattern === "string") {
    var found = string.indexOf(pattern, from);
    return found;
  }
  var m = pattern.exec(from ? string.slice(from) : string);
  return m ? (m.index + from) : -1;
}

function getAllIndexes(string, val, from) {
  var indexes = [], i = from || 0;

  for(; i < string.length; i++)
    if (string[i] === val) indexes.push(i);

  return indexes;
}

CodeMirror.defineMode("jsx", function(config, parserConfig) {
  var jsMode = CodeMirror.getMode(config, "javascript");
  var xmlMode = CodeMirror.getMode(config, { name: "xml", htmlMode: true });

  var TAG = /<([\w_:\.-]*)/
    , foundTag = false;

  function xmlToken(stream, state){
    var oldContent = stream.string
      , found = indexOf(oldContent, OPEN, stream.pos)
      , pos;

    if (!state.xmlState)
      state.xmlState = CodeMirror.startState(xmlMode, jsMode.indent ? jsMode.indent(state.jsState, '') : 0)

    state.active = 'xml'

    if (found === stream.pos) {
      stream.match(OPEN)
      pos = stream.pos
      state.active = 'js'
      state.inJsExpression = true
      state.lastPos = null;
      state.pendingBrackets = 1;

      // get past the attr value state
      stream.string = oldContent.slice(found)
      xmlMode.token(stream, state.xmlState)
      stream.string = oldContent
      stream.pos = pos
      return 'jsx-bracket'
    }
    else if (found !== -1)
      stream.string = oldContent.slice(0, found)

    var style = xmlMode.token(stream, state.xmlState)

    if (found !== -1) stream.string = oldContent

    if (!foundTag)
      foundTag = !!state.xmlState.context

    return style
  }

  function jsToken(stream, state){
    var oldContent = stream.string
      , found = state.expressionEnd
      , style;

    if (!state.inJsExpression)
      return jsMode.token(stream, state.jsState)

    if (state.lastPos == null || stream.pos < state.lastPos) {
      var brackets = getBracketsInRange(stream.string, stream.start);

      state.pendingBrackets += brackets.open.length
      state.pendingBrackets -= brackets.close.length;

      if (brackets.close.length && state.pendingBrackets <= 0)
        found = stream.start + brackets.close[brackets.close.length - Math.abs(state.pendingBrackets - 1)]
    }

    if (found === stream.pos) {
      stream.match(CLOSE);
      state.active = 'xml'
      state.inJsExpression = false
      state.expressionEnd = -1
      style = 'jsx-bracket';
    }
    else {
      if (found !== -1)
        stream.string = oldContent.slice(0, found);

      style = jsMode.token(stream, state.jsState)

      if (found !== -1) {
        stream.string = oldContent;
        state.expressionEnd = found
      }
    }

    state.lastPos = stream.pos;

    return style
  }

  return {
    startState: function() {
      return {
        jsState:  CodeMirror.startState(jsMode),
        xmlState:  CodeMirror.startState(xmlMode),
        active: 'js',
        inJsExpression: false,
        expressionEnd: -1
      }
    },

    copyState: function(state) {
      return {
        jsState: CodeMirror.copyState(jsMode, state.jsState),
        xmlState: CodeMirror.copyState(xmlMode, state.xmlState),
        active: state.active,
        inJsExpression: state.inJsExpression,
        pendingBrackets: state.pendingBrackets,
        expressionEnd: state.expressionEnd,
        lastPos: state.lastPos
      }
    },

    token: function(stream, state) {
      var style;

      if (state.active === 'js' ) {
        if ( stream.match(TAG, false) ) {
          style = xmlToken(stream, state)
        }
        else
          style = jsToken(stream, state)
      }
      else {
        if ( foundTag && state.xmlState.context == null) {
          state.active = 'js'
          foundTag = false
          style = jsToken(stream, state)
        }
        else
          style = xmlToken(stream, state)
      }

      return style
    },

    indent: function(state, textAfter) {
      return state.active === 'js'
        ? jsMode.indent(state.jsState, textAfter)
        : xmlMode.indent(state.xmlState, textAfter)
    }
  }
});

function getBracketsInRange(string, start, end){
  let str = string.slice(start, end);

  return {
    open: getAllIndexes(str, OPEN),
    close: getAllIndexes(str, CLOSE)
  }
}

// CodeMirror.multiplexingMode = function(outer /*, others */) {
//   // Others should be {open, close, mode [, delimStyle] [, innerStyle]} objects
//   var others = Array.prototype.slice.call(arguments, 1);

//   function indexOf(string, pattern, from, returnEnd) {
//     if (typeof pattern == "string") {
//       var found = string.indexOf(pattern, from);
//       return returnEnd && found > -1 ? found + pattern.length : found;
//     }
//     var m = pattern.exec(from ? string.slice(from) : string);
//     return m ? m.index + from + (returnEnd ? m[0].length : 0) : -1;
//   }

//   return {
//     startState: function() {
//       return {
//         outer: CodeMirror.startState(outer),
//         innerActive: null,
//         inner: null
//       };
//     },

//     copyState: function(state) {
//       return {
//         outer: CodeMirror.copyState(outer, state.outer),
//         innerActive: state.innerActive,
//         inner: state.innerActive && CodeMirror.copyState(state.innerActive.mode, state.inner)
//       };
//     },

//     token: function(stream, state) {
//       if (!state.innerActive) {
//         var cutOff = Infinity, oldContent = stream.string;
//         for (var i = 0; i < others.length; ++i) {
//           var other = others[i];
//           var found = indexOf(oldContent, other.open, stream.pos);
//           if (found == stream.pos) {
//             if (!other.parseDelimiters) stream.match(other.open);
//             state.innerActive = other;
//             state.inner = CodeMirror.startState(other.mode, outer.indent ? outer.indent(state.outer, "") : 0);
//             return other.delimStyle;
//           } else if (found != -1 && found < cutOff) {
//             cutOff = found;
//           }
//         }
//         if (cutOff != Infinity) stream.string = oldContent.slice(0, cutOff);
//         var outerToken = outer.token(stream, state.outer);
//         if (cutOff != Infinity) stream.string = oldContent;
//         return outerToken;
//       } else {
//         var curInner = state.innerActive, oldContent = stream.string;
//         if (!curInner.close && stream.sol()) {
//           state.innerActive = state.inner = null;
//           return this.token(stream, state);
//         }
//         var found = curInner.close ? indexOf(oldContent, curInner.close, stream.pos, curInner.parseDelimiters) : -1;
//         if (found == stream.pos && !curInner.parseDelimiters) {
//           stream.match(curInner.close);
//           state.innerActive = state.inner = null;
//           return curInner.delimStyle;
//         }
//         if (found > -1) stream.string = oldContent.slice(0, found);
//         var innerToken = curInner.mode.token(stream, state.inner);
//         if (found > -1) stream.string = oldContent;

//         if (found == stream.pos && curInner.parseDelimiters)
//           state.innerActive = state.inner = null;

//         if (curInner.innerStyle) {
//           if (innerToken) innerToken = innerToken + ' ' + curInner.innerStyle;
//           else innerToken = curInner.innerStyle;
//         }

//         return innerToken;
//       }
//     },

//     indent: function(state, textAfter) {
//       var mode = state.innerActive ? state.innerActive.mode : outer;
//       if (!mode.indent) return CodeMirror.Pass;
//       return mode.indent(state.innerActive ? state.inner : state.outer, textAfter);
//     },

//     blankLine: function(state) {
//       var mode = state.innerActive ? state.innerActive.mode : outer;
//       if (mode.blankLine) {
//         mode.blankLine(state.innerActive ? state.inner : state.outer);
//       }
//       if (!state.innerActive) {
//         for (var i = 0; i < others.length; ++i) {
//           var other = others[i];
//           if (other.open === "\n") {
//             state.innerActive = other;
//             state.inner = CodeMirror.startState(other.mode, mode.indent ? mode.indent(state.outer, "") : 0);
//           }
//         }
//       } else if (state.innerActive.close === "\n") {
//         state.innerActive = state.inner = null;
//       }
//     },

//     electricChars: outer.electricChars,

//     innerMode: function(state) {
//       return state.inner ? {state: state.inner, mode: state.innerActive.mode} : {state: state.outer, mode: outer};
//     }
//   };
// };
