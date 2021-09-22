const COLORS = {
  BLUE: {
    DEFAULT: '#335FE3',
    '50': '#FDFDFF',
    '100': '#E6ECFC',
    '200': '#BAC9F5',
    '300': '#8DA5EF',
    '400': '#6082E9',
    '500': '#335FE3',
    '600': '#1B46C8',
    '700': '#15379B',
    '800': '#0F276E',
    '900': '#091741'
  },
  ORANGE: {
    DEFAULT: '#F77030',
    '50': '#FFFFFF',
    '100': '#FFF8F4',
    '200': '#FDD6C3',
    '300': '#FBB492',
    '400': '#F99261',
    '500': '#F77030',
    '600': '#EB5209',
    '700': '#BA4107',
    '800': '#893005',
    '900': '#581E03'
  }
};

module.exports = {
  mode: 'jit',
  purge: [
    './src/**/*.{js,svelte}',
  ],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      'till-sm': {max:'640px'},
      'till-md': {max:'768px'},
      'till-lg': {max:'1024px'},
      'till-xl': {max:'1280px'},
    },
    extend: {
      backgroundColor: {
        blue: COLORS.BLUE,
        orange: COLORS.ORANGE,
      },
      colors: {
        primary: "#8feef5",
        secondary: "#3ba5ac",
        // blue (base - #335fe3)
        blue: COLORS.BLUE,
        // orange (base - #f77030)
        orange: COLORS.ORANGE,
      }
    }
  },
  variants: {
    borderWidth: ["responsive", "hover", "focus"],
  },
};
