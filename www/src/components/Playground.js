import classNames from 'classnames'
import { css, styled } from 'css-literal-loader/styled'
import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'

import * as Topeka from 'topeka'

import {
  LiveProvider,
  LiveEditor,
  LiveError,
  LivePreview,
  withLive,
} from 'react-live'

const scope = {
  ReactDOM,
  classNames,
  PropTypes,
  ...Topeka,
}

const StyledProvider = styled(LiveProvider)`
  @import '../styles/theme';

  background-color: $body-bg;
  margin-bottom: 3rem;
  display: flex;
`

const StyledEditor = styled(LiveEditor)`
  composes: prism from '../styles/prism.module.scss';
  border-radius: 0 0 8px 8px;
`

const StyledPreview = styled('div')`
  @import '../styles/theme';

  position: relative;
  color: $body-color;
  padding: 1rem;
  border-style: solid;
  border-color: rgb(236, 236, 236);
  margin-right: 0;
  margin-left: 0;
  border-width: 0.2rem;
  border-radius: 8px;

  &.show-code {
    border-width: 0.2rem 0.2rem 0 0.2rem;
    border-radius: 8px 8px 0 0;
  }

  :global {
    .react-live-preview::after {
      display: block;
      clear: both;
      content: '';
    }
  }
`

const EditorInfoMessage = styled('div')`
  composes: p-2 alert alert-info from global;
  position: absolute;
  top: 0;
  right: 0;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  pointer-events: none;
  font-size: 70%;

  *:not(:focus) + & {
    opacity: 0;
  }
`

const StyledError = styled(LiveError)`
  composes: rounded-0 alert alert-danger from global;
`

// -----------
// ----- Here be Dragons

let uid = 0

class CodeEditor extends React.Component {
  state = { ignoreTab: false }

  id = `described-by-${++uid}`

  handleKeyDown = event => {
    const { key } = event

    if (this.state.ignoreTab && key !== 'Tab' && key !== 'Shift') {
      if (key === 'Enter') event.preventDefault()
      this.setState({ ignoreTab: false })
    }
    if (!this.state.ignoreTab && key === 'Escape') {
      this.setState({ ignoreTab: true })
    }
  }

  handleFocus = e => {
    if (e.target !== e.currentTarget) return
    this.setState({
      ignoreTab: !this.mouseDown,
      keyboardFocused: !this.mouseDown,
    })
  }

  handleMouseDown = () => {
    this.mouseDown = true
    window.setTimeout(() => {
      this.mouseDown = false
    }, 0)
  }

  render() {
    const { keyboardFocused, ignoreTab } = this.state
    return (
      <div className="position-relative">
        <StyledEditor
          onBlur={this.handleBlur}
          onFocus={this.handleFocus}
          onKeyDown={this.handleKeyDown}
          onMouseDown={this.handleMouseDown}
          ignoreTabKey={ignoreTab}
          aria-describedby={this.id}
          aria-label="Example code editor"
        />
        {(keyboardFocused || !ignoreTab) && (
          <EditorInfoMessage id={this.id} aria-live="polite">
            {ignoreTab ? (
              <>
                Press <kbd>enter</kbd> or type a key to enable tab-to-indent
              </>
            ) : (
              <>
                Press <kbd>esc</kbd> to disable tab trapping
              </>
            )}
          </EditorInfoMessage>
        )}
      </div>
    )
  }
}

const { background, foreground } = css`
  @import '../styles/theme';
  :export {
    background: $holderjsBg;
    foreground: $holderjsFg;
  }
`

const prettierComment = /(\{\s*\/\*\s+prettier-ignore\s+\*\/\s*\})|(\/\/\s+prettier-ignore)/gim

const Preview = withLive(
  class extends React.Component {
    constructor() {
      super()

      this.example = React.createRef()

      import('holderjs').then(({ default: hjs }) => {
        this.hjs = hjs
        hjs.addTheme('gray', {
          bg: background,
          fg: foreground,
          font: 'Helvetica',
          fontweight: 'normal',
        })
        this.runHolder()
      })
    }

    componentDidUpdate = prevProps => {
      if (prevProps.live.element !== this.props.live.element) this.runHolder()
    }

    // prevent links in examples from navigating
    handleClick = e => {
      if (e.target.tagName === 'A') e.preventDefault()
    }

    runHolder() {
      if (!this.hjs || !this.example.current) return
      this.hjs.run({
        theme: 'gray',
        images: this.example.current.getElementsByTagName('img'),
      })
    }

    render() {
      const { showCode, className } = this.props
      return (
        <StyledPreview
          role="region"
          aria-label="Code Example"
          ref={this.example}
          showCode={showCode}
          className={classNames(className, 'js-search-example')}
          onClick={this.handleClick}
        >
          <LivePreview />
          <StyledError />
        </StyledPreview>
      )
    }
  }
)

export default class Playground extends React.Component {
  static propTypes = {
    code: PropTypes.string.isRequired,
  }

  render() {
    const { code, exampleClassName, showCode = true } = this.props

    return (
      <StyledProvider
        scope={scope}
        mountStylesheet={false}
        code={code.replace(prettierComment, '')}
        noInline={code.includes('render(')}
      >
        <Preview showCode={showCode} className={exampleClassName} />
        {showCode && <CodeEditor onChange={this.handleChange} />}
      </StyledProvider>
    )
  }
}
