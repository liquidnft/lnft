const sveltePreprocess = require("svelte-preprocess");
const replace = require("@rollup/plugin-replace");

const preprocess = sveltePreprocess({
  postcss: {
    plugins: [
      require("tailwindcss"),
      require("autoprefixer"),
      require("postcss-preset-env")({
        stage: 3,
        features: {
          "nesting-rules": true,
        },
      }),
    ],
  },
});

module.exports = {
  adapter: "@sveltejs/adapter-static",
  preprocess,
};
