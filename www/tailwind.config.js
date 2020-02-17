const defaultTheme = require('tailwindcss/defaultTheme')
const { transparentize } = require('polished')

//#8e929e

module.exports = {
  theme: {
    colors: {
      // gray: defaultTheme.colors.gray
      gray: {
        100: '#ededee',
        200: '#e0e1e2',
        300: '#d2d3d4',
        400: '#c3c4c6',
        500: '#b2b3b5',
        600: '#9ea0a3',
        700: '#87898d',
        800: '#6a6c71',
        900: '#3d3f45',
      },
      'info-light': '#d5ecf3',
      info: '#39b4d0',
      'info-dark': '#275663',

      'warning-light': '#f8ebcb',
      warning: '#cfb325',
      'warning-dark': '#63561c',

      'cta-light': '#c5c2c1',
      cta: '#2b221f',
      'cta-dark': '#191513',

      'success-light': '#d5f1d0',
      success: '#3bc143',
      'success-dark': '#275c26',

      'danger-light': '#fccfcb',
      danger: '#d0373f',
      'danger-dark': '#652222',

      primary: '#1f222b',
      accent: '#33363d',
      note: '#ffe564',
      'subtle-on-dark': '#33363d',
      error: '#ff6464',
      'syntax-bg': '#1f222b',
      black: '#000000',
      white: '#fff',
    },

    extend: {
      fontFamily: {
        brand: 'Abril Fatface, cursive',
        default:
          'Open Sans,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;',
      },
      SideNavigationPanel: t => ({
        backgroundColor: t('colors.gray.100'),
        // color: t('colors.white'),
      }),
    },

    prism: t => ({
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
    }),

    InlineCode: t => ({
      color: 'inherit',
      padding: `0 ${t('padding.1')}`,
      backgroundColor: transparentize(0.75, t('colors.info')),
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
          '@apply rounded bg-white leading-normal outline-none w-full mb-6 py-1 px-3 block border border-cta-light': true,
          height: '40px',
          transition:
            'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',

          '&:focus': {
            '@apply shadow-outline': true,
          },

          '& + :global(.validation-error)': {
            '@apply -mt-6 text-danger block text-sm': true,
          },

          '&:global(.invalid-field)': {
            '@apply border-danger': true,
          },
        },
        '& label': {
          '@apply mb-1 text-gray-800 block': true,
        },
        '& button': {
          '@apply border border-cta text-cta rounded px-4 mt-4 appearance-none text-center whitespace-no-wrap outline-none': true,
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
            '@apply bg-cta text-white': true,
          },
          '&:active': {
            '@apply bg-cta-dark text-white': true,
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
