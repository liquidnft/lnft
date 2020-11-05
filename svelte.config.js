const sveltePreprocess = require("svelte-preprocess");

const preprocess = sveltePreprocess({
  postcss: {
    plugins: [require("tailwindcss"), require("autoprefixer")],
  },
});

module.exports = {
	// By default, `npm run build` will create a standard Node app.
	// You can create optimized builds for different platforms by
	// specifying a different adapter
	adapter: '@sveltejs/adapter-static',
  preprocess,
};
