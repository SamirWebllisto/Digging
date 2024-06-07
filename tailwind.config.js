import colors from 'tailwindcss/colors'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      minHeight: {
        dscreen: ['100vh', '100dvh'],
      },
      height: {
        dscreen: ['100vh', '100dvh'],
      },
      fontSize: {
        11: ['0.6875rem', '0.875rem'],
        13: ['0.8125rem', '1.25rem'],
        15: ['0.9375rem', '1.375rem'],
        17: ['1.0625rem', '1.75rem'],
        19: ['1.1875rem', '1.875rem'],
        21: ['1.3125rem', '2rem'],
        23: ['1.4375rem', '2.125rem'],
      },
      boxShadow: {
        cardShadow: '0px 7px 4px 2px rgba(1, 1, 1, 0.13)',
      }
    },
    fontFamily: {
      wow: 'Armstrong',
      wowRegular: 'Armstrong-Regular',
      title: 'verdanab',
      poppins:'"Poppins", sans-serif'
    },
    colors: {
      ...colors,
      bg: {
        primary: '#001861',
        container: '#D8D8D8',
        input: '#606060',
        gray24:'#242424',
        darkGray17:"#171717",
        darkGray21:"#212121",
        green2F:"#2FD15B"
      },
      text: {
        text: '#DCDCDC',
        secondary: '#908F8F',
        ordinary: '#A6A6A6',
        primary: '#5ddaa8',
        inverse: '#767676',
        prompt: '#777777',
        wallet: '#B5B5B5',
        trade: '#B5B5B5',
        tips: '#9C9A9A',
        money: '#7c7c7c',
        unit: '#444444',
        menu: '#868686',
        gray24:'#242424',
        textA6:'#A6A6A6', 
        gray74:"#747474",
        white:"#FFFF"
      },
      border: {
        primary: '#666666',
        gray79:'#797979'
      },
      wow: {
        10: '#B6B6B6',
        20: '#808080',
        30: '#d8d8d8',
        40: '#646464',
        50: '#767676',
        80: '#777777',
        90: '#797979',
        100: '#B0B0B0',
        150: '#1D1D1D',
        200: '#232323',
        300: '#121212',
        400: '#0c0c0c',
        500: '#202020',
        600: '#333333',
        700: '#13F287',
      }
    },
    borderRadius:{
      'sm':'10px',
      'md':"35px",
      'lg': '0.5rem',
      '2xl':'16px',
    }
  },
  plugins: [],
}
