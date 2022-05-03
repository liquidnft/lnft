import preprocess from "svelte-preprocess";
import tailwind from "tailwindcss";
import autoprefixer from "autoprefixer";
import postcss from "postcss-preset-env";
import nesting from "postcss-nesting";
import path from "path";
import node from "@sveltejs/adapter-node";
import shim from "@asoltys/vite-plugin-stream-shim";

export default {
  kit: {
    adapter: node(),
    vite: {
      plugins: [shim()],
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
  preprocess: preprocess({
    postcss: {
      plugins: [tailwind(), autoprefixer(), nesting()],
    },
  }),
};
