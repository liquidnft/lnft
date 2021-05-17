module.exports = {
  purge: [
    './src/**/*.{js,svelte}',
  ],
  theme: {
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
