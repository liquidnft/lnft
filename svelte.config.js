import sveltePreprocess from "svelte-preprocess";
import tailwind from "tailwindcss";
import autoprefixer from "autoprefixer";
import postcss from "postcss-preset-env";
import path from "path";

const preprocess = sveltePreprocess({
  postcss: {
    plugins: [
      tailwind,
      autoprefixer,
      postcss({
        stage: 3,
        features: {
          "nesting-rules": true,
        },
      }),
    ],
  },
});

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    // hydrate the <div id="svelte"> element in src/app.html
    target: "#svelte",
    vite: {
      resolve: {
        alias: {
          $comp: path.resolve("src/components/index.js"),
          $components: path.resolve("src/components"),
          $queries: path.resolve("src/queries"),
        },
      },
      server: {
        proxy: {
          "/api": {
            target: "http://localhost:8091",
            rewrite: (path) => path.replace(/^\/api/, ""),
          },
        },
      },
    },
  },
  preprocess,
};

export default config;
