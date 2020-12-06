module.exports = {
  theme: {
    extend: {
      spacing: {
        72: "18rem",
        84: "21rem",
        96: "24rem",
      },
    },
  }, // Extend Tailwind theme
  colors: {
    primary: "#b027b0",
    secondary: "#009688",
    error: "#f44336",
    success: "#4caf50",
    alert: "#ff9800",
    blue: "#2196f3",
    dark: "#212121",
  }, // Object of colors to generate a palette from, and then all the utility classes
  variants: {
    borderWidth: ["responsive", "hover", "focus"],
  },
};
