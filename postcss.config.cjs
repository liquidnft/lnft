const mode = process.env.NODE_ENV;
const dev = mode === "development";

module.exports = {
  plugins: [
    require("tailwindcss"),
    require("autoprefixer"),
    require("tailwindcss/nesting")(require("postcss-nesting")),
    !dev &&
      require("cssnano")({
        preset: "default",
      }),
  ],
};
