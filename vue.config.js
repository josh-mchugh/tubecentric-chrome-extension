// vue.config.js
const path = require("path");
const fs = require('fs');

function isContentScripts() {
  return process.env.VUE_APP_MODE === "content-scripts";
}

module.exports = {
  publicPath: process.env.PUBLIC_PATH || "/",
  filenameHashing: !isContentScripts(),
  // Work around for error in docker build
  lintOnSave: process.env.NODE_ENV !== 'production',
  chainWebpack: config => {
    
    config.node.set('__dirname', false);
    config.resolve.alias.set("fomantic", path.resolve(fs.realpathSync(process.cwd()),  "fomantic/dist"));

    if (isContentScripts()) {
      config.optimization.splitChunks(false);
    }
  }
};
