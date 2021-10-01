import preprocess from "svelte-preprocess";
import tailwind from "tailwindcss";
import autoprefixer from "autoprefixer";
import postcss from "postcss-preset-env";
import nesting from "postcss-nesting";
import path from "path";
import shimReactPdf from "vite-plugin-shim-react-pdf";

export default {
  kit: {
    // hydrate the <div id="svelte"> element in src/app.html
    target: "#svelte",
    vite: {
      plugins: [shimReactPdf()],
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
