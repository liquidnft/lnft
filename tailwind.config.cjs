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
    },
    extend: {
      colors: {
        primary: "#3C63C4",
        secondary: "#32373C",
      } 
    } 
  },
  variants: {
    borderWidth: ["responsive", "hover", "focus"],
  },
};
