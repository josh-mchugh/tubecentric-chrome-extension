// vue.config.js
function isContentScripts() {
    return process.env.VUE_APP_MODE === 'content-scripts';
}

module.exports = {
    publicPath: process.env.PUBLIC_PATH || '/',
    filenameHashing: !isContentScripts(),
    chainWebpack: config => {

        if (isContentScripts()) {
            config.optimization
                .splitChunks(false);
        }
    }
}
  