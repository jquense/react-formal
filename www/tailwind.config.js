const defaultTheme = require('tailwindcss/defaultTheme');
const { transparentize } = require('polished');

//#8e929e

module.exports = {
  theme: {
    colors: {
      // gray: defaultTheme.colors.gray
      'gray': {
        50: '#fafafa',
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
      'info': '#39b4d0',
      'info-dark': '#275663',

      'warning-light': '#f8ebcb',
      'warning': '#cfb325',
      'warning-dark': '#63561c',

      'cta-light': '#c5c2c1',
      'cta': '#2b221f',
      'cta-dark': '#191513',

      'success-light': '#d5f1d0',
      'success': '#3bc143',
      'success-dark': '#275c26',

      'danger-light': '#fccfcb',
      'danger': '#d0373f',
      'danger-dark': '#652222',

      'primary': '#1f222b',
      'accent': 'white',
      'subtle': '#33363d',

      'note': '#ffe564',
      'subtle-on-dark': '#33363d',
      'error': '#ff6464',
      'syntax-bg': '#1f222b',
      'black': '#000000',
      'white': '#fff',
    },
    body: t => ({
      'color': t('colors.subtle'),
      'bg-color': t('colors.gray.50'),
    }),

    extend: {
      flex: {
        '2': '2 2 0%',
      },
      fontFamily: {
        brand: 'Abril Fatface, cursive',
        default:
          'Open Sans,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;',
      },
      SideNavigationPanel: t => ({
        backgroundColor: t('body.bg-color'),
        // color: t('colors.white'),
      }),
      SideNavigationHeader: t => ({
        '@apply tracking-wider': '',
        'fontFamily': t('fontFamily.brand'),
      }),
      PropsListName: {
        '@apply tracking-wider': '',
      },
      PropListTypeDefinition: {
        '@apply text-info-dark !important': '',
      },
      PropListDefaultValue: {
        '@apply text-info-dark !important': '',
      },
    },

    // prism: t => ({
    //   'bg-color': '#282c34',
    //   'char': '#d8dee9',
    //   'comment': '#999999',
    //   'keyword': '#c5a5c5',
    //   'lineHighlight': '#14161a',
    //   'primitive': '#5a9bcf',
    //   'string': '#8dc891',
    //   'variable': '#d7deea',
    //   'boolean': '#ff8b50',
    //   'punctuation': '#5fb3b3',
    //   'tag': '#fc929e',
    //   'function': '#79b6f2',
    //   'className': '#fac863',
    //   'method': '#6699cc',
    //   'operator': '#fc929e',
    // }),

    InlineCode: t => ({
      '@apply rounded rounded-sm': true,
      'color': 'inherit',
      'padding': `0 ${t('padding.1')}`,
      'backgroundColor': transparentize(0.92, t('colors.info')),
    }),

    CodeBlock: {
      '@apply my-6 rounded-lg p-6': true,
      'backgroundColor': '#282c34',
    },

    LiveCode: {
      '@apply my-6': true,

      '& .preview': {
        '@apply py-6 px-10 rounded-t-lg bg-gray-200': '',

        'borderBottom': 'none',

        '& fieldset': {
          '@apply mb-4': '',
        },

        '& :global(.error)': {
          '@apply text-danger block text-sm py-1': '',
        },

        '&:not(:global(.reset)) input:not([type="checkbox"]):not([type="radio"]), & select': {
          '@apply rounded bg-gray-50 leading-normal outline-none w-full mb-2 py-1 px-3 block border border-gray-50 text-primary': true,
          'height': '40px',
          'transition':
            'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',

          '&:focus': {
            '@apply shadow-outline': '',
          },

          '&:global(.invalid-field)': {
            '@apply border-danger': '',
          },
          '&::placeholder': {
            '@apply text-gray-600': '',
          },
        },

        '& select[multiple]': {
          height: 'auto',
          maxHeight: 130,
        },
        '& label': {
          '@apply text-gray-800 block': '',

          '& + :global(.error)': {
            '@apply -mt-2': '',
          },
        },

        '& label > input, & label > select': {
          '@apply mt-1': '',
        },

        '&:not(:global(.reset)) button': {
          '@apply border border-cta text-cta rounded px-8 mt-4 appearance-none text-center whitespace-no-wrap outline-none': true,
          'height': '40px',
          'transition': `
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
      '& .info': {
        color: 'white',
      },

      '& .error': {
        '@apply p-6 pt-0 rounded-b-lg font-mono text-sm text-danger': true,
        'backgroundColor': '#282c34',
      },

      '& .editor': {
        '@apply p-6 rounded-lg font-mono text-sm': true,

        'backgroundColor': '#282c34',

        '&:not(:first-child)': {
          '@apply rounded-t-none': true,
        },
        '&:not(:last-child)': {
          '@apply rounded-b-none': true,
        },
      },
    },
  },
};
