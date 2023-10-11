/** @type {import('tailwindcss').Config} */

// export default {
//   // content: [],
//   content: ['./src/**/*.{html,js,svelte,ts}'],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }



const config = {
  content: ['./src/**/*.{html,js,svelte,ts}', './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'],

  plugins: [require('flowbite/plugin')],

  darkMode: 'class',

  // theme: {
  //   extend: {
  //     colors: {
  //       // flowbite-svelte
  //       primary: {
  //         50: '#FFF5F2',
  //         100: '#FFF1EE',
  //         200: '#FFE4DE',
  //         300: '#FFD5CC',
  //         400: '#FFBCAD',
  //         500: '#FE795D',
  //         600: '#EF562F',
  //         700: '#EB4F27',
  //         800: '#CC4522',
  //         900: '#A5371B'
  //       }
  //     }
  //   }
  // }

  // https://github.com/themesberg/flowbite-svelte-blocks
  theme: {
      extend: {
        colors: {
          primary: {"50":"#fff1f2","100":"#ffe4e6","200":"#fecdd3","300":"#fda4af","400":"#fb7185","500":"#f43f5e","600":"#e11d48","700":"#be123c","800":"#9f1239","900":"#881337"}
        }
      },
      fontFamily: {
        'body': [
            'Inter',
            'ui-sans-serif',
            'system-ui',
            '-apple-system',
            'system-ui',
            'Segoe UI',
            'Roboto',
            'Helvetica Neue',
            'Arial',
            'Noto Sans',
            'sans-serif',
            'Apple Color Emoji',
            'Segoe UI Emoji',
            'Segoe UI Symbol',
            'Noto Color Emoji'
        ],
        'sans': [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'system-ui',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans',
          'sans-serif',
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol',
          'Noto Color Emoji'
        ]
      }
    },

};

module.exports = config;


