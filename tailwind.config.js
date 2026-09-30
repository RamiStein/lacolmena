/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        colmena: {
          miel: {
            50: '#fdfbf2',
            100: '#fcf7de',
            200: '#faedb4',
            300: '#f6dd81',
            400: '#f0c64b',
            500: '#e5b837', // Color oficial de la pincelada
            600: '#ca9623',
            700: '#a4711c',
            800: '#85591d',
            900: '#70491d',
          },
          terracota: {
            50: '#fef5f2',
            100: '#fde9e3',
            200: '#fad6cc',
            300: '#f4b8a7',
            400: '#eb8f75',
            500: '#b24016', // Color oficial del logo "ESCUELA LA COLMENA"
            600: '#9e3410',
            700: '#84290d',
            800: '#6d240f',
            900: '#5a200f',
          },
          huerta: {
            50: '#f4f7f4',
            100: '#e5eee6',
            200: '#cddfcf',
            300: '#a6c6aa',
            400: '#77a47d',
            500: '#4a6b53', // Verde bosque / huerta
            600: '#3f5945',
            700: '#344738',
            800: '#2b3a2f',
            900: '#243027',
          },
          cielo: {
            50: '#f4f7f8',
            100: '#e5edf0',
            200: '#cfdde4',
            300: '#acc4d1',
            400: '#7fa4b9',
            500: '#466270', // Azul grisáceo "Comunidad"
            600: '#3a515e',
            700: '#31424d',
            800: '#2b3841',
            900: '#263038',
          },
          crema: {
            50: '#fdfcf9',
            100: '#faf6e9', // Fondo de papel artesanal cálido
            200: '#f4eed5',
            300: '#ece1ba',
            400: '#e1d09b',
            500: '#d3bd7b',
          },
          madera: '#3D2E24',
          cacao: '#2B1E16',
        }
      },
      fontFamily: {
        sans: ['"Nunito"', 'system-ui', 'sans-serif'],
        display: ['"Fredoka"', '"Quicksand"', 'system-ui', 'sans-serif'],
        hand: ['"Caveat"', 'cursive', 'sans-serif'],
      },
      boxShadow: {
        'warm': '0 4px 20px -2px rgba(178, 64, 22, 0.08), 0 2px 6px -1px rgba(229, 184, 55, 0.12)',
        'warm-lg': '0 10px 25px -3px rgba(178, 64, 22, 0.12), 0 4px 10px -2px rgba(229, 184, 55, 0.15)',
        'celda': '0 8px 30px rgba(229, 184, 55, 0.18)',
      }
    },
  },
  plugins: [],
}
