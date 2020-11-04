const sveltePreprocess = require("svelte-preprocess");

const preprocess = sveltePreprocess({
  postcss: true,
  /*
  postcss: {
    plugins: [require("tailwindcss"), require("autoprefixer")],
  },
  */
});

module.exports = {
  preprocess,
};
