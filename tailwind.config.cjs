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
        primary: "#83e68d",
        secondary: "#ffc43b",
      } 
    } 
  },
  variants: {
    borderWidth: ["responsive", "hover", "focus"],
  },
};
