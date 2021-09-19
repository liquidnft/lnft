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
      colors: {
        primary: "#8feef5",
        secondary: "#3ba5ac",
      }
    }
  },
  variants: {
    borderWidth: ["responsive", "hover", "focus"],
  },
};
