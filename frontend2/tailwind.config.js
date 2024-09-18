/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'black',
        secondary: '#2563EB',
        tertiary: '#24262B',
        paraColor: '#D7D8D9',
        boxColor: '#1B1B1B',
        designationColor: '#9EA0A5',
        starColor: '#F97316',
        reviewColor: '#3B82F6',
        footerColor: '#1B1B1B',
        copyrightColor: '#FFFFFF7A',
        footerHeading: '#FFFFFFA3',
        trainerColor: '#111214',
        logoColor: '#393C43',
      },
      fontFamily: {
        sans: ['Work Sans', 'sans-serif'],
        orbitron: ['Orbitron', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
        bebes: ['Bebas Neue', 'sans-serif'],
      },
      lineHeight: {
        custom: '2.4rem', // 38.4px
      },
      letterSpacing: {
        custom: '-0.8%', // -0.8%
      },
      backgroundImage: {
        'custom-gradient':
          'linear-gradient(90deg, #001447 0%, #000A23 28.37%, #00091F 65.15%, #222D46 105.08%)',
      },
      keyframes: {
        shake: {
          '0%': { transform: 'translateX(-10px)' },
          '50%': { transform: 'translateX(10px)' },
          '100%': { transform: 'translateX(-10px)' },
        },
      },
      animation: {
        shake: 'shake 0.5s ease-in-out', // Adjust duration and easing as needed
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          /* Hide scrollbar for Chrome, Safari and Opera */
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          /* Hide scrollbar for IE, Edge and Firefox */
          '-ms-overflow-style': 'none' /* IE and Edge */,
          'scrollbar-width': 'none' /* Firefox */,
        },
      });
    },
  ],
};
