module.exports =
{
    content:
    [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme:
    {
      extend:
      {

      },
    },
    plugins: [],
};

module.exports =
{
    content:
    [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme:
    {
      extend:
      {
        backdropBlur:
        {
          'xs': '2px',
          'sm': '4px',
          'md': '8px',
          'lg': '12px',
          'xl': '16px',
          '2xl': '24px',
          '3xl': '48px',
        },
      },
    },
    plugins: [],
};

module.exports = {
  darkMode: ['class', '[data-theme="dark"]'], // Allows class-based & attribute-based switching
  theme: {
    extend: {
      colors: {
        pink: {
          50: '#ffe4e6',
          100: '#ffccd5',
          200: '#fba5b7',
          300: '#f472b6',
          400: '#ec4899',
          500: '#db2777',
          600: '#be185d',
          700: '#9d174d',
          800: '#831843',
          900: '#6b143b',
        },
      },
    },
  },
  plugins: [],
};
