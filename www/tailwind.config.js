const defaultTheme = require('tailwindcss/defaultTheme')
const { transparentize } = require('polished')

module.exports = {
  theme: {
    colors: {
      gray: defaultTheme.colors.gray,
      blue: defaultTheme.colors.blue,
      primary: '#2f2f2f',
      note: '#ffe564',
      'subtle-on-dark': '#999',
      error: '#ff6464',
      'syntax-bg': 'hsl(230, 1%, 98%)',
      black: '#000000',
      white: '#fff',
    },

    extend: {
      fontFamily: {
        default:
          'Raleway,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;',
      },
    },

    prism: {
      'bg-color': '#282c34',
      char: '#d8dee9',
      comment: '#999999',
      keyword: '#c5a5c5',
      lineHighlight: '#14161a',
      primitive: '#5a9bcf',
      string: '#8dc891',
      variable: '#d7deea',
      boolean: '#ff8b50',
      punctuation: '#5fb3b3',
      tag: '#fc929e',
      function: '#79b6f2',
      className: '#fac863',
      method: '#6699cc',
      operator: '#fc929e',
    },

    InlineCode: t => ({
      color: 'inherit',
      padding: `0 ${t('padding.1')}`,
      backgroundColor: transparentize(0.75, t('colors.note')),
    }),

    CodeBlock: {
      '@apply my-6 rounded-lg p-6': true,
      backgroundColor: '#282c34',
    },

    LiveCode: {
      '@apply my-6': true,

      '& .preview': {
        '@apply p-6 rounded-t-lg': true,
        border: '4px solid rgb(236, 236, 236)',
        borderBottom: 'none',

        '& input, & select': {
          '@apply rounded bg-white leading-normal outline-none w-full mb-6 py-1 px-3 block border border-gray-400': true,
          height: '40px',
          transition:
            'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',

          '&:focus': {
            '@apply shadow-outline': true,
          },

          '& + :global(.validation-error)': {
            '@apply -mt-6 text-error block text-sm': true,
          },

          '&:global(.invalid-field)': {
            '@apply border-error': true,
          },
        },
        '& button': {
          '@apply border border-blue-500 text-blue-500 rounded px-4 appearance-none text-center whitespace-no-wrap outline-none': true,
          height: '40px',
          transition: `
            color 0.15s ease-in-out,
            background-color 0.15s ease-in-out,
            border-color 0.15s ease-in-out,
            box-shadow 0.15s ease-in-out`,

          '&:focus': {
            '@apply shadow-outline': true,
          },
          '&:hover': {
            '@apply bg-blue-500 text-white': true,
          },
          '&:active': {
            '@apply bg-blue-600 text-white': true,
          },
        },
      },
      '& .editor': {
        '@apply p-6 rounded-b-lg font-mono text-sm': true,

        backgroundColor: '#282c34',
      },
    },
  },
}
