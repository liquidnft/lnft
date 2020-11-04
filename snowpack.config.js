const fs = require("fs");
const path = require("path");

const cwd = process.cwd();

const scripts = {};

if (fs.existsSync(path.join(cwd, "postcss.config.js"))) {
  scripts["build:css"] = "postcss";
} else {
  const bundledConfig = path.join(__dirname, "postcss.config.js");
  scripts["build:css"] = `postcss --config ${bundledConfig}`;
}

module.exports = {
  "extends": "@snowpack/app-scripts-svelte",
  scripts,
  devOptions: {
    open: "false",
    port: 3300
  }, 
  installOptions: {},
};
